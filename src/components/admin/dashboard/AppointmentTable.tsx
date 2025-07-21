import React from 'react';
import { Table, Tag, Space, Card } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Typography } from 'antd';

const { Text } = Typography;

export interface Appointment {
  id: number;
  patient: string;
  service: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  time: string;
}

interface AppointmentTableProps {
  data: Appointment[];
  title?: string;
}

const AppointmentTable: React.FC<AppointmentTableProps> = ({ data, title = "Lịch hẹn sắp tới" }) => {
  const columns: ColumnsType<Appointment> = [
    {
      title: 'Bệnh nhân',
      dataIndex: 'patient',
      key: 'patient',
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'service',
      key: 'service',
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
      render: (time) => (
        <Space>
          <CalendarOutlined />
          <Text>{time}</Text>
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'green';
        let text = 'Đã xác nhận';
        
        if (status === 'pending') {
          color = 'orange';
          text = 'Chờ xác nhận';
        } else if (status === 'cancelled') {
          color = 'red';
          text = 'Đã hủy';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  return (
    <Card title={title} bordered={false} className="w-full">
      <Table 
        dataSource={data} 
        columns={columns} 
        pagination={false}
        rowKey="id"
        className="w-full"
      />
    </Card>
  );
};

export default AppointmentTable; 