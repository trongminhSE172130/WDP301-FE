import React, { useState } from 'react';
import { Form, Button, Divider } from 'antd';
import DynamicFormFieldCST from './DynamicFormFieldCST';
import dayjs from 'dayjs';


interface DynamicFormRendererProps {
  form: any;
  initialValues?: any;
  onSubmit: (data: any) => void;
  onBack?: () => void;
}

// Convert các trường date từ string sang dayjs object cho initialValues
function convertInitialValues(form: any, initialValues: Record<string, any>) {
  const result: Record<string, any> = { ...initialValues };
  if (form && form.sections) {
    form.sections.forEach((section: any) => {
      section.fields.forEach((field: any) => {
        if (field.field_type === 'date' && typeof result[field.field_name] === 'string') {
          result[field.field_name] = dayjs(result[field.field_name]);
        }
      });
    });
  }
  return result;
}

const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({
  form,
  initialValues = {},
  onSubmit,
  onBack
}) => {
  console.log('initialValues trong DynamicFormRenderer:', initialValues);
  const [formInstance] = Form.useForm();

  const handleFinish = (values: any) => {
    onSubmit(values);
  };

  return (
    <Form
      form={formInstance}
      layout="vertical"
      initialValues={convertInitialValues(form, initialValues)}
      onFinish={handleFinish}
      style={{ marginTop: 16 }}
    >
      {form.sections.map((section: any) => (
        <div key={section.section_name} style={{ marginBottom: 24 }}>
          <Divider orientation="left">{section.section_label}</Divider>
          {section.fields.map((field: any) => (
            <DynamicFormFieldCST
              key={field.field_name}
              field={field}
              value={formInstance.getFieldValue(field.field_name)}
              onChange={(name, value) => formInstance.setFieldValue(name, value)}
              formData={formInstance.getFieldsValue()}
            />
          ))}
        </div>
      ))}
      <div style={{ textAlign: 'right' }}>
        {onBack && <Button style={{ marginRight: 8 }} onClick={onBack}>Quay lại</Button>}
        <Button type="primary" htmlType="submit">Lưu và tiếp tục</Button>
      </div>
    </Form>
  );
};

export default DynamicFormRenderer; 