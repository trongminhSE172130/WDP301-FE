import React from 'react';
import { Table, Button, Tag, Space, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { Appointment } from './AppointmentTypes';

interface AppointmentTableProps {
  data: Appointment[];
  loading: boolean;
  title?: string;
}

const AppointmentTable: React.FC<AppointmentTableProps> = ({ 
  data, 
  loading,
  title = "Danh sách cuộc hẹn"
}) => {
  const navigate = useNavigate();

  const handleViewDetail = (id: string) => {
    navigate(`/admin/appointments/${id}`);
  };

  // Định nghĩa các cột cho bảng
  const columns: ColumnsType<Appointment> = [
    {
      title: 'Mã cuộc hẹn',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: 'Tên bệnh nhân',
      dataIndex: 'patientName',
      key: 'patientName',
      sorter: (a, b) => a.patientName.localeCompare(b.patientName),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'patientPhone',
      key: 'patientPhone',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      filters: [
        { text: 'Nam', value: 'Male' },
        { text: 'Nữ', value: 'Female' },
      ],
      onFilter: (value, record) => record.gender === value,
      render: (gender) => (
        <Tag color={gender === 'Male' ? 'blue' : 'pink'}>
          {gender === 'Male' ? 'Nam' : 'Nữ'}
        </Tag>
      ),
    },
    {
      title: 'Ngày hẹn',
      dataIndex: 'appointmentDate',
      key: 'appointmentDate',
      sorter: (a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime(),
    },
    {
      title: 'Giờ hẹn',
      dataIndex: 'appointmentTime',
      key: 'appointmentTime',
      sorter: (a, b) => a.appointmentTime.localeCompare(b.appointmentTime),
    },
    {
      title: 'Lý do khám',
      dataIndex: 'reason',
      key: 'reason',
      filters: [
        { text: 'Khám định kỳ', value: 'Khám định kỳ' },
        { text: 'Tư vấn', value: 'Tư vấn' },
        { text: 'Khám', value: 'Khám' },
      ],
      onFilter: (value, record) => record.reason === value,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Đã lên lịch', value: 'scheduled' },
        { text: 'Hoàn thành', value: 'completed' },
        { text: 'Đã hủy', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let color = 'default';
        let text = '';
        
        if (status === 'scheduled') {
          color = 'processing';
          text = 'Đã lên lịch';
        } else if (status === 'completed') {
          color = 'success';
          text = 'Hoàn thành';
        } else if (status === 'cancelled') {
          color = 'error';
          text = 'Đã hủy';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            className="text-teal-600" 
            onClick={() => handleViewDetail(record.id)}
          />
          <Button type="text" icon={<EditOutlined />} className="text-blue-600" />
          <Button type="text" icon={<DeleteOutlined />} className="text-red-600" />
        </Space>
      ),
    },
  ];

  return (
    <Card title={title} bordered={false} className="w-full">
      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey="id" 
        loading={loading}
        pagination={{ 
          pageSize: 10, 
          showSizeChanger: true, 
          showTotal: (total) => `Tổng số ${total} cuộc hẹn`,
          pageSizeOptions: ['10', '20', '50'],
          locale: { items_per_page: '/ trang' },    
        }}
      />
    </Card>
  );
};

export default AppointmentTable; 