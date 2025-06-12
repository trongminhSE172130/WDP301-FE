import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  message,
  Typography,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  BellOutlined,
} from '@ant-design/icons';
import PushNotificationTable from '../../components/admin/pushnotifications/PushNotificationTable';
import PushNotificationForm from '../../components/admin/pushnotifications/PushNotificationForm';
import { broadcastNotification, getNotifications } from '../../service/api/notificationAPI';
import type { 
  CreateNotificationRequest
} from '../../components/admin/pushnotifications/PushNotificationTypes';
import type { NotificationItem, GetNotificationsParams } from '../../service/api/notificationAPI';

const { Title } = Typography;

const PushNotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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

  // Mở modal tạo mới
  const handleAdd = () => {
    setIsModalOpen(true);
  };

  // Xử lý submit form và gửi notification
  const handleSubmit = async (data: CreateNotificationRequest) => {
    try {
      setLoading(true);
      
      console.log('Sending notification:', data);
      
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
            `Gửi thông báo thành công! Đã gửi cho ${response.data.sentCount}/${response.data.totalUsers} người dùng có role "${data.role}"`
          );
        } else {
          message.success('Gửi thông báo thành công!');
        }

        // Refresh danh sách để hiển thị notification mới
        await fetchNotifications();
      } else {
        message.error('Gửi thông báo thất bại');
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error('Error sending notification:', error);
      message.error('Có lỗi xảy ra khi gửi thông báo');
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
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAdd}
            loading={loading}
          >
            Gửi thông báo broadcast
          </Button>
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

      {/* Modal tạo/sửa notification */}
      <PushNotificationForm
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialValues={null}
        title="Gửi thông báo cho tất cả người dùng"
      />
    </div>
  );
};

export default PushNotificationPage; 