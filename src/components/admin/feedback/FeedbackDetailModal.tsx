import React from 'react';
import { Modal, Button, Form, Input, Select, Rate, Switch } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import type { Feedback } from '../../../service/api/feedbackAPI';
import type { FormInstance } from 'antd/es/form';
import type { FeedbackResponseFormValues } from './FeedbackTypes';

const { Option } = Select;

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
  return (
    <Modal
      title="Chi tiết Feedback"
      visible={visible}
      onCancel={onCancel}
      footer={feedback?.admin_reply ? [
        <Button key="back" onClick={onCancel}>
          Đóng
        </Button>
      ] : null}
      onOk={() => form.submit()}
    >
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <LoadingOutlined style={{ fontSize: 24 }} spin />
          <span className="ml-2">Đang tải dữ liệu...</span>
        </div>
      ) : feedback ? (
        <div>
          {/* Hiển thị trạng thái ở đầu nội dung modal thay vì trong tiêu đề */}
          {feedback && (
            <div className="mb-4">
              <span className={`px-2 py-1 rounded text-xs text-white ${
                feedback.status === 'approved' ? 'bg-green-500' :
                feedback.status === 'rejected' ? 'bg-red-500' :
                feedback.status === 'hidden' ? 'bg-gray-500' :
                'bg-gold-500'
              }`}>
                {feedback.status === 'approved' ? 'Đã duyệt' :
                 feedback.status === 'rejected' ? 'Từ chối' :
                 feedback.status === 'hidden' ? 'Ẩn' :
                 'Chờ xử lý'}
              </span>
            </div>
          )}
          
          <div className="mb-4">
            <div className="font-bold">Người dùng:</div>
            <div>
              {typeof feedback.user_id === 'object' 
                ? feedback.user_id.full_name + (feedback.is_anonymous ? ' (Ẩn danh)' : '')
                : 'Không xác định'}
            </div>
            {typeof feedback.user_id === 'object' && feedback.user_id.email && (
              <div className="text-xs text-gray-500">{feedback.user_id.email}</div>
            )}
          </div>
          
          <div className="mb-4">
            <div className="font-bold">Dịch vụ:</div>
            <div>
              {typeof feedback.service_id === 'object' 
                ? feedback.service_id.service_id.title
                : 'Không xác định'}
            </div>
          </div>
          
          {/* Hiển thị thông tin đặt lịch */}
          {typeof feedback.booking_id === 'object' && feedback.booking_id !== null && (
            <div className="mb-4">
              <div className="font-bold">Thông tin đặt lịch:</div>
              <div>
                <div>Ngày: {feedback.booking_id.scheduled_date ? new Date(feedback.booking_id.scheduled_date).toLocaleDateString('vi-VN') : 'Không có thông tin'}</div>
                <div>Khung giờ: {feedback.booking_id.time_slot || 'Không có thông tin'}</div>
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <div className="font-bold">Đánh giá:</div>
            <div>
              <Rate disabled defaultValue={feedback.rating} /> (Tổng thể)
            </div>
            <div className="mt-2">
              <div><strong>Chất lượng dịch vụ:</strong> <Rate disabled defaultValue={feedback.service_quality_rating} /></div>
              <div><strong>Tư vấn viên:</strong> <Rate disabled defaultValue={feedback.consultant_rating} /></div>
              <div><strong>Độ chính xác kết quả:</strong> <Rate disabled defaultValue={feedback.result_accuracy_rating} /></div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="font-bold">Nội dung feedback:</div>
            <div className="bg-gray-50 p-3 rounded">{feedback.comment}</div>
          </div>
          
          <div className="mb-4">
            <div className="font-bold">Ngày gửi:</div>
            <div>{new Date(feedback.created_at).toLocaleString('vi-VN')}</div>
          </div>
          
          <div className="mb-4">
            <div className="font-bold">Nổi bật:</div>
            <Switch 
              checked={!!feedback.is_featured} 
              onChange={() => onToggleFeatured(feedback._id, !!feedback.is_featured)}
            />
          </div>
          
          {feedback.admin_reply ? (
            <div>
              <div className="font-bold">Phản hồi:</div>
              <div className="bg-blue-50 p-3 rounded">{feedback.admin_reply}</div>
              <div className="text-sm text-gray-500 mt-2">
                Phản hồi bởi: {
                  typeof feedback.admin_reply_by === 'object' && feedback.admin_reply_by !== null
                    ? feedback.admin_reply_by.full_name
                    : feedback.admin_reply_by || 'Admin'
                } vào lúc {new Date(feedback.admin_reply_at || '').toLocaleString('vi-VN')}
              </div>
              
              {feedback.moderation_notes && (
                <div className="mt-4">
                  <div className="font-bold">Ghi chú kiểm duyệt:</div>
                  <div className="bg-yellow-50 p-3 rounded border border-yellow-200">{feedback.moderation_notes}</div>
                </div>
              )}
              
              {feedback.reported_count !== undefined && feedback.reported_count > 0 && (
                <div className="mt-4">
                  <div className="font-bold text-red-500">Số lần bị báo cáo: {feedback.reported_count}</div>
                </div>
              )}
            </div>
          ) : (
            <Form
              form={form}
              layout="vertical"
              onFinish={onSubmit}
            >
              <Form.Item
                name="response"
                label="Phản hồi của bạn"
                rules={[{ required: true, message: 'Vui lòng nhập nội dung phản hồi!' }]}
              >
                <Input.TextArea rows={4} placeholder="Nhập nội dung phản hồi..." />
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
                <Input.TextArea rows={2} placeholder="Nhập ghi chú nội bộ (không hiển thị cho người dùng)..." />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Gửi phản hồi
                </Button>
              </Form.Item>
            </Form>
          )}
        </div>
      ) : (
        <div className="text-center py-4">Không có dữ liệu</div>
      )}
    </Modal>
  );
};

export default FeedbackDetailModal; 