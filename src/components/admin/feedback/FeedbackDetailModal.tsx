import React from 'react';
import { Modal, Button, Form, Input, Select, Rate, Switch, Avatar, Tag, Divider, Tooltip } from 'antd';
import { LoadingOutlined, UserOutlined, CalendarOutlined, ClockCircleOutlined, CommentOutlined, StarFilled, CheckCircleFilled, CloseCircleFilled, EyeInvisibleOutlined, FieldTimeOutlined, FlagOutlined } from '@ant-design/icons';
import type { Feedback } from '../../../service/api/feedbackAPI';
import type { FormInstance } from 'antd/es/form';
import type { FeedbackResponseFormValues } from './FeedbackTypes';

const { Option } = Select;
const { TextArea } = Input;

interface FeedbackDetailModalProps {
  visible: boolean;
  loading: boolean;
  feedback: Feedback | null;
  form: FormInstance<FeedbackResponseFormValues>;
  onCancel: () => void;
  onSubmit: (values: FeedbackResponseFormValues) => void;
  onToggleFeatured: (id: string, featured: boolean) => void;
}

const FeedbackDetailModal: React.FC<FeedbackDetailModalProps> = ({
  visible,
  loading,
  feedback,
  form,
  onCancel,
  onSubmit,
  onToggleFeatured
}) => {
  const getStatusTag = (status: string | undefined) => {
    switch (status) {
      case 'approved':
        return <Tag color="success" icon={<CheckCircleFilled />}>Đã duyệt</Tag>;
      case 'rejected':
        return <Tag color="error" icon={<CloseCircleFilled />}>Từ chối</Tag>;
      case 'hidden':
        return <Tag color="default" icon={<EyeInvisibleOutlined />}>Ẩn</Tag>;
      default:
        return <Tag color="warning" icon={<FieldTimeOutlined />}>Chờ xử lý</Tag>;
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center">
          <span className="text-lg font-semibold mr-3">Chi tiết Feedback</span>
          {feedback && getStatusTag(feedback.status)}
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={feedback?.admin_reply ? [
        <Button key="back" onClick={onCancel}>
          Đóng
        </Button>
      ] : null}
      onOk={() => form.submit()}
      width={700}
      className="feedback-detail-modal"
      bodyStyle={{ padding: '24px', maxHeight: '80vh', overflowY: 'auto' }}
    >
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingOutlined style={{ fontSize: 32 }} spin />
          <span className="ml-3 text-base">Đang tải dữ liệu...</span>
        </div>
      ) : feedback ? (
        <div className="feedback-detail-content">
          {/* Thông tin người dùng */}
          <div className="bg-gray-50 p-5 rounded-lg mb-6 shadow-sm">
            <div className="flex items-start">
              <Avatar 
                size={64} 
                icon={<UserOutlined />} 
                className="bg-blue-500"
              />
              <div className="ml-4">
                <div className="text-lg font-bold">
                  {typeof feedback.user_id === 'object' 
                    ? feedback.user_id.full_name
                    : 'Không xác định'}
                  {feedback.is_anonymous && 
                    <Tag color="default" className="ml-2">Ẩn danh</Tag>
                  }
                </div>
                {typeof feedback.user_id === 'object' && feedback.user_id.email && (
                  <div className="text-gray-500">{feedback.user_id.email}</div>
                )}
                <div className="mt-2 text-sm text-gray-500">
                  <FieldTimeOutlined className="mr-1" /> Gửi lúc: {new Date(feedback.created_at).toLocaleString('vi-VN')}
                </div>
              </div>
            </div>
          </div>
          
          {/* Thông tin dịch vụ và đặt lịch */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Thông tin dịch vụ */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <h3 className="text-base font-semibold mb-3 flex items-center">
                Dịch vụ
              </h3>
              <div className="bg-blue-50 p-3 rounded-md">
                {typeof feedback.service_id === 'object' && feedback.service_id
                  ? feedback.service_id.title
                  : 'Không xác định'}
              </div>
            </div>
            
            {/* Thông tin đặt lịch */}
            {typeof feedback.booking_id === 'object' && feedback.booking_id !== null && (
              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <h3 className="text-base font-semibold mb-3 flex items-center">
                  <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <CalendarOutlined className="text-green-600" />
                  </span>
                  Thông tin đặt lịch
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CalendarOutlined className="mr-2 text-gray-500" />
                    <span>Ngày: {feedback.booking_id.scheduled_date ? 
                      new Date(feedback.booking_id.scheduled_date).toLocaleDateString('vi-VN') : 
                      'Không có thông tin'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <ClockCircleOutlined className="mr-2 text-gray-500" />
                    <span>Khung giờ: {feedback.booking_id.time_slot || 'Không có thông tin'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Đánh giá */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm mb-6">
            <h3 className="text-base font-semibold mb-4 flex items-center">
              <span className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-2">
                <StarFilled className="text-yellow-500" />
              </span>
              Đánh giá
            </h3>
            <div className="text-center py-3">
              <div className="text-3xl font-bold text-yellow-500 mb-2">{feedback.rating}.0</div>
              <Rate disabled value={feedback.rating} className="text-yellow-500" />
              <div className="mt-2 text-gray-500">Đánh giá tổng thể</div>
            </div>
          </div>
          
          {/* Nội dung feedback */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm mb-6">
            <h3 className="text-base font-semibold mb-3 flex items-center">
              <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                <CommentOutlined className="text-purple-600" />
              </span>
              Nội dung feedback
            </h3>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100 min-h-[100px]">
              {feedback.comment || 'Không có nội dung'}
            </div>
          </div>
          
          {/* Thông tin nổi bật */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold flex items-center">
                <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-2">
                  <FlagOutlined className="text-red-600" />
                </span>
                Đánh dấu nổi bật
              </h3>
              <Tooltip title="Hiển thị trên trang chủ">
                <Switch 
                  checked={!!feedback.is_featured} 
                  onChange={() => onToggleFeatured(feedback._id, !!feedback.is_featured)}
                />
              </Tooltip>
            </div>
            
            {feedback.reported_count !== undefined && feedback.reported_count > 0 && (
              <div className="mt-4">
                <Tag color="error" icon={<FlagOutlined />}>
                  Đã bị báo cáo {feedback.reported_count} lần
                </Tag>
              </div>
            )}
          </div>
          
          {/* Phản hồi admin */}
          {feedback.admin_reply ? (
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <h3 className="text-base font-semibold mb-3">Phản hồi của Admin</h3>
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                {feedback.admin_reply}
              </div>
              <div className="text-sm text-gray-500 mt-3">
                Phản hồi bởi: {
                  typeof feedback.admin_reply_by === 'object' && feedback.admin_reply_by !== null
                    ? feedback.admin_reply_by.full_name
                    : feedback.admin_reply_by || 'Admin'
                } vào lúc {new Date(feedback.admin_reply_at || '').toLocaleString('vi-VN')}
              </div>
              
              {feedback.moderation_notes && (
                <div className="mt-4">
                  <Divider orientation="left">Ghi chú kiểm duyệt</Divider>
                  <div className="bg-yellow-50 p-3 rounded border border-yellow-200">{feedback.moderation_notes}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <h3 className="text-base font-semibold mb-4">Phản hồi</h3>
              <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
              >
                <Form.Item
                  name="response"
                  rules={[{ required: true, message: 'Vui lòng nhập nội dung phản hồi!' }]}
                >
                  <TextArea rows={4} placeholder="Nhập nội dung phản hồi..." />
                </Form.Item>
                
                <Form.Item
                  name="status"
                  label="Trạng thái"
                  initialValue="pending"
                >
                  <Select>
                    <Option value="pending">Chờ xử lý</Option>
                    <Option value="approved">Đã duyệt</Option>
                    <Option value="rejected">Từ chối</Option>
                    <Option value="hidden">Ẩn</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item
                  name="moderation_notes"
                  label="Ghi chú kiểm duyệt (chỉ admin nhìn thấy)"
                >
                  <TextArea rows={2} placeholder="Nhập ghi chú nội bộ (không hiển thị cho người dùng)..." />
                </Form.Item>
                
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="bg-blue-500">
                    Gửi phản hồi
                  </Button>
                </Form.Item>
              </Form>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <i className="fas fa-search fa-3x"></i>
          </div>
          <div className="text-lg">Không có dữ liệu</div>
        </div>
      )}
    </Modal>
  );
};

export default FeedbackDetailModal; 