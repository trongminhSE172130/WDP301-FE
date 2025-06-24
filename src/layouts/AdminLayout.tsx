import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Layout, ConfigProvider, theme } from 'antd';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';

const { Content } = Layout;

interface AdminLayoutProps {
  role: 'Consultant' | 'Admin';
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ role }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
    
  // Xác định menu item hiện tại dựa trên path
  const getCurrentMenuItem = () => {
    const path = location.pathname;
    let menuName = '';
    
    if (path.includes('dashboard')) {
      menuName = 'Bảng điều khiển';
    } else if (path.includes('users')) {
      menuName = 'Quản lý người dùng';
    } else if (path.includes('profile')) {
      menuName = 'Hồ sơ cá nhân';
    } else {
      menuName = role === 'Admin' ? 'Quản trị viên' : role;
    }
    
    return menuName;
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
        },
        components: {
          Layout: {
            siderBg: '#f0f2f5',
            headerBg: '#fff',
          },
        },
      }}
    >
      <Layout className="min-h-[100vh]">
        {/* Sidebar Component */}
        <AdminSidebar 
          collapsed={collapsed} 
          role={role} 
        />
        
        {/* Main Content Area */}
        <Layout className={`transition-all duration-200 ${collapsed ? 'ml-20' : 'ml-50'}`}>
          {/* Header Component */}
          <AdminHeader 
            collapsed={collapsed} 
            setCollapsed={setCollapsed} 
            role={role} 
            currentMenuItem={getCurrentMenuItem()}
          />
          
          {/* Content Area */}
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              borderRadius: '4px',
              minHeight: 280,
              boxShadow: '0 1px 4px rgba(0,21,41,.08)'
            }}
          >
          <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default AdminLayout;