import React from 'react';
import {
  Modal,
  Form,
  Input,
  Row,
  Col
} from 'antd';
import type { PushNotification, CreateNotificationRequest } from './PushNotificationTypes';

const { TextArea } = Input;

interface PushNotificationFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateNotificationRequest) => Promise<void>;
  initialValues?: PushNotification | null;
  title: string;
}

const PushNotificationForm: React.FC<PushNotificationFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  title
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        title: initialValues.title,
        body: initialValues.body,
        data: initialValues.data
      });
    } else if (visible) {
      form.resetFields();
      form.setFieldsValue({
        data: ''
      });
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const data: CreateNotificationRequest = {
        role: 'user',
        title: values.title,
        body: values.body,
        data: values.data || ''
      };

      await onSubmit(data);
    } catch {
      // Form validation error - không cần xử lý gì thêm
    }
  };

  return (
    <Modal
      title={title}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={600}
      okText="Tạo thông báo"
      cancelText="Hủy"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          data: ''
        }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="title"
              label="Tiêu đề"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
            >
              <Input placeholder="Nhập tiêu đề thông báo" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="body"
              label="Nội dung"
              rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
            >
              <TextArea 
                rows={4} 
                placeholder="Nhập nội dung thông báo"
                maxLength={500}
                showCount
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="data"
              label="Dữ liệu bổ sung"
              rules={[
                { max: 1000, message: 'Dữ liệu không được vượt quá 1000 ký tự' }
              ]}
            >
              <TextArea 
                rows={4} 
                placeholder="Nhập dữ liệu bổ sung (có thể để trống)"
                maxLength={1000}
                showCount
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default PushNotificationForm; 