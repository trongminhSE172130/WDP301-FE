import React from 'react';
import { Modal, Form, Input, Switch, Button, message } from 'antd';

interface BlogCategoryAddProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BlogCategoryAdd: React.FC<BlogCategoryAddProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      
      setLoading(true);
      
      // Giả lập gọi API thêm mới
      setTimeout(() => {
        // Đây là nơi bạn sẽ gọi API thực tế
        console.log('Thêm mới danh mục:', values);
        
        message.success('Thêm danh mục thành công!');
        form.resetFields();
        onSuccess();
        onClose();
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Thêm danh mục mới"
      open={isOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading} 
          onClick={handleSubmit}
        >
          Thêm mới
        </Button>,
      ]}
      maskClosable={false}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: true,
        }}
      >
        <Form.Item
          name="name"
          label="Tên danh mục"
          rules={[
            { required: true, message: 'Vui lòng nhập tên danh mục!' },
            { max: 100, message: 'Tên danh mục không được vượt quá 100 ký tự!' },
          ]}
        >
          <Input placeholder="Nhập tên danh mục" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[
            { required: true, message: 'Vui lòng nhập mô tả!' },
            { max: 500, message: 'Mô tả không được vượt quá 500 ký tự!' },
          ]}
        >
          <Input.TextArea
            placeholder="Nhập mô tả về danh mục"
            rows={4}
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          valuePropName="checked"
        >
          <Switch
            checkedChildren="Hoạt động"
            unCheckedChildren="Không hoạt động"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BlogCategoryAdd; 