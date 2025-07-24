import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, Avatar, Typography, Tag, Spin, message, Alert, Badge } from 'antd';
import { SendOutlined, UserOutlined, WifiOutlined, CloseOutlined, LockOutlined } from '@ant-design/icons';
import type { ChatConversation as BaseChatConversation, ChatMessage } from '../../../service/api/chatAPI';
import chatAPI from '../../../service/api/chatAPI';
import { useChat } from '../../../context/ChatContext';
import { getUserById } from '../../../service/api/userAPI';

// Mở rộng interface ChatConversation để thêm trường is_assigned_to_other
interface ChatConversation extends BaseChatConversation {
  is_assigned_to_other?: boolean;
}

const { Text } = Typography;

interface ChatAreaProps {
  conversation: ChatConversation | null;
  messages: ChatMessage[];
  loading: boolean;
  sendingMessage: boolean;
  onConversationUpdate?: (conversation: ChatConversation) => void;
  onMessagesUpdate?: (messages: ChatMessage[]) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  conversation,
  messages,
  loading,
  sendingMessage,
  onConversationUpdate,
  onMessagesUpdate,
}) => {
  const [messageText, setMessageText] = useState('');
  const [acceptingConversation, setAcceptingConversation] = useState(false);
  const [closingConversation, setClosingConversation] = useState(false);
  const [localSending, setLocalSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [assignedUserName, setAssignedUserName] = useState<string>('Người hỗ trợ');
  
  // Sử dụng ChatContext để truy cập WebSocket và API
  const { isConnected, joinConversation, leaveConversation, sendMessage } = useChat();

  // Lấy thông tin người được gán khi conversation thay đổi
  useEffect(() => {
    if (conversation && conversation.assigned_to && conversation.status === 'active') {
      if (typeof conversation.assigned_to === 'object' && conversation.assigned_to.full_name) {
        // Nếu assigned_to là đối tượng, lấy full_name trực tiếp
        setAssignedUserName(conversation.assigned_to.full_name);
      } else if (typeof conversation.assigned_to === 'string') {
        // Nếu assigned_to là string, gọi API để lấy thông tin
        fetchAssignedUser(conversation.assigned_to);
      }
    } else {
      setAssignedUserName('Người hỗ trợ');
    }
  }, [conversation]);

  // Hàm lấy thông tin người được gán từ API
  const fetchAssignedUser = async (userId: string) => {
    try {
      const response = await getUserById(userId);
      if (response.success && response.data) {
        setAssignedUserName(response.data.full_name || 'Người hỗ trợ');
      }
    } catch (error) {
      console.error('Error fetching assigned user:', error);
      setAssignedUserName('Người hỗ trợ');
    }
  };

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
        message.success('Tin nhắn đã được gửi');
      } else {
        // Khôi phục tin nhắn nếu gửi thất bại
        setMessageText(textToSend);
        message.error('Không thể gửi tin nhắn. Vì đã consultant/admin chấp nhận đoạn chat.');
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
      setClosingConversation(true);
      
      // Lấy thông tin người dùng hiện tại từ localStorage
      const userStr = localStorage.getItem('user');
      let closedBy = null;
      let closedByName = 'Người hỗ trợ';
      
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          if (userData) {
            // Lấy ID người dùng - xử lý cả trường hợp id và _id
            const userId = userData.id || userData._id;
            closedBy = userId;
            closedByName = userData.full_name || 'Người hỗ trợ';
          }
        } catch (error) {
          console.error('Lỗi khi phân tích dữ liệu người dùng:', error);
        }
      }
      
      // Gọi API trực tiếp không qua hộp thoại xác nhận
      const response = await chatAPI.closeConversation(conversation._id);
      
      // Cập nhật phần xử lý đóng cuộc hội thoại
      if (response && response.success) {
        message.success('Đã đóng hội thoại');
        
        // Cập nhật trạng thái conversation trong UI
        if (onConversationUpdate) {
          const updatedConversation: ChatConversation = {
            ...conversation,
            status: 'closed' as const,
            closed_at: new Date().toISOString(),
            closed_by: closedBy // Sử dụng ID người dùng hiện tại
          };
          onConversationUpdate(updatedConversation);
          
          // Thêm tin nhắn hệ thống thông báo đóng cuộc hội thoại
          try {
            const systemMessageContent = `${closedByName} đã đóng cuộc hội thoại.`;
            
            // Tạo tin nhắn hệ thống để hiển thị ngay lập tức
            const systemMessage: ChatMessage = {
              _id: `local_system_${Date.now()}`,
              conversation_id: conversation._id,
              sender_id: closedBy || 'system',
              content: systemMessageContent,
              message_type: 'system',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              is_read: true
            };
            
            // Thêm tin nhắn vào danh sách tin nhắn hiện tại
            const updatedMessages = [...messages, systemMessage];
            
            // Cập nhật danh sách tin nhắn trong component cha
            if (typeof onMessagesUpdate === 'function') {
              onMessagesUpdate(updatedMessages);
            }
            
            // Gọi API để gửi tin nhắn hệ thống
            const systemMessageResponse = await chatAPI.sendSystemMessage(conversation._id, systemMessageContent);
            
            if (systemMessageResponse && systemMessageResponse.success) {
              // Tin nhắn hệ thống đã được gửi thành công
              message.success('Đã gửi thông báo đóng cuộc hội thoại');
            } else {
              console.error('Không thể gửi tin nhắn hệ thống:', systemMessageResponse);
            }
          } catch (error) {
            console.error('Lỗi khi gửi tin nhắn hệ thống:', error);
          }
        }
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
      // Lấy thông tin người dùng từ localStorage trước khi gọi API
      const userStr = localStorage.getItem('user');
      let assignedTo = null; // Giá trị mặc định
      let currentUserName = 'Người hỗ trợ';
      let userId = null;
      
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          if (userData) {
            // Lấy ID người dùng - xử lý cả trường hợp id và _id
            userId = userData.id || userData._id;
            
            // Tạo đối tượng assigned_to
            assignedTo = {
              _id: userId,
              role: userData.role || 'admin',
              full_name: userData.full_name || 'Người hỗ trợ'
            };
            currentUserName = userData.full_name || 'Người hỗ trợ';
            // Cập nhật tên người được gán ngay lập tức
            setAssignedUserName(currentUserName);
          }
        } catch (error) {
          console.error('Lỗi khi phân tích dữ liệu người dùng:', error);
        }
      }
      
      // Gọi API để chấp nhận cuộc hội thoại
      const response = await chatAPI.acceptConversation(conversation._id);
      if (response.success) {
        message.success('Đã chấp nhận yêu cầu hỗ trợ');
        
        // Cập nhật trạng thái conversation trong UI
        if (onConversationUpdate) {
          onConversationUpdate({
            ...conversation,
            status: 'active',
            assigned_to: assignedTo
          });
        }
        
        // Thêm tin nhắn hệ thống thông báo chấp nhận cuộc hội thoại
        try {
          const systemMessageContent = `${currentUserName} (${assignedTo?.role || 'admin'}) đã tiếp nhận yêu cầu hỗ trợ của bạn.`;
          
          // Tạo tin nhắn hệ thống để hiển thị ngay lập tức
          const systemMessage: ChatMessage = {
            _id: `local_system_${Date.now()}`,
            conversation_id: conversation._id,
            sender_id: userId || 'system',
            content: systemMessageContent,
            message_type: 'system',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_read: true
          };
          
          // Thêm tin nhắn vào danh sách tin nhắn hiện tại
          const updatedMessages = [...messages, systemMessage];
          
          // Cập nhật danh sách tin nhắn trong component cha
          if (typeof onMessagesUpdate === 'function') {
            onMessagesUpdate(updatedMessages);
          }
          
          // Gọi API để gửi tin nhắn hệ thống
          const systemMessageResponse = await chatAPI.sendSystemMessage(conversation._id, systemMessageContent);
          
          if (systemMessageResponse && systemMessageResponse.success) {
            // Tin nhắn hệ thống chấp nhận cuộc hội thoại đã được gửi thành công
            message.success('Đã gửi thông báo chấp nhận cuộc hội thoại');
          } else {
            console.error('Không thể gửi tin nhắn hệ thống chấp nhận cuộc hội thoại:', systemMessageResponse);
          }
        } catch (error) {
          console.error('Lỗi khi gửi tin nhắn hệ thống chấp nhận cuộc hội thoại:', error);
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
    
    // Nếu đây là tin nhắn từ admin/consultant và có conversation
    if (conversation && isAdminMessage(message)) {
      // Nếu có assigned_to, hiển thị tên người được gán
      if (conversation.assigned_to) {
        // Nếu assigned_to là đối tượng có full_name
        if (typeof conversation.assigned_to === 'object' && conversation.assigned_to.full_name) {
          return conversation.assigned_to.full_name;
        }
        
        // Nếu assigned_to là string, kiểm tra xem có phải là người dùng hiện tại không
        if (typeof conversation.assigned_to === 'string') {
          const userStr = localStorage.getItem('user');
          if (userStr) {
            try {
              const userData = JSON.parse(userStr);
              if (userData && userData._id === conversation.assigned_to) {
                return 'Bạn';
              }
            } catch (error) {
              console.error('Lỗi khi phân tích dữ liệu người dùng:', error);
            }
          }
          return assignedUserName; // Sử dụng tên đã lấy từ API
        }
      }
      
      // Nếu không có assigned_to, hiển thị tên từ sender_id
      if (typeof message.sender_id === 'object' && message.sender_id.full_name) {
        return message.sender_id.full_name;
      }
      
      return 'Người hỗ trợ';
    }
    
    // Xử lý các trường hợp khác
    if (typeof message.sender_id === 'string') {
      if (message.sender_id === 'admin') return 'Admin';
      if (message.sender_id === 'consultant') return 'Tư vấn viên';
      return 'Người dùng';
    } else {
      // Ưu tiên hiển thị tên thực nếu có
      return message.sender_id?.full_name || 
             (message.sender_id?.role === 'admin' ? 'Admin' : 
             (message.sender_id?.role === 'Consultant' || message.sender_id?.role === 'consultant') ? 
             'Tư vấn viên' : 'Người dùng');
    }
  };

  const isAdminMessage = (message: ChatMessage) => {
    if (!message || !message.sender_id) {
      return false;
    }
    
    if (typeof message.sender_id === 'string') {
      return message.sender_id === 'admin' || message.sender_id === 'consultant';
    } else {
      return message.sender_id?.role === 'admin' || 
             message.sender_id?.role === 'Consultant' || 
             message.sender_id?.role === 'consultant';
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

  // Kiểm tra xem cuộc hội thoại đã được gán cho người khác chưa
  const isAssignedToOther = () => {
    if (!conversation) return false;
    
    // Nếu đã đánh dấu là được gán cho người khác
    if ('is_assigned_to_other' in conversation && conversation.is_assigned_to_other) {
      return true;
    }
    
    // Nếu không có assigned_to, không được gán cho ai
    if (!conversation.assigned_to) {
      return false;
    }
    
    // Kiểm tra xem assigned_to có phải là người dùng hiện tại không
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        if (userData) {
          if (userData._id) {
            // Nếu assigned_to là string
            if (typeof conversation.assigned_to === 'string') {
              return conversation.assigned_to !== userData._id;
            }
            // Nếu assigned_to là object
            if (typeof conversation.assigned_to === 'object' && conversation.assigned_to !== null) {
              return conversation.assigned_to._id !== userData._id;
            }
          }
        }
      } catch (error) {
        console.error('Lỗi khi phân tích dữ liệu người dùng:', error);
      }
    }
    
    return false;
  };
  
  // Kiểm tra xem người dùng hiện tại có phải là admin hoặc consultant không
  const isCurrentUserAdmin = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        return userData && (userData.role === 'admin' || userData.role === 'consultant');
      } catch (error) {
        console.error('Lỗi khi phân tích dữ liệu người dùng:', error);
      }
    }
    return false;
  };
  
  // Kiểm tra xem có thể xem tin nhắn không
  const canViewMessages = () => {
    // Admin luôn có thể xem tin nhắn
    if (isCurrentUserAdmin()) {
      return true;
    }
    
    // Người khác chỉ có thể xem nếu không bị gán cho người khác
    return !isAssignedToOther();
  };
  
  // Kiểm tra xem người dùng có thể gửi tin nhắn không
  const canSendMessages = (): boolean => {
    // Nếu không có cuộc hội thoại được chọn hoặc đang tải dữ liệu, không cho phép gửi tin nhắn
    if (!conversation || loading) {
      return false;
    }

    // Nếu cuộc hội thoại đã đóng, không cho phép gửi tin nhắn
    if (conversation.status === 'closed') {
      return false;
    }

    // Lấy thông tin người dùng hiện tại
    const userStr = localStorage.getItem('user');
    
    if (!userStr) {
      return false;
    }
    
    try {
      const userData = JSON.parse(userStr);
      
      // Lấy ID người dùng - xử lý cả trường hợp id và _id
      const userId = userData.id || userData._id;
      
      if (!userData || !userId) {
        return false;
      }
      
      // Nếu cuộc hội thoại chưa được assign cho ai
      if (!conversation.assigned_to) {
        // Chỉ cho phép admin hoặc consultant gửi tin nhắn
        const isAdminOrConsultant = userData.role === 'admin' || userData.role === 'consultant';
        return isAdminOrConsultant;
      }
      
      // Nếu cuộc hội thoại đã được assign
      
      // Nếu assigned_to là string, so sánh trực tiếp
      if (typeof conversation.assigned_to === 'string') {
        const result = conversation.assigned_to === userId;
        return result;
      }
      
      // Nếu assigned_to là object, so sánh _id
      if (typeof conversation.assigned_to === 'object' && conversation.assigned_to !== null) {
        const result = conversation.assigned_to._id === userId;
        return result;
      }
      
      return false;
    } catch (error) {
      console.error('Lỗi khi phân tích dữ liệu người dùng:', error);
      return false;
    }
  };

  // Phần render form nhập tin nhắn dựa trên trạng thái cuộc hội thoại
  const renderMessageInput = () => {
    if (!conversation) {
      return (
        <Alert
          message="Vui lòng chọn một cuộc hội thoại"
          type="info"
          showIcon
        />
      );
    }

    if (conversation.status === 'closed') {
      return (
        <Alert
          message="Cuộc hội thoại đã đóng"
          type="info"
          showIcon
        />
      );
    }

    if (conversation.status === 'pending') {
      return (
        <Button
          type="primary"
          block
          size="large"
          className="bg-blue-500 hover:bg-blue-600"
          onClick={handleAcceptConversation}
          loading={acceptingConversation}
        >
          Vui lòng chấp nhận yêu cầu hỗ trợ để bắt đầu trò chuyện
        </Button>
      );
    }

    if (!canSendMessages()) {
      // Lấy thông tin người dùng để hiển thị thông báo phù hợp
      let message = 'Bạn không có quyền gửi tin nhắn trong cuộc hội thoại này.';
      
      if (conversation.assigned_to) {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const userData = JSON.parse(userStr);
            // Lấy ID người dùng - xử lý cả trường hợp id và _id
            const userId = userData.id || userData._id;
            
            if (userData && userId) {
              // Kiểm tra xem assigned_to có phải là người dùng hiện tại không
              let isAssignedToCurrentUser = false;
              
              if (typeof conversation.assigned_to === 'string') {
                isAssignedToCurrentUser = conversation.assigned_to === userId;
              } else if (typeof conversation.assigned_to === 'object' && conversation.assigned_to !== null) {
                isAssignedToCurrentUser = conversation.assigned_to._id === userId;
              }
              
              if (!isAssignedToCurrentUser) {
                message = `Cuộc hội thoại này đã được gán cho ${typeof conversation.assigned_to === 'object' && conversation.assigned_to.full_name ? conversation.assigned_to.full_name : 'người khác'}. Bạn chỉ có thể xem tin nhắn.`;
              }
            }
          } catch (error) {
            console.error('Lỗi khi phân tích dữ liệu người dùng:', error);
          }
        }
      }
      
      return (
        <Alert
          message={message}
          type="info"
          showIcon
        />
      );
    }

    return (
      <div className="flex">
        <Input
          placeholder="Nhập tin nhắn..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={sendingMessage || localSending}
          className="flex-grow mr-2"
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSendMessage}
          loading={sendingMessage || localSending}
        >
          Gửi
        </Button>
      </div>
    );
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
              {conversation.status === 'active' && !isAssignedToOther() && (
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
            {!canViewMessages() ? (
              <div className="h-full flex items-center justify-center flex-col">
                <div className="text-gray-400 mb-4 text-5xl">
                  <LockOutlined />
                </div>
                <Text strong className="text-lg mb-2">Cuộc hội thoại đã được gán cho người khác</Text>
                <Text type="secondary">
                  Bạn không có quyền xem tin nhắn trong cuộc hội thoại này.
                </Text>
              </div>
            ) : loading ? (
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
                          <span>{getSenderName(message)}</span>
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
            {renderMessageInput()}
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