import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, message, Switch } from 'antd';
import type { ServiceTypeData } from './ServiceCategoryTypes';
import { updateServiceType } from '../../../service/api/serviceAPI';

interface ServiceCategoryEditProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category: ServiceTypeData | null;
}

const ServiceCategoryEdit: React.FC<ServiceCategoryEditProps> = ({
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
        is_active: category.is_active,
      });
    }
  }, [category, form, isOpen]);

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      
      if (!category?.id) {
        message.error('Không tìm thấy ID loại dịch vụ!');
        return;
      }
      
      setLoading(true);
      
      try {
        // Gọi API cập nhật loại dịch vụ
        await updateServiceType(category.id.toString(), {
          name: values.name,
          description: values.description,
          is_active: values.is_active
        });
        
        message.success('Cập nhật loại dịch vụ thành công!');
        onSuccess();
      } catch (error) {
        console.error('Lỗi khi cập nhật loại dịch vụ:', error);
        message.error('Không thể cập nhật loại dịch vụ. Vui lòng thử lại!');
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
      title="Chỉnh sửa loại dịch vụ"
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
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="Tên loại dịch vụ"
          rules={[
            { required: true, message: 'Vui lòng nhập tên loại dịch vụ!' },
            { max: 100, message: 'Tên loại dịch vụ không được vượt quá 100 ký tự!' },
          ]}
        >
          <Input placeholder="Nhập tên loại dịch vụ" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[
            { max: 500, message: 'Mô tả không được vượt quá 500 ký tự!' },
          ]}
        >
          <Input.TextArea 
            placeholder="Nhập mô tả cho loại dịch vụ" 
            rows={3}
          />
        </Form.Item>

        <Form.Item
          name="is_active"
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

export default ServiceCategoryEdit; 