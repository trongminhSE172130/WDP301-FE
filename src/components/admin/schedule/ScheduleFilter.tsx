import React, { useState } from 'react';
import { Form, Input, Select, DatePicker, Button, Row, Col, Card, Space } from 'antd';
import { SearchOutlined, PlusOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import type { FilterParams } from './ScheduleTypes';
import locale from 'antd/es/date-picker/locale/vi_VN';
import type { Dayjs } from 'dayjs';

const { Option } = Select;

interface ScheduleFilterProps {
  onFilter: (values: FilterParams) => void;
  onReset: () => void;
  onAddNew: () => void;
  loading?: boolean;
}

interface FormValues {
  doctor?: string;
  specialty?: string;
  date?: Dayjs;
  status?: string;
}

const ScheduleFilter: React.FC<ScheduleFilterProps> = ({
  onFilter,
  onReset,
  onAddNew,
  loading = false,
}) => {
  const [form] = Form.useForm<FormValues>();
  const [showFilters, setShowFilters] = useState(false);

  const handleFinish = (values: FormValues) => {
    const filters: FilterParams = {};
    
    if (values.doctor) {
      filters.doctor = values.doctor;
    }
    
    if (values.specialty) {
      filters.specialty = values.specialty;
    }
    
    if (values.date) {
      filters.date = values.date.format('DD/MM/YYYY');
    }
    
    if (values.status) {
      filters.status = values.status;
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
        name="scheduleFilter"
        onFinish={handleFinish}
        layout="vertical"
      >
        <Row gutter={16}>
          <Col xs={24} sm={showFilters ? 12 : 16} md={showFilters ? 8 : 16} lg={showFilters ? 6 : 16}>
            <Form.Item name="doctor">
              <Input 
                prefix={<SearchOutlined />} 
                placeholder="Tìm theo bác sĩ" 
                allowClear
              />
            </Form.Item>
          </Col>

          {showFilters && (
            <>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="specialty" label="Chuyên khoa">
                  <Select placeholder="Chọn chuyên khoa" allowClear>
                    <Option value="Phụ khoa">Phụ khoa</Option>
                    <Option value="Thai sản">Thai sản</Option>
                    <Option value="Sản khoa">Sản khoa</Option>
                    <Option value="Dinh dưỡng">Dinh dưỡng</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="date" label="Ngày">
                  <DatePicker 
                    format="DD/MM/YYYY" 
                    placeholder="Chọn ngày"
                    locale={locale}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="status" label="Trạng thái">
                  <Select placeholder="Chọn trạng thái" allowClear>
                    <Option value="available">Còn trống</Option>
                    <Option value="booked">Đã đặt</Option>
                    <Option value="completed">Đã hoàn thành</Option>
                    <Option value="cancelled">Đã hủy</Option>
                  </Select>
                </Form.Item>
              </Col>
            </>
          )}

          <Col xs={24} sm={showFilters ? 12 : 8} md={showFilters ? 8 : 8} lg={showFilters ? 6 : 8}>
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
                  {showFilters ? 'Ẩn lọc' : 'Hiện lọc'}
                </Button>
              </Space>
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={showFilters ? 12 : 24} md={showFilters ? 16 : 24} lg={showFilters ? 18 : 24} style={{ textAlign: 'right' }}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={onAddNew}
            >
              Thêm lịch mới
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default ScheduleFilter; 