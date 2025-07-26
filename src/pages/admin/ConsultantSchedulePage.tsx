import React, { useEffect, useState } from "react";
import { Button, Typography, message, Modal, Space } from "antd";
import { CalendarOutlined, PlusOutlined } from "@ant-design/icons";
import ScheduleConsultantTableView from "../../components/admin/schedule/ScheduleConsultantTableView";
import ScheduleForm from "../../components/admin/schedule/ScheduleForm";
import BatchScheduleForm from "../../components/admin/schedule/BatchScheduleForm";
import { getMySchedules, getScheduleById, createSchedule, updateSchedule, deleteSchedule, createSchedulesBatch } from "../../service/api/scheduleAPI";
import type { Schedule } from "../../components/admin/schedule/ScheduleTypes";
import type { CreateScheduleRequest, BatchCreateScheduleRequest, ScheduleSearchParams } from "../../service/api/scheduleAPI";

interface ScheduleFormValues {
  consultant_user_id: string;
  date: string;
  time_slot: string;
  schedule_type: 'advice' | 'consultation';
}

const { Title } = Typography;

const ConsultantSchedulePage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [allSchedules, setAllSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [currentSchedule, setCurrentSchedule] = useState<Schedule | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showBatchForm, setShowBatchForm] = useState<boolean>(false);
  const [batchFormLoading, setBatchFormLoading] = useState<boolean>(false);
  const [formKey, setFormKey] = useState(0);
  const [batchFormKey, setBatchFormKey] = useState(0);

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
      
      // Set empty array on error
      setSchedules([]);
      setAllSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle add new schedule
  const handleAdd = () => {
    setCurrentSchedule(undefined);
    setFormKey(prev => prev + 1); // Force form remount for add mode
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
      const schedule = schedules.find(s => s._id === id);
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

  // Handle form submit
  const handleFormSubmit = async (values: ScheduleFormValues) => {
    try {
      setFormLoading(true);
      
      console.log('Form values received:', values); // Debug log
      
      // Validation
      if (!values.consultant_user_id) {
        message.error('Vui lòng chọn tư vấn viên');
        return;
      }
      if (!values.date) {
        message.error('Vui lòng chọn ngày');
        return;
      }
      if (!values.time_slot) {
        message.error('Vui lòng chọn khung giờ');
        return;
      }
      if (!values.schedule_type) {
        message.error('Vui lòng chọn loại lịch');
        return;
      }
      
      const requestData: CreateScheduleRequest = {
        consultant_user_id: values.consultant_user_id,
        date: values.date,
        time_slot: values.time_slot,
        schedule_type: values.schedule_type,
      };

      if (currentSchedule) {
        // Update existing schedule - không cần consultant_user_id cho update
        const updateData = {
          date: values.date,
          time_slot: values.time_slot,
          schedule_type: values.schedule_type,
        };
        console.log('Sending update request with data:', updateData);
        const response = await updateSchedule(currentSchedule._id, updateData);
        if (response.success) {
          message.success('Cập nhật lịch trình thành công!');
          setShowForm(false);
          setCurrentSchedule(undefined);
          setFormKey(prev => prev + 1); // Reset form
          loadSchedules();
        }
      } else {
        // Create new schedule
        console.log('Sending create request with data:', requestData);
        const response = await createSchedule(requestData);
        console.log('Create response received:', response);
        if (response.success) {
          message.success('Tạo lịch trình mới thành công!');
          setShowForm(false);
          setCurrentSchedule(undefined);
          setFormKey(prev => prev + 1); // Reset form
          loadSchedules();
        } else {
          message.error('Không thể tạo lịch trình. Vui lòng thử lại.');
        }
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      
      // More specific error messages
      if (error && typeof error === 'object' && 'response' in error) {
        const errorResponse = (error as { response?: { status?: number } }).response;
        if (errorResponse?.status === 400) {
          message.error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.');
        } else if (errorResponse?.status === 401) {
          message.error('Bạn không có quyền tạo lịch trình. Vui lòng đăng nhập lại.');
        } else if (errorResponse?.status === 403) {
          message.error('Không có quyền tạo lịch trình.');
        } else {
          message.error('Có lỗi xảy ra khi lưu lịch trình. Vui lòng thử lại.');
        }
      } else {
        message.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      }
    } finally {
      setFormLoading(false);
    }
  };

  // Handle form cancel
  const handleCancel = () => {
    setShowForm(false);
    setCurrentSchedule(undefined); // Reset currentSchedule khi cancel
    setFormKey(prev => prev + 1); // Reset form key
  };

  // Handle batch form submit
  const handleBatchSubmit = async (values: BatchCreateScheduleRequest) => {
    try {
      setBatchFormLoading(true);
      console.log('Batch form submitted with values:', values);

      const result = await createSchedulesBatch(values);
      console.log('Batch create result:', result);

      if (result.success) {
        const count = result.data?.length || 0;
        message.success(`Tạo thành công ${count} lịch trình`);
        setShowBatchForm(false);
        setBatchFormKey(prev => prev + 1); // Reset batch form
        setRefreshKey(prev => prev + 1);
        loadSchedules();
      } else {
        message.error('Có lỗi xảy ra khi tạo lịch');
      }
    } catch (error) {
      console.error('Error batch creating schedules:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        const errorMessage = axiosError.response?.data?.message || 'Có lỗi xảy ra khi tạo lịch hàng loạt';
        message.error(errorMessage);
      } else {
        message.error('Có lỗi xảy ra khi tạo lịch hàng loạt');
      }
    } finally {
      setBatchFormLoading(false);
    }
  };

  // Handle delete schedule
  const handleDelete = async (id: string) => {
    try {
      console.log('Deleting schedule with ID:', id);
      const response = await deleteSchedule(id);
      console.log('Delete response:', response);
      
      if (response.success) {
        message.success('Xóa lịch trình thành công!');
        
        // Immediately update both schedules and allSchedules states
        console.log('Updating local state after delete...');
        const updatedSchedules = schedules.filter(schedule => schedule._id !== id);
        const updatedAllSchedules = allSchedules.filter(schedule => schedule._id !== id);
        
        console.log('Original schedules count:', schedules.length);
        console.log('Updated schedules count:', updatedSchedules.length);
        
        setSchedules(updatedSchedules);
        setAllSchedules(updatedAllSchedules);
        
        // Force re-render by updating refresh key
        setRefreshKey(prev => prev + 1);
        console.log('Local state updated successfully');
      } else {
        message.error('Không thể xóa lịch trình. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      message.error('Có lỗi xảy ra khi xóa lịch trình');
    }
  };

  // Handle bulk delete schedules
  const handleBulkDelete = async (scheduleIds: string[]) => {
    try {
      console.log('Bulk deleting schedules:', scheduleIds);
      
      // Update local state immediately
      const updatedSchedules = schedules.filter(schedule => !scheduleIds.includes(schedule._id));
      const updatedAllSchedules = allSchedules.filter(schedule => !scheduleIds.includes(schedule._id));
      
      console.log('Original schedules count:', schedules.length);
      console.log('Updated schedules count after bulk delete:', updatedSchedules.length);
      
      setSchedules(updatedSchedules);
      setAllSchedules(updatedAllSchedules);
      
      // Force re-render by updating refresh key
      setRefreshKey(prev => prev + 1);
      console.log('Bulk delete - local state updated successfully');
      
      // Optionally reload data from server to ensure consistency
      loadSchedules();
    } catch (error) {
      console.error('Error handling bulk delete:', error);
      // Reload data from server if there's an error
      loadSchedules();
    }
  };

  return (
    <div className="min-h-screen ">
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

        {/* View Mode Toggle and Add Button */}
        <div className="flex justify-between items-center mb-4">
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              className="bg-gradient-to-r from-blue-600 to-blue-700 border-0 shadow-lg hover:from-blue-700 hover:to-blue-800"
            >
              Thêm lịch trình
            </Button>
            
            <Button
              icon={<CalendarOutlined />}
              onClick={() => {
                setBatchFormKey(prev => prev + 1); // Reset batch form
                setShowBatchForm(true);
              }}
              className="bg-gradient-to-r from-green-600 to-green-700 border-0 shadow-lg hover:from-green-700 hover:to-green-800 text-white"
            >
              Tạo nhiều lịch cùng lúc
            </Button>
          </Space>
          
        </div>

        {/* Schedule Display */}
        <ScheduleConsultantTableView
          key={`consultant-${refreshKey}`}
          data={schedules}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBulkDelete={handleBulkDelete}
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
                key={`schedule-form-${currentSchedule?._id || 'new'}-${formKey}`}
                visible={true}
                initialValues={currentSchedule || undefined}
                onFinish={handleFormSubmit}
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

        {/* Batch Schedule Form Modal */}
        <Modal
          open={showBatchForm}
          title={
            <div className="flex items-center space-x-3 py-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <CalendarOutlined className="text-white text-lg" />
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-800">
                  Tạo nhiều lịch trình cùng lúc
                </div>
                <div className="text-sm text-gray-500">
                  Tạo lịch cho tư vấn viên theo khoảng thời gian và khung giờ
                </div>
              </div>
            </div>
          }
          onCancel={() => {
            setBatchFormKey(prev => prev + 1); // Reset batch form
            setShowBatchForm(false);
          }}
          footer={null}
          width={1000}
          className="batch-schedule-form-modal"
          maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(4px)' }}
          bodyStyle={{ padding: '0', maxHeight: '80vh', overflowY: 'auto' }}
          centered
        >
          <div className="bg-gray-50">
            <div className="p-6 bg-white">
              <BatchScheduleForm
                key={`batch-form-${batchFormKey}`}
                visible={showBatchForm}
                onFinish={handleBatchSubmit}
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
                    onClick={() => {
                      setBatchFormKey(prev => prev + 1); // Reset batch form
                      setShowBatchForm(false);
                    }}
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    form="batchScheduleForm"
                    type="submit"
                    disabled={batchFormLoading}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 border border-transparent rounded-lg shadow-sm hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-green-600 disabled:hover:to-green-700"
                  >
                    {batchFormLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang tạo lịch...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <CalendarOutlined />
                        <span>Tạo lịch hàng loạt</span>
                      </div>
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
