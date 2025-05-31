import React, { useState } from "react";
import { Form, Input, Button, Typography, Divider } from "antd";
import { UserOutlined, LockOutlined, SafetyOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/img/streamline_health-care-2-solid.png";

const { Title, Text } = Typography;

interface LoginFormValues {
  username: string;
  password: string;
  remember?: boolean;
}

const AdminLoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values: LoginFormValues) => {
    setLoading(true);
    console.log("Đăng nhập với thông tin:", values);
    
    // Giả lập quá trình đăng nhập
    setTimeout(() => {
      setLoading(false);
      // Sau khi đăng nhập thành công, điều hướng đến trang dashboard
      navigate("/admin/dashboard");
    }, 1500);
  };

  return (
    <div className="h-screen w-full flex justify-center items-center p-5 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <img src={logo} alt="Logo" className="w-10 h-10 mr-2" />
            <Title level={2} className="m-0 text-blue-500">GenHealth</Title>
          </div>
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
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
          >
            <Input 
              prefix={<UserOutlined className="text-gray-400" />} 
              placeholder="Tên đăng nhập" 
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