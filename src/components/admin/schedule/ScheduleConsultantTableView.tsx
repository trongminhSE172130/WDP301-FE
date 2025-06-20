import React, { useState } from 'react';
import { Table, Modal, Card, Tag, Button, Tooltip, Popconfirm, Avatar, Badge, Row, Col, Checkbox, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, ClockCircleOutlined, CheckCircleOutlined, UserOutlined, CalendarOutlined, SelectOutlined } from '@ant-design/icons';
import type { Schedule } from './ScheduleTypes';
import type { ColumnsType } from 'antd/es/table';
import ScheduleDetailModal from './ScheduleDetailModal';
import { deleteSchedulesBulk } from '../../../service/api/scheduleAPI';

interface ConsultantData {
  consultant: {
    _id: string;
    full_name: string;
    email: string;
  };
  schedules: Schedule[];
  totalSchedules: number;
  bookedSchedules: number;
  availableSchedules: number;
}

interface ScheduleConsultantTableViewProps {
  data: Schedule[];
  loading?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
}

const ScheduleConsultantTableView: React.FC<ScheduleConsultantTableViewProps> = ({ 
  data, 
  loading = false,
  onEdit,
  onDelete,
  onBulkDelete
}) => {
  const [selectedConsultant, setSelectedConsultant] = useState<ConsultantData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [selectedScheduleIds, setSelectedScheduleIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);

  const handleEdit = (id: string) => {
    if (onEdit) {
      onEdit(id);
    }
  };

  const handleView = (id: string) => {
    setSelectedScheduleId(id);
    setDetailModalVisible(true);
  };

  const handleDelete = (id: string) => {
    if (onDelete) {
      onDelete(id);
      
      // Update selectedConsultant state to remove deleted schedule
      if (selectedConsultant) {
        const updatedSchedules = selectedConsultant.schedules.filter(schedule => schedule._id !== id);
        const updatedConsultant = {
          ...selectedConsultant,
          schedules: updatedSchedules,
          totalSchedules: updatedSchedules.length,
          bookedSchedules: updatedSchedules.filter(s => s.is_booked).length,
          availableSchedules: updatedSchedules.filter(s => !s.is_booked).length,
        };
        setSelectedConsultant(updatedConsultant);
      }
    }
  };

  const renderStatus = (isBooked: boolean) => {
    const color = isBooked ? 'blue' : 'green';
    const text = isBooked ? 'Đã đặt' : 'Còn trống';
    const icon = isBooked ? <CheckCircleOutlined /> : <ClockCircleOutlined />;

    return (
      <Tag color={color} icon={icon}>
        {text}
      </Tag>
    );
  };

  const renderScheduleType = (type: string) => {
    const color = type === 'advice' ? 'cyan' : 'purple';
    const text = type === 'advice' ? 'Tư vấn' : 'Khám bệnh';
    
    return (
      <Tag color={color}>
        {text}
      </Tag>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Group schedules by consultant
  const groupedByConsultant = data.reduce((groups: Record<string, Schedule[]>, schedule) => {
    // Handle both string ID and object consultant_user_id
    const consultantId = typeof schedule.consultant_user_id === 'string' 
      ? schedule.consultant_user_id 
      : schedule.consultant_user_id._id;
    
    if (!groups[consultantId]) {
      groups[consultantId] = [];
    }
    groups[consultantId].push(schedule);
    return groups;
  }, {});

  // Get consultant info and stats
  const consultantData: ConsultantData[] = Object.keys(groupedByConsultant).map(consultantId => {
    const schedules = groupedByConsultant[consultantId];
    const consultantInfo = schedules[0].consultant_user_id;
    
    // Ensure we have proper consultant object structure
    const consultant = typeof consultantInfo === 'string' 
      ? { _id: consultantInfo, full_name: 'Tư vấn viên', email: 'Đang tải...' }
      : consultantInfo;
    const totalSchedules = schedules.length;
    const bookedSchedules = schedules.filter(s => s.is_booked).length;
    const availableSchedules = totalSchedules - bookedSchedules;

    // Sort schedules by date and time
    const sortedSchedules = schedules.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateA !== dateB) return dateA - dateB;
      
      // If same date, sort by time slot
      return a.time_slot.localeCompare(b.time_slot);
    });

    return {
      consultant,
      schedules: sortedSchedules,
      totalSchedules,
      bookedSchedules,
      availableSchedules
    };
  });

  // Sort consultants by name
  const sortedConsultants = consultantData.sort((a, b) => 
    a.consultant.full_name.localeCompare(b.consultant.full_name)
  );

  const handleViewSchedules = (consultantData: ConsultantData) => {
    setSelectedConsultant(consultantData);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedConsultant(null);
    setSelectedScheduleIds([]);
    setIsSelectionMode(false);
  };

  const handleToggleSelection = (scheduleId: string) => {
    setSelectedScheduleIds(prev => {
      if (prev.includes(scheduleId)) {
        return prev.filter(id => id !== scheduleId);
      } else {
        return [...prev, scheduleId];
      }
    });
  };

  const handleToggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      setSelectedScheduleIds([]);
    }
  };

  const handleSelectAll = () => {
    if (selectedConsultant) {
      const allIds = selectedConsultant.schedules.map(s => s._id);
      setSelectedScheduleIds(allIds);
    }
  };

  const handleDeselectAll = () => {
    setSelectedScheduleIds([]);
  };

  const handleBulkDelete = async () => {
    if (selectedScheduleIds.length === 0) {
      message.warning('Vui lòng chọn ít nhất một lịch trình để xóa');
      return;
    }

    try {
      setBulkDeleteLoading(true);
      console.log('Bulk deleting schedules from modal:', selectedScheduleIds);

      const result = await deleteSchedulesBulk(selectedScheduleIds);
      console.log('Bulk delete result from modal:', result);

      if (result.success) {
        message.success(`Xóa thành công ${selectedScheduleIds.length} lịch trình`);
        
        // Update selected consultant data immediately
        if (selectedConsultant) {
          const updatedSchedules = selectedConsultant.schedules.filter(
            schedule => !selectedScheduleIds.includes(schedule._id)
          );
          const updatedConsultant = {
            ...selectedConsultant,
            schedules: updatedSchedules,
            totalSchedules: updatedSchedules.length,
            bookedSchedules: updatedSchedules.filter(s => s.is_booked).length,
            availableSchedules: updatedSchedules.filter(s => !s.is_booked).length,
          };
          setSelectedConsultant(updatedConsultant);
        }

        // Also call parent callback to update main list
        if (onBulkDelete) {
          onBulkDelete(selectedScheduleIds);
        }

        setSelectedScheduleIds([]);
        setIsSelectionMode(false);
      } else {
        message.error('Có lỗi xảy ra khi xóa lịch');
      }
    } catch (error) {
      console.error('Error bulk deleting schedules:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
        const errorMessage = axiosError.response?.data?.message || 'Có lỗi xảy ra khi xóa lịch hàng loạt';
        message.error(errorMessage);
      } else {
        message.error('Có lỗi xảy ra khi xóa lịch hàng loạt');
      }
    } finally {
      setBulkDeleteLoading(false);
    }
  };

  const columns: ColumnsType<ConsultantData> = [
    {
      title: 'Tư vấn viên',
      key: 'consultant',
      width: 300,
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar 
            size={40} 
            icon={<UserOutlined />}
            className="bg-blue-500"
          >
            {record.consultant.full_name.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <div className="font-semibold text-gray-800">{record.consultant.full_name}</div>
            <div className="text-sm text-gray-500">{record.consultant.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Tổng lịch',
      dataIndex: 'totalSchedules',
      key: 'totalSchedules',
      width: 120,
      align: 'center',
      render: (count) => (
        <Badge count={count} color="blue" />
      ),
      sorter: (a, b) => a.totalSchedules - b.totalSchedules,
    },
    {
      title: 'Còn trống',
      dataIndex: 'availableSchedules',
      key: 'availableSchedules',
      width: 120,
      align: 'center',
      render: (count) => (
        <Badge count={count} color="green" />
      ),
      sorter: (a, b) => a.availableSchedules - b.availableSchedules,
    },
    {
      title: 'Đã đặt',
      dataIndex: 'bookedSchedules',
      key: 'bookedSchedules',
      width: 120,
      align: 'center',
      render: (count) => (
        <Badge count={count} color="orange" />
      ),
      sorter: (a, b) => a.bookedSchedules - b.bookedSchedules,
    },
    {
      title: 'Tỷ lệ đặt lịch',
      key: 'bookingRate',
      width: 150,
      align: 'center',
      render: (_, record) => {
        const rate = record.totalSchedules > 0 
          ? Math.round((record.bookedSchedules / record.totalSchedules) * 100) 
          : 0;
        const color = rate >= 80 ? 'red' : rate >= 50 ? 'orange' : 'green';
        
        return (
          <Tag color={color}>
            {rate}%
          </Tag>
        );
      },
      sorter: (a, b) => {
        const rateA = a.totalSchedules > 0 ? (a.bookedSchedules / a.totalSchedules) * 100 : 0;
        const rateB = b.totalSchedules > 0 ? (b.bookedSchedules / b.totalSchedules) * 100 : 0;
        return rateA - rateB;
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<CalendarOutlined />}
          onClick={() => handleViewSchedules(record)}
        >
          Xem lịch
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={sortedConsultants}
        rowKey={(record) => record.consultant._id}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} tư vấn viên`,
        }}
        scroll={{ x: 800 }}
        className="consultant-table"
      />

      {/* Modal hiển thị lịch của tư vấn viên */}
      <Modal
        title={
          selectedConsultant && (
            <div className="flex items-center space-x-3">
              <Avatar 
                size={40} 
                icon={<UserOutlined />}
                className="bg-blue-500"
              >
                {selectedConsultant.consultant.full_name.charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <div className="text-lg font-semibold">
                  Lịch trình của {selectedConsultant.consultant.full_name}
                </div>
                <div className="text-sm text-gray-500">
                  {selectedConsultant.consultant.email}
                </div>
              </div>
            </div>
          )
        }
        open={modalVisible}
        onCancel={handleCloseModal}
        width={1000}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Đóng
          </Button>,
          <Space key="actions">
            <Button 
              icon={<SelectOutlined />}
              onClick={handleToggleSelectionMode}
              type={isSelectionMode ? 'primary' : 'default'}
            >
              {isSelectionMode ? 'Hủy chọn' : 'Chọn nhiều'}
            </Button>
            {isSelectionMode && (
              <>
                <Button size="small" onClick={handleSelectAll}>
                  Chọn tất cả
                </Button>
                <Button size="small" onClick={handleDeselectAll}>
                  Bỏ chọn tất cả
                </Button>
                <Popconfirm
                  title="Xác nhận xóa"
                  description={`Bạn có chắc chắn muốn xóa ${selectedScheduleIds.length} lịch trình đã chọn?`}
                  onConfirm={handleBulkDelete}
                  okText="Xóa"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                  disabled={selectedScheduleIds.length === 0}
                >
                  <Button 
                    danger
                    loading={bulkDeleteLoading}
                    disabled={selectedScheduleIds.length === 0}
                    icon={<DeleteOutlined />}
                  >
                    {bulkDeleteLoading ? 'Đang xóa...' : `Xóa đã chọn (${selectedScheduleIds.length})`}
                  </Button>
                </Popconfirm>
              </>
            )}
          </Space>
        ]}
        className="schedule-modal"
      >
        {selectedConsultant && (
          <div className="space-y-4">
            {/* Statistics */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <Row gutter={16}>
                <Col span={8}>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedConsultant.totalSchedules}
                    </div>
                    <div className="text-sm text-gray-600">Tổng lịch</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedConsultant.availableSchedules}
                    </div>
                    <div className="text-sm text-gray-600">Còn trống</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {selectedConsultant.bookedSchedules}
                    </div>
                    <div className="text-sm text-gray-600">Đã đặt</div>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Schedule Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {selectedConsultant.schedules.map((schedule) => {
                const isSelected = selectedScheduleIds.includes(schedule._id);
                return (
                  <Card
                    key={schedule._id}
                    size="small"
                    className={`border transition-all duration-200 ${
                      isSelectionMode && isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                    }`}
                    bodyStyle={{ padding: '16px' }}
                    onClick={isSelectionMode ? () => handleToggleSelection(schedule._id) : undefined}
                    style={{ cursor: isSelectionMode ? 'pointer' : 'default' }}
                  >
                                        <div className="space-y-3">
                        {/* Selection Checkbox */}
                        {isSelectionMode && (
                          <div className="flex justify-end">
                            <Checkbox 
                              checked={isSelected}
                              onChange={() => handleToggleSelection(schedule._id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        )}

                        {/* Date and Time */}
                        <div className="text-center border-b border-gray-100 pb-2">
                          <div className="text-sm font-medium text-gray-600">
                            {formatDate(schedule.date)}
                          </div>
                          <div className="text-lg font-semibold text-gray-800">
                            {schedule.time_slot}
                          </div>
                        </div>

                    {/* Schedule Type and Status */}
                    <div className="flex justify-between items-center">
                      {renderScheduleType(schedule.schedule_type)}
                      {renderStatus(schedule.is_booked)}
                    </div>

                                            {/* Actions */}
                        {!isSelectionMode && (
                          <div className="flex justify-center space-x-1 pt-2 border-t border-gray-100">
                            <Tooltip title="Xem chi tiết">
                              <Button
                                type="text"
                                size="small"
                                icon={<EyeOutlined />}
                                onClick={() => handleView(schedule._id)}
                                className="text-blue-600 hover:text-blue-800"
                              />
                            </Tooltip>
                            
                            <Tooltip title="Chỉnh sửa">
                              <Button
                                type="text"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => handleEdit(schedule._id)}
                                className="text-green-600 hover:text-green-800"
                              />
                            </Tooltip>
                            
                            <Popconfirm
                              title="Xác nhận xóa"
                              description="Bạn có chắc chắn muốn xóa lịch trình này?"
                              onConfirm={() => handleDelete(schedule._id)}
                              okText="Xóa"
                              cancelText="Hủy"
                              okButtonProps={{ danger: true }}
                            >
                              <Tooltip title="Xóa">
                                <Button
                                  type="text"
                                  size="small"
                                  icon={<DeleteOutlined />}
                                  className="text-red-600 hover:text-red-800"
                                />
                              </Tooltip>
                            </Popconfirm>
                          </div>
                        )}
                        </div>
                      </Card>
                    );
                  })}
            </div>

            {selectedConsultant.schedules.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-lg mb-2">Chưa có lịch trình nào</div>
                <div className="text-sm">Tư vấn viên này chưa có lịch trình được tạo</div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Schedule Detail Modal */}
      <ScheduleDetailModal
        visible={detailModalVisible}
        scheduleId={selectedScheduleId}
        onClose={() => {
          setDetailModalVisible(false);
          setSelectedScheduleId(null);
        }}
        onEdit={(schedule) => {
          if (onEdit) {
            onEdit(schedule._id);
          }
        }}
      />
    </>
  );
};

export default ScheduleConsultantTableView; 