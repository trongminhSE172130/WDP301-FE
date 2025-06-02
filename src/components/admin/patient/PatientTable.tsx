import React, { useState } from 'react';
import { Table, Card, Button, Space, Tooltip, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { Patient } from './PatientTypes';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

interface PatientTableProps {
  data: Patient[];
  loading?: boolean;
  onEdit?: (id: string) => void;
}

interface PatientTableItem extends Patient {
  key: string;
}

const PatientTable: React.FC<PatientTableProps> = ({ data, loading = false, onEdit }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const navigate = useNavigate();
  
  const handleView = (id: string) => {
    navigate(`/admin/patients/${id}`);
  };

  const handleEdit = (id: string) => {
    if (onEdit) {
      onEdit(id);
    } else {
      console.log('Sửa bệnh nhân:', id);
    }
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa bệnh nhân này không?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: () => {
        console.log('Xóa bệnh nhân:', id);
      },
    });
  };

  const columns: ColumnsType<PatientTableItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Tên bệnh nhân',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender: string) => (gender === 'Male' ? 'Nam' : 'Nữ'),
      filters: [
        { text: 'Nam', value: 'Male' },
        { text: 'Nữ', value: 'Female' },
      ],
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: 'Bệnh án',
      dataIndex: 'medicalRecord',
      key: 'medicalRecord',
    },
    {
      title: 'Người tư vấn',
      dataIndex: 'consultant',
      key: 'consultant',
    },
    {
      title: 'Lý do',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Hành động',
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
    <Card title="Quản lý bệnh nhân">
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        columns={columns}
        dataSource={data.map(patient => ({ ...patient, key: patient.id }))}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng số: ${total} bệnh nhân`,
        }}
      />
    </Card>
  );
};

export default PatientTable; 