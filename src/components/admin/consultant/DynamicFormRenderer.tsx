import React, { useState } from 'react';
import { Form, Button, Divider } from 'antd';
import DynamicFormField from '../dynamicform/DynamicFormField';

interface DynamicFormRendererProps {
  form: any;
  initialValues?: any;
  onSubmit: (data: any) => void;
  onBack?: () => void;
}

const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({ form, initialValues = {}, onSubmit, onBack }) => {
  const [formInstance] = Form.useForm();

  const handleFinish = (values: any) => {
    onSubmit(values);
  };

  return (
    <Form
      form={formInstance}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleFinish}
      style={{ marginTop: 16 }}
    >
      {form.sections.map((section: any) => (
        <div key={section.section_name} style={{ marginBottom: 24 }}>
          <Divider orientation="left">{section.section_label}</Divider>
          {section.fields.map((field: any) => (
            <DynamicFormField
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