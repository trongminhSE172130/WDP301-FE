import React from 'react';
import { Card, Row, Col, Tag, Button, Tooltip, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { Schedule } from './ScheduleTypes';

interface ScheduleGroupedViewProps {
  data: Schedule[];
  loading?: boolean;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ScheduleGroupedView: React.FC<ScheduleGroupedViewProps> = ({ 
  data, 
  loading = false,
  onEdit,
  onView,
  onDelete
}) => {
  const handleEdit = (id: string) => {
    if (onEdit) {
      onEdit(id);
    }
  };

  const handleView = (id: string) => {
    if (onView) {
      onView(id);
    }
  };

  const handleDelete = (id: string) => {
    if (onDelete) {
      onDelete(id);
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
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const formatDateKey = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Group schedules by date
  const groupedSchedules = data.reduce((groups: Record<string, Schedule[]>, schedule) => {
    const dateKey = formatDateKey(schedule.date);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(schedule);
    return groups;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(groupedSchedules).sort((a, b) => {
    return new Date(a.split('/').reverse().join('-')).getTime() - new Date(b.split('/').reverse().join('-')).getTime();
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} loading={true} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedDates.map((dateKey) => {
        const schedules = groupedSchedules[dateKey];
        const firstSchedule = schedules[0];
        
        return (
          <Card
            key={dateKey}
            title={
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {new Date(firstSchedule.date).getDate()}
                  </span>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-800">
                    {formatDate(firstSchedule.date)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {schedules.length} lịch trình
                  </div>
                </div>
              </div>
            }
            className="shadow-sm border border-gray-200"
          >
            <Row gutter={[16, 16]}>
              {schedules.map((schedule) => (
                <Col xs={24} sm={12} lg={8} xl={6} key={schedule._id}>
                  <Card
                    size="small"
                    className="border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                    bodyStyle={{ padding: '12px' }}
                  >
                    <div className="space-y-3">
                      {/* Time slot */}
                      <div className="flex items-center justify-between">
                        <div className="text-base font-semibold text-gray-800">
                          {schedule.time_slot}
                        </div>
                        {renderStatus(schedule.is_booked)}
                      </div>

                      {/* Consultant info */}
                      <div>
                        <div className="text-sm font-medium text-gray-700">
                          {schedule.consultant_user_id.full_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {schedule.consultant_user_id.email}
                        </div>
                      </div>

                      {/* Schedule type */}
                      <div>
                        {renderScheduleType(schedule.schedule_type)}
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end space-x-1 pt-2 border-t border-gray-100">
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
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        );
      })}
      
      {sortedDates.length === 0 && (
        <Card className="text-center py-8">
          <div className="text-gray-500">
            <div className="text-lg mb-2">Chưa có lịch trình nào</div>
            <div className="text-sm">Hãy tạo lịch trình đầu tiên của bạn!</div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ScheduleGroupedView; 