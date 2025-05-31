import React, { useState } from 'react';
import { Table, Card, Tag, Button, Space, Tooltip, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { Service } from './ServiceTypes';
import type { ColumnsType } from 'antd/es/table';

interface ServiceTableProps {
  data: Service[];
  loading?: boolean;
  onEdit?: (id: string) => void;
}

interface ServiceTableItem extends Service {
  key: string;
}

const ServiceTable: React.FC<ServiceTableProps> = ({ data, loading = false, onEdit }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  
  const handleView = (id: string) => {
    console.log('Xem dịch vụ:', id);
  };

  const handleEdit = (id: string) => {
    if (onEdit) {
      onEdit(id);
    } else {
      console.log('Sửa dịch vụ:', id);
    }
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa dịch vụ này không?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: () => {
        console.log('Xóa dịch vụ:', id);
      },
    });
  };

  // Format số tiền VND
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Format thời gian
  const formatDuration = (minutes: number) => {
    if (minutes === 0) return 'Không xác định';
    if (minutes < 60) return `${minutes} phút`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours} giờ ${remainingMinutes} phút` : `${hours} giờ`;
  };

  const columns: ColumnsType<ServiceTableItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Tên dịch vụ',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      filters: Array.from(new Set(data.map(service => service.category))).map(category => ({
        text: category,
        value: category,
      })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => formatCurrency(price),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Thời gian',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number) => formatDuration(duration),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
      filters: [
        { text: 'Đang hoạt động', value: 'active' },
        { text: 'Không hoạt động', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record.id)}
            />
          </Tooltip>
          <Tooltip title="Sửa">
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
    <Card title="Quản lý dịch vụ">
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        columns={columns}
        dataSource={data.map(service => ({ ...service, key: service.id }))}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng số: ${total} dịch vụ`,
        }}
      />
    </Card>
  );
};

export default ServiceTable; 