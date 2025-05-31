import React from 'react';
import { Input, Select, Button, Form, Row, Col, Card, Flex, Space } from 'antd';
import { SearchOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';

const { Option } = Select;

export interface SearchFormValues {
  keyword?: string;
  role?: string;
  status?: string;
}

interface UserSearchProps {
  onSearch: (values: SearchFormValues) => void;
  onAdd: () => void;
  onReset: () => void;
  roles: string[];
  statuses: string[];
  loading?: boolean;
}

const UserSearch: React.FC<UserSearchProps> = ({
  onSearch,
  onAdd,
  onReset,
  roles,
  statuses,
  loading = false,
}) => {
  const [form] = Form.useForm();

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  return (
    <Card bordered={false} className="w-full mb-4">
      <Flex vertical gap={24}>
        <div>
          <Flex className="mb-2">
            <div className="font-semibold text-gray-500">Tìm kiếm</div>
          </Flex>

          <Form form={form} onFinish={onSearch} layout="vertical" className="w-full">
            <Row gutter={16}>
              <Col xs={24} sm={12} md={6} lg={5}>
                <Form.Item name="keyword" className="mb-0">
                  <Input 
                    placeholder="Tên hoặc email" 
                    prefix={<SearchOutlined className="text-gray-400" />}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6} lg={5}>
                <Form.Item name="role" className="mb-0">
                  <Select placeholder="Vai trò" allowClear className="w-full">
                    {roles.map((role) => (
                      <Option key={role} value={role}>
                        {role}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6} lg={5}>
                <Form.Item name="status" className="mb-0">
                  <Select placeholder="Trạng thái" allowClear className="w-full">
                    {statuses.map((status) => (
                      <Option key={status} value={status}>
                        {status}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6} lg={9}>
                <Flex justify="space-between">
                  <Space>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      icon={<SearchOutlined />} 
                      loading={loading}
                    >
                      Tìm kiếm
                    </Button>
                    <Button 
                      onClick={handleReset} 
                      icon={<ReloadOutlined />}
                    >
                      Đặt lại
                    </Button>
                  </Space>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={onAdd}
                    className="bg-green-500 hover:bg-green-600 border-green-500"
                  >
                    Thêm mới
                  </Button>
                </Flex>
              </Col>
            </Row>
          </Form>
        </div>

        {/* <div>
          <Flex className="font-semibold mb-1">
            <div>Danh sách người dùng</div>
          </Flex>
        </div> */}
      </Flex>
    </Card>
  );
};

export default UserSearch; 