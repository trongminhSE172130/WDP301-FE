import React from 'react';
import { Calendar, Badge, Card, Tooltip } from 'antd';
import type { Schedule } from './ScheduleTypes';
import type { Dayjs } from 'dayjs';
import type { BadgeProps } from 'antd';
import 'dayjs/locale/vi';

interface ScheduleCalendarProps {
  data: Schedule[];
  onSelect?: (id: string) => void;
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({ data, onSelect }) => {
  // Chuyển đổi dữ liệu lịch thành đối tượng với key là ngày
  const getSchedulesByDate = () => {
    const scheduleMap: Record<string, Schedule[]> = {};
    
    data.forEach(schedule => {
      const dateKey = schedule.date;
      if (!scheduleMap[dateKey]) {
        scheduleMap[dateKey] = [];
      }
      scheduleMap[dateKey].push(schedule);
    });
    
    return scheduleMap;
  };

  // Lấy màu dựa trên trạng thái
  const getStatusColor = (status: string): BadgeProps['status'] => {
    switch (status) {
      case 'available':
        return 'success';
      case 'booked':
        return 'processing';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  // Lấy dữ liệu ô lịch
  const dateCellRender = (value: Dayjs) => {
    const dateKey = value.format('DD/MM/YYYY');
    const schedulesByDate = getSchedulesByDate();
    const schedules = schedulesByDate[dateKey] || [];
    
    return (
      <ul className="events">
        {schedules.map(item => (
          <li key={item.id}>
            <Tooltip 
              title={`${item.title} (${item.startTime} - ${item.endTime}) - ${item.doctor}`}
              placement="top"
            >
              <Badge
                status={getStatusColor(item.status)}
                text={
                  <span 
                    onClick={() => onSelect && onSelect(item.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {item.startTime} {item.title.length > 12 ? item.title.substring(0, 12) + '...' : item.title}
                  </span>
                }
              />
            </Tooltip>
          </li>
        ))}
      </ul>
    );
  };

  // Xử lý chọn một ngày
  const handleSelect = (date: Dayjs) => {
    console.log('Selected date:', date.format('DD/MM/YYYY'));
  };

  return (
    <Card className="mb-4">
      <Calendar 
        dateCellRender={dateCellRender}
        onSelect={handleSelect}
        headerRender={({ value, onChange }) => {
          const start = 0;
          const end = 12;
          const monthOptions = [];

          const monthNames = [
            'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
            'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
          ];

          for (let i = start; i < end; i++) {
            monthOptions.push(
              <option key={i} value={i}>
                {monthNames[i]}
              </option>
            );
          }

          const year = value.year();
          const month = value.month();
          const options = [];
          for (let i = year - 10; i < year + 10; i += 1) {
            options.push(
              <option key={i} value={i}>
                {i}
              </option>
            );
          }

          return (
            <div style={{ padding: 8 }}>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ marginRight: '8px' }}>Tháng:</span>
                <select
                  value={month}
                  onChange={e => {
                    const newValue = value.clone();
                    newValue.month(parseInt(e.target.value, 10));
                    onChange(newValue);
                  }}
                >
                  {monthOptions}
                </select>
                <span style={{ margin: '0 8px' }}>Năm:</span>
                <select
                  value={year}
                  onChange={e => {
                    const newValue = value.clone();
                    newValue.year(parseInt(e.target.value, 10));
                    onChange(newValue);
                  }}
                >
                  {options}
                </select>
              </div>
            </div>
          );
        }}
      />
      <div className="custom-styles">
        <style>
          {`
            .events {
              margin: 0;
              padding: 0;
              list-style: none;
            }
            .events li {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              margin-bottom: 2px;
            }
          `}
        </style>
      </div>
    </Card>
  );
};

export default ScheduleCalendar; 