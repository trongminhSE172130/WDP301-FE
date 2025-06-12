import React, { useState } from 'react';
import { Form, Card, Button, Steps, Divider, Typography } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import DynamicFormField from './DynamicFormField';
import type { DynamicForm, FormSubmissionData } from '../../../types/dynamicForm';

const { Title, Paragraph } = Typography;

interface DynamicFormRendererProps {
  form: DynamicForm;
  onSubmit: (data: FormSubmissionData) => void;
  loading?: boolean;
}

const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({
  form,
  onSubmit,
  loading = false
}) => {
  const [formData, setFormData] = useState<FormSubmissionData>({});
  const [antdForm] = Form.useForm();

  const handleFieldChange = (fieldName: string, value: string | number | boolean | string[] | File | null) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = async (values: FormSubmissionData) => {
    // Combine antd form values with our tracked data
    const finalData = { ...formData, ...values };
    onSubmit(finalData);
  };

  // Sort sections by order
  const sortedSections = [...form.sections].sort((a, b) => a.order - b.order);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Form Header */}
      <div className="mb-8">
        <Title level={2} className="text-blue-600 mb-2">
          {form.form_name}
        </Title>
        <Paragraph className="text-gray-600 text-lg">
          {form.form_description}
        </Paragraph>
        
        {form.service_id && (
          <Card size="small" className="mt-4 bg-blue-50 border-blue-200">
            <div>
              <strong className="text-blue-700">Dịch vụ:</strong> {form.service_id.title}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {form.service_id.description}
            </div>
          </Card>
        )}
      </div>

      {/* Progress Steps */}
      {sortedSections.length > 1 && (
        <div className="mb-8">
          <Steps
            size="small"
            current={0}
            items={sortedSections.map((section) => ({
              title: section.section_label,
              description: section.description
            }))}
          />
        </div>
      )}

      {/* Form */}
      <Form
        form={antdForm}
        layout="vertical"
        onFinish={handleSubmit}
        scrollToFirstError
        size="large"
      >
        {sortedSections.map((section, sectionIndex) => (
          <Card 
            key={section.section_name}
            className="mb-6 shadow-md"
            title={
              <div>
                <Title level={4} className="text-gray-800 mb-1">
                  {section.section_label}
                </Title>
                {section.description && (
                  <Paragraph className="text-gray-600 text-sm mb-0">
                    {section.description}
                  </Paragraph>
                )}
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.fields
                .sort((a, b) => a.order - b.order)
                .map((field) => (
                  <div 
                    key={field.field_name}
                    className={
                      field.field_type === 'textarea' || 
                      field.field_type === 'checkbox' ||
                      field.validation_rules.options?.length && field.validation_rules.options.length > 3
                        ? 'md:col-span-2' 
                        : 'md:col-span-1'
                    }
                  >
                    <DynamicFormField
                      field={field}
                      value={formData[field.field_name]}
                      onChange={handleFieldChange}
                      formData={formData}
                    />
                  </div>
                ))}
            </div>

            {sectionIndex < sortedSections.length - 1 && (
              <Divider className="mt-6 mb-0" />
            )}
          </Card>
        ))}

        {/* Submit Button */}
        <Card className="text-center shadow-md">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            icon={<SendOutlined />}
            className="px-8 h-12 text-lg font-medium"
          >
            Gửi thông tin đăng ký
          </Button>
          
          <div className="mt-4 text-sm text-gray-500">
            Vui lòng kiểm tra kỹ thông tin trước khi gửi
          </div>
        </Card>
      </Form>

      {/* Form Info */}
      <div className="mt-8 text-center text-sm text-gray-400">
        <div>Được tạo bởi: {form.created_by.full_name}</div>
        <div>Cập nhật lần cuối: {new Date(form.updated_at).toLocaleDateString('vi-VN')}</div>
      </div>
    </div>
  );
};

export default DynamicFormRenderer; 