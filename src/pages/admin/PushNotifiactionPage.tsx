import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  message,
  Typography,
  Spin,
  Space,
} from 'antd';
import {
  PlusOutlined,
  BellOutlined,
  UserOutlined,
} from '@ant-design/icons';
import PushNotificationTable from '../../components/admin/pushnotifications/PushNotificationTable';
import PushNotificationForm from '../../components/admin/pushnotifications/PushNotificationForm';
import PushNotificationUserForm from '../../components/admin/pushnotifications/PushNotificationUserForm';
import { broadcastNotification, getNotifications, sendToUserNotification } from '../../service/api/notificationAPI';
import type { 
  CreateNotificationRequest,
  CreateUserNotificationRequest
} from '../../components/admin/pushnotifications/PushNotificationTypes';
import type { NotificationItem, GetNotificationsParams } from '../../service/api/notificationAPI';

const { Title } = Typography;

const PushNotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState<boolean>(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    pages: 1
  });

  // Lấy danh sách notifications từ API
  const fetchNotifications = async (params?: GetNotificationsParams) => {
    try {
      setLoading(true);
      const response = await getNotifications({
        page: pagination.current,
        limit: pagination.pageSize,
        ...params
      });

      if (response.success) {
        setNotifications(response.data);
        setPagination({
          current: response.page,
          pageSize: pagination.pageSize,
          total: response.total,
          pages: response.pages
        });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      message.error('Có lỗi xảy ra khi tải danh sách thông báo');
    } finally {
      setLoading(false);
    }
  };

  // Load data khi component mount
  useEffect(() => {
    fetchNotifications();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Xử lý thay đổi phân trang
  const handleTableChange = (page: number, pageSize?: number) => {
    const newPagination = {
      ...pagination,
      current: page,
      pageSize: pageSize || pagination.pageSize
    };
    setPagination(newPagination);
    
    fetchNotifications({
      page,
      limit: pageSize || pagination.pageSize
    });
  };

  // Mở modal broadcast
  const handleBroadcast = () => {
    setIsBroadcastModalOpen(true);
  };

  // Mở modal gửi cho user cụ thể
  const handleSendToUser = () => {
    setIsUserModalOpen(true);
  };

  // Xử lý submit form broadcast
  const handleBroadcastSubmit = async (data: CreateNotificationRequest) => {
    try {
      setLoading(true);
      
      console.log('Sending broadcast notification:', data);
      
      // Gửi broadcast notification qua API
      const response = await broadcastNotification({
        role: data.role,
        title: data.title,
        body: data.body,
        data: data.data
      });

      console.log('API Response:', response);

      if (response.success) {
        // Hiển thị thông báo thành công với thống kê
        if (response.data) {
          message.success(
            `Gửi thông báo broadcast thành công! Đã gửi cho ${response.data.sentCount}/${response.data.totalUsers} người dùng có role "${data.role}"`
          );
        } else {
          message.success('Gửi thông báo broadcast thành công!');
        }

        // Refresh danh sách để hiển thị notification mới
        await fetchNotifications();
      } else {
        message.error('Gửi thông báo broadcast thất bại');
      }

      setIsBroadcastModalOpen(false);
    } catch (error) {
      console.error('Error sending broadcast notification:', error);
      message.error('Có lỗi xảy ra khi gửi thông báo broadcast');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý submit form gửi cho user cụ thể
  const handleUserSubmit = async (data: CreateUserNotificationRequest) => {
    try {
      setLoading(true);
      
      console.log('Sending user notification:', data);
      
      // Gửi notification cho user cụ thể qua API
      const response = await sendToUserNotification({
        user_id: data.user_id,
        title: data.title,
        body: data.body,
        data: data.data
      });

      console.log('API Response:', response);

      if (response.success) {
        // Hiển thị thông báo thành công với thông tin user
        if (response.data?.user_info) {
          message.success(
            `Gửi thông báo thành công cho ${response.data.user_info.full_name} (${response.data.user_info.email})`
          );
        } else {
          message.success('Gửi thông báo cho người dùng thành công!');
        }

        // Refresh danh sách để hiển thị notification mới
        await fetchNotifications();
      } else {
        message.error('Gửi thông báo cho người dùng thất bại');
      }

      setIsUserModalOpen(false);
    } catch (error) {
      console.error('Error sending user notification:', error);
      message.error('Có lỗi xảy ra khi gửi thông báo cho người dùng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <BellOutlined style={{ marginRight: '8px' }} />
        Quản lý Push Notification
      </Title>

      {/* Bảng notifications */}
      <Card>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <Title level={4} style={{ margin: 0 }}>Danh sách thông báo</Title>
          <Space>
            <Button 
              type="default" 
              icon={<UserOutlined />}
              onClick={handleSendToUser}
              loading={loading}
            >
              Gửi cho người dùng cụ thể
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleBroadcast}
              loading={loading}
            >
              Gửi thông báo cho tất cả người dùng
            </Button>
          </Space>
        </div>

        <Spin spinning={loading}>
          <PushNotificationTable
            notifications={notifications}
            loading={loading}
            pagination={pagination}
            onTableChange={handleTableChange}
          />
        </Spin>
      </Card>

      {/* Modal broadcast notification */}
      <PushNotificationForm
        visible={isBroadcastModalOpen}
        onCancel={() => setIsBroadcastModalOpen(false)}
        onSubmit={handleBroadcastSubmit}
        initialValues={null}
        title="Gửi thông báo broadcast cho tất cả người dùng"
      />

      {/* Modal gửi notification cho user cụ thể */}
      <PushNotificationUserForm
        visible={isUserModalOpen}
        onCancel={() => setIsUserModalOpen(false)}
        onSubmit={handleUserSubmit}
        title="Gửi thông báo cho người dùng cụ thể"
      />
    </div>
  );
};

export default PushNotificationPage; 