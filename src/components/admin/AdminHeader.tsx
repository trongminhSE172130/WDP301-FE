import React from 'react';
import { Layout, Button, Avatar, Dropdown, Typography, Breadcrumb } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';

const { Header } = Layout;
const { Text } = Typography;

interface AdminHeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  role: 'Consultant' | 'Staff' | 'Manager' | 'Admin';
  currentMenuItem: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  collapsed, 
  setCollapsed, 
  role, 
  currentMenuItem 
}) => {
  const navigate = useNavigate();

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
      onClick: () => navigate('/admin/login'),
    },
  ];

  return (
    <Header style={{ padding: 0, background: '#fff', boxShadow: '0 1px 4px rgba(0,21,41,.08)' }}>
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
              <Avatar className='bg-teal-600' icon={<UserOutlined />} />
              <Text className='ml-2'>Admin User</Text>
            </div>
          </Dropdown>
        </div>
      </div>
    </Header>
  );
};

export default AdminHeader; 