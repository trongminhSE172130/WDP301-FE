import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Row, Col, Divider, message } from 'antd';
import chatAPI from '../../service/api/chatAPI';
import type { ChatConversation, ChatMessage, ChatUser } from '../../service/api/chatAPI';
import ConversationList from '../../components/admin/chat/ConversationList';
import ChatArea from '../../components/admin/chat/ChatArea';
import { useChat } from '../../context/ChatContext';

const { Title } = Typography;

// Hàm loại bỏ tin nhắn trùng lặp
const removeDuplicateMessages = (messages: ChatMessage[]): ChatMessage[] => {
  // Tạo một Map để theo dõi tin nhắn đã thấy dựa trên nội dung và thời gian
  const seen = new Map<string, boolean>();
  
  // Lọc các tin nhắn trùng lặp
  return messages.filter(message => {
    // Tạo khóa duy nhất dựa trên nội dung và thời gian tạo
    const key = `${message.content}_${message.created_at}_${typeof message.sender_id === 'string' ? message.sender_id : message.sender_id._id}`;
    
    // Nếu đã thấy tin nhắn này trước đó, bỏ qua
    if (seen.has(key)) {
      return false;
    }
    
    // Đánh dấu tin nhắn này đã được thấy
    seen.set(key, true);
    return true;
  });
};

const ChatPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [searchText, setSearchText] = useState('');
  
  // Sử dụng ChatContext
  const { onNewMessage, onConversationUpdate: onWsConversationUpdate } = useChat();

  // Xử lý tin nhắn mới từ WebSocket
  const handleNewMessage = useCallback((newMessage: ChatMessage) => {
    // Kiểm tra tin nhắn hợp lệ
    if (!newMessage || !newMessage.conversation_id) {
      console.error('Received invalid message:', newMessage);
      return;
    }

    // Kiểm tra xem tin nhắn có thuộc về cuộc hội thoại hiện tại không
    if (selectedConversation && selectedConversation._id && newMessage.conversation_id === selectedConversation._id) {
      // Xử lý tin nhắn để đảm bảo thông tin người gửi đầy đủ
      let processedMessage = {...newMessage};
      
      if (newMessage.sender_id) {
        if (typeof newMessage.sender_id === 'string') {
          if (newMessage.sender_id === 'admin') {
            processedMessage = {
              ...newMessage,
              sender_id: {
                _id: 'admin',
                full_name: 'Admin',
                role: 'admin'
              }
            };
          } else if (selectedConversation.user_id && typeof selectedConversation.user_id !== 'string' && 
                    selectedConversation.user_id._id && newMessage.sender_id === selectedConversation.user_id._id) {
            processedMessage = {
              ...newMessage,
              sender_id: selectedConversation.user_id
            };
          } else {
            processedMessage = {
              ...newMessage,
              sender_id: {
                _id: newMessage.sender_id,
                full_name: 'Người dùng ' + newMessage.sender_id.substring(0, 5),
                role: 'user'
              }
            };
          }
        }
      } else {
        // Nếu không có sender_id, tạo một giá trị mặc định
        processedMessage.sender_id = {
          _id: 'unknown',
          full_name: 'Không xác định',
          role: 'unknown'
        };
      }
      
      // Thêm tin nhắn vào danh sách
      setMessages(prevMessages => {
        console.log('Adding new message to messages list');
        const newMessagesList = [...prevMessages, processedMessage];
        // Loại bỏ tin nhắn trùng lặp
        return removeDuplicateMessages(newMessagesList);
      });
      
      // Cập nhật tin nhắn cuối cùng trong danh sách hội thoại
      setConversations(prevConversations => {
        if (!prevConversations || !Array.isArray(prevConversations)) {
          return prevConversations || [];
        }
        
        return prevConversations.map(conv => {
          if (!conv || !conv._id) return conv;
          
          if (conv._id === selectedConversation._id) {
            return { 
              ...conv, 
              last_message: {
                content: newMessage.content || '',
                sender_id: typeof processedMessage.sender_id === 'string' 
                  ? processedMessage.sender_id 
                  : (processedMessage.sender_id && processedMessage.sender_id._id) || null,
                sent_at: newMessage.created_at || new Date().toISOString()
              }
            };
          }
          return conv;
        });
      });
    } else {
      // Nếu tin nhắn thuộc về hội thoại khác, chỉ cập nhật số tin nhắn chưa đọc và tin nhắn cuối cùng
      setConversations(prevConversations => {
        if (!prevConversations || !Array.isArray(prevConversations)) {
          return prevConversations || [];
        }
        
        return prevConversations.map(conv => {
          if (!conv || !conv._id) return conv;
          
          if (conv._id === newMessage.conversation_id) {
            // Đảm bảo unread_count tồn tại trước khi truy cập
            const currentUnreadCount = conv.unread_count || { admin: 0, user: 0 };
            
            return { 
              ...conv, 
              last_message: {
                content: newMessage.content || '',
                sender_id: typeof newMessage.sender_id === 'string' 
                  ? newMessage.sender_id 
                  : (newMessage.sender_id && typeof newMessage.sender_id === 'object' && newMessage.sender_id._id) || null,
                sent_at: newMessage.created_at || new Date().toISOString()
              },
              unread_count: {
                ...currentUnreadCount,
                admin: (currentUnreadCount.admin || 0) + 1
              }
            };
          }
          return conv;
        });
      });
    }
  }, [selectedConversation]);

  // Xử lý cập nhật hội thoại từ WebSocket
  const handleConversationWsUpdate = useCallback((updatedConversation: ChatConversation) => {
    // Kiểm tra hội thoại hợp lệ
    if (!updatedConversation || !updatedConversation._id) {
      console.error('Received invalid conversation update:', updatedConversation);
      return;
    }

    setConversations(prevConversations => {
      // Kiểm tra mảng prevConversations có tồn tại không
      if (!prevConversations || !Array.isArray(prevConversations)) {
        console.error('Previous conversations is not an array:', prevConversations);
        return prevConversations || [];
      }
      
      return prevConversations.map(conv => {
        // Kiểm tra conv có tồn tại và có _id không
        if (!conv || !conv._id) {
          return conv;
        }
        return conv._id === updatedConversation._id ? updatedConversation : conv;
      });
    });
    
    if (selectedConversation && selectedConversation._id === updatedConversation._id) {
      setSelectedConversation(updatedConversation);
    }
  }, [selectedConversation]);

  // Đăng ký các callback WebSocket
  useEffect(() => {
    // Đăng ký callback cho tin nhắn mới và lưu hàm để hủy đăng ký
    const unsubscribeMessage = onNewMessage(handleNewMessage);
    
    // Đăng ký callback cho cập nhật hội thoại và lưu hàm để hủy đăng ký
    const unsubscribeConversation = onWsConversationUpdate(handleConversationWsUpdate);
    
    // Hủy đăng ký khi component unmount
    return () => {
      unsubscribeMessage();
      unsubscribeConversation();
    };
  }, [onNewMessage, onWsConversationUpdate, handleNewMessage, handleConversationWsUpdate]);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const response = await chatAPI.getConversations();
        if (response.success) {
          // Đảm bảo mỗi hội thoại có thông tin người dùng đầy đủ
          const processedConversations = response.data.map(conversation => {
            // Kiểm tra hội thoại hợp lệ
            if (!conversation) return conversation;
            
            // Nếu user_id là string, tạo một đối tượng người dùng tạm thời
            if (typeof conversation.user_id === 'string') {
              return {
                ...conversation,
                user_id: {
                  _id: conversation.user_id,
                  full_name: 'Người dùng ' + conversation.user_id.substring(0, 5),
                  role: 'user'
                }
              };
            }
            return conversation;
          });
          setConversations(processedConversations);
        } else {
          message.error('Không thể tải danh sách hội thoại');
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        message.error('Có lỗi xảy ra khi tải danh sách hội thoại');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Load messages when selecting a conversation
  useEffect(() => {
    if (selectedConversation && selectedConversation._id) {
      const fetchConversationDetail = async () => {
        setLoading(true);
        try {
          const response = await chatAPI.getConversationDetail(selectedConversation._id);
          if (response.success && response.data) {
            // Tìm thông tin user từ messages nếu có
            let userInfo: ChatUser | null = null;
            
            // Tìm message đầu tiên từ user để lấy thông tin
            const userMessage = response.data.messages.find(msg => 
              msg && typeof msg.sender_id === 'object' && 
              msg.sender_id.role === 'user' &&
              msg.sender_id.full_name
            );
            
            if (userMessage && typeof userMessage.sender_id === 'object') {
              userInfo = userMessage.sender_id as ChatUser;
            }
            
            // Xử lý tin nhắn để đảm bảo thông tin người gửi đầy đủ
            const processedMessages = response.data.messages.map(message => {
              if (!message) return message;
              
              if (typeof message.sender_id === 'string') {
                // Nếu sender_id là admin, giữ nguyên
                if (message.sender_id === 'admin') {
                  return {
                    ...message,
                    sender_id: {
                      _id: 'admin',
                      full_name: 'Admin',
                      role: 'admin'
                    }
                  };
                }
                
                // Nếu sender_id là user_id và đã có thông tin user từ message khác
                const userId = typeof response.data.conversation.user_id === 'string' 
                  ? response.data.conversation.user_id 
                  : (response.data.conversation.user_id && response.data.conversation.user_id._id);
                
                if (userId && message.sender_id === userId && userInfo) {
                  return {
                    ...message,
                    sender_id: userInfo
                  };
                }
                
                // Trường hợp khác
                return {
                  ...message,
                  sender_id: {
                    _id: message.sender_id,
                    full_name: 'Người dùng ' + message.sender_id.substring(0, 5),
                    role: 'user'
                  }
                };
              }
              return message;
            });
            
            // Loại bỏ tin nhắn trùng lặp dựa trên nội dung và thời gian
            const uniqueMessages = removeDuplicateMessages(processedMessages.filter(Boolean));
            
            setMessages(uniqueMessages);
            
            // Xử lý thông tin conversation
            let updatedConversation = response.data.conversation;
            if (updatedConversation && typeof updatedConversation.user_id === 'string') {
              // Nếu đã tìm thấy thông tin user từ messages, sử dụng thông tin đó
              if (userInfo) {
                updatedConversation = {
                  ...updatedConversation,
                  user_id: userInfo
                };
              } else {
                updatedConversation = {
                  ...updatedConversation,
                  user_id: {
                    _id: updatedConversation.user_id,
                    full_name: 'Người dùng ' + updatedConversation.user_id.substring(0, 5),
                    role: 'user'
                  }
                };
              }
            }
            
            setSelectedConversation(updatedConversation);
            
            // Update unread count in conversation list
            setConversations(prevConversations => {
              if (!prevConversations || !Array.isArray(prevConversations)) {
                return prevConversations || [];
              }
              
              return prevConversations.map(conv => {
                if (!conv || !conv._id || !selectedConversation || !selectedConversation._id) {
                  return conv;
                }
                
                if (conv._id === selectedConversation._id) {
                  return { 
                    ...conv, 
                    unread_count: { 
                      ...(conv.unread_count || { user: 0, admin: 0 }), 
                      admin: 0 
                    } 
                  };
                }
                return conv;
              });
            });
          } else {
            message.error('Không thể tải tin nhắn');
          }
        } catch (error) {
          console.error('Error fetching conversation detail:', error);
          message.error('Có lỗi xảy ra khi tải tin nhắn');
        } finally {
          setLoading(false);
        }
      };

      fetchConversationDetail();
    }
  }, [selectedConversation?._id]);

  const handleConversationSelect = async (conversation: ChatConversation) => {
    if (conversation && conversation._id) {
      setSelectedConversation(conversation);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchText(value);
  };

  const handleConversationUpdate = (updatedConversation: ChatConversation) => {
    // Kiểm tra hội thoại hợp lệ
    if (!updatedConversation || !updatedConversation._id) {
      console.error('Invalid conversation update:', updatedConversation);
      return;
    }
    
    // Cập nhật conversation được chọn
    setSelectedConversation(updatedConversation);
    
    // Cập nhật trong danh sách conversations
    setConversations(prevConversations => {
      // Kiểm tra mảng prevConversations có tồn tại không
      if (!prevConversations || !Array.isArray(prevConversations)) {
        console.error('Previous conversations is not an array:', prevConversations);
        return prevConversations || [];
      }
      
      return prevConversations.map(conv => {
        // Kiểm tra conv có tồn tại và có _id không
        if (!conv || !conv._id) {
          return conv;
        }
        return conv._id === updatedConversation._id ? updatedConversation : conv;
      });
    });
    
    // Thêm tin nhắn hệ thống thông báo về việc chấp nhận
    const systemMessage: ChatMessage = {
      _id: Date.now().toString(),
      conversation_id: updatedConversation._id,
      sender_id: {
        _id: 'system',
        full_name: 'Hệ thống',
        role: 'system'
      },
      content: 'Admin đã chấp nhận yêu cầu hỗ trợ.',
      message_type: 'system',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, systemMessage]);
  };

  return (
    <div>
      <Title level={2}>Chat hệ thống</Title>
      <Divider />
      
      <Row gutter={16}>
        {/* Conversation List Component */}
        <Col xs={24} sm={24} md={8} lg={6}>
          <ConversationList 
            conversations={conversations}
            loading={loading && !selectedConversation}
            searchText={searchText}
            selectedConversation={selectedConversation}
            onSearchChange={handleSearchChange}
            onConversationSelect={handleConversationSelect}
          />
        </Col>
        
        {/* Chat Area Component */}
        <Col xs={24} sm={24} md={16} lg={18}>
          <ChatArea 
            conversation={selectedConversation}
            messages={messages}
            loading={loading && !!selectedConversation}
            sendingMessage={false}
            onConversationUpdate={handleConversationUpdate}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ChatPage; 