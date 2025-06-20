import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Switch, Button, Row, Col, message, Modal } from 'antd';
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
import type { SubscriptionPlan } from './SubscriptionTable';

interface SubscriptionFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: SubscriptionFormData) => void;
  loading?: boolean;
  initialValues?: Partial<SubscriptionPlan>;
  mode: 'create' | 'edit';
}

export interface SubscriptionFormData {
  name: string;
  description: string;
  price: number;
  duration_days: number;
  duration_months: number;
  is_active: boolean;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  loading = false,
  initialValues,
  mode
}) => {
  const [form] = Form.useForm();
  const [switchValue, setSwitchValue] = useState(true);

  useEffect(() => {
    if (visible) {
      // Delay một chút để đảm bảo form đã render
      setTimeout(() => {
        if (mode === 'edit' && initialValues) {
          console.log('Setting edit values:', initialValues);
          // Đảm bảo set đúng giá trị is_active
          const formValues = {
            ...initialValues,
            is_active: initialValues.is_active !== undefined ? initialValues.is_active : true
          };
          console.log('Form values to set:', formValues);
          form.setFieldsValue(formValues);
          setSwitchValue(formValues.is_active);
        } else {
          form.resetFields();
          // Set default values for create mode
          form.setFieldsValue({
            is_active: true,
            duration_months: 1,
            duration_days: 30
          });
          setSwitchValue(true);
        }
      }, 100);
    }
  }, [visible, mode, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch {
      message.error('Vui lòng kiểm tra lại thông tin đã nhập');
    }
  };

  const handleDurationMonthsChange = (value: number | null) => {
    if (value) {
      // Tự động tính số ngày dựa trên số tháng
      const days = value * 30; // Estimate 30 days per month
      form.setFieldValue('duration_days', days);
    }
  };

  return (
    <Modal
      title={mode === 'create' ? 'Tạo gói đăng ký mới' : 'Chỉnh sửa gói đăng ký'}
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={null}
      destroyOnClose={false}
      key={mode === 'edit' && initialValues ? initialValues._id : 'create'}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-6"
      >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Tên gói đăng ký"
                name="name"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên gói đăng ký' },
                  { min: 3, message: 'Tên gói phải có ít nhất 3 ký tự' },
                  { max: 100, message: 'Tên gói không được quá 100 ký tự' }
                ]}
              >
                <Input 
                  placeholder="Ví dụ: Gói 1 tháng, Gói 6 tháng..." 
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Mô tả gói đăng ký"
                name="description"
                rules={[
                  { required: true, message: 'Vui lòng nhập mô tả gói đăng ký' },
                  { min: 10, message: 'Mô tả phải có ít nhất 10 ký tự' },
                  { max: 500, message: 'Mô tả không được quá 500 ký tự' }
                ]}
              >
                <Input.TextArea 
                  placeholder="Mô tả chi tiết về gói đăng ký, quyền lợi của khách hàng..."
                  rows={3}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Giá tiền (VND)"
                name="price"
                rules={[
                  { required: true, message: 'Vui lòng nhập giá tiền' },
                  { type: 'number', min: 1000, message: 'Giá tiền phải lớn hơn 1,000 VND' },
                  { type: 'number', max: 50000000, message: 'Giá tiền không được quá 50,000,000 VND' }
                ]}
              >
                <InputNumber
                  placeholder="150000"
                  size="large"
                  className="w-full"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Thời hạn (tháng)"
                name="duration_months"
                rules={[
                  { required: true, message: 'Vui lòng nhập thời hạn' },
                  { type: 'number', min: 1, message: 'Thời hạn phải lớn hơn 0' },
                  { type: 'number', max: 60, message: 'Thời hạn không được quá 60 tháng' }
                ]}
              >
                <InputNumber
                  placeholder="1"
                  size="large"
                  className="w-full"
                  onChange={handleDurationMonthsChange}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Thời hạn (ngày)"
                name="duration_days"
                rules={[
                  { required: true, message: 'Vui lòng nhập số ngày' },
                  { type: 'number', min: 1, message: 'Số ngày phải lớn hơn 0' },
                  { type: 'number', max: 1825, message: 'Số ngày không được quá 1825 (5 năm)' }
                ]}
              >
                <InputNumber
                  placeholder="30"
                  size="large"
                  className="w-full"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Trạng thái"
                name="is_active"
                valuePropName="checked"
              >
                <div className="flex items-center space-x-2">
                  <Switch 
                    size="default"
                    checked={switchValue}
                    onChange={(checked) => {
                      setSwitchValue(checked);
                      form.setFieldValue('is_active', checked);
                    }}
                  />
                  <span className="text-sm text-gray-600">
                    Kích hoạt gói đăng ký này
                  </span>
                </div>
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button 
              onClick={onCancel}
              size="large"
            >
              Hủy
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={loading}
              size="large"
              icon={mode === 'create' ? <PlusOutlined /> : <SaveOutlined />}
            >
              {mode === 'create' ? 'Tạo gói đăng ký' : 'Cập nhật'}
            </Button>
          </div>
        </Form>
    </Modal>
  );
};

export default SubscriptionForm; 