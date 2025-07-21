import React, { useState, useEffect } from 'react';
import { Modal, Card, Descriptions, Tag, Avatar, Spin, message, Row, Col, Statistic } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, CalendarOutlined, TeamOutlined } from '@ant-design/icons';
import { getUserById, type ApiUser } from '../../../service/api/userAPI';

interface UserDetailModalProps {
  visible: boolean;
  userId: string | null;
  onClose: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ visible, userId, onClose }) => {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && userId) {
      fetchUserDetail();
    }
  }, [visible, userId]);

  const fetchUserDetail = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await getUserById(userId);
      
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Error fetching user detail:', error);
      message.error('Có lỗi xảy ra khi tải thông tin chi tiết');
    } finally {
      setLoading(false);
    }
  };

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'admin':
        return { color: 'red', text: 'Quản trị viên' };
      case 'consultant':
        return { color: 'green', text: 'Tư vấn viên' };
      case 'user':
        return { color: 'blue', text: 'Người dùng' };
      default:
        return { color: 'default', text: role };
    }
  };

  const getGenderText = (gender?: string) => {
    if (gender === 'male') return 'Nam';
    if (gender === 'female') return 'Nữ';
    return 'Chưa cập nhật';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatBirthDate = (dateString?: string) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <Modal
      title={
        <div className="flex items-center">
          <UserOutlined className="mr-2" />
          Chi tiết người dùng
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose
    >
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Spin size="large" />
        </div>
      ) : user ? (
        <div className="space-y-6">
          {/* Header với avatar và thông tin cơ bản */}
          <Card className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <Avatar size={80} icon={<UserOutlined />} />
              <div>
                <h2 className="text-xl font-semibold mb-2">{user.full_name}</h2>
                <Tag color={getRoleInfo(user.role).color} className="text-sm">
                  {getRoleInfo(user.role).text}
                </Tag>
              </div>
            </div>
          </Card>

          {/* Thống kê */}
          <Card title="Thống kê">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Tổng số đặt lịch"
                  value={user.statistics.total_bookings}
                  prefix={<CalendarOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Gói đăng ký đang hoạt động"
                  value={user.statistics.active_subscriptions}
                  prefix={<TeamOutlined />}
                />
              </Col>
            </Row>
          </Card>

          {/* Thông tin cá nhân */}
          <Card title="Thông tin cá nhân">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Họ và tên" span={2}>
                <div className="flex items-center">
                  <UserOutlined className="mr-2" />
                  {user.full_name}
                </div>
              </Descriptions.Item>
              
              <Descriptions.Item label="Email">
                <div className="flex items-center">
                  <MailOutlined className="mr-2" />
                  {user.email}
                </div>
              </Descriptions.Item>
              
              <Descriptions.Item label="Số điện thoại">
                <div className="flex items-center">
                  <PhoneOutlined className="mr-2" />
                  {user.phone || 'Chưa cập nhật'}
                </div>
              </Descriptions.Item>
              
              <Descriptions.Item label="Giới tính">
                {getGenderText(user.gender)}
              </Descriptions.Item>
              
              <Descriptions.Item label="Ngày sinh">
                {formatBirthDate(user.dob)}
              </Descriptions.Item>
              
              <Descriptions.Item label="Ngày tạo tài khoản" span={2}>
                {formatDate(user.created_at)}
              </Descriptions.Item>
              
              <Descriptions.Item label="Cập nhật lần cuối" span={2}>
                {formatDate(user.updated_at)}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Thông tin tư vấn viên (nếu có) */}
          {user.role === 'consultant' && (user.degree || user.specialty) && (
            <Card title="Thông tin chuyên môn">
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Bằng cấp" span={2}>
                  {user.degree || 'Chưa cập nhật'}
                </Descriptions.Item>
                
                <Descriptions.Item label="Chuyên khoa">
                  {user.specialty || 'Chưa cập nhật'}
                </Descriptions.Item>
                
                <Descriptions.Item label="Kinh nghiệm">
                  {user.experience_years ? `${user.experience_years} năm` : 'Chưa cập nhật'}
                </Descriptions.Item>
                
                <Descriptions.Item label="Tư vấn trực tuyến">
                  <Tag color={user.is_available_for_advice ? 'green' : 'red'}>
                    {user.is_available_for_advice ? 'Có' : 'Không'}
                  </Tag>
                </Descriptions.Item>
                
                <Descriptions.Item label="Phân tích kết quả">
                  <Tag color={user.is_available_for_analysis ? 'green' : 'red'}>
                    {user.is_available_for_analysis ? 'Có' : 'Không'}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}

          {/* Cài đặt thông báo */}
          {user.push_notification_settings && (
            <Card title="Cài đặt thông báo">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span>Nhắc nhở đặt lịch:</span>
                  <Tag color={user.push_notification_settings.booking_reminders ? 'green' : 'red'}>
                    {user.push_notification_settings.booking_reminders ? 'Bật' : 'Tắt'}
                  </Tag>
                </div>
                
                <div className="flex justify-between">
                  <span>Thông báo gói dịch vụ:</span>
                  <Tag color={user.push_notification_settings.subscription_alerts ? 'green' : 'red'}>
                    {user.push_notification_settings.subscription_alerts ? 'Bật' : 'Tắt'}
                  </Tag>
                </div>
                
                <div className="flex justify-between">
                  <span>Theo dõi sinh sản:</span>
                  <Tag color={user.push_notification_settings.reproductive_tracking ? 'green' : 'red'}>
                    {user.push_notification_settings.reproductive_tracking ? 'Bật' : 'Tắt'}
                  </Tag>
                </div>
                
                <div className="flex justify-between">
                  <span>Cập nhật blog:</span>
                  <Tag color={user.push_notification_settings.blog_updates ? 'green' : 'red'}>
                    {user.push_notification_settings.blog_updates ? 'Bật' : 'Tắt'}
                  </Tag>
                </div>
                
                <div className="flex justify-between">
                  <span>Cập nhật tư vấn:</span>
                  <Tag color={user.push_notification_settings.consultation_updates ? 'green' : 'red'}>
                    {user.push_notification_settings.consultation_updates ? 'Bật' : 'Tắt'}
                  </Tag>
                </div>
              </div>
            </Card>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p>Không tìm thấy thông tin người dùng</p>
        </div>
      )}
    </Modal>
  );
};

export default UserDetailModal; 