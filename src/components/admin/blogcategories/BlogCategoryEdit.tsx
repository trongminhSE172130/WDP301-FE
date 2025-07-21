import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import type { BlogCategoryData } from './BlogCategoryTypes';
import { updateBlogCategory } from '../../../service/api/blogAPI';

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
      });
    }
  }, [category, form, isOpen]);

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      
      if (!category?.id) {
        message.error('Không tìm thấy ID danh mục!');
        return;
      }
      
      setLoading(true);
      
      try {
        // Gọi API cập nhật danh mục
        await updateBlogCategory(category.id.toString(), {
          name: values.name
        });
        
        message.success('Cập nhật danh mục thành công!');
        onSuccess();
      } catch (error) {
        console.error('Lỗi khi cập nhật danh mục:', error);
        message.error('Không thể cập nhật danh mục. Vui lòng thử lại!');
      } finally {
        setLoading(false);
      }
      
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
      </Form>
    </Modal>
  );
};

export default BlogCategoryEdit; 