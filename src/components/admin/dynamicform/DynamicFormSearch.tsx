import React from 'react';
import { Form, Input, Button, Card, Select } from 'antd';
import { SearchOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';

const { Option } = Select;

export interface SearchFormValues {
  keyword?: string;
  formType?: string;
  status?: string;
}

interface DynamicFormSearchProps {
  onSearch: (values: SearchFormValues) => void;
  onAdd?: () => void;
  onReset: () => void;
  loading: boolean;
}

const DynamicFormSearch: React.FC<DynamicFormSearchProps> = ({
  onSearch,
  onAdd,
  onReset,
  loading
}) => {
  const [form] = Form.useForm();

  // Xử lý reset form
  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  return (
    <Card className="mb-6">
      <Form
        form={form}
        layout="vertical"
        onFinish={onSearch}
        initialValues={{
          keyword: '',
          formType: '',
          status: ''
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Tìm kiếm từ khóa */}
          <div className="md:col-span-4">
            <Form.Item name="keyword" label="Tìm kiếm" className="mb-0">
              <Input
                placeholder="Nhập tên form, mô tả..."
                prefix={<SearchOutlined className="text-gray-400" />}
                allowClear
                className="w-full"
              />
            </Form.Item>
          </div>
          
          {/* Lọc theo loại form */}
          <div className="md:col-span-3">
            <Form.Item name="formType" label="Loại form" className="mb-0">
              <Select
                placeholder="Chọn loại form"
                allowClear
                className="w-full"
              >
                <Option value="booking_form">Đặt lịch</Option>
                <Option value="survey_form">Khảo sát</Option>
                <Option value="registration_form">Đăng ký</Option>
              </Select>
            </Form.Item>
          </div>
          
          {/* Lọc theo trạng thái */}
          <div className="md:col-span-2">
            <Form.Item name="status" label="Trạng thái" className="mb-0">
              <Select
                placeholder="Trạng thái"
                allowClear
                className="w-full"
              >
                <Option value="active">Đang hoạt động</Option>
                <Option value="inactive">Không hoạt động</Option>
              </Select>
            </Form.Item>
          </div>
          
          {/* Các nút */}
          <div className="md:col-span-3">
            <Form.Item className="mb-0">
              <div className="flex flex-wrap gap-2 justify-end">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                  loading={loading}
                  className="bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600"
                >
                  Tìm kiếm
                </Button>
                <Button
                  onClick={handleReset}
                  icon={<ReloadOutlined />}
                  className="border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-700"
                >
                  Đặt lại
                </Button>
              </div>
            </Form.Item>
          </div>
        </div>
        
        {/* Nút thêm form mới - nếu có */}
        {onAdd && (
          <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onAdd}
              className="bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600"
            >
              Tạo form mới
            </Button>
          </div>
        )}
      </Form>
    </Card>
  );
};

export default DynamicFormSearch; 