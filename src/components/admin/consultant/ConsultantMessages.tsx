import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, List, Avatar, Empty, Spin, Alert } from 'antd';
import apiClient from '../../../service/instance';
import { io, Socket } from 'socket.io-client';

const statusLabel: Record<string, string> = {
  confirmed: 'Đã xác nhận',
  in_progress: 'Đang tư vấn',
  completed: 'Đã hoàn thành',
  pending: 'Chờ xác nhận',
  cancelled: 'Đã hủy',
};

interface ChatRoom {
  booking_id: string;
  room_name: string;
  booking_status: string;
  participants: {
    user: {
      id: string;
      name: string;
      email: string;
      online: boolean;
    };
    consultant: {
      id: string;
      name: string;
      email: string;
      online: boolean;
    };
  };
  last_message: null | {
    _id: string;
    sender: string;
    message: string;
    message_type: string;
    created_at: string;
  };
  unread_count: number;
  created_at: string;
  updated_at: string;
}

interface ChatMessage {
  _id: string;
  sender: string;
  message: string;
  message_type: string;
  created_at: string;
}

const mockMessages = [
  { from: 'user', text: 'Xin chào bác sĩ!', time: '09:00' },
  { from: 'consultant', text: 'Chào bạn, bạn cần tư vấn gì?', time: '09:01' },
  { from: 'user', text: 'Tôi muốn hỏi về sức khỏe.', time: '09:02' },
];

const ConsultantMessages: React.FC = () => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selected, setSelected] = useState<ChatRoom | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    setLoading(true);
    apiClient.get('/chat/rooms')
      .then(res => {
        setRooms(res.data.data || []);
        setSelected((res.data.data && res.data.data[0]) || null);
        setError(null);
      })
      .catch(() => {
        setError('Không thể tải danh sách phòng chat.');
      })
      .finally(() => setLoading(false));
  }, []);

  // Kết nối socket.io khi có token
  useEffect(() => {
    if (!token) return;
    const socket = io('https://genhealth.wizlab.io.vn', {
      auth: { token }
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Kết nối thành công tới socket server');
    });
    socket.on('error', (err: any) => {
      console.error('Lỗi từ server:', err?.message || err);
    });
    socket.on('new_message', (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });
    return () => {
      socket.disconnect();
    };
  }, [token]);

  // Khi chọn phòng chat, join_chat và load messages
  useEffect(() => {
    if (!selected || !socketRef.current) {
      setMessages([]);
      return;
    }
    setMsgLoading(true);
    // Join phòng chat
    socketRef.current.emit('join_chat', { booking_id: selected.booking_id });
    // Load messages lần đầu bằng REST API
    apiClient.get(`/chat/${selected.booking_id}/messages`)
      .then(res => {
        setMessages(res.data.data?.messages || []);
      })
      .catch(() => {
        setMessages([]);
      })
      .finally(() => setMsgLoading(false));
  }, [selected]);

  const bookingStatus = selected?.booking_status;

  const handleSend = () => {
    if (socketRef.current && input.trim() && selected) {
      socketRef.current.emit('send_message', {
        booking_id: selected.booking_id,
        message: input,
        message_type: 'text',
      });
      setInput('');
    }
  };

  return (
    <div style={{ display: 'flex', height: '80vh', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      {/* Sidebar */}
      <div style={{ width: 320, borderRight: '1px solid #f0f0f0', padding: 16, overflowY: 'auto' }}>
        <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 16, color: '#08979c' }}>Danh sách tư vấn</h3>
        {loading ? <Spin /> : error ? <Alert type="error" message={error} showIcon /> : (
          <List
            itemLayout="horizontal"
            dataSource={rooms}
            renderItem={item => (
              <List.Item
                style={{
                  background: selected?.room_name === item.room_name ? '#e6fffb' : undefined,
                  borderRadius: 8,
                  marginBottom: 8,
                  cursor: 'pointer',
                  border: selected?.room_name === item.room_name ? '1.5px solid #08979c' : '1px solid #f0f0f0',
                }}
                onClick={() => setSelected(item)}
              >
                <List.Item.Meta
                  avatar={<Avatar>{item.participants?.user?.name ? item.participants.user.name[0] : '?'}</Avatar>}
                  title={<span style={{ fontWeight: 600 }}>{item.participants?.user?.name || 'Không xác định'}</span>}
                  description={<span style={{ color: '#888' }}>{statusLabel[item.booking_status] || item.booking_status}</span>}
                />
                <div style={{ fontSize: 12, color: '#888' }}>{item.last_message?.message || ''}</div>
              </List.Item>
            )}
          />
        )}
      </div>
      {/* Chat window */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0 }}>
        <div style={{ padding: 16, borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
          <span style={{ fontWeight: 600, fontSize: 18 }}>{selected?.participants?.user?.name || 'Không xác định'}</span>
          <span style={{ color: '#13c2c2', marginLeft: 16 }}>{statusLabel[selected?.booking_status]}</span>
        </div>
        <div style={{ flex: 1, padding: 24, overflowY: 'auto', background: '#f7f7f7' }}>
          {msgLoading ? <Spin /> : (
            messages.length > 0 ? (
              messages.map((msg, idx) => (
                <div key={msg._id || idx} style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'consultant' ? 'flex-end' : 'flex-start',
                  marginBottom: 12,
                }}>
                  <div style={{
                    background: msg.sender === 'consultant' ? '#e6fffb' : '#fff',
                    color: '#222',
                    borderRadius: 16,
                    padding: '8px 16px',
                    maxWidth: 320,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  }}>
                    {msg.message}
                    <div style={{ fontSize: 11, color: '#888', marginTop: 2, textAlign: 'right' }}>{new Date(msg.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              ))
            ) : <Empty description="Chưa có tin nhắn" />
          )}
        </div>
        <div style={{ padding: 16, borderTop: '1px solid #f0f0f0', background: '#fafafa', display: 'flex', gap: 8 }}>
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onPressEnter={handleSend}
            placeholder={bookingStatus === 'completed' ? 'Cuộc tư vấn đã kết thúc, không thể gửi tin nhắn.' : 'Nhập tin nhắn...'}
            disabled={bookingStatus === 'completed'}
            style={{ borderRadius: 16 }}
          />
          <Button
            type="primary"
            onClick={handleSend}
            disabled={!input.trim() || bookingStatus === 'completed'}
            style={{ borderRadius: 16 }}
          >Gửi</Button>
        </div>
      </div>
    </div>
  );
};

export default ConsultantMessages; 