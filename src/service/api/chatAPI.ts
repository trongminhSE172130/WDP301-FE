import apiClient from '../instance';

export interface ChatUser {
  _id: string;
  full_name: string;
  email?: string;
  role?: string;
}

export interface LastMessage {
  content: string;
  sender_id: string | null;
  sent_at: string | null;
}

export interface UnreadCount {
  user: number;
  admin: number;
}

export interface ChatConversation {
  _id: string;
  user_id: ChatUser | string;
  assigned_to: string | ChatUser | null;
  status: 'pending' | 'active' | 'closed';
  title: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: string;
  closed_at: string | null;
  closed_by: string | null;
  tags: string[];
  last_message: LastMessage;
  unread_count: UnreadCount;
  created_at: string;
  updated_at: string;
}

export interface Attachment {
  url: string | null;
  filename: string | null;
  filesize: number | null;
  mimetype: string | null;
}

export interface ChatMessage {
  _id: string;
  conversation_id: string;
  sender_id: string | ChatUser;
  content: string;
  message_type?: 'text' | 'system' | 'image' | 'file';
  attachment?: Attachment;
  is_read?: boolean;
  read_at?: string | null;
  edited_at?: string | null;
  is_deleted?: boolean;
  deleted_at?: string | null;
  reply_to?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConversationsResponse {
  success: boolean;
  count: number;
  data: ChatConversation[];
}

export interface ConversationDetailResponse {
  success: boolean;
  data: {
    conversation: ChatConversation;
    messages: ChatMessage[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_records: number;
      limit: number;
    };
  };
}

export interface SendMessageResponse {
  success: boolean;
  data: ChatMessage;
}

export interface AcceptConversationResponse {
  success: boolean;
  message: string;
}

export interface CloseConversationResponse {
  success: boolean;
  message: string;
}

const chatAPI = {
  // Lấy danh sách hội thoại
  getConversations: async (): Promise<ConversationsResponse> => {
    const response = await apiClient.get<ConversationsResponse>('/chat/conversations');
    return response.data;
  },

  // Lấy chi tiết hội thoại và tin nhắn
  getConversationDetail: async (conversationId: string): Promise<ConversationDetailResponse> => {
    const response = await apiClient.get<ConversationDetailResponse>(`/chat/conversations/${conversationId}`);
    return response.data;
  },

  // Gửi tin nhắn mới
  sendMessage: async (conversationId: string, content: string): Promise<SendMessageResponse> => {
    const response = await apiClient.post<SendMessageResponse>(`/chat/conversations/${conversationId}/messages`, {
      content
    });
    return response.data;
  },

  // Chấp nhận yêu cầu hỗ trợ từ người dùng
  acceptConversation: async (conversationId: string): Promise<AcceptConversationResponse> => {
    const response = await apiClient.post<AcceptConversationResponse>(`/chat/conversations/${conversationId}/accept`);
    return response.data;
  },

  // Đóng hội thoại
  closeConversation: async (conversationId: string): Promise<CloseConversationResponse> => {
    const response = await apiClient.put<CloseConversationResponse>(`/chat/conversations/${conversationId}/close`);
    return response.data;
  },

  // Thêm hàm API để gửi tin nhắn hệ thống
  sendSystemMessage: async (conversationId: string, content: string): Promise<SendMessageResponse> => {
    const response = await apiClient.post<SendMessageResponse>(`/chat/conversations/${conversationId}/system-message`, {
      content
    });
    return response.data;
  }
};

export default chatAPI; 