import React, { useEffect, useState } from 'react';
import { Form, Select, DatePicker, Checkbox, Card, Tag, message, Input } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import locale from 'antd/es/date-picker/locale/vi_VN';

dayjs.extend(isSameOrBefore);
import { getAllUsers, type ApiUser } from '../../../service/api/userAPI';
import type { BatchCreateScheduleRequest } from '../../../service/api/scheduleAPI';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface BatchScheduleFormProps {
  visible: boolean;
  onFinish?: (values: BatchCreateScheduleRequest) => void;
}

interface FormValues {
  consultant_user_id: string;
  dateRange: [Dayjs, Dayjs];
  daysOfWeek: number[];
  timeSlots: string[];
  schedule_type: 'advice' | 'consultation';
}

const BatchScheduleForm: React.FC<BatchScheduleFormProps> = ({
  visible,
  onFinish
}) => {
  const [form] = Form.useForm<FormValues>();
  const [consultants, setConsultants] = useState<ApiUser[]>([]);
  const [loadingConsultants, setLoadingConsultants] = useState(false);
  const [previewCount, setPreviewCount] = useState(0);

  const daysOfWeekOptions = [
    { label: 'Chủ nhật', value: 0 },
    { label: 'Thứ 2', value: 1 },
    { label: 'Thứ 3', value: 2 },
    { label: 'Thứ 4', value: 3 },
    { label: 'Thứ 5', value: 4 },
    { label: 'Thứ 6', value: 5 },
    { label: 'Thứ 7', value: 6 }
  ];

  const timeSlotOptions = [
    '08:00 - 09:00',
    '09:00 - 10:00', 
    '10:00 - 11:00',
    '11:00 - 12:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
    '17:00 - 18:00'
  ];

  useEffect(() => {
    if (visible) {
      form.resetFields();
      // Đặt giá trị mặc định cho schedule_type
      form.setFieldsValue({
        schedule_type: 'advice'
      });
      loadConsultants();
    }
  }, [visible, form]);

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

  const calculatePreviewCount = () => {
    try {
      const values = form.getFieldsValue();
      
      // Kiểm tra an toàn các trường bắt buộc
      if (!values.dateRange || !Array.isArray(values.dateRange) || values.dateRange.length !== 2) {
        setPreviewCount(0);
        return;
      }

      if (!Array.isArray(values.daysOfWeek) || !Array.isArray(values.timeSlots)) {
        setPreviewCount(0);
        return;
      }

      const [startDate, endDate] = values.dateRange;
      const daysOfWeek = values.daysOfWeek;
      const timeSlots = values.timeSlots;

      // Kiểm tra tính hợp lệ của dữ liệu
      if (!startDate || !endDate || !dayjs.isDayjs(startDate) || !dayjs.isDayjs(endDate)) {
        setPreviewCount(0);
        return;
      }

      if (daysOfWeek.length === 0 || timeSlots.length === 0) {
        setPreviewCount(0);
        return;
      }

      // Giới hạn phạm vi tính toán để tránh vòng lặp vô hạn
      const daysDiff = endDate.diff(startDate, 'day');
      if (daysDiff > 365) { // Giới hạn 1 năm
        setPreviewCount(0);
        return;
      }

      let count = 0;
      const current = startDate.clone();
      let iterations = 0;
      const maxIterations = 400; // Giới hạn vòng lặp
      
      while (current.isSameOrBefore(endDate, 'day') && iterations < maxIterations) {
        if (daysOfWeek.includes(current.day())) {
          count += timeSlots.length;
        }
        current.add(1, 'day');
        iterations++;
      }
      
      setPreviewCount(count);
    } catch (error) {
      console.error('Error calculating preview count:', error);
      setPreviewCount(0);
    }
  };

  // Debounce function để tránh tính toán quá nhiều
  const [debounceTimer, setDebounceTimer] = useState<number | null>(null);

  const handleValuesChange = () => {
    // Clear timer cũ
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set timer mới
    const newTimer = window.setTimeout(() => {
      calculatePreviewCount();
    }, 300); // Debounce 300ms

    setDebounceTimer(newTimer);
  };

  // Cleanup timer khi component unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const handleFinish = (values: FormValues) => {
    if (onFinish) {
      const [startDate, endDate] = values.dateRange;
      
      const batchData: BatchCreateScheduleRequest = {
        consultant_user_id: values.consultant_user_id,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        daysOfWeek: values.daysOfWeek,
        timeSlots: values.timeSlots,
        schedule_type: 'advice', // Luôn gửi là advice
      };
      
      onFinish(batchData);
    }
  };

  return (
    <Form
      id="batchScheduleForm"
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      onValuesChange={handleValuesChange}
      className="space-y-4"
      initialValues={{
        schedule_type: 'advice'
      }}
    >
      {/* Consultant Selection */}
      <Card 
        title={
          <div className="flex items-center space-x-2">
            <UserOutlined className="text-blue-500" />
            <span>Chọn tư vấn viên</span>
          </div>
        }
        size="small"
      >
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
      </Card>

      {/* Date Range Selection */}
      <Card 
        title={
          <div className="flex items-center space-x-2">
            <CalendarOutlined className="text-green-500" />
            <span>Khoảng thời gian</span>
          </div>
        }
        size="small"
      >
        <Form.Item
          name="dateRange"
          label="Từ ngày - đến ngày"
          rules={[
            { required: true, message: 'Vui lòng chọn khoảng thời gian' },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                const [startDate] = value;
                if (startDate.isBefore(dayjs(), 'day')) {
                  return Promise.reject(new Error('Không thể chọn ngày trong quá khứ'));
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <RangePicker 
            format="DD/MM/YYYY"
            locale={locale}
            style={{ width: '100%' }}
            disabledDate={(current) => current && current < dayjs().startOf('day')}
            placeholder={['Từ ngày', 'Đến ngày']}
          />
        </Form.Item>
      </Card>

      {/* Days of Week Selection */}
      <Card 
        title={
          <div className="flex items-center space-x-2">
            <CalendarOutlined className="text-purple-500" />
            <span>Chọn ngày trong tuần</span>
          </div>
        }
        size="small"
      >
        <Form.Item
          name="daysOfWeek"
          label="Các ngày trong tuần"
          rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 ngày' }]}
        >
          <Checkbox.Group className="grid grid-cols-4 gap-2">
            {daysOfWeekOptions.map((day) => (
              <Checkbox key={day.value} value={day.value}>
                {day.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
      </Card>

      {/* Time Slots Selection */}
      <Card 
        title={
          <div className="flex items-center space-x-2">
            <ClockCircleOutlined className="text-orange-500" />
            <span>Khung giờ</span>
          </div>
        }
        size="small"
      >
        <Form.Item
          name="timeSlots"
          label="Các khung giờ"
          rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 khung giờ' }]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn các khung giờ"
            style={{ width: '100%' }}
          >
            {timeSlotOptions.map((timeSlot) => (
              <Option key={timeSlot} value={timeSlot}>
                {timeSlot}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Card>

      {/* Loại lịch */}
      <Card 
        title={
          <div className="flex items-center space-x-2">
            <FileTextOutlined className="text-cyan-500" />
            <span>Loại lịch</span>
          </div>
        }
        size="small"
      >
        <Form.Item
          name="schedule_type"
          label="Loại lịch"
          hidden
        >
          <Input type="hidden" />
        </Form.Item>
        <div className="ant-form-item">
          <div className="ant-form-item-label">
            <label>Loại lịch</label>
          </div>
          <div className="ant-form-item-control">
            <div className="ant-form-item-control-input">
              <div className="ant-form-item-control-input-content">
                <Input value="Tư vấn" disabled style={{ backgroundColor: '#f5f5f5', color: '#333' }} />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Preview */}
      {previewCount > 0 && (
        <Card 
          title="Xem trước"
          size="small"
          className="border-blue-200 bg-blue-50"
        >
          <div className="text-center">
            <Tag color="blue" className="text-lg px-4 py-2">
              Sẽ tạo {previewCount} lịch trình
            </Tag>
            <div className="text-sm text-gray-600 mt-2">
              Tổng số lịch sẽ được tạo dựa trên khoảng thời gian, ngày trong tuần và khung giờ đã chọn
            </div>
          </div>
        </Card>
      )}
    </Form>
  );
};

export default BatchScheduleForm; 