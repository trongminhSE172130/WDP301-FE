import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Spin,
  message
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { getUsers } from '../../../service/api/notificationAPI';
import type { 
  CreateUserNotificationRequest 
} from './PushNotificationTypes';
import type { UserItem } from '../../../service/api/notificationAPI';

const { TextArea } = Input;
const { Option } = Select;

interface PushNotificationUserFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateUserNotificationRequest) => Promise<void>;
  title: string;
}

const PushNotificationUserForm: React.FC<PushNotificationUserFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  title
}) => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);

  // Load danh sách users khi modal mở
  useEffect(() => {
    if (visible) {
      fetchUsers();
      form.resetFields();
      form.setFieldsValue({
        data: ''
      });
    }
  }, [visible, form]);

  // Fetch danh sách users
  const fetchUsers = async (search?: string) => {
    try {
      setLoadingUsers(true);
      const response = await getUsers({
        page: 1,
        limit: 100, // Lấy nhiều user để có thể search
        search: search || ''
      });

      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Có lỗi xảy ra khi tải danh sách người dùng');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Xử lý search users
  const handleSearch = (value: string) => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchUsers(value);
    }, 500);

    return () => clearTimeout(timer);
  };

  // Submit form
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const data: CreateUserNotificationRequest = {
        user_id: values.user_id,
        title: values.title,
        body: values.body,
        data: values.data || ''
      };

      await onSubmit(data);
    } catch {
      // Form validation error - không cần xử lý gì thêm
    }
  };

  return (
    <Modal
      title={title}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={600}
      okText="Gửi thông báo"
      cancelText="Hủy"
      className="push-notification-modal"
    >
      <div className="p-4">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            data: ''
          }}
          className="space-y-4"
        >
          <div className="w-full">
            <Form.Item
              name="user_id"
              label={<span className="font-medium text-gray-700">Chọn người dùng</span>}
              rules={[{ required: true, message: 'Vui lòng chọn người dùng' }]}
            >
              <Select
                showSearch
                placeholder="Tìm kiếm và chọn người dùng"
                loading={loadingUsers}
                filterOption={false}
                onSearch={handleSearch}
                notFoundContent={loadingUsers ? <Spin size="small" /> : 'Không tìm thấy người dùng'}
                suffixIcon={<SearchOutlined />}
                className="w-full"
                size="large"
              >
                {users.map(user => (
                  <Option key={user._id} value={user._id}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{user.full_name}</span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {user.role}
                      </span>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="w-full">
            <Form.Item
              name="title"
              label={<span className="font-medium text-gray-700">Tiêu đề</span>}
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
            >
              <Input 
                placeholder="Nhập tiêu đề thông báo" 
                className="w-full"
                size="large"
              />
            </Form.Item>
          </div>

          <div className="w-full">
            <Form.Item
              name="body"
              label={<span className="font-medium text-gray-700">Nội dung</span>}
              rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
            >
              <TextArea 
                rows={4} 
                placeholder="Nhập nội dung thông báo"
                maxLength={500}
                showCount
                className="w-full resize-none"
              />
            </Form.Item>
          </div>

          <div className="w-full">
            <Form.Item
              name="data"
              label={<span className="font-medium text-gray-700">Dữ liệu bổ sung</span>}
              rules={[
                { max: 1000, message: 'Dữ liệu không được vượt quá 1000 ký tự' }
              ]}
            >
              <TextArea 
                rows={4} 
                placeholder="Nhập dữ liệu bổ sung (có thể để trống)"
                maxLength={1000}
                showCount
                className="w-full resize-none"
              />
            </Form.Item>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default PushNotificationUserForm; 