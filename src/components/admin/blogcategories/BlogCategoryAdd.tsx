import React from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { addBlogCategory } from '../../../service/api/blogAPI';

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
      
      try {
        // Gọi API thêm mới danh mục
        await addBlogCategory({ name: values.name });
        message.success('Thêm danh mục thành công!');
        form.resetFields();
        onSuccess();
      } catch (error) {
        console.error('Lỗi khi thêm danh mục:', error);
        message.error('Không thể thêm danh mục. Vui lòng thử lại!');
      } finally {
        setLoading(false);
      }
      
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
      </Form>
    </Modal>
  );
};

export default BlogCategoryAdd; 