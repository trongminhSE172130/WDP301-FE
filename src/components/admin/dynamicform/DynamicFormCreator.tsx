import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message, Steps, Card, Space, Divider, Alert } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined, EditOutlined } from '@ant-design/icons';
import type { FormSection, Service, DynamicFormCreate } from '../../../types/dynamicForm';
import type { DynamicForm } from '../../../types/dynamicForm';
import { createDynamicForm, getAvailableServices, updateDynamicForm, getExistingFormsForService } from '../../../service/api/dynamicformAPI';
import DynamicFormSectionBuilder from './DynamicFormSectionBuilder';

const { TextArea } = Input;
const { Option } = Select;

interface DynamicFormCreatorProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editForm?: DynamicForm | null;
  mode?: 'create' | 'edit';
}

const FORM_TYPES = [
  { value: 'booking_form', label: 'Form đặt lịch' },
  { value: 'result_form', label: 'Form kết quả' },
];

const DynamicFormCreator: React.FC<DynamicFormCreatorProps> = ({
  visible,
  onCancel,
  onSuccess,
  editForm,
  mode = 'create',
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [sections, setSections] = useState<FormSection[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  
  // State để lưu form data giữa các steps
  const [formBasicData, setFormBasicData] = useState<{
    service_id?: string;
    form_type?: string;
    form_name?: string;
    form_description?: string;
  }>({});
  
  // State cho validation
  const [existingForms, setExistingForms] = useState<{ booking_form?: DynamicForm; result_form?: DynamicForm }>({});
  const [validationMessage, setValidationMessage] = useState<string>('');

  const isEditMode = mode === 'edit' && editForm;

  useEffect(() => {
    if (visible) {
      loadServices();
      
      if (isEditMode && editForm) {
        // Load data cho edit mode
        const basicData = {
          service_id: typeof editForm.service_id === 'object' ? editForm.service_id?._id : editForm.service_id,
          form_type: editForm.form_type,
          form_name: editForm.form_name,
          form_description: editForm.form_description,
        };
        
        form.setFieldsValue(basicData);
        setFormBasicData(basicData);
        setSections(editForm.sections || []);
        
        // Load existing forms cho service đã chọn
        if (basicData.service_id) {
          handleServiceChange(basicData.service_id);
        }
        

      } else {
        // Reset form khi tạo mới
      form.resetFields();
      setSections([]);
        setFormBasicData({});
        setExistingForms({});
        setValidationMessage('');
      }
      
      setCurrentStep(0);
    }
  }, [visible, form, isEditMode, editForm]);

  const loadServices = async () => {
    try {
      const response = await getAvailableServices();
      if (response.success) {
        setServices(response.data);
      } else {
        message.error('Không thể tải danh sách dịch vụ');
      }
    } catch (error) {
      console.error('Error loading services:', error);
      message.error('Không thể tải danh sách dịch vụ');
    }
  };

  const addSection = () => {
    const newSection: FormSection = {
      section_name: `section_${sections.length + 1}`,
      section_label: `Phần ${sections.length + 1}`,
      description: '',
      order: sections.length,
      fields: [],
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (index: number, updatedSection: FormSection) => {
    const newSections = [...sections];
    newSections[index] = updatedSection;
    setSections(newSections);
  };

  const removeSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    // Cập nhật lại order
    newSections.forEach((section, i) => {
      section.order = i;
    });
    setSections(newSections);
  };

  // Kiểm tra form đã tồn tại khi thay đổi service
  const handleServiceChange = async (serviceId: string) => {
    try {
      const response = await getExistingFormsForService(serviceId);
      
      if (response.success) {
        setExistingForms(response.data);
        
        // Tạo thông báo validation
        const existing = response.data;
        const existingTypes = [];
        const existingDetails = [];
        
        if (existing.booking_form) {
          existingTypes.push('Form đặt lịch');
          existingDetails.push(`• Form đặt lịch: "${existing.booking_form.form_name}"`);
        }
        if (existing.result_form) {
          existingTypes.push('Form kết quả');
          existingDetails.push(`• Form kết quả: "${existing.result_form.form_name}"`);
        }
        
        if (existingTypes.length > 0) {
          setValidationMessage(`Dịch vụ này đã có ${existingTypes.length}/2 loại form:\n${existingDetails.join('\n')}`);
        } else {
          setValidationMessage('Dịch vụ này chưa có form nào. Bạn có thể tạo Form đặt lịch hoặc Form kết quả.');
        }
      } else {
        console.warn('API returned success: false');
        setExistingForms({});
        setValidationMessage('Không thể kiểm tra forms đã tồn tại.');
      }
    } catch (error) {
      console.error('Error checking existing forms:', error);
      setExistingForms({});
      setValidationMessage('Lỗi khi kiểm tra forms đã tồn tại.');
    }
  };

  // Lấy danh sách form types có thể tạo
  const getAvailableFormTypes = () => {
    if (!existingForms) return FORM_TYPES;
    
    return FORM_TYPES.filter(formType => {
      if (isEditMode && editForm?.form_type === formType.value) {
        // Cho phép giữ nguyên form type hiện tại khi edit
        return true;
      }
      
      // Chỉ hiển thị form types chưa tồn tại
      if (formType.value === 'booking_form' && existingForms.booking_form) return false;
      if (formType.value === 'result_form' && existingForms.result_form) return false;
      
      return true;
    });
  };

  const handleNext = () => {
    if (currentStep === 0) {
      form.validateFields(['service_id', 'form_type', 'form_name', 'form_description'])
        .then((values) => {
          // Lưu form data vào state
          setFormBasicData(values);
          setCurrentStep(1);
        })
        .catch(() => {
          message.error('Vui lòng điền đầy đủ thông tin bước 1');
        });
    }
  };

  const handlePrev = () => {
    // Restore form values khi quay lại step 1
    if (formBasicData.service_id) {
      form.setFieldsValue(formBasicData);
    }
    setCurrentStep(0);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Sử dụng data từ state thay vì validate form lại
      const basicData = formBasicData.service_id ? formBasicData : await form.validateFields();

      // Kiểm tra service_id có trong danh sách services không
      const selectedService = services.find(s => s._id === basicData.service_id);

      // Validation bổ sung
      if (!basicData.service_id) {
        message.error('Vui lòng chọn dịch vụ');
        return;
      }

      if (!selectedService) {
        message.error('Dịch vụ đã chọn không hợp lệ. Vui lòng chọn lại.');
        return;
      }

      // Validation form type đã tồn tại (chỉ khi tạo mới hoặc edit mà thay đổi form_type)
      if (!isEditMode || (isEditMode && editForm?.form_type !== basicData.form_type)) {
        if (basicData.form_type === 'booking_form' && existingForms.booking_form) {
          message.error('Dịch vụ này đã có Form đặt lịch. Mỗi dịch vụ chỉ được có 1 Form đặt lịch và 1 Form kết quả.');
          return;
        }
        if (basicData.form_type === 'result_form' && existingForms.result_form) {
          message.error('Dịch vụ này đã có Form kết quả. Mỗi dịch vụ chỉ được có 1 Form đặt lịch và 1 Form kết quả.');
          return;
        }
      }

      // Validate sections
      if (sections.length === 0) {
        message.error('Vui lòng thêm ít nhất một phần (section)');
        return;
      }

      // Kiểm tra mỗi section phải có ít nhất 1 field
      for (const section of sections) {
        if (section.fields.length === 0) {
          message.error(`Phần "${section.section_label}" phải có ít nhất một trường dữ liệu`);
          return;
        }
      }

      // Tạo form data
      const formData: DynamicFormCreate = {
        service_id: basicData.service_id,
        form_type: basicData.form_type,
        form_name: basicData.form_name,
        form_description: basicData.form_description,
        sections: sections,
      };



      // Gọi API tương ứng với mode
      let response;
      if (isEditMode && editForm?._id) {
        // Tạo update data với cấu trúc phù hợp cho PUT API
        const updateData = {
          service_id: basicData.service_id,
          form_type: basicData.form_type,
          form_name: basicData.form_name,
          form_description: basicData.form_description,
          sections: sections,
        };
        
        response = await updateDynamicForm(editForm._id, updateData);
        if (response.success) {
          message.success('Cập nhật form schema thành công!');
          onSuccess();
        } else {
          throw new Error('Cập nhật form thất bại');
        }
      } else {
        response = await createDynamicForm(formData);
      if (response.success) {
        message.success('Tạo form schema thành công!');
        onSuccess();
      } else {
        throw new Error('Tạo form thất bại');
        }
      }
    } catch (error) {
      // Kiểm tra nếu là axios error
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; statusText?: string; data?: { message?: string; error?: string } }; config?: unknown };
        
        // Hiển thị error message từ server nếu có
        const serverMessage = axiosError.response?.data?.message || axiosError.response?.data?.error;
        if (serverMessage) {
          message.error(`Lỗi từ server: ${serverMessage}`);
        } else {
          message.error(`Lỗi HTTP ${axiosError.response?.status}: ${axiosError.response?.statusText}`);
        }
      } else {
      message.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo form');
      }
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: 'Thông tin cơ bản',
      content: (
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="service_id"
            label="Dịch vụ"
            rules={[{ required: true, message: 'Vui lòng chọn dịch vụ' }]}
          >
            <Select 
              placeholder="Chọn dịch vụ" 
              loading={services.length === 0}
              onChange={handleServiceChange}
            >
              {services.map(service => (
                <Option key={service._id} value={service._id}>
                  {service.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {validationMessage && (
            <Alert
              message={
                <div style={{ whiteSpace: 'pre-line' }}>
                  {validationMessage}
                </div>
              }
              type="info"
              showIcon
              className="mb-4"
            />
          )}

          <Form.Item
            name="form_type"
            label="Loại form"
            rules={[{ required: true, message: 'Vui lòng chọn loại form' }]}
          >
            <Select 
              placeholder={
                getAvailableFormTypes().length === 0 
                  ? "Dịch vụ này đã có đủ 2 loại form" 
                  : "Chọn loại form"
              }
              disabled={getAvailableFormTypes().length === 0}
            >
              {getAvailableFormTypes().map(type => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="form_name"
            label="Tên form"
            rules={[{ required: true, message: 'Vui lòng nhập tên form' }]}
          >
            <Input placeholder="Nhập tên form" />
          </Form.Item>

          <Form.Item
            name="form_description"
            label="Mô tả form"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả form' }]}
          >
            <TextArea rows={4} placeholder="Nhập mô tả form" />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Xây dựng sections',
      content: (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Sections & Fields</h3>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={addSection}
            >
              Thêm Section
            </Button>
          </div>

          {sections.length === 0 ? (
            <Card className="text-center">
              <p className="text-gray-500">Chưa có section nào. Hãy thêm section đầu tiên!</p>
            </Card>
          ) : (
            sections.map((section, index) => (
              <Card
                key={index}
                className="mb-4"
                title={
                  <div className="flex justify-between items-center">
                    <span>{section.section_label || `Section ${index + 1}`}</span>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeSection(index)}
                      size="small"
                    />
                  </div>
                }
              >
                <DynamicFormSectionBuilder
                  section={section}
                  onChange={(updatedSection) => updateSection(index, updatedSection)}
                />
              </Card>
            ))
          )}
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={isEditMode ? 'Chỉnh sửa Form Schema' : 'Tạo Form Schema Mới'}
      open={visible}
      onCancel={onCancel}
      width={900}
      footer={null}
      destroyOnClose
    >
      <Steps current={currentStep} className="mb-6">
        {steps.map(step => (
          <Steps.Step key={step.title} title={step.title} />
        ))}
      </Steps>

      <div className="min-h-[400px]">
        {steps[currentStep].content}
      </div>

      <Divider />

      <div className="flex justify-between">
        <div>
          {currentStep > 0 && (
            <Button onClick={handlePrev}>
              Quay lại
            </Button>
          )}
        </div>
        
        <Space>
          <Button onClick={onCancel}>
            Hủy
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button type="primary" onClick={handleNext}>
              Tiếp tục
            </Button>
          ) : (
            <Button
              type="primary"
              icon={isEditMode ? <EditOutlined /> : <SaveOutlined />}
              onClick={handleSubmit}
              loading={loading}
            >
              {isEditMode ? 'Cập nhật Form Schema' : 'Tạo Form Schema'}
            </Button>
          )}
        </Space>
      </div>
    </Modal>
  );
};

export default DynamicFormCreator; 