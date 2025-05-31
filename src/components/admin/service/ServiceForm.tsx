import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Radio, Divider } from 'antd';
import type { Service } from './ServiceTypes';

const { Option } = Select;
const { TextArea } = Input;

interface ServiceFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Omit<Service, 'id'>) => void;
  initialValues?: Service;
  title: string;
  confirmLoading?: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  title,
  confirmLoading = false,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
    });
  };

  const categoryOptions = [
    'Khám tổng quát',
    'Phụ khoa',
    'Thai sản',
    'Dinh dưỡng',
    'Tư vấn',
    'Xét nghiệm',
    'Tâm lý',
  ];

  return (
    <Modal
      open={visible}
      title={title}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={confirmLoading}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ status: 'active', duration: 30 }}
      >
        <Divider orientation="left">Thông tin dịch vụ</Divider>
        
        <Form.Item
          name="name"
          label="Tên dịch vụ"
          rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ' }]}
        >
          <Input placeholder="Nhập tên dịch vụ" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Danh mục"
          rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
        >
          <Select placeholder="Chọn danh mục">
            {categoryOptions.map(category => (
              <Option key={category} value={category}>{category}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="price"
          label="Giá dịch vụ (VNĐ)"
          rules={[{ required: true, message: 'Vui lòng nhập giá dịch vụ' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            step={10000}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            placeholder="Nhập giá dịch vụ"
          />
        </Form.Item>

        <Form.Item
          name="duration"
          label="Thời gian thực hiện (phút)"
          rules={[{ required: true, message: 'Vui lòng nhập thời gian thực hiện' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            placeholder="Nhập thời gian thực hiện (phút)"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả dịch vụ' }]}
        >
          <TextArea rows={4} placeholder="Nhập mô tả dịch vụ" />
        </Form.Item>

        <Divider orientation="left">Trạng thái</Divider>
        
        <Form.Item name="status" label="Trạng thái">
          <Radio.Group>
            <Radio value="active">Đang hoạt động</Radio>
            <Radio value="inactive">Không hoạt động</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ServiceForm; 