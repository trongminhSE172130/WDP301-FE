import React, { useState } from 'react';
import { Form, Input, Select, DatePicker, Button, Row, Col, Card, Space } from 'antd';
import { SearchOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import type { DocumentFilterParams } from './DocumentTypes';
import type { Dayjs } from 'dayjs';
import locale from 'antd/es/date-picker/locale/vi_VN';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface DocumentFilterProps {
  onFilter: (values: DocumentFilterParams) => void;
  onReset: () => void;
  loading?: boolean;
}

interface FormValues {
  title?: string;
  type?: string;
  patientName?: string;
  doctorName?: string;
  status?: string;
  dateRange?: [Dayjs, Dayjs];
}

const DocumentFilter: React.FC<DocumentFilterProps> = ({
  onFilter,
  onReset,
  loading = false,
}) => {
  const [form] = Form.useForm<FormValues>();
  const [showFilters, setShowFilters] = useState(false);

  const handleFinish = (values: FormValues) => {
    const filters: DocumentFilterParams = {};
    
    if (values.title) {
      filters.title = values.title;
    }
    
    if (values.type) {
      filters.type = values.type;
    }
    
    if (values.patientName) {
      filters.patientName = values.patientName;
    }
    
    if (values.doctorName) {
      filters.doctorName = values.doctorName;
    }
    
    if (values.status) {
      filters.status = values.status;
    }
    
    if (values.dateRange && values.dateRange.length === 2) {
      filters.dateRange = [
        values.dateRange[0].format('DD/MM/YYYY'),
        values.dateRange[1].format('DD/MM/YYYY')
      ];
    }
    
    onFilter(filters);
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <Card className="mb-4">
      <Form
        form={form}
        name="documentFilter"
        onFinish={handleFinish}
        layout="vertical"
      >
        <Row gutter={16}>
          <Col xs={24} sm={16} md={showFilters ? 8 : 16} lg={showFilters ? 6 : 16}>
            <Form.Item name="title">
              <Input 
                prefix={<SearchOutlined />} 
                placeholder="Tìm kiếm tài liệu" 
                allowClear
              />
            </Form.Item>
          </Col>

          {showFilters && (
            <>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="type" label="Loại tài liệu">
                  <Select placeholder="Chọn loại tài liệu" allowClear>
                    <Option value="report">Báo cáo</Option>
                    <Option value="prescription">Đơn thuốc</Option>
                    <Option value="test">Xét nghiệm</Option>
                    <Option value="other">Khác</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="patientName" label="Tên bệnh nhân">
                  <Input placeholder="Nhập tên bệnh nhân" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="doctorName" label="Tên bác sĩ">
                  <Input placeholder="Nhập tên bác sĩ" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="status" label="Trạng thái">
                  <Select placeholder="Chọn trạng thái" allowClear>
                    <Option value="active">Đang hoạt động</Option>
                    <Option value="archived">Đã lưu trữ</Option>
                    <Option value="deleted">Đã xóa</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="dateRange" label="Thời gian tạo">
                  <RangePicker 
                    format="DD/MM/YYYY" 
                    locale={locale} 
                    className="w-full"
                    placeholder={['Từ ngày', 'Đến ngày']}
                  />
                </Form.Item>
              </Col>
            </>
          )}

          <Col xs={24} sm={8} md={showFilters ? 24 : 8} className={showFilters ? 'text-right' : 'text-left'}>
            <Form.Item>
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
                <Button 
                  type="link" 
                  onClick={toggleFilters} 
                  icon={<FilterOutlined />}
                >
                  {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default DocumentFilter; 