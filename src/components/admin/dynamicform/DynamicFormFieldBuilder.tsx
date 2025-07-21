import React, { useEffect } from 'react';
import { Form, Input, Select, Switch, InputNumber, Collapse, Space, Button, Tag, Alert } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import type { FormField } from '../../../types/dynamicForm';

const { Option } = Select;
const { Panel } = Collapse;
const { TextArea } = Input;

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

  // Kiểm tra và khởi tạo options khi thay đổi field type
  useEffect(() => {
    if (['select', 'radio', 'checkbox'].includes(field.field_type) && 
        (!field.validation_rules.options || field.validation_rules.options.length === 0)) {
      handleValidationChange('options', ['Tùy chọn 1', 'Tùy chọn 2']);
    }
    
    if (field.field_type === 'file' && 
        (!field.validation_rules.file_types || field.validation_rules.file_types.length === 0)) {
      handleValidationChange('file_types', ['.jpg', '.pdf']);
    }
  }, [field.field_type]);

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

  const needsOptions = ['select', 'radio', 'checkbox'].includes(field.field_type);
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

        {/* Hiển thị các trường nhập liệu tùy theo loại field */}
        {needsOptions && (
          <div className="mb-4 border-t border-gray-200 pt-3 mt-2">
            <Form.Item 
              label={
                <div className="flex items-center">
                  <span className="mr-2">Các tùy chọn</span>
                  <Tag color="blue">{field.field_type === 'select' ? 'Dropdown' : field.field_type === 'radio' ? 'Radio Button' : 'Checkbox'}</Tag>
                </div>
              } 
              className="mb-2"
            >
              <div className="space-y-2">
                {(field.validation_rules.options || []).length === 0 && (
                  <Alert message="Hãy thêm ít nhất một tùy chọn" type="warning" showIcon />
                )}
                
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
                      disabled={(field.validation_rules.options || []).length <= 1}
                    />
                  </Space>
                ))}
                
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={addOption}
                  size="small"
                  block
                >
                  Thêm tùy chọn
                </Button>
              </div>
            </Form.Item>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {!needsOptions && (
            <Form.Item label="Placeholder" className="mb-2">
              <Input
                value={field.placeholder}
                onChange={(e) => handleFieldChange('placeholder', e.target.value)}
                placeholder="Nhập placeholder..."
                size="small"
              />
            </Form.Item>
          )}
          
          <Form.Item label="Gợi ý (help text)" className={`mb-2 ${!needsOptions ? '' : 'col-span-2'}`}>
            <Input
              value={field.help_text}
              onChange={(e) => handleFieldChange('help_text', e.target.value)}
              placeholder="Gợi ý cho người dùng..."
              size="small"
            />
          </Form.Item>
        </div>

        {/* File types cho field loại file */}
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

        {/* Validation Rules */}
        <Collapse size="small" className="mt-3">
          <Panel header="Quy tắc validation nâng cao" key="validation">
            <div className="space-y-3">
              {/* Pattern */}
              {!needsOptions && !needsFileTypes && (
                <Form.Item label="Pattern (Regex)" className="mb-2">
                  <Input
                    value={field.validation_rules.pattern}
                    onChange={(e) => handleValidationChange('pattern', e.target.value)}
                    placeholder="^[a-zA-Z0-9]+$"
                    size="small"
                  />
                </Form.Item>
              )}

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
            </div>
          </Panel>
        </Collapse>

        {/* Field Preview */}
        <div className="mt-3 p-3 bg-gray-50 rounded border">
          <div className="text-xs text-gray-600 mb-1">Preview:</div>
          <div className="text-sm">
            <strong>{field.field_label || 'Chưa có nhãn'}</strong>
            {field.is_required && <span className="text-red-500 ml-1">*</span>}
            
            <div className="mt-1">
              {field.field_type === 'text' && (
                <Input placeholder={field.placeholder || 'Nhập văn bản...'} size="small" disabled />
              )}
              
              {field.field_type === 'textarea' && (
                <TextArea placeholder={field.placeholder || 'Nhập văn bản dài...'} size="small" rows={2} disabled />
              )}
              
              {field.field_type === 'number' && (
                <InputNumber placeholder={field.placeholder || '0'} size="small" disabled style={{ width: '100%' }} />
              )}
              
              {field.field_type === 'date' && (
                <Input placeholder="DD/MM/YYYY" size="small" disabled />
              )}
              
              {field.field_type === 'select' && (
                <Select size="small" placeholder={field.placeholder || 'Chọn...'} disabled style={{ width: '100%' }}>
                  {(field.validation_rules.options || []).map((option, i) => (
                    <Option key={i} value={option}>{option}</Option>
                  ))}
                </Select>
              )}
              
              {field.field_type === 'radio' && (
                <div className="space-y-1">
                  {(field.validation_rules.options || []).map((option, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-4 h-4 rounded-full border border-gray-300 mr-2"></div>
                      <span className="text-sm text-gray-500">{option}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {field.field_type === 'checkbox' && (
                <div className="space-y-1">
                  {(field.validation_rules.options || []).map((option, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-4 h-4 border border-gray-300 mr-2"></div>
                      <span className="text-sm text-gray-500">{option}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {field.field_type === 'file' && (
                <div>
                  <Button size="small" disabled>Chọn file</Button>
                  <div className="text-xs text-gray-400 mt-1">
                    Loại file: {(field.validation_rules.file_types || []).join(', ')}
                  </div>
                </div>
              )}
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