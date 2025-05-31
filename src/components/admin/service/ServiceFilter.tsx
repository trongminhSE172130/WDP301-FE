import React from 'react';
import { Form, Input, Select, Button, Row, Col, Space, Card } from 'antd';

const { Option } = Select;

export interface ServiceFilterValues {
  name?: string;
  category?: string;
  status?: 'active' | 'inactive';
}

interface ServiceFilterProps {
  onSearch: (values: ServiceFilterValues) => void;
  onAdd: () => void;
}

const ServiceFilter: React.FC<ServiceFilterProps> = ({ onSearch, onAdd }) => {
  const [form] = Form.useForm<ServiceFilterValues>();

  const handleReset = () => {
    form.resetFields();
  };

  const handleFinish = (values: ServiceFilterValues) => {
    onSearch(values);
  };

  return (
    <Card className="mb-4">
      <Form
        form={form}
        name="serviceFilter"
        layout="vertical"
        onFinish={handleFinish}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="name" label="Tên dịch vụ">
              <Input placeholder="Nhập tên dịch vụ" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="category" label="Danh mục">
              <Input placeholder="Nhập danh mục" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="status" label="Trạng thái">
              <Select placeholder="Chọn trạng thái" allowClear>
                <Option value="active">Đang hoạt động</Option>
                <Option value="inactive">Không hoạt động</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Space>
              <Button type="primary" htmlType="submit">
                Tìm kiếm
              </Button>
              <Button onClick={handleReset}>Đặt lại</Button>
            </Space>
            <Button
              type="primary"
              style={{ float: 'right' }}
              onClick={onAdd}
            >
              Thêm mới
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default ServiceFilter; 