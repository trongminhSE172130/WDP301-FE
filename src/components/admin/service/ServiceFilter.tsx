import React from 'react';
import { Form, Input, Select, Button, Row, Col, Space, Card } from 'antd';
import type { Service } from './ServiceTypes';

const { Option } = Select;

export interface ServiceFilterValues {
  title?: string;
  service_type?: string;
  is_active?: boolean;
}

interface ServiceFilterProps {
  onSearch: (values: ServiceFilterValues) => void;
  onAdd: () => void;
  data?: Service[];
}

const ServiceFilter: React.FC<ServiceFilterProps> = ({ onSearch, onAdd, data = [] }) => {
  const [form] = Form.useForm<ServiceFilterValues>();

  const handleReset = () => {
    form.resetFields();
    onSearch({});
  };

  const handleFinish = (values: ServiceFilterValues) => {
    onSearch(values);
  };

  const serviceTypeOptions = Array.from(new Set(data.map(service => service.service_type)));

  return (
    <Card className="mb-4">
      <Form
        form={form}
        name="serviceFilter"
        layout="vertical"
        onFinish={handleFinish}
      >
        <Row gutter={16} align="bottom">
          <Col xs={24} sm={8} md={6} lg={6}>
            <Form.Item name="title" label="Tên dịch vụ">
              <Input placeholder="Nhập tên dịch vụ" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8} md={6} lg={6}>
            <Form.Item name="service_type" label="Loại dịch vụ">
              <Select placeholder="Chọn loại dịch vụ" allowClear>
                {serviceTypeOptions.map(option => (
                  <Option key={option} value={option}>{option}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={8} md={6} lg={6}>
            <Form.Item name="is_active" label="Trạng thái">
              <Select placeholder="Chọn trạng thái" allowClear>
                <Option value={true}>Đang hoạt động</Option>
                <Option value={false}>Không hoạt động</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6}>
            <Form.Item label=" ">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
            <Space>
              <Button type="primary" htmlType="submit">
                Tìm kiếm
              </Button>
              <Button onClick={handleReset}>Đặt lại</Button>
            </Space>
            <Button
              type="primary"
              onClick={onAdd}
            >
                  Thêm dịch vụ mới
            </Button>
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default ServiceFilter; 