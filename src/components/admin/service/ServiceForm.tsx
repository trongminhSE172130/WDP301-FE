import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Radio, Divider, Row, Col, message, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { Service } from './ServiceTypes';
import { getServiceTypes, uploadServiceImage } from '../../../service/api/serviceAPI';
import type { ServiceType } from '../../../service/api/serviceAPI';

const { Option } = Select;
const { TextArea } = Input;

// CSS styles for upload component
const uploadButtonStyle = {
  border: '1px dashed #d9d9d9',
  borderRadius: '6px',
  background: '#fafafa',
  width: '104px',
  height: '104px',
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'border-color 0.3s',
};

interface ServiceFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Omit<Service, '_id' | 'created_at' | 'updated_at' | '__v'>) => void;
  initialValues?: Service;
  title: string;
  confirmLoading?: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  title,
  confirmLoading = false,
}) => {
  const [form] = Form.useForm();
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loadingServiceTypes, setLoadingServiceTypes] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageUploading, setImageUploading] = useState<boolean>(false);

  // Load service types when component mounts
  useEffect(() => {
    const fetchServiceTypes = async () => {
      setLoadingServiceTypes(true);
      try {
        const response = await getServiceTypes();
        if (response && response.data) {
          setServiceTypes(response.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách loại dịch vụ:', error);
        message.error('Không thể tải danh sách loại dịch vụ');
      } finally {
        setLoadingServiceTypes(false);
      }
    };

    fetchServiceTypes();
  }, []);

  useEffect(() => {
    if (visible && initialValues) {
      // Tìm service_type_id từ service_type name
      const selectedServiceType = serviceTypes.find(type => type.name === initialValues.service_type);
      
      form.setFieldsValue({
        ...initialValues,
        service_type_id: selectedServiceType?._id || '',
        parameters: initialValues.test_details.parameters.join('\n'),
        preparation: initialValues.test_details.preparation,
        result_time: initialValues.test_details.result_time,
      });
      setImageUrl(initialValues.image_url || '');
    } else if (visible) {
      form.resetFields();
      setImageUrl('');
    }
  }, [visible, initialValues, form, serviceTypes]);

  const handleImageUpload = async (file: File) => {
    // Kiểm tra loại file
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
    if (!isJpgOrPng) {
      message.error('Chỉ có thể upload file JPG/PNG/WEBP!');
      return false;
    }

    // Kiểm tra kích thước file (2MB)
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Kích thước ảnh phải nhỏ hơn 2MB!');
      return false;
    }

    setImageUploading(true);
    try {
      const response = await uploadServiceImage(file);
      if (response.success) {
        setImageUrl(response.data.url);
        form.setFieldsValue({ image_url: response.data.url });
        message.success('Upload ảnh thành công!');
      }
    } catch {
      message.error('Upload ảnh thất bại. Vui lòng thử lại.');
    } finally {
      setImageUploading(false);
    }
    
    return false; // Prevent default upload behavior
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const formattedValues = {
        ...values,
        image_url: imageUrl, // Use uploaded image URL
        test_details: {
          parameters: values.parameters.split('\n').filter((param: string) => param.trim()),
          preparation: values.preparation,
          result_time: values.result_time,
        },
      };
      // Remove the temporary fields
      delete formattedValues.parameters;
      delete formattedValues.preparation;
      delete formattedValues.result_time;
      
      onSubmit(formattedValues);
    });
  };

  return (
    <Modal
      open={visible}
      title={title}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={confirmLoading}
      width={900}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ is_active: true }}
      >
        <Divider orientation="left">Thông tin cơ bản</Divider>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="title"
              label="Tên dịch vụ"
              rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ' }]}
            >
              <Input placeholder="Nhập tên dịch vụ" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="service_type_id"
              label="Loại dịch vụ"
              rules={[{ required: true, message: 'Vui lòng chọn loại dịch vụ' }]}
            >
              <Select 
                placeholder="Chọn loại dịch vụ"
                loading={loadingServiceTypes}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {serviceTypes
                  .filter(type => type.is_active) // Chỉ hiển thị loại dịch vụ đang hoạt động
                  .map(type => (
                    <Option key={type._id} value={type._id}>
                      {type.display_name || type.name}
                    </Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả dịch vụ' }]}
        >
          <TextArea rows={3} placeholder="Nhập mô tả dịch vụ" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="duration"
              label="Thời gian thực hiện"
              rules={[{ required: true, message: 'Vui lòng nhập thời gian thực hiện' }]}
            >
              <Input placeholder="VD: 30-45 phút" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="sample_type"
              label="Loại mẫu"
              rules={[{ required: true, message: 'Vui lòng nhập loại mẫu' }]}
            >
              <Input placeholder="VD: Máu tĩnh mạch" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="target_audience"
          label="Đối tượng áp dụng"
          rules={[{ required: true, message: 'Vui lòng nhập đối tượng áp dụng' }]}
        >
          <Input placeholder="VD: Nam và nữ từ 18 tuổi trở lên" />
        </Form.Item>

        <Form.Item
          name="overview_section"
          label="Tổng quan"
          rules={[{ required: true, message: 'Vui lòng nhập tổng quan về dịch vụ' }]}
        >
          <TextArea rows={3} placeholder="Nhập tổng quan về dịch vụ" />
        </Form.Item>

        <Divider orientation="left">Chi tiết xét nghiệm</Divider>

        <Form.Item
          name="parameters"
          label="Các chỉ số xét nghiệm (mỗi chỉ số một dòng)"
          rules={[{ required: true, message: 'Vui lòng nhập các chỉ số xét nghiệm' }]}
        >
          <TextArea 
            rows={4} 
            placeholder="VD:&#10;Hemoglobin (Hb)&#10;Hematocrit (Hct)&#10;Số lượng hồng cầu" 
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="preparation"
              label="Chuẩn bị trước xét nghiệm"
              rules={[{ required: true, message: 'Vui lòng nhập hướng dẫn chuẩn bị' }]}
            >
              <TextArea rows={2} placeholder="VD: Nhịn ăn 8-12 tiếng trước khi xét nghiệm" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="result_time"
              label="Thời gian có kết quả"
              rules={[{ required: true, message: 'Vui lòng nhập thời gian có kết quả' }]}
            >
              <Input placeholder="VD: 24-48 giờ" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Hình ảnh minh họa (tùy chọn)">
          <Upload
            name="image"
            listType="picture-card"
            className="service-uploader"
            showUploadList={false}
            beforeUpload={handleImageUpload}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="service" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={uploadButtonStyle}>
                {imageUploading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
          {imageUrl && (
            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
              Ảnh đã được upload thành công
            </div>
          )}
        </Form.Item>

        <Divider orientation="left">Trạng thái</Divider>
        
        <Form.Item name="is_active" label="Trạng thái">
          <Radio.Group>
            <Radio value={true}>Đang hoạt động</Radio>
            <Radio value={false}>Không hoạt động</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ServiceForm; 