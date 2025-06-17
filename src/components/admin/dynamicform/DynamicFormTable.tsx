import React from 'react';
import { Table, Button, Space, Tag, Tooltip, Popconfirm } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { DynamicForm } from '../../../types/dynamicForm';

interface DynamicFormTableProps {
  data: DynamicForm[];
  onEdit?: (form: DynamicForm) => void;
  onPreview?: (form: DynamicForm) => void;
  onDelete?: (formId: string) => Promise<void>;
  onToggleStatus?: (formId: string) => Promise<void>;
  loading: boolean;
}

const DynamicFormTable: React.FC<DynamicFormTableProps> = ({
  data,
  onEdit,
  onPreview,
  onDelete,
  onToggleStatus,
  loading
}) => {
  const getFormTypeColor = (formType: string) => {
    switch (formType) {
      case 'booking_form':
        return 'blue';
      case 'result_form':
        return 'purple';
      case 'survey_form':
        return 'green';
      case 'registration_form':
        return 'orange';
      default:
        return 'default';
    }
  };

  const getFormTypeName = (formType: string) => {
    switch (formType) {
      case 'booking_form':
        return 'Form đặt lịch';
      case 'result_form':
        return 'Form kết quả';
      case 'survey_form':
        return 'Khảo sát';
      case 'registration_form':
        return 'Đăng ký';
      default:
        return formType;
    }
  };

  const renderFormStatus = (form: DynamicForm) => {
    if (form.is_active) {
      return <Tag color="green">Hoạt động</Tag>;
    } else {
      return <Tag color="default">Không hoạt động</Tag>;
    }
  };

  const renderService = (form: DynamicForm) => {
    if (form.service_id) {
      return (
        <div>
          <div className="font-medium text-gray-800 text-sm">
            {form.service_id.title}
          </div>
          <div className="text-xs text-gray-500 mt-1 line-clamp-2">
            {form.service_id.description}
          </div>
        </div>
      );
    }
    return <span className="text-gray-400 text-sm">Không có dịch vụ</span>;
  };

  const renderFormInfo = (form: DynamicForm) => {
    const totalFields = form.sections.reduce((total, section) => total + section.fields.length, 0);
    
    return (
        <div>
          <div className="font-semibold text-gray-800 text-sm">
            {form.form_name}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {form.sections.length} phần • {totalFields} trường
        </div>
      </div>
    );
  };

  const columns: ColumnsType<DynamicForm> = [
    {
      title: 'Thông tin Form',
      key: 'formInfo',
      render: (_, record) => renderFormInfo(record),
      width: 250,
    },
    {
      title: 'Loại Form',
      key: 'formType',
      dataIndex: 'form_type',
      width: 120,
      render: (formType) => (
        <Tag color={getFormTypeColor(formType)}>
          {getFormTypeName(formType)}
        </Tag>
      ),
    },
    {
      title: 'Dịch vụ liên quan',
      key: 'service',
      width: 250,
      render: (_, record) => renderService(record),
    },
    {
      title: 'Mô tả',
      dataIndex: 'form_description',
      key: 'description',
      width: 300,
      render: (description) => (
        <div className="text-sm text-gray-600 line-clamp-2" title={description}>
          {description}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 140,
      render: (_, record) => (
        <div 
          className={onToggleStatus ? 'cursor-pointer' : ''}
          onClick={() => onToggleStatus && onToggleStatus(record._id)}
        >
          {renderFormStatus(record)}
        </div>
      ),
    },
    {
      title: 'Người tạo',
      key: 'creator',
      width: 150,
      render: (_, record) => (
          <div>
            <div className="text-sm font-medium text-gray-700">
              {record.created_by.full_name}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(record.created_at).toLocaleDateString('vi-VN')}
          </div>
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          {onPreview && (
            <Tooltip title="Xem chi tiết">
              <Button
                size="small"
                icon={<EyeOutlined />}
                onClick={() => onPreview(record)}
              />
            </Tooltip>
          )}
          
          {onEdit && (
            <Tooltip title="Chỉnh sửa">
              <Button
                type="primary"
                size="small"
                icon={<EditOutlined />}
                onClick={() => onEdit(record)}
              />
            </Tooltip>
          )}
          
          {onDelete && (
            <Popconfirm
              title="Xác nhận xóa"
              description="Bạn có chắc chắn muốn xóa form này?"
              onConfirm={() => onDelete(record._id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Tooltip title="Xóa">
                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
        }}
        scroll={{ x: 1200 }}
        className="bg-white rounded-lg shadow-sm"
      />
    </div>
  );
};

export default DynamicFormTable; 