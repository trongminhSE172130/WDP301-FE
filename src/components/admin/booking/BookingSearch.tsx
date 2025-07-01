import React from 'react';
import { Input, Select, Button, Form, Row, Col, Card, Flex, Space, DatePicker } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';

const { Option } = Select;

export interface SearchFormValues {
  keyword?: string;
  status?: string;
  date?: string;
  consultant?: string;
}

interface BookingSearchProps {
  onSearch: (values: SearchFormValues) => void;
  onReset: () => void;
  statuses: string[];
  consultants: { id: string; name: string }[];
  loading?: boolean;
}

const BookingSearch: React.FC<BookingSearchProps> = ({
  onSearch,
  onReset,
  statuses,
  consultants,
  loading = false,
}) => {
  const [form] = Form.useForm();

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  const handleFinish = (values: { keyword?: string; status?: string; date?: Dayjs; consultant?: string }) => {
    // Transform date to string format if exists
    const searchValues = {
      ...values,
      date: values.date ? values.date.format('YYYY-MM-DD') : undefined
    };
    onSearch(searchValues);
  };

  return (
    <Card bordered={false} className="w-full mb-4">
      <Flex vertical gap={24}>
        <div>
          <Flex className="mb-2">
            <div className="font-semibold text-gray-500">Tìm kiếm</div>
          </Flex>

          <Form form={form} onFinish={handleFinish} layout="vertical" className="w-full">
            <Row gutter={16}>
              <Col xs={24} sm={12} md={6} lg={5}>
                <Form.Item name="keyword" className="mb-0">
                  <Input 
                    placeholder="Tên bệnh nhân hoặc SĐT" 
                    prefix={<SearchOutlined className="text-gray-400" />}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6} lg={5}>
                <Form.Item name="status" className="mb-0">
                  <Select placeholder="Trạng thái" allowClear className="w-full">
                    {statuses.map((status) => (
                      <Option key={status} value={status}>
                        {status === 'pending' && 'Chờ xác nhận'}
                        {status === 'confirmed' && 'Đã xác nhận'}
                        {status === 'completed' && 'Đã hoàn thành'}
                        {status === 'cancelled' && 'Đã hủy'}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6} lg={5}>
                <Form.Item name="consultant" className="mb-0">
                  <Select placeholder="Tư vấn viên" allowClear className="w-full">
                    {consultants.map((consultant) => (
                      <Option key={consultant.id} value={consultant.id}>
                        {consultant.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6} lg={4}>
                <Form.Item name="date" className="mb-0">
                  <DatePicker 
                    placeholder="Ngày hẹn" 
                    format="DD/MM/YYYY"
                    className="w-full"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6} lg={5}>
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

export default BookingSearch; 