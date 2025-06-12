import React from 'react';
import { Modal, Descriptions, Tag, Divider, Card, Typography, Space } from 'antd';
import { FormOutlined, UserOutlined, TagOutlined, CalendarOutlined } from '@ant-design/icons';
import type { DynamicForm } from '../../../types/dynamicForm';

const { Title, Paragraph, Text } = Typography;

interface DynamicFormDetailModalProps {
  visible: boolean;
  form: DynamicForm | null;
  onCancel: () => void;
}

const DynamicFormDetailModal: React.FC<DynamicFormDetailModalProps> = ({
  visible,
  form,
  onCancel
}) => {
  if (!form) return null;

  const getFormTypeColor = (formType: string) => {
    switch (formType) {
      case 'booking_form':
        return 'blue';
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
        return 'Đặt lịch';
      case 'survey_form':
        return 'Khảo sát';
      case 'registration_form':
        return 'Đăng ký';
      default:
        return formType;
    }
  };

  const totalFields = form.sections.reduce((total, section) => total + section.fields.length, 0);

  return (
    <Modal
      title={
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <FormOutlined className="text-blue-600" />
          </div>
          <div>
            <Title level={4} className="mb-0">Chi tiết Form</Title>
            <Text type="secondary">{form.form_name}</Text>
          </div>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      className="dynamic-form-detail-modal"
    >
      <div className="space-y-6">
        {/* Thông tin cơ bản */}
        <Card title="Thông tin cơ bản" size="small">
          <Descriptions column={2} size="small">
            <Descriptions.Item label="Tên Form" span={2}>
              <Text strong>{form.form_name}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả" span={2}>
              <Paragraph className="mb-0">{form.form_description}</Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label="Loại Form">
              <Tag color={getFormTypeColor(form.form_type)} icon={<TagOutlined />}>
                {getFormTypeName(form.form_type)}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Trạng thái">
              {form.is_active ? (
                <Tag color="green">Hoạt động</Tag>
              ) : (
                <Tag color="default">Không hoạt động</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Tổng số trường">
              <Text strong>{totalFields} trường</Text>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Thông tin dịch vụ */}
        {form.service_id && (
          <Card title="Dịch vụ liên quan" size="small">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Tên dịch vụ">
                <Text strong>{form.service_id.title}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả dịch vụ">
                <Paragraph className="mb-0">{form.service_id.description}</Paragraph>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}

        {/* Thông tin người tạo */}
        <Card title="Thông tin người tạo" size="small">
          <Descriptions column={2} size="small">
            <Descriptions.Item label="Người tạo">
              <Space>
                <UserOutlined className="text-gray-400" />
                <Text strong>{form.created_by.full_name}</Text>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              <Space>
                <CalendarOutlined className="text-gray-400" />
                <Text>{new Date(form.created_at).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</Text>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Cập nhật cuối">
              <Text>{new Date(form.updated_at).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</Text>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Cấu trúc form */}
        <Card title={`Cấu trúc Form (${form.sections.length} phần)`} size="small">
          <div className="space-y-4">
            {form.sections
              .sort((a, b) => a.order - b.order)
              .map((section, index) => (
                <div key={section.section_name} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Title level={5} className="mb-1">
                        {index + 1}. {section.section_label}
                      </Title>
                      {section.description && (
                        <Text type="secondary" className="text-sm">
                          {section.description}
                        </Text>
                      )}
                    </div>
                    <Tag color="blue">{section.fields.length} trường</Tag>
                  </div>
                  
                  <Divider className="my-3" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {section.fields
                      .sort((a, b) => a.order - b.order)
                      .map((field) => (
                        <div key={field.field_name} className="bg-white p-3 rounded border">
                          <div className="flex items-center justify-between mb-1">
                            <Text strong className="text-sm">{field.field_label}</Text>
                            <div className="flex items-center space-x-2">
                              <Tag color={field.is_required ? 'red' : 'default'}>
                                {field.is_required ? 'Bắt buộc' : 'Tùy chọn'}
                              </Tag>
                              <Tag color="geekblue">
                                {field.field_type}
                              </Tag>
                            </div>
                          </div>
                          {field.placeholder && (
                            <Text type="secondary" className="text-xs block">
                              Placeholder: {field.placeholder}
                            </Text>
                          )}
                          {field.help_text && (
                            <Text type="secondary" className="text-xs block">
                              Hướng dẫn: {field.help_text}
                            </Text>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </Modal>
  );
};

export default DynamicFormDetailModal; 