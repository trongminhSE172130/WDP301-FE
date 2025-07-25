import React from 'react';
import { Modal, Descriptions, Tag, Divider, Card, Typography, Space, Select } from 'antd';
import { FormOutlined, UserOutlined, TagOutlined, CalendarOutlined } from '@ant-design/icons';
import type { DynamicForm } from '../../../types/dynamicForm';
// import type { Creator } from '../../../types/dynamicForm';

// Mở rộng interface DynamicForm để bao gồm trường created_by
// interface ExtendedDynamicForm extends DynamicForm {
//   created_by?: Creator;
// }

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
  
  // Kiểm tra kiểu dữ liệu của service_id
  const serviceTitle = typeof form.service_id === 'object' && form.service_id !== null 
    ? form.service_id.title 
    : 'Không có thông tin';
    
  const serviceDescription = typeof form.service_id === 'object' && form.service_id !== null 
    ? form.service_id.description 
    : '';
    
  // Kiểm tra nếu có thông tin người tạo
  // const hasCreatorInfo = form.created_by && typeof form.created_by === 'object' && form.created_by.full_name;

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
        {form.service_id && typeof form.service_id === 'object' && (
          <Card title="Dịch vụ liên quan" size="small">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Tên dịch vụ">
                <Text strong>{serviceTitle}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả dịch vụ">
                <Paragraph className="mb-0">{serviceDescription}</Paragraph>
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
                {/* <Text strong>{hasCreatorInfo && form.created_by ? form.created_by.full_name : 'Không xác định'}</Text> */}
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
                                {field.field_type === 'select' ? 'Dropdown' : 
                                 field.field_type === 'radio' ? 'Radio Button' : 
                                 field.field_type === 'checkbox' ? 'Checkbox' : 
                                 field.field_type === 'textarea' ? 'Văn bản dài' : 
                                 field.field_type === 'date' ? 'Ngày tháng' : 
                                 field.field_type === 'file' ? 'Tệp tin' : 
                                 field.field_type}
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
                          
                          {/* Hiển thị các tùy chọn cho select, radio, checkbox */}
                          {['select', 'radio', 'checkbox'].includes(field.field_type) && field.validation_rules.options && field.validation_rules.options.length > 0 && (
                            <div className="mt-2 border-t pt-2">
                              <Text type="secondary" className="text-xs block font-medium">
                                Các tùy chọn:
                              </Text>
                              <div className="mt-1 max-h-32 overflow-y-auto">
                                {field.field_type === 'select' && (
                                  <Select 
                                    size="small" 
                                    style={{ width: '100%' }} 
                                    placeholder="Chọn..." 
                                    disabled
                                    options={field.validation_rules.options.map(opt => ({ label: opt, value: opt }))}
                                  />
                                )}
                                
                                {field.field_type === 'radio' && (
                                  <div className="space-y-1">
                                    {field.validation_rules.options.map((option, i) => (
                                      <div key={i} className="flex items-center">
                                        <div className="w-3 h-3 rounded-full border border-gray-300 mr-2"></div>
                                        <Text className="text-xs text-gray-600">{option}</Text>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {field.field_type === 'checkbox' && (
                                  <div className="space-y-1">
                                    {field.validation_rules.options.map((option, i) => (
                                      <div key={i} className="flex items-center">
                                        <div className="w-3 h-3 border border-gray-300 mr-2"></div>
                                        <Text className="text-xs text-gray-600">{option}</Text>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Hiển thị các loại file được phép */}
                          {field.field_type === 'file' && field.validation_rules.file_types && field.validation_rules.file_types.length > 0 && (
                            <div className="mt-2">
                              <Text type="secondary" className="text-xs block">
                                Loại file: {field.validation_rules.file_types.join(', ')}
                              </Text>
                            </div>
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