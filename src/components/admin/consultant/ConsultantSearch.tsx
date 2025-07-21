import React from 'react';
import { Form, Input, Button, Card } from 'antd';
import { SearchOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';

export interface SearchFormValues {
  keyword?: string;
}

interface ConsultantSearchProps {
  onSearch: (values: SearchFormValues) => void;
  onAdd: () => void;
  onReset: () => void;
  loading: boolean;
}

const ConsultantSearch: React.FC<ConsultantSearchProps> = ({
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
          keyword: ''
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Tìm kiếm */}
          <div className="md:col-span-8">
            <Form.Item name="keyword" label="Tìm kiếm tư vấn viên" className="mb-0">
              <Input
                placeholder="Nhập tên, email để tìm kiếm..."
                prefix={<SearchOutlined className="text-gray-400" />}
                allowClear
                className="w-full"
              />
            </Form.Item>
          </div>
          
          {/* Các nút */}
          <div className="md:col-span-4">
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
        
        {/* Nút thêm tư vấn viên - riêng biệt */}
        <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAdd}
            className="bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600"
          >
            Thêm tư vấn viên mới
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default ConsultantSearch; 