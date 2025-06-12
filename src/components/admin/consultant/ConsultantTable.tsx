import React from 'react';
import { Table, Button, Space, Popconfirm, Tag, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined, EyeOutlined, CalendarOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Service } from '../service/ServiceTypes';

export interface Consultant {
  _id: string;
  full_name: string;
  email: string;
  degree: string;
  specialty: string;
  experience_years: number;
  bio: string;
  is_available_for_advice: boolean;
  is_available_for_analysis: boolean;
  services: string[];
}

interface ConsultantTableProps {
  data: Consultant[];
  onEdit: (consultant: Consultant) => void;
  onDelete: (consultantId: string) => Promise<void>;
  onViewProfile: (consultantId: string) => void;
  onManageSchedule: (consultantId: string) => void;
  loading: boolean;
  services: Service[];
  getServiceNames: (serviceIds: string[]) => string[];
}

const ConsultantTable: React.FC<ConsultantTableProps> = ({
  data,
  onEdit,
  onDelete,
  onViewProfile,
  onManageSchedule,
  loading,
  services,
  getServiceNames
}) => {
  const renderAvailabilityStatus = (record: Consultant) => {
    const canAdvice = record.is_available_for_advice;
    const canAnalysis = record.is_available_for_analysis;

    if (canAdvice && canAnalysis) {
      return <Tag color="green">Tư vấn & Phân tích</Tag>;
    } else if (canAdvice) {
      return <Tag color="blue">Chỉ tư vấn</Tag>;
    } else if (canAnalysis) {
      return <Tag color="orange">Chỉ phân tích</Tag>;
    } else {
      return <Tag color="red">Không khả dụng</Tag>;
    }
  };

  const renderServices = (serviceIds: string[]) => {
    if (!serviceIds || serviceIds.length === 0) {
      return <Tag color="default">Chưa có dịch vụ</Tag>;
    }

    const serviceNames = getServiceNames(serviceIds);
    
    if (serviceNames.length <= 2) {
      return (
        <div>
          {serviceNames.map((name, index) => (
            <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
              {name}
            </Tag>
          ))}
        </div>
      );
    }

    return (
      <div>
        <Tag color="blue">{serviceNames[0]}</Tag>
        <Tooltip 
          title={
            <div>
              {serviceNames.map((name, index) => (
                <div key={index}>{name}</div>
              ))}
            </div>
          }
        >
          <Tag color="purple">+{serviceNames.length - 1} khác</Tag>
        </Tooltip>
      </div>
    );
  };

  const columns: ColumnsType<Consultant> = [
    {
      title: 'Tư vấn viên',
      key: 'consultant',
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <UserOutlined className="text-blue-600" />
          </div>
          <div>
            <div className="font-semibold text-gray-800">{record.full_name}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
      width: 250,
    },
    {
      title: 'Bằng cấp',
      dataIndex: 'degree',
      key: 'degree',
      width: 180,
      render: (degree) => (
        <span className="text-gray-700">{degree}</span>
      ),
    },
    {
      title: 'Chuyên khoa',
      dataIndex: 'specialty',
      key: 'specialty',
      width: 150,
      render: (specialty) => (
        <Tag color="cyan">{specialty}</Tag>
      ),
    },
    {
      title: 'Kinh nghiệm',
      dataIndex: 'experience_years',
      key: 'experience_years',
      width: 120,
      render: (years) => (
        <span className="text-gray-700">{years} năm</span>
      ),
    },
    {
      title: 'Dịch vụ đảm nhiệm',
      dataIndex: 'services',
      key: 'services',
      width: 200,
      render: (serviceIds) => renderServices(serviceIds),
    },
    {
      title: 'Khả năng làm việc',
      key: 'availability',
      width: 160,
      render: (_, record) => renderAvailabilityStatus(record),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem hồ sơ">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => onViewProfile(record._id)}
              className="text-blue-600 hover:text-blue-800"
            />
          </Tooltip>
          
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              className="text-green-600 hover:text-green-800"
            />
          </Tooltip>
          
          <Tooltip title="Quản lý lịch">
            <Button
              type="text"
              icon={<CalendarOutlined />}
              onClick={() => onManageSchedule(record._id)}
              className="text-purple-600 hover:text-purple-800"
            />
          </Tooltip>
          
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa tư vấn viên này?"
            onConfirm={() => onDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                className="text-red-600 hover:text-red-800"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="_id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} tư vấn viên`,
      }}
      scroll={{ x: 1200 }}
      className="consultant-table"
    />
  );
};

export default ConsultantTable; 