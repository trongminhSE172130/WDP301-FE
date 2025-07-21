import React, { useEffect, useState } from 'react';
import { Layout, Button, Avatar, Dropdown, Typography, Breadcrumb, message } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { logoutUser } from '../../service/api/authApi';

const { Header } = Layout;
const { Text } = Typography;

interface AdminHeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  role: 'Consultant' | 'Staff' | 'Manager' | 'Admin';
  currentMenuItem: string;
}

interface UserInfo {
  id: string;
  role: string;
  full_name: string;
  email: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  collapsed, 
  setCollapsed, 
  role, 
  currentMenuItem 
}) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUserInfo(userData);
      } catch (error) {
        console.error('Lỗi khi phân tích dữ liệu người dùng:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    // Xóa dữ liệu đăng nhập
    logoutUser();
    
    // Hiển thị thông báo và chuyển hướng
    message.success('Đăng xuất thành công');
    navigate('/admin/login');
  };

  // Dropdown menu for user profile
  const userMenuItems: MenuProps['items'] = [
    {
      key: '1',
      label: 'Thông tin cá nhân',
      icon: <UserOutlined />,
    },
    {
      key: '2',
      label: 'Cài đặt',
      icon: <SettingOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: '3',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  // Hiển thị avatar với chữ cái đầu tiên của tên người dùng
  const getAvatarContent = () => {
    if (userInfo?.full_name) {
      return userInfo.full_name.charAt(0).toUpperCase();
    }
    return <UserOutlined />;
  };

  // Hiển thị tên người dùng hoặc email nếu không có tên
  const getDisplayName = () => {
    if (userInfo?.full_name) {
      return userInfo.full_name;
    }
    if (userInfo?.email) {
      return userInfo.email.split('@')[0];
    }
    return 'Người dùng';
  };

  return (
    <Header style={{ 
      padding: 0, 
      background: '#fff', 
      boxShadow: '0 1px 4px rgba(0,21,41,.08)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      width: '100%'
    }}>
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <Breadcrumb
            items={[
              { title: role === 'Admin' ? 'Quản trị' : role },
              { title: currentMenuItem },
            ]}
            className="mx-4"
          />
        </div>
        <div className="flex items-center">
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div className="cursor-pointer flex items-center">
              <Avatar className='bg-teal-600'>
                {getAvatarContent()}
              </Avatar>
              <Text className='ml-2'>{getDisplayName()}</Text>
            </div>
          </Dropdown>
        </div>
      </div>
    </Header>
  );
};

export default AdminHeader; 