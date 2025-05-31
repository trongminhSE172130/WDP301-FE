import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Radio, Divider } from 'antd';
import type { Patient } from './PatientTypes';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface PatientFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Omit<Patient, 'id' | 'registeredDate'>) => void;
  initialValues?: Patient;
  title: string;
  confirmLoading?: boolean;
}

const PatientForm: React.FC<PatientFormProps> = ({
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
      // Convert string date format to dayjs object if initialValues has birthdate
      const values = {
        ...initialValues,
        birthdate: initialValues.birthdate ? dayjs(initialValues.birthdate, 'DD/MM/YYYY') : undefined,
      };
      form.setFieldsValue(values);
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      // Convert dayjs object to string format
      const formattedValues = {
        ...values,
        birthdate: values.birthdate ? values.birthdate.format('DD/MM/YYYY') : '',
      };
      onSubmit(formattedValues);
    });
  };

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
        initialValues={{ gender: 'Male', status: 'active' }}
      >
        <Divider orientation="left">Thông tin cá nhân</Divider>
        <Form.Item
          name="fullName"
          label="Họ và tên"
          rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại' },
            { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' },
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item name="gender" label="Giới tính">
          <Radio.Group>
            <Radio value="Male">Nam</Radio>
            <Radio value="Female">Nữ</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="birthdate" label="Ngày sinh">
          <DatePicker 
            format="DD/MM/YYYY" 
            placeholder="Chọn ngày sinh"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item name="address" label="Địa chỉ">
          <TextArea rows={3} placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Divider orientation="left">Thông tin y tế</Divider>
        
        <Form.Item name="medicalRecord" label="Mã bệnh án">
          <Input placeholder="Nhập mã bệnh án" />
        </Form.Item>

        <Form.Item name="consultant" label="Người tư vấn">
          <Input placeholder="Nhập tên người tư vấn" />
        </Form.Item>

        <Form.Item name="reason" label="Lý do khám">
          <TextArea rows={3} placeholder="Nhập lý do khám" />
        </Form.Item>

        <Divider orientation="left">Trạng thái</Divider>
        
        <Form.Item name="status" label="Trạng thái">
          <Select>
            <Option value="active">Đang hoạt động</Option>
            <Option value="inactive">Không hoạt động</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PatientForm; 