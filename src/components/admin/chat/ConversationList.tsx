import React from 'react';
import { Input, List, Avatar, Badge, Typography, Tag } from 'antd';
import { UserOutlined, ClockCircleOutlined, LockOutlined } from '@ant-design/icons';
import type { ChatConversation as BaseChatConversation } from '../../../service/api/chatAPI';

// Mở rộng interface ChatConversation để thêm trường is_assigned_to_other
interface ChatConversation extends BaseChatConversation {
  is_assigned_to_other?: boolean;
}

const { Text } = Typography;
const { Search } = Input;

interface ConversationListProps {
  conversations: ChatConversation[];
  loading: boolean;
  searchText: string;
  selectedConversation: ChatConversation | null;
  onSearchChange: (value: string) => void;
  onConversationSelect: (conversation: ChatConversation) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  loading,
  searchText,
  selectedConversation,
  onSearchChange,
  onConversationSelect,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'pending':
        return 'orange';
      case 'closed':
        return 'red';
      default:
        return 'default';
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
    if (!conversation.user_id) {
      return 'Khách vãng lai';
    } else if (typeof conversation.user_id === 'string') {
      return 'Người dùng';
    } else {
      return conversation.user_id.full_name || 'Người dùng';
    }
  };

  // Kiểm tra xem cuộc hội thoại đã được gán cho người khác chưa
  const isAssignedToOther = (conversation: ChatConversation) => {
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
        if (userData && userData._id) {
          // Nếu assigned_to là string
          if (typeof conversation.assigned_to === 'string') {
            return conversation.assigned_to !== userData._id;
          }
          // Nếu assigned_to là object
          if (typeof conversation.assigned_to === 'object' && conversation.assigned_to !== null) {
            return conversation.assigned_to._id !== userData._id;
          }
        }
      } catch {
        // Lỗi khi phân tích dữ liệu người dùng
      }
    }
    
    return false;
  };

  // Kiểm tra xem người dùng hiện tại có phải là admin không
  const isCurrentUserAdmin = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        return userData && userData.role === 'admin';
      } catch {
        // Lỗi khi phân tích dữ liệu người dùng
      }
    }
    return false;
  };

  // Hàm lấy tên người được assign vào cuộc hội thoại
  const getAssignedUserName = (conversation: ChatConversation) => {
    if (!conversation.assigned_to) {
      return null;
    }
    
    // Lấy thông tin người dùng hiện tại
    const userStr = localStorage.getItem('user');
    let currentUserId = '';
    
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        if (userData) {
          // Lấy ID người dùng - xử lý cả trường hợp id và _id
          currentUserId = userData.id || userData._id;
        }
      } catch {
        // Lỗi khi phân tích dữ liệu người dùng
      }
    }
    
    if (typeof conversation.assigned_to === 'string') {
      // Nếu người được assign là người dùng hiện tại
      if (currentUserId && conversation.assigned_to === currentUserId) {
        return 'Bạn';
      }
      return 'Đã gán';
    } else if (typeof conversation.assigned_to === 'object' && conversation.assigned_to !== null) {
      // Nếu người được assign là người dùng hiện tại
      if (currentUserId && conversation.assigned_to._id === currentUserId) {
        return 'Bạn';
      }
      return conversation.assigned_to.full_name || 'Đã gán';
    }
    
    return null;
  };

  const filteredConversations = conversations.filter(conv => {
    const userName = !conv.user_id ? 'Khách vãng lai' : 
      (typeof conv.user_id === 'string' ? '' : conv.user_id.full_name.toLowerCase());
    
    return userName.includes(searchText.toLowerCase()) ||
      conv.title.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <div className="h-[calc(100vh-120px)] overflow-hidden">
      <Search
        placeholder="Tìm kiếm hội thoại"
        allowClear
        onChange={(e) => onSearchChange(e.target.value)}
        className="mb-4"
        style={{ flexShrink: 0 }}
      />
      
      <div 
        className="overflow-y-auto flex-grow pr-1 conversation-list-scroll" 
        style={{ 
          height: 'calc(100vh - 220px)',
          overflowY: 'auto',
        }}
      >
        <List
          loading={loading}
          dataSource={filteredConversations}
          renderItem={(conversation) => (
            <List.Item 
              key={conversation._id}
              onClick={() => onConversationSelect(conversation)}
              className={`cursor-pointer hover:bg-gray-50 rounded p-2 mb-2 ${selectedConversation?._id === conversation._id ? 'bg-blue-50' : ''}`}
            >
              <List.Item.Meta
                avatar={
                  <Avatar icon={<UserOutlined />} />
                }
                title={
                  <div className="flex items-center justify-between">
                    <Text strong>{getUserName(conversation)}</Text>
                    <div className="flex items-center">
                      {conversation.assigned_to && (
                        <Tag color="blue" className="mr-1">
                          <UserOutlined /> {getAssignedUserName(conversation) === 'Bạn' 
                            ? 'Bạn đang hỗ trợ' 
                            : `Hỗ trợ: ${getAssignedUserName(conversation)}`}
                        </Tag>
                      )}
                      {isAssignedToOther(conversation) && (
                        <Tag color="purple" className="mr-1">
                          <LockOutlined /> {isCurrentUserAdmin() ? 'Đã gán (Chỉ xem)' : 'Đã gán'}
                        </Tag>
                      )}
                      <Tag color={getStatusColor(conversation.status)}>{conversation.status}</Tag>
                    </div>
                  </div>
                }
                description={
                  <div>
                    <div className="font-medium">{conversation.title}</div>
                    <Text type="secondary" ellipsis>
                      {conversation.last_message.content || 'Chưa có tin nhắn'}
                    </Text>
                  </div>
                }
              />
              <div className="flex flex-col items-end">
                <Text type="secondary" className="text-xs flex items-center">
                  <ClockCircleOutlined className="mr-1" /> 
                  {formatDate(conversation.last_message.sent_at) || formatDate(conversation.created_at)}
                </Text>
                {conversation.unread_count.admin > 0 && (
                  <Badge count={conversation.unread_count.admin} size="small" className="mt-1" />
                )}
              </div>
            </List.Item>
          )}
          locale={{
            emptyText: <div className="py-8 text-center">Không có hội thoại nào</div>
          }}
        />
      </div>
    </div>
  );
};

export default ConversationList; 