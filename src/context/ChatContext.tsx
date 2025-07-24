import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import type { ChatConversation, ChatMessage } from '../service/api/chatAPI';
import chatAPI from '../service/api/chatAPI';
import { SessionManager } from '../utils/sessionManager';
import { message } from 'antd';

interface ChatContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendMessage: (conversationId: string, content: string) => Promise<boolean>;
  onNewMessage: (callback: (message: ChatMessage) => void) => () => void;
  onConversationUpdate: (callback: (conversation: ChatConversation) => void) => () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messageListeners] = useState<Set<(message: ChatMessage) => void>>(new Set());
  const [conversationUpdateListeners] = useState<Set<(conversation: ChatConversation) => void>>(new Set());
  const [processedMessageIds] = useState<Set<string>>(new Set());

  // Khởi tạo kết nối socket khi component mount
  useEffect(() => {
    const token = SessionManager.getToken();
    if (!token) {
      console.log('No token available for WebSocket connection');
      return;
    }

    // Kết nối đến server WebSocket
    try {
      const socketInstance = io('https://genhealth.wizlab.io.vn', {
        auth: { token },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000
      });

      // Xử lý các sự kiện kết nối
      socketInstance.on('connect', () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        message.success('Đã kết nối tới máy chủ chat');
      });

      socketInstance.on('disconnect', () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        message.warning('Mất kết nối tới máy chủ chat');
      });

      socketInstance.on('connect_error', (error: unknown) => {
        console.error('WebSocket connection error:', error);
        setIsConnected(false);
      });

      socketInstance.on('error', (error: unknown) => {
        console.error('WebSocket error:', error);
      });

      // Lắng nghe sự kiện tin nhắn mới
      socketInstance.on('new_message', (messageData: unknown) => {
        try {
          // Kiểm tra và xử lý dữ liệu tin nhắn
          if (!messageData) {
            console.error('Received empty message data from server');
            return;
          }
          
          // Xử lý cấu trúc tin nhắn đặc biệt từ server
          let actualMessage: ChatMessage;
          
          // Kiểm tra xem messageData có cấu trúc { conversation_id, message } không
          if (typeof messageData === 'object' && messageData !== null &&
              'message' in messageData && typeof messageData.message === 'object' && messageData.message !== null) {
            // Trường hợp tin nhắn được bọc trong thuộc tính message
            
            const wrappedMessage = messageData as { conversation_id?: string; message: Record<string, unknown> };
            
            // Lấy message từ cấu trúc bọc
            const extractedMessage = wrappedMessage.message;
            
            // Đảm bảo conversation_id được truyền từ cấu trúc bọc nếu không có trong tin nhắn
            if (!extractedMessage.conversation_id && wrappedMessage.conversation_id) {
              extractedMessage.conversation_id = wrappedMessage.conversation_id;
            }
            
            actualMessage = extractedMessage as unknown as ChatMessage;
          } else if (typeof messageData === 'string') {
            // Xử lý trường hợp nhận được dữ liệu dạng string
            try {
              const parsedData = JSON.parse(messageData);
              
              // Kiểm tra xem dữ liệu đã parse có cấu trúc { conversation_id, message } không
              if (parsedData && typeof parsedData === 'object' && 'message' in parsedData) {
                const extractedMessage = parsedData.message;
                if (!extractedMessage.conversation_id && parsedData.conversation_id) {
                  extractedMessage.conversation_id = parsedData.conversation_id;
                }
                actualMessage = extractedMessage as unknown as ChatMessage;
              } else {
                actualMessage = parsedData as unknown as ChatMessage;
              }
              
            } catch (parseError) {
              console.error('Failed to parse message data:', parseError);
              return;
            }
          } else {
            // Trường hợp thông thường, messageData là tin nhắn trực tiếp
            actualMessage = messageData as ChatMessage;
          }
          
          // Kiểm tra tin nhắn hợp lệ
          if (!actualMessage || !actualMessage.conversation_id || !actualMessage._id) {
            console.error('Received invalid message structure from server:', messageData);
            return;
          }
          
          // Kiểm tra xem tin nhắn đã được xử lý trước đó chưa
          if (processedMessageIds.has(actualMessage._id)) {
            return;
          }
          
          // Thêm ID tin nhắn vào danh sách đã xử lý
          processedMessageIds.add(actualMessage._id);
          
          // Thêm timestamp vào ID tin nhắn để đảm bảo tính duy nhất khi hiển thị
          actualMessage._id = `${actualMessage._id}_${Date.now()}`;
          
          // Thông báo cho các listener
          if (messageListeners && messageListeners.size > 0) {
            messageListeners.forEach(listener => {
              if (listener) {
                try {
                  listener(actualMessage);
                } catch (error) {
                  console.error('Error in message listener:', error);
                }
              }
            });
          } else {
            console.warn('No message listeners registered to handle the new message');
          }
        } catch (error) {
          console.error('Error processing new message from WebSocket:', error);
        }
      });

      // Lắng nghe sự kiện cập nhật hội thoại
      socketInstance.on('conversation_update', (conversationData: unknown) => {
        try {
          // Kiểm tra và xử lý dữ liệu hội thoại
          if (!conversationData) {
            console.error('Received empty conversation data from server');
            return;
          }
          
          // Xử lý trường hợp nhận được dữ liệu dạng string
          let conversation: ChatConversation;
          if (typeof conversationData === 'string') {
            try {
              conversation = JSON.parse(conversationData);
            } catch (parseError) {
              console.error('Failed to parse conversation data:', parseError);
              return;
            }
          } else {
            conversation = conversationData as ChatConversation;
          }
          
          // Kiểm tra hội thoại hợp lệ
          if (!conversation || !conversation._id) {
            console.error('Received invalid conversation structure from server:', conversation);
            return;
          }
          
          // Thông báo cho các listener
          if (conversationUpdateListeners && conversationUpdateListeners.size > 0) {
            conversationUpdateListeners.forEach(listener => {
              if (listener) {
                try {
                  listener(conversation);
                } catch (error) {
                  console.error('Error in conversation update listener:', error);
                }
              }
            });
          }
        } catch (error) {
          console.error('Error processing conversation update from WebSocket:', error);
        }
      });

      setSocket(socketInstance);

      // Dọn dẹp khi component unmount
      return () => {
        if (socketInstance) {
          try {
            socketInstance.disconnect();
          } catch (error) {
            console.error('Error disconnecting socket:', error);
          }
        }
      };
    } catch (error) {
      console.error('Error initializing WebSocket connection:', error);
      message.error('Không thể kết nối tới máy chủ chat');
    }
  }, []);

  // Tham gia vào một phòng hội thoại
  const joinConversation = (conversationId: string) => {
    if (!conversationId) {
      console.error('Cannot join conversation: Invalid conversation ID');
      return;
    }
    
    if (socket && isConnected) {
      try {
        socket.emit('join_conversation', { conversation_id: conversationId });
      } catch (error) {
        console.error(`Error joining conversation ${conversationId}:`, error);
      }
    } else {
      console.warn(`Cannot join conversation ${conversationId}: Socket not connected`);
    }
  };

  // Rời khỏi một phòng hội thoại
  const leaveConversation = (conversationId: string) => {
    if (!conversationId) {
      console.error('Cannot leave conversation: Invalid conversation ID');
      return;
    }
    
    if (socket && isConnected) {
      try {
        socket.emit('leave_conversation', { conversation_id: conversationId });
      } catch (error) {
        console.error(`Error leaving conversation ${conversationId}:`, error);
      }
    }
  };

  // Gửi tin nhắn qua API REST
  const sendMessage = async (conversationId: string, content: string): Promise<boolean> => {
    // Kiểm tra tham số đầu vào
    if (!conversationId) {
      console.error('Cannot send message: Invalid conversation ID');
      return false;
    }
    
    if (!content || content.trim() === '') {
      console.error('Cannot send message: Empty content');
      return false;
    }
    
    try {
      const response = await chatAPI.sendMessage(conversationId, content);
      
      if (response && response.success && response.data) {
        
        // Kiểm tra dữ liệu trả về
        if (!response.data._id || !response.data.conversation_id) {
          console.error('Received invalid message data from API:', response.data);
          return true; // Vẫn trả về true vì tin nhắn đã được gửi đi
        }
        
        // Lưu ID tin nhắn đã gửi để tránh trùng lặp
        const sentMessageId = response.data._id;
        
        // Thêm vào Set các ID tin nhắn đã xử lý
        processedMessageIds.add(sentMessageId);
        
        // Thêm timestamp vào ID tin nhắn để đảm bảo tính duy nhất khi hiển thị
        response.data._id = `${response.data._id}_${Date.now()}`;
        
        // Thông báo cho các listener về tin nhắn mới
        try {
          if (messageListeners && messageListeners.size > 0) {
            messageListeners.forEach(listener => {
              if (listener) {
                try {
                  listener(response.data);
                } catch (listenerError) {
                  console.error('Error in message listener:', listenerError);
                }
              }
            });
          }
        } catch (error) {
          console.error('Error notifying listeners:', error);
        }
        
        return true;
      } else {
        console.error('Failed to send message:', response);
        return false;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };

  // Đăng ký callback cho tin nhắn mới
  const onNewMessage = (callback: (message: ChatMessage) => void) => {
    if (!callback) {
      console.error('Invalid callback for new messages');
      return () => {};
    }
    
    messageListeners.add(callback);
    return () => {
      messageListeners.delete(callback);
    };
  };

  // Đăng ký callback cho cập nhật hội thoại
  const onConversationUpdate = (callback: (conversation: ChatConversation) => void) => {
    if (!callback) {
      console.error('Invalid callback for conversation updates');
      return () => {};
    }
    
    conversationUpdateListeners.add(callback);
    return () => {
      conversationUpdateListeners.delete(callback);
    };
  };

  const contextValue: ChatContextType = {
    socket,
    isConnected,
    joinConversation,
    leaveConversation,
    sendMessage,
    onNewMessage,
    onConversationUpdate
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 