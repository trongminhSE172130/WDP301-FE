import React from 'react';
import { Card, Input, List, Avatar, Badge, Typography, Tag } from 'antd';
import { UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { ChatConversation } from '../../../service/api/chatAPI';

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
    if (typeof conversation.user_id === 'string') {
      return 'Người dùng';
    } else {
      return conversation.user_id.full_name || 'Người dùng';
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const userName = typeof conv.user_id === 'string' 
      ? '' 
      : conv.user_id.full_name.toLowerCase();
    
    return userName.includes(searchText.toLowerCase()) ||
      conv.title.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <Card
      title="Danh sách hội thoại"
      bordered={false}
      className="h-[calc(100vh-120px)] overflow-hidden flex flex-col"
      bodyStyle={{ padding: '12px', height: '100%', display: 'flex', flexDirection: 'column' }}
    >
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
                    <Tag color={getStatusColor(conversation.status)}>{conversation.status}</Tag>
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
    </Card>
  );
};

export default ConversationList; 