import React, { useEffect, useState } from 'react';
import { Form, Select, DatePicker, Row, Col, message } from 'antd';
import type { Schedule } from './ScheduleTypes';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/vi_VN';
import { getAllUsers, type ApiUser } from '../../../service/api/userAPI';

const { Option } = Select;

interface ScheduleFormProps {
  visible: boolean;
  initialValues?: Schedule;
  onFinish?: (values: FormOutput) => void;
}

interface FormValues {
  consultant_user_id: string;
  date: Dayjs;
  time_slot: string;
  schedule_type: 'advice' | 'consultation';
}

interface FormOutput {
  consultant_user_id: string;
  date: string;
  time_slot: string;
  schedule_type: 'advice' | 'consultation';
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  visible,
  initialValues,
  onFinish
}) => {
  const [form] = Form.useForm<FormValues>();
  const [consultants, setConsultants] = useState<ApiUser[]>([]);
  const [loadingConsultants, setLoadingConsultants] = useState(false);

    useEffect(() => {
    if (visible) {
      // Luôn reset form trước
      form.resetFields();
      loadConsultants();
      
      // Chỉ set giá trị khi có initialValues (edit mode)
      if (initialValues) {
        // Delay một chút để đảm bảo form đã reset xong
        setTimeout(() => {
          const consultantId = typeof initialValues.consultant_user_id === 'string' 
            ? initialValues.consultant_user_id 
            : initialValues.consultant_user_id._id;
          
          form.setFieldsValue({
            consultant_user_id: consultantId,
            date: dayjs(initialValues.date),
            time_slot: initialValues.time_slot,
            schedule_type: initialValues.schedule_type
          });
        }, 0);
      }
    }
  }, [visible, initialValues, form]);

  const loadConsultants = async () => {
    try {
      setLoadingConsultants(true);
      const response = await getAllUsers({ role: 'consultant', limit: 100 });
      if (response.success) {
        setConsultants(response.data);
      }
    } catch (error) {
      console.error('Error loading consultants:', error);
      message.error('Không thể tải danh sách tư vấn viên');
    } finally {
      setLoadingConsultants(false);
    }
  };

  const handleFinish = (values: FormValues) => {
    if (onFinish) {
      // Convert Dayjs to date string format YYYY-MM-DD (as expected by API)
      const formattedValues = {
        consultant_user_id: values.consultant_user_id,
        date: values.date.format('YYYY-MM-DD'),
        time_slot: values.time_slot,
        schedule_type: values.schedule_type,
      };
      onFinish(formattedValues);
    }
  };

  return (
      <Form
      id="scheduleForm"
        form={form}
        layout="vertical"
      onFinish={handleFinish}
        initialValues={{
        schedule_type: 'advice'
        }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="consultant_user_id"
              label="Tư vấn viên"
              rules={[{ required: true, message: 'Vui lòng chọn tư vấn viên' }]}
            >
              <Select 
                placeholder="Chọn tư vấn viên"
                loading={loadingConsultants}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option?.children?.toString()?.toLowerCase().includes(input.toLowerCase()) || false
                }
            >
                {consultants.map((consultant) => (
                  <Option key={consultant._id} value={consultant._id}>
                    {consultant.full_name} - {consultant.email}
                    {consultant.specialty && (
                      <span className="text-gray-500"> ({consultant.specialty})</span>
                    )}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="date"
              label="Ngày"
              rules={[
                { required: true, message: 'Vui lòng chọn ngày' },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    if (value.isBefore(dayjs(), 'day')) {
                      return Promise.reject(new Error('Không thể chọn ngày trong quá khứ'));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <DatePicker 
                format="DD/MM/YYYY"
                locale={locale}
                style={{ width: '100%' }}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
                placeholder="Chọn ngày"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
            name="time_slot"
            label="Khung giờ"
            rules={[{ required: true, message: 'Vui lòng chọn khung giờ' }]}
            >
            <Select placeholder="Chọn khung giờ">
              <Option value="08:00 - 09:00">08:00 - 09:00</Option>
              <Option value="09:00 - 10:00">09:00 - 10:00</Option>
              <Option value="10:00 - 11:00">10:00 - 11:00</Option>
              <Option value="11:00 - 12:00">11:00 - 12:00</Option>
              <Option value="14:00 - 15:00">14:00 - 15:00</Option>
              <Option value="15:00 - 16:00">15:00 - 16:00</Option>
              <Option value="16:00 - 17:00">16:00 - 17:00</Option>
              <Option value="17:00 - 18:00">17:00 - 18:00</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
        <Col span={24}>
            <Form.Item
            name="schedule_type"
            label="Loại lịch"
            rules={[{ required: true, message: 'Vui lòng chọn loại lịch' }]}
            >
            <Select placeholder="Chọn loại lịch">
              <Option value="advice">Tư vấn</Option>
              <Option value="consultation">Khám bệnh</Option>
            </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
  );
};

export default ScheduleForm; 