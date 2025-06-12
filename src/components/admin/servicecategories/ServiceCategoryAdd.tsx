import React from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { addServiceType } from '../../../service/api/serviceAPI';

interface ServiceCategoryAddProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ServiceCategoryAdd: React.FC<ServiceCategoryAddProps> = ({
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
        // Gọi API thêm mới loại dịch vụ (mặc định is_active = true)
        await addServiceType({ 
          name: values.name,
          description: values.description,
          is_active: true
        });
        message.success('Thêm loại dịch vụ thành công!');
        form.resetFields();
        onSuccess();
      } catch (error) {
        console.error('Lỗi khi thêm loại dịch vụ:', error);
        message.error('Không thể thêm loại dịch vụ. Vui lòng thử lại!');
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
      title="Thêm loại dịch vụ mới"
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
      width={500}
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
      </Form>
    </Modal>
  );
};

export default ServiceCategoryAdd; 