import React from 'react';
import { Form, Input, Select, Typography, InputNumber, Row, Col, Card } from 'antd';
import { UserOutlined, MailOutlined, BookOutlined, MedicineBoxOutlined, StarOutlined, LockOutlined } from '@ant-design/icons';
import type { Consultant } from './ConsultantTable';
import type { Service } from '../service/ServiceTypes';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export interface FormValues {
  _id?: string;
  full_name: string;
  email: string;
  password?: string;
  degree: string;
  specialty: string;
  experience_years: number;
  bio: string;
  services: string[];
}

interface ConsultantFormProps {
  consultant?: Consultant;
  onFinish: (values: FormValues) => void;
  loading?: boolean;
  title: string;
  services: Service[];
}

const ConsultantForm: React.FC<ConsultantFormProps> = ({
  consultant,
  onFinish,
  title,
  services
}) => {
  const [form] = Form.useForm();
  const isEditing = !!consultant;

  React.useEffect(() => {
    if (consultant) {
      form.setFieldsValue({
        _id: consultant._id,
        full_name: consultant.full_name,
        email: consultant.email,
        degree: consultant.degree,
        specialty: consultant.specialty,
        experience_years: consultant.experience_years,
        bio: consultant.bio,
        services: consultant.services
      });
    } else {
      form.resetFields();
    }
  }, [consultant, form]);

  return (
    <div className="bg-white">
      {title && <Title level={4} className="mb-6 text-gray-800">{title}</Title>}
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        id="consultantForm"
        initialValues={{
          experience_years: 0
        }}
        className="space-y-6"
      >
        {consultant && (
          <Form.Item name="_id" hidden>
            <Input />
          </Form.Item>
        )}
        
        <Card 
          title={
            <div className="flex items-center space-x-2">
              <UserOutlined className="text-blue-600" />
              <span className="text-gray-800 font-semibold">Thông tin cá nhân</span>
              {isEditing && (
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <LockOutlined className="text-orange-500" />
                  <span>Chỉ đọc</span>
                </div>
              )}
            </div>
          } 
          className="shadow-sm border border-gray-200"
          bodyStyle={{ padding: '24px' }}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
            <Form.Item
                name="full_name"
                label={
                  <span className="text-sm font-medium text-gray-700">
                    Họ và tên *
                    {isEditing && <span className="ml-2 text-xs text-orange-500">(Không thể chỉnh sửa)</span>}
                  </span>
                }
              rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
              <Input
                  prefix={isEditing ? <LockOutlined className="text-orange-400" /> : <UserOutlined className="text-gray-400" />}
                placeholder="Nhập họ tên đầy đủ"
                  size="large"
                  disabled={isEditing}
                  className={`rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                    isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                  }`}
              />
            </Form.Item>
            </Col>
          
            <Col xs={24} md={12}>
            <Form.Item
              name="email"
                label={
                  <span className="text-sm font-medium text-gray-700">
                    Email *
                    {isEditing && <span className="ml-2 text-xs text-orange-500">(Không thể chỉnh sửa)</span>}
                  </span>
                }
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input
                  prefix={isEditing ? <LockOutlined className="text-orange-400" /> : <MailOutlined className="text-gray-400" />}
                  placeholder="example@genhealth.com"
                  size="large"
                  disabled={isEditing}
                  className={`rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                    isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                  }`}
                />
              </Form.Item>
            </Col>
          </Row>

          {!isEditing && (
            <Row gutter={[24, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="password"
                  label={<span className="text-sm font-medium text-gray-700">Mật khẩu *</span>}
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Nhập mật khẩu đăng nhập"
                    size="large"
                    className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </Form.Item>
              </Col>
            </Row>
          )}
        </Card>

        <Card 
          title={
            <div className="flex items-center space-x-2">
              <MedicineBoxOutlined className="text-green-600" />
              <span className="text-gray-800 font-semibold">Thông tin chuyên môn</span>
              {isEditing && (
                <div className="flex items-center space-x-1 text-xs text-green-600">
                  <span>✓ Có thể chỉnh sửa</span>
          </div>
              )}
        </div>
          } 
          className="shadow-sm border border-gray-200"
          bodyStyle={{ padding: '24px' }}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
            <Form.Item
                name="degree"
                label={<span className="text-sm font-medium text-gray-700">Bằng cấp *</span>}
                rules={[{ required: true, message: 'Vui lòng nhập bằng cấp!' }]}
            >
              <Input
                  prefix={<BookOutlined className="text-gray-400" />}
                  placeholder="Ví dụ: Bác sĩ chuyên khoa I"
                  size="large"
                  className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </Form.Item>
            </Col>
          
            <Col xs={24} md={12}>
            <Form.Item
              name="specialty"
                label={<span className="text-sm font-medium text-gray-700">Chuyên khoa *</span>}
                rules={[{ required: true, message: 'Vui lòng nhập chuyên khoa!' }]}
            >
                <Input
                  prefix={<MedicineBoxOutlined className="text-gray-400" />}
                  placeholder="Ví dụ: Sản phụ khoa, Nội tiết..."
                  size="large"
                  className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
            </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
            <Form.Item
                name="experience_years"
                label={<span className="text-sm font-medium text-gray-700">Năm kinh nghiệm *</span>}
              rules={[{ required: true, message: 'Vui lòng nhập số năm kinh nghiệm!' }]}
            >
              <InputNumber
                min={0}
                  max={50}
                placeholder="Số năm kinh nghiệm"
                  size="large"
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  prefix={<StarOutlined className="text-gray-400" />}
              />
            </Form.Item>
            </Col>
          
            {isEditing && (
            <Col xs={24} md={12}>
            <Form.Item
                name="services"
                label={
                  <span className="text-sm font-medium text-gray-700">
                    Dịch vụ đảm nhiệm
                      <span className="ml-2 text-xs text-orange-500">(Không thể chỉnh sửa)</span>
                  </span>
                }
            >
              <Select 
                  mode="multiple"
                  placeholder="Chọn dịch vụ (tùy chọn)"
                  size="large"
                  className="rounded-lg"
                  optionFilterProp="children"
                  allowClear
                    disabled={true}
              >
                  {services.map((service) => (
                    <Option key={service._id} value={service._id}>
                      {service.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            </Col>
            )}
          </Row>

          <Form.Item
            name="bio"
            label={<span className="text-sm font-medium text-gray-700">Giới thiệu *</span>}
            rules={[{ required: true, message: 'Vui lòng nhập thông tin giới thiệu!' }]}
          >
            <TextArea
              rows={4}
              placeholder="Mô tả ngắn về kinh nghiệm, chuyên môn và thành tích của tư vấn viên..."
              className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              showCount
              maxLength={500}
            />
          </Form.Item>
        </Card>

        {!consultant ? (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-100 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm">ℹ️</span>
              </div>
              <div>
                <p className="text-sm text-blue-800 font-medium mb-1">Lưu ý quan trọng</p>
                <p className="text-sm text-blue-700">
                  Sau khi tạo thành công, thông tin tư vấn viên sẽ được thêm vào hệ thống. 
                  Bạn có thể chỉnh sửa một số thông tin này sau. Để gán dịch vụ cho tư vấn viên, 
                  vui lòng sử dụng chức năng "Gán dịch vụ" sau khi tạo tư vấn viên.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-amber-50 to-orange-100 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <LockOutlined className="text-amber-600 text-sm" />
        </div>
              <div>
                <p className="text-sm text-amber-800 font-medium mb-1">Chế độ chỉnh sửa</p>
                <p className="text-sm text-amber-700">
                  <span className="font-medium">Có thể chỉnh sửa:</span> Bằng cấp, Chuyên khoa, Kinh nghiệm, Giới thiệu.
                  <br />
                  <span className="font-medium">Không thể chỉnh sửa:</span> Họ tên, Email, Dịch vụ đảm nhiệm.
                  <br />
                  <span className="font-medium">Để gán dịch vụ:</span> Sử dụng nút "Gán dịch vụ" trong danh sách tư vấn viên.
            </p>
              </div>
            </div>
          </div>
        )}
      </Form>
    </div>
  );
};

export default ConsultantForm; 