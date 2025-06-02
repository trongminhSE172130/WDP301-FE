import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch, Button, message } from 'antd';
import type { BlogCategoryData } from './BlogCategoryTypes';

interface BlogCategoryEditProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category: BlogCategoryData | null;
}

const BlogCategoryEdit: React.FC<BlogCategoryEditProps> = ({
  isOpen,
  onClose,
  onSuccess,
  category,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (category && isOpen) {
      form.setFieldsValue({
        name: category.name,
        description: category.description,
        status: category.status === 'active',
      });
    }
  }, [category, form, isOpen]);

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      
      setLoading(true);
      
      // Giả lập gọi API cập nhật
      setTimeout(() => {
        // Đây là nơi bạn sẽ gọi API thực tế
        console.log('Cập nhật danh mục:', {
          id: category?.id,
          ...values,
          status: values.status ? 'active' : 'inactive',
        });
        
        message.success('Cập nhật danh mục thành công!');
        onSuccess();
        onClose();
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      title="Chỉnh sửa danh mục"
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
          Cập nhật
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

export default BlogCategoryEdit; 