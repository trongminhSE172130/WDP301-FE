import React, { useState } from 'react';
import { Typography, Layout, message, Button, Space, Row, Col } from 'antd';
import { PlusOutlined, FilterOutlined } from '@ant-design/icons';
import ScheduleCalendar from '../../components/admin/schedule/ScheduleCalendar';
import ScheduleFilter from '../../components/admin/schedule/ScheduleFilter';
import ScheduleForm from '../../components/admin/schedule/ScheduleForm';
import { schedulesData } from '../../components/admin/schedule/ScheduleData';
import type { Schedule } from '../../components/admin/schedule/ScheduleTypes';
import type { FilterParams } from '../../components/admin/schedule/ScheduleTypes';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

dayjs.locale('vi');

const { Content } = Layout;
const { Title } = Typography;

const SchedulePage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>(schedulesData);
  const [loading, setLoading] = useState<boolean>(false);
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [formTitle, setFormTitle] = useState<string>('Thêm lịch trình mới');
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | undefined>(undefined);
  const [showFilter, setShowFilter] = useState<boolean>(false);

  // Xử lý lọc dữ liệu
  const handleFilter = (filters: FilterParams) => {
    setLoading(true);
    
    // Giả lập API call
    setTimeout(() => {
      let filteredData = [...schedulesData];
      
      if (filters.doctor) {
        filteredData = filteredData.filter(item => 
          item.doctor.toLowerCase().includes(filters.doctor?.toLowerCase() || '')
        );
      }
      
      if (filters.specialty) {
        filteredData = filteredData.filter(item => 
          item.specialty === filters.specialty
        );
      }
      
      if (filters.date) {
        filteredData = filteredData.filter(item => 
          item.date === filters.date
        );
      }
      
      if (filters.status) {
        filteredData = filteredData.filter(item => 
          item.status === filters.status
        );
      }
      
      setSchedules(filteredData);
      setLoading(false);
    }, 500);
  };

  // Xử lý đặt lại bộ lọc
  const handleReset = () => {
    setSchedules(schedulesData);
    message.success('Đã đặt lại dữ liệu');
  };

  // Xử lý thêm mới
  const handleAddNew = () => {
    setFormTitle('Thêm lịch trình mới');
    setSelectedSchedule(undefined);
    setFormVisible(true);
  };

  // Xử lý chỉnh sửa
  const handleEdit = (id: string) => {
    const schedule = schedules.find(item => item.id === id);
    if (schedule) {
      setFormTitle('Chỉnh sửa lịch trình');
      setSelectedSchedule(schedule);
      setFormVisible(true);
    }
  };

  // Xử lý khi form được submit
  const handleFormSubmit = (values: Omit<Schedule, 'id'>) => {
    setFormLoading(true);
    
    // Giả lập API call
    setTimeout(() => {
      if (selectedSchedule) {
        // Cập nhật
        const updatedSchedules = schedules.map(item => 
          item.id === selectedSchedule.id ? { ...values, id: selectedSchedule.id } : item
        );
        setSchedules(updatedSchedules);
        message.success('Cập nhật lịch trình thành công');
      } else {
        // Thêm mới
        const newId = `SCH${String(schedules.length + 1).padStart(3, '0')}`;
        const newSchedule = { ...values, id: newId };
        setSchedules([...schedules, newSchedule]);
        message.success('Thêm lịch trình mới thành công');
      }
      
      setFormLoading(false);
      setFormVisible(false);
    }, 1000);
  };

  // Xử lý đóng form
  const handleFormCancel = () => {
    setFormVisible(false);
  };

  // Xử lý bật/tắt bộ lọc
  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  return (
    <Content style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>Quản lý lịch trình</Title>
          </Col>
          <Col>
            <Space>
              <Button 
                icon={<FilterOutlined />} 
                onClick={toggleFilter}
                type={showFilter ? 'primary' : 'default'}
              >
                {showFilter ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleAddNew}
              >
                Thêm lịch mới
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {showFilter && (
        <ScheduleFilter 
          onFilter={handleFilter}
          onReset={handleReset}
          onAddNew={handleAddNew}
          loading={loading}
        />
      )}
      
      <ScheduleCalendar 
        data={schedules} 
        onSelect={handleEdit}
      />

      <ScheduleForm
        visible={formVisible}
        title={formTitle}
        loading={formLoading}
        initialValues={selectedSchedule}
        onCancel={handleFormCancel}
        onSubmit={handleFormSubmit}
      />
    </Content>
  );
};

export default SchedulePage; 