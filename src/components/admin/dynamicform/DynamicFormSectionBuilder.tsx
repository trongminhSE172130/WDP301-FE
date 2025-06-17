import React from 'react';
import { Form, Input, Button, Space, Card, Divider } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { FormSection, FormField } from '../../../types/dynamicForm';
import DynamicFormFieldBuilder from './DynamicFormFieldBuilder';

const { TextArea } = Input;

interface DynamicFormSectionBuilderProps {
  section: FormSection;
  onChange: (section: FormSection) => void;
}

const DynamicFormSectionBuilder: React.FC<DynamicFormSectionBuilderProps> = ({
  section,
  onChange,
}) => {
  const [form] = Form.useForm();

  const handleSectionChange = (field: string, value: string) => {
    const updatedSection = {
      ...section,
      [field]: value,
    };
    onChange(updatedSection);
  };

  const addField = () => {
    const newField: FormField = {
      field_name: `field_${section.fields.length + 1}`,
      field_label: `Trường ${section.fields.length + 1}`,
      field_type: 'text',
      is_required: false,
      validation_rules: {},
      placeholder: '',
      help_text: '',
      order: section.fields.length,
    };

    const updatedSection = {
      ...section,
      fields: [...section.fields, newField],
    };
    onChange(updatedSection);
  };

  const updateField = (fieldIndex: number, updatedField: FormField) => {
    const newFields = [...section.fields];
    newFields[fieldIndex] = updatedField;
    
    const updatedSection = {
      ...section,
      fields: newFields,
    };
    onChange(updatedSection);
  };

  const removeField = (fieldIndex: number) => {
    const newFields = section.fields.filter((_, index) => index !== fieldIndex);
    // Cập nhật lại order
    newFields.forEach((field, index) => {
      field.order = index;
    });

    const updatedSection = {
      ...section,
      fields: newFields,
    };
    onChange(updatedSection);
  };

  return (
    <div>
      {/* Section Information */}
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="Tên section (key)">
            <Input
              value={section.section_name}
              onChange={(e) => handleSectionChange('section_name', e.target.value)}
              placeholder="section_name"
            />
          </Form.Item>
          
          <Form.Item label="Nhãn hiển thị">
            <Input
              value={section.section_label}
              onChange={(e) => handleSectionChange('section_label', e.target.value)}
              placeholder="Phần thông tin cá nhân"
            />
          </Form.Item>
        </div>

        <Form.Item label="Mô tả section">
          <TextArea
            rows={2}
            value={section.description}
            onChange={(e) => handleSectionChange('description', e.target.value)}
            placeholder="Mô tả về section này"
          />
        </Form.Item>
      </Form>

      <Divider />

      {/* Fields */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-md font-medium">Các trường dữ liệu</h4>
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addField}
            size="small"
          >
            Thêm Field
          </Button>
        </div>

        {section.fields.length === 0 ? (
          <div className="text-center text-gray-500 py-4 border border-dashed border-gray-300 rounded">
            Chưa có field nào. Hãy thêm field đầu tiên!
          </div>
        ) : (
          <Space direction="vertical" className="w-full">
            {section.fields.map((field, fieldIndex) => (
              <Card
                key={fieldIndex}
                size="small"
                className="border border-gray-200"
                title={
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      {field.field_label || `Field ${fieldIndex + 1}`}
                      {field.is_required && <span className="text-red-500 ml-1">*</span>}
                    </span>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeField(fieldIndex)}
                      size="small"
                    />
                  </div>
                }
              >
                <DynamicFormFieldBuilder
                  field={field}
                  onChange={(updatedField) => updateField(fieldIndex, updatedField)}
                />
              </Card>
            ))}
          </Space>
        )}
      </div>
    </div>
  );
};

export default DynamicFormSectionBuilder; 