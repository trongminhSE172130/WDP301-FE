import React, { useState } from 'react';
import { Table, Card, Space, Button, Tag, Modal, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { Schedule } from './ScheduleTypes';
import type { ColumnsType } from 'antd/es/table';

interface ScheduleTableProps {
  data: Schedule[];
  loading?: boolean;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
}

interface TableItem extends Schedule {
  key: string;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ 
  data, 
  loading = false,
  onEdit,
  onView
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

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
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa lịch trình này không?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: () => {
        console.log('Xóa lịch trình với ID:', id);
      }
    });
  };

  const columns: ColumnsType<TableItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Bác sĩ',
      dataIndex: 'doctor',
      key: 'doctor',
      ellipsis: true,
      sorter: (a, b) => a.doctor.localeCompare(b.doctor),
      filters: Array.from(new Set(data.map(item => item.doctor))).map(doctor => ({
        text: doctor,
        value: doctor,
      })),
      onFilter: (value, record) => record.doctor === value,
    },
    {
      title: 'Chuyên khoa',
      dataIndex: 'specialty',
      key: 'specialty',
      width: 130,
      filters: Array.from(new Set(data.map(item => item.specialty))).map(specialty => ({
        text: specialty,
        value: specialty,
      })),
      onFilter: (value, record) => record.specialty === value,
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      sorter: (a, b) => {
        const dateA = a.date.split('/').reverse().join('');
        const dateB = b.date.split('/').reverse().join('');
        return dateA.localeCompare(dateB);
      },
    },
    {
      title: 'Thời gian',
      key: 'time',
      width: 150,
      render: (_, record) => (
        <span>{record.startTime} - {record.endTime}</span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status) => {
        let color = '';
        let text = '';
        let icon = null;

        switch (status) {
          case 'available':
            color = 'green';
            text = 'Còn trống';
            icon = <ClockCircleOutlined />;
            break;
          case 'booked':
            color = 'blue';
            text = 'Đã đặt';
            icon = <CheckCircleOutlined />;
            break;
          case 'completed':
            color = 'cyan';
            text = 'Đã hoàn thành';
            icon = <CheckCircleOutlined />;
            break;
          case 'cancelled':
            color = 'red';
            text = 'Đã hủy';
            icon = <ClockCircleOutlined />;
            break;
          default:
            color = 'default';
            text = status;
        }

        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      },
      filters: [
        { text: 'Còn trống', value: 'available' },
        { text: 'Đã đặt', value: 'booked' },
        { text: 'Đã hoàn thành', value: 'completed' },
        { text: 'Đã hủy', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleView(record.id)} 
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record.id)} 
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDelete(record.id)} 
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        columns={columns}
        dataSource={data.map(item => ({ ...item, key: item.id }))}
        loading={loading}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total) => `Tổng số: ${total} lịch trình`,
        }}
        scroll={{ x: 1200 }}
      />
    </Card>
  );
};

export default ScheduleTable; 