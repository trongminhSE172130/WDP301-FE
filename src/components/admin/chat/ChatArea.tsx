import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, Avatar, Typography, Tag, Spin, message, Alert, Badge } from 'antd';
import { SendOutlined, UserOutlined, CheckOutlined, WifiOutlined, CloseOutlined } from '@ant-design/icons';
import type { ChatConversation, ChatMessage } from '../../../service/api/chatAPI';
import chatAPI from '../../../service/api/chatAPI';
import { useChat } from '../../../context/ChatContext';

const { Text } = Typography;

interface ChatAreaProps {
  conversation: ChatConversation | null;
  messages: ChatMessage[];
  loading: boolean;
  sendingMessage: boolean;
  onConversationUpdate?: (conversation: ChatConversation) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  conversation,
  messages,
  loading,
  sendingMessage,
  onConversationUpdate,
}) => {
  const [messageText, setMessageText] = useState('');
  const [acceptingConversation, setAcceptingConversation] = useState(false);
  const [closingConversation, setClosingConversation] = useState(false);
  const [localSending, setLocalSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Sử dụng ChatContext để truy cập WebSocket và API
  const { isConnected, joinConversation, leaveConversation, sendMessage } = useChat();

  // Cuộn xuống cuối cùng khi có tin nhắn mới
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Tham gia vào phòng hội thoại khi chọn một hội thoại
  useEffect(() => {
    if (conversation && conversation._id) {
      try {
        joinConversation(conversation._id);
        
        // Rời khỏi phòng hội thoại khi component unmount hoặc khi chọn hội thoại khác
        return () => {
          try {
            if (conversation._id) {
              leaveConversation(conversation._id);
            }
          } catch (error) {
            console.error('Error leaving conversation:', error);
          }
        };
      } catch (error) {
        console.error('Error joining conversation:', error);
      }
    }
  }, [conversation?._id, joinConversation, leaveConversation]);

  const handleSendMessage = async () => {
    // Kiểm tra điều kiện gửi tin nhắn
    if (!messageText.trim()) {
      message.warning('Vui lòng nhập nội dung tin nhắn');
      return;
    }
    
    if (!conversation || !conversation._id) {
      message.error('Không thể gửi tin nhắn: Hội thoại không hợp lệ');
      return;
    }
    
    // Kiểm tra kết nối WebSocket
    if (!isConnected) {
      message.warning('Đang mất kết nối với máy chủ. Tin nhắn có thể không được gửi đi ngay lập tức.');
    }
    
    const content = messageText.trim();
    setLocalSending(true);
    
    try {
      // Lưu tin nhắn trước khi gửi để tránh mất dữ liệu
      const textToSend = content;
      setMessageText('');
      
      // Sử dụng API REST để gửi tin nhắn
      if (!sendMessage) {
        throw new Error('Chức năng gửi tin nhắn không khả dụng');
      }
      
      const success = await sendMessage(conversation._id, textToSend);
      
      if (success) {
        // Tin nhắn đã được gửi thành công và sẽ được cập nhật qua callback
        console.log('Message sent successfully');
        message.success('Tin nhắn đã được gửi');
      } else {
        // Khôi phục tin nhắn nếu gửi thất bại
        setMessageText(textToSend);
        message.error('Không thể gửi tin nhắn. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      message.error('Có lỗi xảy ra khi gửi tin nhắn');
      // Khôi phục tin nhắn nếu có lỗi
      setMessageText(content);
    } finally {
      setLocalSending(false);
    }
  };

  const handleCloseConversation = async () => {
    if (!conversation || !conversation._id) {
      message.error('Không thể đóng hội thoại: Hội thoại không hợp lệ');
      return;
    }

    try {
      console.log('Attempting to close conversation with ID:', conversation._id);
      setClosingConversation(true);
      
      // Gọi API trực tiếp không qua hộp thoại xác nhận
      const response = await chatAPI.closeConversation(conversation._id);
      console.log('Close conversation API response:', response);
      
      if (response && response.success) {
        message.success('Đã đóng hội thoại');
        
        // Cập nhật trạng thái conversation trong UI
        if (onConversationUpdate) {
          const updatedConversation: ChatConversation = {
            ...conversation,
            status: 'closed' as const,
            closed_at: new Date().toISOString(),
            closed_by: 'admin' // Giả định ID admin
          };
          console.log('Updating conversation with:', updatedConversation);
          onConversationUpdate(updatedConversation);
        }
        
        // Không gửi tin nhắn hệ thống để tránh gọi API messages
      } else {
        message.error('Không thể đóng hội thoại: ' + (response?.message || 'Lỗi không xác định'));
      }
    } catch (error) {
      console.error('Error closing conversation:', error);
      message.error('Có lỗi xảy ra khi đóng hội thoại');
    } finally {
      setClosingConversation(false);
    }
  };

  const handleAcceptConversation = async () => {
    if (!conversation || !conversation._id) {
      message.error('Không thể chấp nhận yêu cầu: Hội thoại không hợp lệ');
      return;
    }
    
    setAcceptingConversation(true);
    try {
      const response = await chatAPI.acceptConversation(conversation._id);
      if (response.success) {
        message.success('Đã chấp nhận yêu cầu hỗ trợ');
        
        // Cập nhật trạng thái conversation trong UI
        if (onConversationUpdate) {
          onConversationUpdate({
            ...conversation,
            status: 'active',
            assigned_to: 'admin' // Giả định ID admin
          });
        }
      } else {
        message.error('Không thể chấp nhận yêu cầu');
      }
    } catch (error) {
      console.error('Error accepting conversation:', error);
      message.error('Có lỗi xảy ra khi chấp nhận yêu cầu');
    } finally {
      setAcceptingConversation(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Hôm qua';
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getUserName = (conversation: ChatConversation) => {
    if (!conversation || !conversation.user_id) {
      return 'Người dùng';
    }
    
    if (typeof conversation.user_id === 'string') {
      return 'Người dùng';
    } else {
      return conversation.user_id?.full_name || 'Người dùng';
    }
  };

  const getUserEmail = (conversation: ChatConversation) => {
    if (!conversation || !conversation.user_id) {
      return '';
    }
    
    if (typeof conversation.user_id === 'string') {
      return '';
    } else {
      return conversation.user_id?.email || '';
    }
  };

  const getSenderName = (message: ChatMessage) => {
    if (!message || !message.sender_id) {
      return 'Không xác định';
    }
    
    if (typeof message.sender_id === 'string') {
      return message.sender_id === 'admin' ? 'Admin' : 'Người dùng';
    } else {
      return message.sender_id?.full_name || (message.sender_id?.role === 'admin' ? 'Admin' : 'Người dùng');
    }
  };

  const isAdminMessage = (message: ChatMessage) => {
    if (!message || !message.sender_id) {
      return false;
    }
    
    if (typeof message.sender_id === 'string') {
      return message.sender_id === 'admin';
    } else {
      return message.sender_id?.role === 'admin';
    }
  };

  const isSystemMessage = (message: ChatMessage) => {
    return message.message_type === 'system';
  };

  // Hàm lấy màu cho tag trạng thái
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'active':
        return 'green';
      case 'closed':
        return 'red';
      default:
        return 'default';
    }
  };

  // Hàm lấy màu cho tag mức độ ưu tiên
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'blue';
      case 'normal':
        return 'green';
      case 'high':
        return 'orange';
      case 'urgent':
        return 'red';
      default:
        return 'default';
    }
  };

  return (
    <Card
      bordered={false}
      className="h-[calc(100vh-120px)] flex flex-col"
      bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {conversation ? (
        <>
          {/* Chat Header */}
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <div className="flex items-center">
              <Avatar icon={<UserOutlined />} className="mr-2" />
              <div>
                <Text strong>{getUserName(conversation)}</Text>
                <div>
                  <Text type="secondary" className="text-xs">
                    {getUserEmail(conversation)}
                  </Text>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <Badge 
                status={isConnected ? "success" : "error"} 
                text={
                  <Text type={isConnected ? "success" : "danger"} className="mr-2 flex items-center">
                    <WifiOutlined className="mr-1" />
                    {isConnected ? "Đã kết nối" : "Mất kết nối"}
                  </Text>
                }
              />
              {conversation.status === 'active' && (
                <Button
                  danger
                  onClick={handleCloseConversation}
                  loading={closingConversation}
                  className="mr-2 px-3 py-0 h-6 rounded-md bg-red-500 text-white hover:bg-red-600 transition-all duration-300 flex items-center text-xs border-none"
                  icon={<CloseOutlined style={{ fontSize: '12px' }} />}
                >
                  Đóng
                </Button>
              )}
              <Tag color={getPriorityColor(conversation.priority)} className="mr-2">
                {conversation.priority}
              </Tag>
              <Tag color={getStatusColor(conversation.status)}>
                {conversation.status}
              </Tag>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-grow p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)', scrollBehavior: 'smooth' }}>
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Spin />
              </div>
            ) : (
              <>
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <Text type="secondary">Chưa có tin nhắn nào</Text>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message._id}
                      className={`mb-4 max-w-[60%] ${
                        isSystemMessage(message)
                          ? 'mx-auto bg-gray-200 text-gray-700 rounded-lg'
                          : isAdminMessage(message)
                            ? 'ml-auto bg-blue-500 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg'
                            : 'mr-auto bg-gray-100 rounded-tl-lg rounded-tr-lg rounded-br-lg'
                      } p-3 relative`}
                    >
                      {isSystemMessage(message) && (
                        <div className="text-center text-xs mb-1 font-medium">Thông báo hệ thống</div>
                      )}
                      <div>{message.content}</div>
                      <div
                        className={`text-xs mt-1 flex justify-between items-center ${
                          isSystemMessage(message)
                            ? 'text-gray-500'
                            : isAdminMessage(message)
                              ? 'text-blue-100'
                              : 'text-gray-500'
                        }`}
                      >
                        <span>{formatDate(message.created_at)}</span>
                        {!isSystemMessage(message) && (
                          <span>{isAdminMessage(message) ? 'Admin' : getSenderName(message)}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          
          {/* Message Input */}
          <div className="p-3 border-t">
            {conversation.status === 'active' ? (
              <Input.Group compact>
                <Input
                  style={{ width: 'calc(100% - 50px)' }}
                  placeholder="Nhập tin nhắn..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onPressEnter={handleSendMessage}
                  disabled={sendingMessage || localSending}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  loading={sendingMessage || localSending}
                />
              </Input.Group>
            ) : conversation.status === 'pending' ? (
              <Button
                type="primary"
                icon={<CheckOutlined />}
                block
                size="large"
                className="bg-blue-500 hover:bg-blue-600"
                onClick={handleAcceptConversation}
                loading={acceptingConversation}
              >
                Vui lòng chấp nhận yêu cầu hỗ trợ để bắt đầu trò chuyện
              </Button>
            ) : (
              <Alert
                message="Hội thoại đã được đóng, không thể gửi tin nhắn mới"
                type="warning"
                showIcon
              />
            )}
            {!isConnected && conversation.status === 'active' && (
              <Alert
                message="Mất kết nối tới máy chủ. Đang thử kết nối lại..."
                type="error"
                showIcon
                className="mt-2"
              />
            )}
          </div>
        </>
      ) : (
        <div className="h-full flex items-center justify-center flex-col">
          <div className="text-gray-400 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
            </svg>
          </div>
          <Text type="secondary">Chọn một hội thoại để bắt đầu trò chuyện</Text>
          <div className="mt-3">
            <Badge 
              status={isConnected ? "success" : "error"} 
              text={
                <Text type={isConnected ? "success" : "danger"} className="flex items-center">
                  <WifiOutlined className="mr-1" />
                  {isConnected ? "Đã kết nối tới máy chủ" : "Mất kết nối tới máy chủ"}
                </Text>
              }
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default ChatArea; 