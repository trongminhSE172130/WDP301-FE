import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message, Steps, Card, Space, Alert, Switch, Tag } from 'antd';
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
  const [isActive, setIsActive] = useState(true);
  
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
        setIsActive(editForm.is_active);
        
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
        setIsActive(true);
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
      order: sections.length + 1,
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
    // Xác nhận trước khi xóa
    if (sections[index].fields.length > 0) {
      if (!window.confirm(`Xóa phần "${sections[index].section_label}" sẽ xóa cả ${sections[index].fields.length} trường dữ liệu. Bạn có chắc chắn?`)) {
        return;
      }
    }
    
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
  };

  const handleServiceChange = async (serviceId: string) => {
    try {
      // Kiểm tra các form đã tồn tại cho service này
      const response = await getExistingFormsForService(serviceId);
      if (response.success) {
        setExistingForms(response.data);
        
        // Tạo thông báo cho người dùng
        let message = '';
        if (response.data.booking_form && response.data.result_form) {
          message = 'Dịch vụ này đã có cả Đơn đặt lịch và Đơn kết quả.\nMỗi dịch vụ chỉ được có 1 Đơn đặt lịch và 1 Form kết quả.';
        } else if (response.data.booking_form) {
          message = 'Dịch vụ này đã có Đơn đặt lịch.\nBạn chỉ có thể tạo thêm Đơn kết quả.';
        } else if (response.data.result_form) {
          message = 'Dịch vụ này đã có Đơn kết quả.\nBạn chỉ có thể tạo thêm Đơn đặt lịch.';
        }
        
        setValidationMessage(message);
        
        // Nếu đang trong edit mode và form hiện tại là một trong các form đã tồn tại
        if (isEditMode && editForm) {
          if (editForm.form_type === 'booking_form' && response.data.booking_form?._id !== editForm._id) {
            setValidationMessage('Dịch vụ này đã có Đơn đặt lịch khác. Bạn không thể thay đổi loại Đơn.');
          } else if (editForm.form_type === 'result_form' && response.data.result_form?._id !== editForm._id) {
            setValidationMessage('Dịch vụ này đã có Đơn kết quả khác. Bạn không thể thay đổi loại Đơn.');
          }
        }
      }
    } catch (error) {
      console.error('Error checking existing forms:', error);
    }
  };

  const getAvailableFormTypes = () => {
    // Nếu đang edit, không cho phép thay đổi form_type
    if (isEditMode) {
      return FORM_TYPES.filter(type => type.value === editForm?.form_type);
    }
    
    // Nếu đang tạo mới, chỉ hiển thị các loại form chưa tồn tại
    const availableTypes = [...FORM_TYPES];
    if (existingForms.booking_form) {
      return availableTypes.filter(type => type.value !== 'booking_form');
    }
    if (existingForms.result_form) {
      return availableTypes.filter(type => type.value !== 'result_form');
    }
    return availableTypes;
  };

  const handleNext = () => {
    form.validateFields()
      .then(values => {
          setFormBasicData(values);
          setCurrentStep(1);
        })
      .catch(errorInfo => {
        console.log('Validate Failed:', errorInfo);
        });
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
          message.error('Dịch vụ này đã có Đơn đặt lịch. Mỗi dịch vụ chỉ được có 1 Đơn đặt lịch và 1 Đơn kết quả.');
          return;
        }
        if (basicData.form_type === 'result_form' && existingForms.result_form) {
          message.error('Dịch vụ này đã có Đơn kết quả. Mỗi dịch vụ chỉ được có 1 Đơn đặt lịch và 1 Đơn kết quả.');
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
          is_active: isActive
        };
        
        response = await updateDynamicForm(editForm._id, updateData);
        if (response.success) {
          message.success('Cập nhật đơn schema thành công!');
          onSuccess();
        } else if (response.data && typeof response.data === 'object' && 'error' in response.data && typeof response.data.error === 'string') {
          message.error(response.data.error);
        } else {
          throw new Error('Cập nhật đơn thất bại');
        }
      } else {
        response = await createDynamicForm(formData);
      if (response.success) {
        message.success('Tạo đơn schema thành công!');
        onSuccess();
        } else if (response.data && typeof response.data === 'object' && 'error' in response.data && typeof response.data.error === 'string') {
          message.error(response.data.error);
      } else {
        throw new Error('Tạo đơn thất bại');
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
      message.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo đơn');
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
            label="Loại đơn"
            rules={[{ required: true, message: 'Vui lòng chọn loại đơn' }]}
          >
            <Select 
              placeholder={
                getAvailableFormTypes().length === 0 
                  ? "Dịch vụ này đã có đủ 2 loại đơn" 
                  : "Chọn loại đơn"
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
            label="Tên đơn"
            rules={[{ required: true, message: 'Vui lòng nhập tên đơn' }]}
          >
            <Input placeholder="Nhập tên đơn" />
          </Form.Item>

          <Form.Item
            name="form_description"
            label="Mô tả đơn"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả đơn' }]}
          >
            <TextArea rows={4} placeholder="Nhập mô tả đơn" />
          </Form.Item>

          {isEditMode && (
            <Form.Item
              label={
                <div className="flex items-center">
                  <span className="mr-2">Trạng thái</span>
                  <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Hoạt động' : 'Không hoạt động'}
                  </Tag>
                </div>
              }
            >
              <div className="flex items-center">
                <Switch 
                  checked={isActive} 
                  onChange={(checked) => setIsActive(checked)} 
                  className="mr-2"
                />
                <span className="text-sm text-gray-500">
                  {isActive ? 'Form đang hoạt động và có thể sử dụng' : 'Form đang bị vô hiệu hóa và không thể sử dụng'}
                </span>
              </div>
            </Form.Item>
          )}
        </Form>
      ),
    },
    {
      title: 'Xây dựng các phần',
      content: (
        <div className="mt-4 pb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Phần và Trường dữ liệu</h3>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={addSection}
            >
              Thêm Phần
            </Button>
          </div>

          <div className="max-h-[calc(100vh-400px)] overflow-y-auto pr-1">
          {sections.length === 0 ? (
            <Card className="text-center">
              <p className="text-gray-500">Chưa có phần nào. Hãy thêm phần đầu tiên!</p>
            </Card>
          ) : (
            sections.map((section, index) => (
              <Card
                key={index}
                className="mb-4"
                title={
                  <div className="flex justify-between items-center">
                    <span>{section.section_label || `Phần ${index + 1}`}</span>
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
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={isEditMode ? 'Chỉnh sửa Đơn' : 'Tạo Đơn Mới'}
      open={visible}
      onCancel={onCancel}
      width={900}
      footer={null}
      destroyOnClose
      bodyStyle={{ padding: '24px', overflow: 'hidden' }}
    >
      <Steps current={currentStep} className="mb-6">
        {steps.map(step => (
          <Steps.Step key={step.title} title={step.title} />
        ))}
      </Steps>

      <div className="min-h-[400px]">
        {steps[currentStep].content}
      </div>

      <div className="flex justify-between mt-6 pt-4 border-t">
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
              {isEditMode ? 'Cập nhật Đơn' : 'Tạo Đơn'}
            </Button>
          )}
        </Space>
      </div>
    </Modal>
  );
};

export default DynamicFormCreator; 