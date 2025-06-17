import React, { useState, useEffect } from 'react';
import { Typography, message, Modal } from 'antd';
import ScheduleTable from '../../components/admin/schedule/ScheduleTable';
import ScheduleForm from '../../components/admin/schedule/ScheduleForm';
import ScheduleSearch from '../../components/admin/schedule/ScheduleSearch';
import type { Schedule } from '../../components/admin/schedule/ScheduleTypes';
import {
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getScheduleById,
  getMySchedules,
} from '../../service/api/scheduleAPI';
import type { 
  ScheduleSearchParams,
  CreateScheduleRequest 
} from '../../service/api/scheduleAPI';

const { Title } = Typography;

const ConsultantSchedulePage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [allSchedules, setAllSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [currentSchedule, setCurrentSchedule] = useState<Schedule | undefined>(undefined);

  // Load schedules on component mount
  useEffect(() => {
    loadSchedules();
  }, []);

  // Function to load schedules
  const loadSchedules = async (params?: ScheduleSearchParams) => {
    try {
      setLoading(true);
      
      // Use getMySchedules for consultant's own schedules
      const response = await getMySchedules({
        page: 1,
        limit: 100,
        ...params
      });

      if (response.success) {
        setSchedules(response.data);
        setAllSchedules(response.data);
      } else {
        throw new Error('Không thể tải danh sách lịch trình');
      }
    } catch (error) {
      console.error('Error loading schedules:', error);
      message.error('Có lỗi xảy ra khi tải danh sách lịch trình');
      
      // Use mock data as fallback
      const { schedulesData } = await import('../../components/admin/schedule/ScheduleData');
      setSchedules(schedulesData);
      setAllSchedules(schedulesData);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (values: { keyword?: string }) => {
    const { keyword } = values;
    
    if (!keyword) {
      setSchedules(allSchedules);
      return;
    }
    
    const filteredSchedules = allSchedules.filter(
      schedule => 
        schedule.title.toLowerCase().includes(keyword.toLowerCase()) || 
        schedule.doctor.toLowerCase().includes(keyword.toLowerCase()) ||
        schedule.specialty.toLowerCase().includes(keyword.toLowerCase())
    );
      
    setSchedules(filteredSchedules);
  };

  // Handle search reset
  const handleReset = () => {
    setSchedules(allSchedules);
  };

  // Handle add new schedule
  const handleAdd = () => {
    setCurrentSchedule(undefined);
    setShowForm(true);
  };

  // Handle edit schedule
  const handleEdit = async (id: string) => {
    try {
      setLoading(true);
      const response = await getScheduleById(id);
      
      if (response.success) {
        setCurrentSchedule(response.data);
        setShowForm(true);
      }
    } catch (error) {
      console.error('Error loading schedule for edit:', error);
      
      // Fallback to find in current data
      const schedule = schedules.find(s => s.id === id);
      if (schedule) {
        setCurrentSchedule(schedule);
        setShowForm(true);
      } else {
        message.error('Không thể tải thông tin lịch trình');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle view schedule details
  const handleView = (id: string) => {
    const schedule = schedules.find(s => s.id === id);
    if (schedule) {
      message.info(`Xem chi tiết lịch: ${schedule.title} - ${schedule.doctor}`);
      // TODO: Implement view details modal
    }
  };

  // Handle form submit
  const handleFormSubmit = async (values: Omit<Schedule, 'id'>) => {
    try {
      setFormLoading(true);
      
      const requestData: CreateScheduleRequest = {
        title: values.title,
        doctor: values.doctor,
        specialty: values.specialty,
        date: values.date,
        startTime: values.startTime,
        endTime: values.endTime,
        status: values.status,
        note: values.note,
      };

      if (currentSchedule) {
        // Update existing schedule
        const response = await updateSchedule(currentSchedule.id, requestData);
        if (response.success) {
          message.success('Cập nhật lịch trình thành công!');
          setShowForm(false);
          loadSchedules();
        }
      } else {
        // Create new schedule
        const response = await createSchedule(requestData);
        if (response.success) {
          message.success('Tạo lịch trình mới thành công!');
          setShowForm(false);
          loadSchedules();
        }
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      message.error('Có lỗi xảy ra khi lưu lịch trình');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle form cancel
  const handleCancel = () => {
    setShowForm(false);
  };

  // Handle delete schedule
  const handleDelete = async (id: string) => {
    try {
      const response = await deleteSchedule(id);
      if (response.success) {
        message.success('Xóa lịch trình thành công!');
        loadSchedules();
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      message.error('Có lỗi xảy ra khi xóa lịch trình');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div>
        {/* Header */}
        <div className="mb-8">
          <Title level={2} className="text-gray-800 mb-2">
            Quản lý lịch tư vấn
          </Title>
          <p className="text-gray-600">
            Quản lý và theo dõi lịch trình tư vấn của bạn trong hệ thống
          </p>
        </div>

        {/* Search Form */}
        <ScheduleSearch 
          onSearch={handleSearch}
          onAdd={handleAdd}
          onReset={handleReset}
          loading={loading}
        />

        {/* Schedule Table */}
        <ScheduleTable
          data={schedules}
          loading={loading}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
        />

        {/* Schedule Form Modal */}
        <Modal
          open={showForm}
          title={
            <div className="flex items-center space-x-3 py-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">
                  {currentSchedule ? '✏️' : '📅'}
                </span>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-800">
                  {currentSchedule ? 'Chỉnh sửa lịch trình' : 'Thêm lịch trình mới'}
                </div>
                <div className="text-sm text-gray-500">
                  {currentSchedule ? 'Cập nhật thông tin lịch trình' : 'Điền đầy đủ thông tin bên dưới'}
                </div>
              </div>
            </div>
          }
          onCancel={handleCancel}
          footer={null}
          width={900}
          className="schedule-form-modal"
          maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(4px)' }}
          bodyStyle={{ padding: '0', maxHeight: '80vh', overflowY: 'auto' }}
          centered
        >
          <div className="bg-gray-50">
            <div className="p-6 bg-white">
              <ScheduleForm
                visible={true}
                title=""
                loading={formLoading}
                initialValues={currentSchedule || undefined}
                onCancel={handleCancel}
                onSubmit={handleFormSubmit}
              />
            </div>
            
            {/* Form Actions */}
            <div className="bg-white border-t border-gray-200 px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  <span className="text-red-500">*</span> Các trường bắt buộc
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={handleCancel} 
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    form="scheduleForm"
                    type="submit"
                    disabled={formLoading}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-blue-700"
                  >
                    {formLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang xử lý...</span>
                      </div>
                    ) : (
                      <>
                        {currentSchedule ? (
                          <div className="flex items-center space-x-2">
                            <span>✓</span>
                            <span>Cập nhật</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span>+</span>
                            <span>Thêm mới</span>
                          </div>
                        )}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ConsultantSchedulePage;
