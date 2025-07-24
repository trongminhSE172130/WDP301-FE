import React, { useState } from "react";
import { Form, Input, Button, Typography, Divider, message } from "antd";
import { UserOutlined, LockOutlined, SafetyOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { GiHealthNormal } from "react-icons/gi";
import { loginUser } from "../../service/api/authApi";

const { Title, Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

const AdminLoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const response = await loginUser({
        email: values.email,
        password: values.password
      });
      
      // Lưu token và user info bằng SessionManager
      if (response.data && response.data.success && response.data.token && response.data.user) {
        // Note: SessionManager sẽ được gọi tự động trong loginUser function
        
        message.success("Đăng nhập thành công!");
        
        // Xác định trang điều hướng dựa vào role
        const userRole = response.data.user?.role?.toLowerCase() || 'admin';
        let redirectPath = '/admin/dashboard';
        
        if (userRole === 'consultant') {
          redirectPath = '/consultant/consultations';
        } else if (userRole === 'admin') {
          redirectPath = '/admin/dashboard';
        }
        
        navigate(redirectPath);
      } else {
        throw new Error("Không nhận được token từ server");
      }
    } catch (error: unknown) {
      console.error("Lỗi đăng nhập:", error);
      const apiError = error as ApiError;
      message.error(apiError.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex justify-center items-center p-5 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <GiHealthNormal className="text-3xl text-teal-600 mr-2" />
            <Title level={2} className="m-0 text-blue-500">GenHealth</Title>
          </div>
          <div className="text-xs text-teal-600 -mt-2 mb-4">Health Care Center</div>
          <div className="flex items-center justify-center mb-2">
            <SafetyOutlined className="text-lg text-blue-500 mr-2" />
            <Title level={4} className="m-0">Đăng nhập Quản trị</Title>
          </div>
          <Text type="secondary" className="text-gray-500">Vui lòng đăng nhập để truy cập hệ thống quản trị</Text>
        </div>

        <Form
          name="admin_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
          className="w-full"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" }
            ]}
          >
            <Input 
              prefix={<UserOutlined className="text-gray-400" />} 
              placeholder="Email" 
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password 
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Mật khẩu"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="w-full h-10 rounded-lg"
              loading={loading}
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <Divider plain>
            <Text type="secondary" className="text-xs text-gray-400">HỆ THỐNG QUẢN TRỊ GENHEALTH</Text>
          </Divider>
        </Form>
      </div>
    </div>
  );
};

export default AdminLoginPage; 