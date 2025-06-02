import React from 'react';
import { Form, Input, Select, Row, Col } from 'antd';
import type { User } from './UserTable';

const { Option } = Select;

export interface FormValues extends Omit<User, 'id'> {
  id?: number;
  password?: string;
  confirmPassword?: string;
}

interface UserFormProps {
  user?: User;
  onFinish: (values: FormValues) => void;
  title?: string;
}

const UserForm: React.FC<UserFormProps> = ({
  user,
  onFinish,
  title = user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới',
}) => {
  const isEditMode = !!user;

  return (
    <div className="w-full">
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
      <Form
        id="userForm"
        name="userForm"
        initialValues={user || { status: 'active', role: 'user' }}
        onFinish={onFinish}
        layout="vertical"
        className="w-full"
      >
        {isEditMode && (
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
        )}

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="name"
              label="Họ tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
              <Input placeholder="Nhập họ tên" className="rounded-lg" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input placeholder="Nhập email" className="rounded-lg" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
              <Select placeholder="Chọn vai trò" className="rounded-lg">
                <Option value="admin">Quản trị viên</Option>
                <Option value="staff">Nhân viên</Option>
                <Option value="user">Người dùng</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
              <Select placeholder="Chọn trạng thái" className="rounded-lg">
                <Option value="active">Hoạt động</Option>
                <Option value="inactive">Không hoạt động</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {!isEditMode && (
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu" className="rounded-lg" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Xác nhận mật khẩu" className="rounded-lg" />
              </Form.Item>
            </Col>
          </Row>
        )}

        {/* Nút submit đã được chuyển lên UsersPage để hiển thị trong footer của Modal */}
      </Form>
    </div>
  );
};

export default UserForm; 