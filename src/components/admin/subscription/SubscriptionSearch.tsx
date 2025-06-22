import React from 'react';
import { Input, Select, Button, Form, Row, Col, Card, Flex, Space } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { Option } = Select;

export interface SearchFormValues {
  keyword?: string;
  is_active?: boolean;
}

interface SubscriptionSearchProps {
  onSearch: (values: SearchFormValues) => void;
  onReset: () => void;
  loading?: boolean;
}

const SubscriptionSearch: React.FC<SubscriptionSearchProps> = ({
  onSearch,
  onReset,
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
                    placeholder="Tên gói đăng ký" 
                    prefix={<SearchOutlined className="text-gray-400" />}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6} lg={5}>
                <Form.Item name="is_active" className="mb-0">
                  <Select placeholder="Trạng thái" allowClear className="w-full">
                    <Option value={true}>Đang hoạt động</Option>
                    <Option value={false}>Tạm dừng</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6} lg={14}>
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
              </Col>
            </Row>
          </Form>
        </div>
      </Flex>
    </Card>
  );
};

export default SubscriptionSearch; 