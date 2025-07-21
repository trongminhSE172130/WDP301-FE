import React from 'react';
import { Form, Input, Select, Button, Row, Col, Space, Card } from 'antd';

const { Option } = Select;

export interface PatientFilterValues {
  patientName?: string;
  phone?: string;
  gender?: 'Male' | 'Female';
  medicalRecord?: string;
}

interface PatientFilterProps {
  onSearch: (values: PatientFilterValues) => void;
  onAdd: () => void;
}

const PatientFilter: React.FC<PatientFilterProps> = ({ onSearch, onAdd }) => {
  const [form] = Form.useForm<PatientFilterValues>();

  const handleReset = () => {
    form.resetFields();
  };

  const handleFinish = (values: PatientFilterValues) => {
    onSearch(values);
  };

  return (
    <Card className="mb-4">
      <Form
        form={form}
        name="patientFilter"
        layout="vertical"
        onFinish={handleFinish}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="patientName" label="Tên bệnh nhân">
              <Input placeholder="Nhập tên bệnh nhân" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="phone" label="Số điện thoại">
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="gender" label="Giới tính">
              <Select placeholder="Chọn giới tính" allowClear>
                <Option value="Male">Nam</Option>
                <Option value="Female">Nữ</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="medicalRecord" label="Bệnh án">
              <Input placeholder="Nhập mã bệnh án" />
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

export default PatientFilter; 