import React, { useState, useEffect } from 'react';
import { Modal, Descriptions, Tag, Avatar, Spin, message, Button, Divider } from 'antd';
import { 
  UserOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
  InfoCircleOutlined,
  EditOutlined,
  CloseOutlined
} from '@ant-design/icons';
import type { Schedule } from './ScheduleTypes';
import { getScheduleById } from '../../../service/api/scheduleAPI';
import { getUserById, type ApiUser } from '../../../service/api/userAPI';

interface ScheduleDetailModalProps {
  visible: boolean;
  scheduleId: string | null;
  onClose: () => void;
  onEdit?: (schedule: Schedule) => void;
}

const ScheduleDetailModal: React.FC<ScheduleDetailModalProps> = ({
  visible,
  scheduleId,
  onClose,
  onEdit
}) => {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [consultant, setConsultant] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && scheduleId) {
      loadScheduleDetail();
    } else if (!visible) {
      // Reset states when modal is closed
      setSchedule(null);
      setConsultant(null);
    }
  }, [visible, scheduleId]);

  const loadScheduleDetail = async () => {
    if (!scheduleId) return;
    
    setLoading(true);
    try {
      const response = await getScheduleById(scheduleId);
      console.log('Schedule detail response:', response); // Debug log
      if (response.success) {
        console.log('Schedule data:', response.data); // Debug log
        console.log('Consultant ID:', response.data.consultant_user_id); // Debug log
        setSchedule(response.data);
        
        // Load consultant details if we have the ID
        if (response.data.consultant_user_id && typeof response.data.consultant_user_id === 'string') {
          try {
            const consultantResponse = await getUserById(response.data.consultant_user_id);
            console.log('Consultant details:', consultantResponse); // Debug log
            if (consultantResponse.success) {
              setConsultant(consultantResponse.data);
            }
          } catch (consultantError) {
            console.error('Error loading consultant details:', consultantError);
            // Don't show error message for consultant details, just log it
          }
        }
      } else {
        message.error('Không thể tải thông tin chi tiết lịch');
      }
    } catch (error) {
      console.error('Error loading schedule detail:', error);
      message.error('Có lỗi xảy ra khi tải thông tin lịch');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (schedule && onEdit) {
      onEdit(schedule);
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const renderStatus = (isBooked: boolean) => {
    if (isBooked) {
      return (
        <Tag color="blue" icon={<CheckCircleOutlined />} className="px-3 py-1">
          Đã được đặt
        </Tag>
      );
    } else {
      return (
        <Tag color="green" icon={<ClockCircleOutlined />} className="px-3 py-1">
          Còn trống
        </Tag>
      );
    }
  };

  const renderScheduleType = (type: string) => {
    if (type === 'advice') {
      return (
        <Tag color="cyan" className="px-3 py-1">
          Tư vấn
        </Tag>
      );
    } else {
      return (
        <Tag color="purple" className="px-3 py-1">
          Khám bệnh
        </Tag>
      );
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-3 py-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <InfoCircleOutlined className="text-white text-lg" />
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-800">
              Chi tiết lịch tư vấn
            </div>
            <div className="text-sm text-gray-500">
              Thông tin chi tiết về lịch trình tư vấn
            </div>
          </div>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="close" icon={<CloseOutlined />} onClick={onClose}>
          Đóng
        </Button>,
        ...(schedule && onEdit ? [
          <Button 
            key="edit" 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={handleEdit}
          >
            Chỉnh sửa
          </Button>
        ] : [])
      ]}
      className="schedule-detail-modal"
    >
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      ) : schedule ? (
        <div className="space-y-6">
          {/* Header Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar 
                  size={60} 
                  icon={<UserOutlined />}
                  className="bg-blue-500"
                >
                  {consultant?.full_name?.charAt(0).toUpperCase() || 'T'}
                </Avatar>
                <div>
                  <div className="text-xl font-semibold text-gray-800">
                    {consultant?.full_name || 'Tư vấn viên'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {consultant?.email || 'Email không có'}
                  </div>
                  {consultant?.specialty && (
                    <div className="text-xs text-blue-600 mt-1">
                      Chuyên khoa: {consultant.specialty}
                    </div>
                  )}
                  {consultant?.experience_years && (
                    <div className="text-xs text-gray-500">
                      Kinh nghiệm: {consultant.experience_years} năm
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                {renderStatus(schedule.is_booked)}
                <div className="mt-2">
                  {renderScheduleType(schedule.schedule_type)}
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Details */}
          <Descriptions 
            title="Thông tin lịch trình" 
            bordered 
            column={2}
            size="middle"
            labelStyle={{ 
              fontWeight: 600, 
              color: '#374151',
              backgroundColor: '#f9fafb',
              width: '180px'
            }}
            contentStyle={{ 
              color: '#1f2937'
            }}
          >
            <Descriptions.Item 
              label={
                <span className="flex items-center space-x-2">
                  <CalendarOutlined className="text-blue-500" />
                  <span>Ngày</span>
                </span>
              } 
              span={2}
            >
              <span className="text-lg font-medium">{formatDate(schedule.date)}</span>
            </Descriptions.Item>

            <Descriptions.Item 
              label={
                <span className="flex items-center space-x-2">
                  <ClockCircleOutlined className="text-green-500" />
                  <span>Khung giờ</span>
                </span>
              }
            >
              <span className="text-lg font-medium text-blue-600">{schedule.time_slot}</span>
            </Descriptions.Item>

            <Descriptions.Item label="Loại lịch">
              {renderScheduleType(schedule.schedule_type)}
            </Descriptions.Item>

            <Descriptions.Item label="Trạng thái" span={2}>
              {renderStatus(schedule.is_booked)}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          {/* Metadata */}
          <Descriptions 
            title="Thông tin hệ thống" 
            bordered 
            column={1}
            size="small"
            labelStyle={{ 
              fontWeight: 600, 
              color: '#6b7280',
              backgroundColor: '#f9fafb',
              width: '150px'
            }}
            contentStyle={{ 
              color: '#6b7280',
              fontSize: '13px'
            }}
          >
            <Descriptions.Item label="Ngày tạo">
              {formatDateTime(schedule.created_at)}
            </Descriptions.Item>

            <Descriptions.Item label="Cập nhật cuối">
              {formatDateTime(schedule.updated_at)}
            </Descriptions.Item>
          </Descriptions>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <InfoCircleOutlined className="text-4xl mb-4" />
          <div>Không thể tải thông tin lịch trình</div>
        </div>
      )}
    </Modal>
  );
};

export default ScheduleDetailModal; 