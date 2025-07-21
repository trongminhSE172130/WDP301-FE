import React from 'react';
import { Input, Select, Radio, Checkbox, DatePicker, InputNumber, Upload, Form } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { FormField, FormSubmissionData } from '../../../types/dynamicForm';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

interface DynamicFormFieldProps {
  field: FormField;
  value?: string | number | boolean | string[] | File | null;
  onChange: (fieldName: string, value: string | number | boolean | string[] | File | null) => void;
  formData: FormSubmissionData;
}

const DynamicFormField: React.FC<DynamicFormFieldProps> = ({
  field,
  value,
  onChange,
  formData
}) => {
  // Kiểm tra conditional logic
  const shouldShowField = () => {
    if (!field.conditional_logic?.show_if) return true;
    
    const { field: conditionField, operator, value: conditionValue } = field.conditional_logic.show_if;
    const fieldValue = formData[conditionField];
    
    switch (operator) {
      case 'equals':
        return fieldValue === conditionValue;
      default:
        return true;
    }
  };

  if (!shouldShowField()) {
    return null;
  }

  const handleChange = (newValue: string | number | boolean | string[] | File | null) => {
    onChange(field.field_name, newValue);
  };

  const renderField = () => {
    switch (field.field_type) {
      case 'text':
        return (
          <Input
            placeholder={field.placeholder}
            maxLength={field.validation_rules.max_length}
            minLength={field.validation_rules.min_length}
            value={value as string}
            onChange={(e) => handleChange(e.target.value)}
          />
        );

      case 'textarea':
        return (
          <TextArea
            placeholder={field.placeholder}
            maxLength={field.validation_rules.max_length}
            rows={4}
            value={value as string}
            onChange={(e) => handleChange(e.target.value)}
          />
        );

      case 'number':
        return (
          <InputNumber
            placeholder={field.placeholder}
            min={field.validation_rules.min}
            max={field.validation_rules.max}
            style={{ width: '100%' }}
            value={value as number}
            onChange={(val) => handleChange(val)}
          />
        );

      case 'date':
        return (
          <DatePicker
            placeholder={field.placeholder}
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            value={value ? dayjs(value as string) : null}
            onChange={(date) => handleChange(date ? date.format('YYYY-MM-DD') : null)}
          />
        );

      case 'select':
        return (
          <Select
            placeholder={field.placeholder}
            style={{ width: '100%' }}
            value={value as string}
            onChange={(val) => handleChange(val)}
          >
            {field.validation_rules.options?.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        );

      case 'radio':
        return (
          <Radio.Group
            value={value as string}
            onChange={(e) => handleChange(e.target.value)}
          >
            {field.validation_rules.options?.map((option) => (
              <Radio key={option} value={option} style={{ display: 'block', marginBottom: 8 }}>
                {option}
              </Radio>
            ))}
          </Radio.Group>
        );

      case 'checkbox':
        return (
          <Checkbox.Group
            options={field.validation_rules.options}
            value={value as string[]}
            onChange={(checkedValues) => handleChange(checkedValues)}
          />
        );

      case 'file':
        return (
          <Upload
            beforeUpload={() => false} // Prevent auto upload
            onChange={(info) => {
              const file = info.fileList[0]?.originFileObj;
              handleChange(file || null);
            }}
          >
            <button type="button" className="ant-btn">
              <UploadOutlined /> Chọn file
            </button>
          </Upload>
        );

      default:
        return (
          <Input
            placeholder={field.placeholder}
            value={value as string}
            onChange={(e) => handleChange(e.target.value)}
          />
        );
    }
  };

  const rules: any[] = [
    {
      required: field.is_required,
      message: `Vui lòng nhập ${field.field_label.toLowerCase()}`
    }
  ];

  if (field.validation_rules.pattern) {
    rules.push({
      pattern: new RegExp(field.validation_rules.pattern),
      message: 'Định dạng không hợp lệ'
    });
  }

  if (field.validation_rules.min_length) {
    rules.push({
      min: field.validation_rules.min_length,
      message: `Tối thiểu ${field.validation_rules.min_length} ký tự`
    });
  }

  if (field.validation_rules.max_length) {
    rules.push({
      max: field.validation_rules.max_length,
      message: `Tối đa ${field.validation_rules.max_length} ký tự`
    });
  }

  return (
    <Form.Item
      label={field.field_label}
      name={field.field_name}
      rules={rules}
      help={field.help_text}
      required={field.is_required}
    >
      {renderField()}
    </Form.Item>
  );
};

export default DynamicFormField; 