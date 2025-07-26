import React from 'react';
import { Table, Button, Space, Tag, Tooltip, Modal, Select } from 'antd';
import { EditOutlined, UserOutlined, EyeOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Service } from '../service/ServiceTypes';
import { useState } from 'react';

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
  onViewProfile: (consultantId: string) => void;
  onAssignServices?: (consultantId: string, serviceIds: string[]) => Promise<void>;
  loading: boolean;
  services: Service[];
  getServiceNames: (serviceIds: string[]) => string[];
}

const ConsultantTable: React.FC<ConsultantTableProps> = ({
  data,
  onEdit,
  onViewProfile,
  onAssignServices,
  loading,
  services,
  getServiceNames
}) => {
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [currentConsultant, setCurrentConsultant] = useState<Consultant | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [assignLoading, setAssignLoading] = useState(false);

  const handleAssignServices = (consultant: Consultant) => {
    setCurrentConsultant(consultant);
    setSelectedServices(consultant.services || []);
    setAssignModalVisible(true);
  };

  const handleAssignSubmit = async () => {
    if (!currentConsultant || !onAssignServices) return;
    
    try {
      setAssignLoading(true);
      await onAssignServices(currentConsultant._id, selectedServices);
      setAssignModalVisible(false);
    } catch (error) {
      console.error('Error assigning services:', error);
    } finally {
      setAssignLoading(false);
    }
  };

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
      width: 240,
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

          {onAssignServices && (
            <Tooltip title="Gán dịch vụ">
              <Button
                type="text"
                icon={<AppstoreAddOutlined />}
                onClick={() => handleAssignServices(record)}
                className="text-orange-600 hover:text-orange-800"
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
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

      <Modal
        title={`Gán dịch vụ cho ${currentConsultant?.full_name || ''}`}
        open={assignModalVisible}
        onCancel={() => setAssignModalVisible(false)}
        onOk={handleAssignSubmit}
        confirmLoading={assignLoading}
        okText="Lưu"
        cancelText="Hủy"
      >
        <div className="mb-4">
          <p className="mb-2">Chọn các dịch vụ mà tư vấn viên này có thể đảm nhiệm:</p>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Chọn dịch vụ"
            value={selectedServices}
            onChange={(value) => setSelectedServices(value)}
            optionFilterProp="children"
            showSearch
          >
            {services.map(service => (
              <Select.Option key={service._id} value={service._id}>
                {service.title}
              </Select.Option>
            ))}
          </Select>
        </div>
      </Modal>
    </>
  );
};

export default ConsultantTable; 