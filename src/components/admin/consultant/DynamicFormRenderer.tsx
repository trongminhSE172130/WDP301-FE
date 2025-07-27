import React from 'react';
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
        if (field.field_type === 'date' && typeof result[field.field_name] === 'string' && result[field.field_name]) {
          // Kiểm tra xem string có hợp lệ không trước khi convert
          const dateStr = result[field.field_name];
          const parsed = dayjs(dateStr, ['YYYY-MM-DD', 'DD/MM/YYYY'], true);
          if (parsed.isValid()) {
            result[field.field_name] = parsed;
          } else {
            // Nếu không parse được, set về null thay vì dayjs object không hợp lệ
            result[field.field_name] = null;
          }
        }
      });
    });
  }
  return result;
}

// Style button mềm mại, gradient, bo góc
const primaryButtonStyle: React.CSSProperties = {
  borderRadius: 20,
  fontWeight: 600,
  padding: '0 32px',
  height: 44,
  background: 'linear-gradient(90deg, #36cfc9 0%, #08979c 100%)',
  border: 'none',
  boxShadow: '0 2px 12px rgba(8,151,156,0.10)',
  transition: 'all 0.2s',
};
const secondaryButtonStyle: React.CSSProperties = {
  borderRadius: 20,
  fontWeight: 500,
  padding: '0 28px',
  height: 44,
  background: '#fff',
  border: '1.5px solid #b5f5ec',
  color: '#08979c',
  boxShadow: '0 2px 8px rgba(8,151,156,0.06)',
  transition: 'all 0.2s',
};

const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({
  form,
  initialValues = {},
  onSubmit,
  onBack
}) => {
  console.log('initialValues trong DynamicFormRenderer:', initialValues);
  const [formInstance] = Form.useForm();

  const handleFinish = (values: any) => {
    // Convert dayjs objects về string cho date fields
    const processedValues = { ...values };
    if (form && form.sections) {
      form.sections.forEach((section: any) => {
        section.fields.forEach((field: any) => {
          if (field.field_type === 'date' && dayjs.isDayjs(processedValues[field.field_name])) {
            processedValues[field.field_name] = processedValues[field.field_name].format('YYYY-MM-DD');
          }
        });
      });
    }
    
    console.log('Form submitted with values:', processedValues);
    onSubmit(processedValues);
  };

  // Log mỗi khi có thay đổi trong form
  const handleValuesChange = (changedValues: any, allValues: any) => {
    console.log('Form field changed:', changedValues);
    console.log('All form values:', allValues);
  };

  return (
    <Form
      form={formInstance}
      layout="vertical"
      initialValues={convertInitialValues(form, initialValues)}
      onFinish={handleFinish}
      onValuesChange={handleValuesChange}
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
        <Button
          onClick={onBack}
          style={secondaryButtonStyle}
          onMouseOver={e => (e.currentTarget.style.background = '#e6fffb')}
          onMouseOut={e => (e.currentTarget.style.background = '#fff')}
        >
          Quay lại
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          
          style={primaryButtonStyle}
          onMouseOver={e => (e.currentTarget.style.background = '#13c2c2')}
          onMouseOut={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #36cfc9 0%, #08979c 100%)')}
        >
          Lưu và tiếp tục
        </Button>
      </div>
    </Form>
  );
};

export default DynamicFormRenderer; 