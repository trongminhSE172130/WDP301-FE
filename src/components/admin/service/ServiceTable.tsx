import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, Image, Input, Select, Tag, Switch, message } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Service } from './ServiceTypes';
import ServiceDetail from './ServiceDetail';
import { getServiceTypes } from '../../../service/api/serviceAPI';
import type { ServiceType } from '../../../service/api/serviceAPI';

const { Search } = Input;
const { Option } = Select;

interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
}

interface ServiceTableProps {
  services: Service[];
  loading: boolean;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  onSearch: (value: string) => void;
  onServiceTypeFilter?: (value: string) => void;
  onStatusFilter?: (value: string) => void;
  onSortChange?: (value: string) => void;
  onStatusChange?: (id: string, checked: boolean) => void;
  searchQuery: string;
  pagination: PaginationProps;
  userRole?: string; // Thêm prop để kiểm tra role
}

const ServiceTable: React.FC<ServiceTableProps> = ({
  services,
  loading,
  onEdit,
  onDelete,
  onSearch,
  onServiceTypeFilter,
  onStatusFilter,
  onSortChange,
  onStatusChange,
  searchQuery,
  pagination,
  userRole
}) => {
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loadingServiceTypes, setLoadingServiceTypes] = useState<boolean>(false);

  // Load service types when component mounts
  useEffect(() => {
    const fetchServiceTypes = async () => {
      setLoadingServiceTypes(true);
      try {
        const response = await getServiceTypes();
        if (response && response.data) {
          setServiceTypes(response.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách loại dịch vụ:', error);
        message.error('Không thể tải danh sách loại dịch vụ cho filter');
      } finally {
        setLoadingServiceTypes(false);
      }
    };

    fetchServiceTypes();
  }, []);
  
  const handleView = (service: Service) => {
    setSelectedServiceId(service._id);
    setDetailVisible(true);
  };

  const handleDetailClose = () => {
    setDetailVisible(false);
    setSelectedServiceId(null);
  };

  const columns: ColumnsType<Service> = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image_url',
      key: 'image_url',
      render: (imageUrl?: string) => (
        imageUrl ? (
          <Image
            src={imageUrl}
            width={60}
            height={40}
            style={{ objectFit: 'cover' }}
            preview={false}
          />
        ) : (
          <div style={{ 
            width: 60, 
            height: 40, 
            backgroundColor: '#f5f5f5', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderRadius: '4px',
            color: '#999',
            fontSize: '12px'
          }}>
            Không có
          </div>
        )
      ),
      width: 80,
    },
    {
      title: 'Tên dịch vụ',
      dataIndex: 'title',
      key: 'title',
      sorter: (a: Service, b: Service) => a.title.localeCompare(b.title),
      render: (title: string) => <span style={{ fontWeight: 500, color: '#1890ff' }}>{title}</span>,
    },
    {
      title: 'Loại dịch vụ',
      dataIndex: 'service_type',
      key: 'service_type',
      render: (serviceType: string) => {
        // Tìm service type tương ứng để hiển thị display_name
        const type = serviceTypes.find(t => t.name === serviceType);
        return type?.display_name || serviceType;
      },
    },
    {
      title: 'Thời gian',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Mẫu xét nghiệm',
      dataIndex: 'sample_type',
      key: 'sample_type',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean, record: Service) => (
        onStatusChange ? (
          <Switch
            checkedChildren="Hoạt động"
            unCheckedChildren="Tạm dừng"
            checked={isActive}
            onChange={(checked) => onStatusChange(record._id, checked)}
          />
        ) : (
          <Tag color={isActive ? 'green' : 'red'}>
            {isActive ? 'Đang hoạt động' : 'Không hoạt động'}
        </Tag>
        )
      )
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating?: number) => rating ? `${rating}/5` : 'Chưa có',
      sorter: (a: Service, b: Service) => (a.rating || 0) - (b.rating || 0),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
      sorter: (a: Service, b: Service) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: unknown, record: Service) => (
        <Space>
            <Button
            type="default"
              icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            />
            <Button
            type="primary"
              icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            />
          {/* Chỉ hiển thị nút xóa cho admin */}
          {userRole?.toLowerCase() === 'admin' && (
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa dịch vụ này?"
              description="Chỉ admin mới có quyền xóa dịch vụ."
              onConfirm={() => onDelete(record._id)}
              okText="Có"
              cancelText="Không"
            >
            <Button
              danger
              icon={<DeleteOutlined />}
            />
            </Popconfirm>
          )}
        </Space>
      ),
      width: 150,
      align: 'center',
    },
  ];

  return (
    <>
      <div className="p-6">
        <div className="mb-4 flex flex-wrap gap-4">
          <Search
            placeholder="Tìm kiếm dịch vụ..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={onSearch}
            defaultValue={searchQuery}
            loading={loading}
            className="max-w-md"
          />
          
          {onServiceTypeFilter && (
            <Select
              placeholder="Lọc theo loại dịch vụ"
              allowClear
              style={{ width: 250 }}
              onChange={onServiceTypeFilter}
              loading={loadingServiceTypes}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              <Option value="">Tất cả loại dịch vụ</Option>
              {serviceTypes
                .filter(type => type.is_active) // Chỉ hiển thị loại dịch vụ đang hoạt động
                .map(type => (
                  <Option key={type._id} value={type.name}>
                    {type.display_name || type.name}
                  </Option>
                ))
              }
            </Select>
          )}
          
          {onStatusFilter && (
            <Select
              placeholder="Trạng thái"
              allowClear
              style={{ width: 160 }}
              onChange={onStatusFilter}
            >
              <Option value="">Tất cả</Option>
              <Option value="true">Đang hoạt động</Option>
              <Option value="false">Không hoạt động</Option>
            </Select>
          )}
          
          {onSortChange && (
            <Select
              placeholder="Sắp xếp"
              style={{ width: 180 }}
              onChange={onSortChange}
              defaultValue="created_at-desc"
            >
              <Option value="created_at-desc">Mới nhất</Option>
              <Option value="created_at-asc">Cũ nhất</Option>
              <Option value="rating-desc">Đánh giá (cao-thấp)</Option>
              <Option value="rating-asc">Đánh giá (thấp-cao)</Option>
              <Option value="title-asc">Tên A-Z</Option>
              <Option value="title-desc">Tên Z-A</Option>
            </Select>
          )}
        </div>
        
      <Table
        columns={columns}
          dataSource={services}
          rowKey="_id"
        loading={loading}
          className="bg-white rounded-lg shadow"
        pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: pagination.onChange,
          showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50'],
            showTotal: (total: number) => `Tổng ${total} dịch vụ`
        }}
          scroll={{ x: 1200 }}
      />
      </div>

      <ServiceDetail
        visible={detailVisible}
        onClose={handleDetailClose}
        serviceId={selectedServiceId}
      />
    </>
  );
};

export default ServiceTable; 