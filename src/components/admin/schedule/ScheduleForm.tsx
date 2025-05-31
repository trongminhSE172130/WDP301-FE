import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, TimePicker, DatePicker, Button, Row, Col } from 'antd';
import type { Schedule } from './ScheduleTypes';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/vi_VN';

const { Option } = Select;
const { TextArea } = Input;

interface ScheduleFormProps {
  visible: boolean;
  title: string;
  loading: boolean;
  initialValues?: Schedule;
  onCancel: () => void;
  onSubmit: (values: Omit<Schedule, 'id'>) => void;
}

interface FormValues {
  title: string;
  doctor: string;
  specialty: string;
  date: Dayjs;
  startTime: Dayjs;
  endTime: Dayjs;
  status: 'available' | 'booked' | 'completed' | 'cancelled';
  note?: string;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  visible,
  title,
  loading,
  initialValues,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (visible) {
      form.resetFields();
      
      if (initialValues) {
        // Chuyển đổi chuỗi ngày tháng thành object Dayjs
        const dateObj = initialValues.date.split('/').reverse().join('-');
        
        form.setFieldsValue({
          ...initialValues,
          date: dayjs(dateObj),
          startTime: dayjs(initialValues.startTime, 'HH:mm'),
          endTime: dayjs(initialValues.endTime, 'HH:mm')
        });
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      // Chuyển đổi các giá trị Dayjs thành chuỗi
      const formattedValues = {
        ...values,
        date: values.date.format('DD/MM/YYYY'),
        startTime: values.startTime.format('HH:mm'),
        endTime: values.endTime.format('HH:mm')
      };
      
      onSubmit(formattedValues);
    });
  };

  return (
    <Modal
      open={visible}
      title={title}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          Lưu
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: 'available'
        }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="title"
              label="Tiêu đề lịch trình"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề lịch trình' }]}
            >
              <Input placeholder="Nhập tiêu đề lịch trình" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="doctor"
              label="Bác sĩ"
              rules={[{ required: true, message: 'Vui lòng chọn bác sĩ' }]}
            >
              <Select placeholder="Chọn bác sĩ">
                <Option value="Bs. Nguyễn Thị Hương">Bs. Nguyễn Thị Hương</Option>
                <Option value="Bs. Trần Văn Minh">Bs. Trần Văn Minh</Option>
                <Option value="Bs. Lê Thị An">Bs. Lê Thị An</Option>
                <Option value="Bs. Phạm Văn Đức">Bs. Phạm Văn Đức</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="specialty"
              label="Chuyên khoa"
              rules={[{ required: true, message: 'Vui lòng chọn chuyên khoa' }]}
            >
              <Select placeholder="Chọn chuyên khoa">
                <Option value="Phụ khoa">Phụ khoa</Option>
                <Option value="Thai sản">Thai sản</Option>
                <Option value="Sản khoa">Sản khoa</Option>
                <Option value="Dinh dưỡng">Dinh dưỡng</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="date"
              label="Ngày"
              rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
            >
              <DatePicker 
                format="DD/MM/YYYY"
                locale={locale}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="available">Còn trống</Option>
                <Option value="booked">Đã đặt</Option>
                <Option value="completed">Đã hoàn thành</Option>
                <Option value="cancelled">Đã hủy</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="startTime"
              label="Thời gian bắt đầu"
              rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu' }]}
            >
              <TimePicker 
                format="HH:mm"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="endTime"
              label="Thời gian kết thúc"
              rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc' }]}
            >
              <TimePicker 
                format="HH:mm"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="note" label="Ghi chú">
              <TextArea rows={4} placeholder="Nhập ghi chú nếu có" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ScheduleForm; 