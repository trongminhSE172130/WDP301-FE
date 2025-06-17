import React from 'react';
import { Form, Input, Select, Switch, InputNumber, Collapse, Space, Button, Tag } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import type { FormField } from '../../../types/dynamicForm';

const { Option } = Select;
const { Panel } = Collapse;

interface DynamicFormFieldBuilderProps {
  field: FormField;
  onChange: (field: FormField) => void;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text (Văn bản)' },
  { value: 'textarea', label: 'Textarea (Văn bản dài)' },
  { value: 'number', label: 'Number (Số)' },
  { value: 'date', label: 'Date (Ngày tháng)' },
  { value: 'select', label: 'Select (Chọn từ danh sách)' },
  { value: 'radio', label: 'Radio (Chọn 1 trong nhiều)' },
  { value: 'checkbox', label: 'Checkbox (Đánh dấu)' },
  { value: 'file', label: 'File (Tệp tin)' },
];

const DynamicFormFieldBuilder: React.FC<DynamicFormFieldBuilderProps> = ({
  field,
  onChange,
}) => {
  const [form] = Form.useForm();

  const handleFieldChange = (fieldName: string, value: string | boolean | number) => {
    const updatedField = {
      ...field,
      [fieldName]: value,
    };
    onChange(updatedField);
  };

  const handleValidationChange = (ruleName: string, value: string | number | string[] | undefined | null) => {
    const updatedField = {
      ...field,
      validation_rules: {
        ...field.validation_rules,
        [ruleName]: value,
      },
    };
    onChange(updatedField);
  };

  const addOption = () => {
    const currentOptions = field.validation_rules.options || [];
    const newOptions = [...currentOptions, `Tùy chọn ${currentOptions.length + 1}`];
    handleValidationChange('options', newOptions);
  };

  const updateOption = (index: number, value: string) => {
    const currentOptions = field.validation_rules.options || [];
    const newOptions = [...currentOptions];
    newOptions[index] = value;
    handleValidationChange('options', newOptions);
  };

  const removeOption = (index: number) => {
    const currentOptions = field.validation_rules.options || [];
    const newOptions = currentOptions.filter((_, i) => i !== index);
    handleValidationChange('options', newOptions);
  };

  const needsOptions = ['select', 'radio'].includes(field.field_type);
  const needsFileTypes = field.field_type === 'file';
  const needsLength = ['text', 'textarea'].includes(field.field_type);
  const needsMinMax = ['number'].includes(field.field_type);

  return (
    <div>
      <Form form={form} layout="vertical" size="small">
        {/* Basic Field Info */}
        <div className="grid grid-cols-2 gap-3">
          <Form.Item label="Tên field (key)" className="mb-2">
            <Input
              value={field.field_name}
              onChange={(e) => handleFieldChange('field_name', e.target.value)}
              placeholder="field_name"
              size="small"
            />
          </Form.Item>
          
          <Form.Item label="Nhãn hiển thị" className="mb-2">
            <Input
              value={field.field_label}
              onChange={(e) => handleFieldChange('field_label', e.target.value)}
              placeholder="Họ và tên"
              size="small"
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Form.Item label="Loại field" className="mb-2">
            <Select
              value={field.field_type}
              onChange={(value) => handleFieldChange('field_type', value)}
              size="small"
            >
              {FIELD_TYPES.map(type => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item label="Bắt buộc" className="mb-2">
            <Switch
              checked={field.is_required}
              onChange={(checked) => handleFieldChange('is_required', checked)}
              size="small"
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Form.Item label="Placeholder" className="mb-2">
            <Input
              value={field.placeholder}
              onChange={(e) => handleFieldChange('placeholder', e.target.value)}
              placeholder="Nhập placeholder..."
              size="small"
            />
          </Form.Item>
          
          <Form.Item label="Gợi ý (help text)" className="mb-2">
            <Input
              value={field.help_text}
              onChange={(e) => handleFieldChange('help_text', e.target.value)}
              placeholder="Gợi ý cho người dùng..."
              size="small"
            />
          </Form.Item>
        </div>

        {/* Validation Rules */}
        <Collapse size="small" className="mt-3">
          <Panel header="Quy tắc validation" key="validation">
            <div className="space-y-3">
              {/* Pattern */}
              <Form.Item label="Pattern (Regex)" className="mb-2">
                <Input
                  value={field.validation_rules.pattern}
                  onChange={(e) => handleValidationChange('pattern', e.target.value)}
                  placeholder="^[a-zA-Z0-9]+$"
                  size="small"
                />
              </Form.Item>

              {/* Length validation for text fields */}
              {needsLength && (
                <div className="grid grid-cols-2 gap-3">
                  <Form.Item label="Độ dài tối thiểu" className="mb-2">
                    <InputNumber
                      value={field.validation_rules.min_length}
                      onChange={(value) => handleValidationChange('min_length', value)}
                      min={0}
                      size="small"
                      className="w-full"
                    />
                  </Form.Item>
                  
                  <Form.Item label="Độ dài tối đa" className="mb-2">
                    <InputNumber
                      value={field.validation_rules.max_length}
                      onChange={(value) => handleValidationChange('max_length', value)}
                      min={0}
                      size="small"
                      className="w-full"
                    />
                  </Form.Item>
                </div>
              )}

              {/* Min/Max for number fields */}
              {needsMinMax && (
                <div className="grid grid-cols-2 gap-3">
                  <Form.Item label="Giá trị tối thiểu" className="mb-2">
                    <InputNumber
                      value={field.validation_rules.min}
                      onChange={(value) => handleValidationChange('min', value)}
                      size="small"
                      className="w-full"
                    />
                  </Form.Item>
                  
                  <Form.Item label="Giá trị tối đa" className="mb-2">
                    <InputNumber
                      value={field.validation_rules.max}
                      onChange={(value) => handleValidationChange('max', value)}
                      size="small"
                      className="w-full"
                    />
                  </Form.Item>
                </div>
              )}

              {/* Options for select/radio */}
              {needsOptions && (
                <Form.Item label="Tùy chọn" className="mb-2">
                  <div className="space-y-2">
                    {(field.validation_rules.options || []).map((option, index) => (
                      <Space key={index} className="w-full">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Tùy chọn ${index + 1}`}
                          size="small"
                          style={{ flex: 1 }}
                        />
                        <Button
                          type="text"
                          danger
                          icon={<MinusOutlined />}
                          onClick={() => removeOption(index)}
                          size="small"
                        />
                      </Space>
                    ))}
                    
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={addOption}
                      size="small"
                    >
                      Thêm tùy chọn
                    </Button>
                  </div>
                </Form.Item>
              )}

              {/* File types for file fields */}
              {needsFileTypes && (
                <Form.Item label="Loại file cho phép" className="mb-2">
                  <Select
                    mode="tags"
                    value={field.validation_rules.file_types}
                    onChange={(value) => handleValidationChange('file_types', value)}
                    placeholder="Nhập loại file: .jpg, .png, .pdf..."
                    size="small"
                  >
                    <Option value=".jpg">JPG</Option>
                    <Option value=".png">PNG</Option>
                    <Option value=".pdf">PDF</Option>
                    <Option value=".doc">DOC</Option>
                    <Option value=".docx">DOCX</Option>
                  </Select>
                </Form.Item>
              )}
            </div>
          </Panel>
        </Collapse>

        {/* Field Preview */}
        <div className="mt-3 p-2 bg-gray-50 rounded border">
          <div className="text-xs text-gray-600 mb-1">Preview:</div>
          <div className="text-sm">
            <strong>{field.field_label}</strong>
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
                         <div className="text-xs text-gray-500 mt-1">
               Type: <Tag>{field.field_type}</Tag>
              {field.placeholder && `| Placeholder: "${field.placeholder}"`}
            </div>
            {field.help_text && (
              <div className="text-xs text-gray-400 mt-1">{field.help_text}</div>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
};

export default DynamicFormFieldBuilder; 