import React from 'react';
import { Card, Row, Col, Input, DatePicker, Select, Space, Button, Flex, Form } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

export interface AppointmentSearchValues {
  keyword?: string;
  date?: string;
  status?: string;
}

interface AppointmentFilterProps {
  searchText: string;
  onSearchTextChange: (value: string) => void;
  onSearch: () => void;
  onReset?: () => void;
  onAddNew?: () => void;
  loading: boolean;
}

const AppointmentFilter: React.FC<AppointmentFilterProps> = ({
  searchText,
  onSearchTextChange,
  onSearch,
  onReset = () => {},
  onAddNew = () => {},
  loading
}) => {
  const [form] = Form.useForm();

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  const handleSubmit = () => {
    onSearch();
  };

  return (
    <Card bordered={false} className="w-full mb-4">
      <Flex vertical gap={24}>
        <div>
          <Flex className="mb-2">
            <div className="font-semibold text-gray-500">Tìm kiếm</div>
          </Flex>

          <Form form={form} onFinish={handleSubmit} layout="vertical" className="w-full">
            <Row gutter={16}>
              <Col xs={24} sm={12} md={6} lg={5}>
                <Form.Item name="keyword" className="mb-0">
                  <Input 
                    placeholder="Tìm kiếm theo tên bệnh nhân..." 
                    prefix={<SearchOutlined />} 
                    value={searchText}
                    onChange={e => onSearchTextChange(e.target.value)}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6} lg={5}>
                <Form.Item name="date" className="mb-0">
                  <DatePicker 
                    className="w-full" 
                    placeholder="Chọn ngày"
                    format="DD/MM/YYYY"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={6} lg={5}>
                <Form.Item name="status" className="mb-0">
                  <Select
                    className="w-full"
                    placeholder="Trạng thái"
                    allowClear
                  >
                    <Option value="scheduled">Đã lên lịch</Option>
                    <Option value="completed">Hoàn thành</Option>
                    <Option value="cancelled">Đã hủy</Option>
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
                      icon={<ReloadOutlined />}
                      onClick={handleReset}
                    >
                      Đặt lại
                    </Button>
                  </Space>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={onAddNew}
                    className="bg-green-500 hover:bg-green-600 border-green-500"
                  >
                    Thêm mới
                  </Button>
                </Flex>
              </Col>
            </Row>
          </Form>
        </div>
      </Flex>
    </Card>
  );
};

export default AppointmentFilter; 