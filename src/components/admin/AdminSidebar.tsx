import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  MessageOutlined,
  FormOutlined,
  AppstoreOutlined,
  UserOutlined,
  FileTextOutlined,
  ScheduleOutlined,
  EditOutlined,
  FolderOutlined,
  BellOutlined
} from '@ant-design/icons';
import { GiHealthNormal } from 'react-icons/gi';

const { Sider } = Layout;

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  link?: string;
  children?: MenuItem[];
}

interface AdminSidebarProps {
  collapsed: boolean;
  role: 'Admin' | 'Consultant';
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Different menu items based on role
  const getMenuItems = (): MenuItem[] => {
    // Role-specific menu items
    switch (role) {
      case 'Consultant':
        return [
          { key: 'dashboard', icon: <DashboardOutlined />, label: 'Tổng quan', link: '/consultant/dashboard' },
          { key: 'consultations', icon: <TeamOutlined />, label: 'Hàng đợi tư vấn', link: '/consultant/consultations' },
          { key: 'schedule', icon: <CalendarOutlined />, label: 'Lịch hẹn xét nghiệm', link: '/consultant/schedules' },
          { key: 'availability', icon: <ScheduleOutlined />, label: 'Lịch làm việc', link: '/consultant/availability' },
          { key: 'forms', icon: <FormOutlined />, label: 'Biểu mẫu', link: '/consultant/forms' },
          { key: 'messages', icon: <MessageOutlined />, label: 'Tin nhắn', link: '/consultant/messages' },
          { key: 'profile', icon: <UserOutlined />, label: 'Cài đặt hồ sơ', link: '/consultant/profile' },
        ];
      case 'Admin':
        return [
          { key: 'dashboard', icon: <DashboardOutlined />, label: 'Tổng quan', link: '/admin/dashboard' },
          
          // Quản lý nhân sự
          { key: 'users', icon: <UserOutlined />, label: 'Quản lý người dùng', link: '/admin/users' },
          { key: 'consultants', icon: <TeamOutlined />, label: 'Quản lý tư vấn viên', link: '/admin/consultants' },
          
          // Quản lý dịch vụ & biểu mẫu
          { 
            key: 'service-management', 
            icon: <AppstoreOutlined />, 
            label: 'Quản lý dịch vụ', 
            children: [
              { key: 'services', icon: <AppstoreOutlined />, label: 'Dịch vụ', link: '/admin/services' },
              { key: 'service-categories', icon: <FolderOutlined />, label: 'Loại dịch vụ', link: '/admin/service-categories' }
            ]
          },
          { key: 'dynamic-forms', icon: <FormOutlined />, label: 'Quản lý biểu mẫu', link: '/admin/dynamic-forms' },
          { key: 'formReview', icon: <FileTextOutlined />, label: 'Quản lý gói đăng ký', link: '/admin/subscription' },
          
          // Quản lý lịch trình & đặt lịch
          { key: 'schedules', icon: <CalendarOutlined />, label: 'Quản lý lịch trình', link: '/admin/schedules' },
          { key: 'bookings', icon: <ScheduleOutlined />, label: 'Tổng quan đặt lịch', link: '/admin/bookings' },
          
          // Quản lý nội dung & thông báo
          { 
            key: 'blog', 
            icon: <EditOutlined />, 
            label: 'Blog', 
            children: [
              { key: 'blogs', icon: <FileTextOutlined />, label: 'Quản lý blog', link: '/admin/blogs' },
              { key: 'blog-categories', icon: <FolderOutlined />, label: 'Danh mục blog', link: '/admin/blog-categories' }
            ]
          },
          { key: 'push-notifications', icon: <BellOutlined />, label: 'Push Notification', link: '/admin/push-notifications' },
        ];
      default:
        return [{ key: 'dashboard', icon: <DashboardOutlined />, label: 'Tổng quan', link: '/dashboard' }];
    }
  };

  const menuItems = getMenuItems();
  
  // Determine selected key based on current path
  const getSelectedKey = (): string => {
    return currentPath.split('/').pop() || 'dashboard';
  };

  const renderMenu = (items: MenuItem[]) => {
    return items.map(item => {
      if (item.children) {
        return {
          key: item.key,
          icon: item.icon,
          label: item.label,
          children: item.children.map(child => ({
            key: child.key,
            icon: child.icon,
            label: child.label,
            onClick: () => navigate(child.link || '')
          }))
        };
      }
      return {
        key: item.key,
        icon: item.icon,
        label: item.label,
        onClick: () => navigate(item.link || '')
      };
    });
  };

  return (
    <Sider 
      trigger={null} 
      collapsible 
      collapsed={collapsed}
      theme="light"
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
      }}
    >
      <div className={`py-5 flex items-center justify-center ${collapsed ? 'px-2' : 'px-4'} border-b border-gray-100`}>
        <div className={`flex ${collapsed ? 'justify-center' : 'justify-start'} items-center w-full`}>
          <GiHealthNormal className={`text-3xl text-teal-600 ${collapsed ? 'mx-auto' : 'mr-2'}`} />
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="text-xl font-semibold text-gray-800">GenHealth</div>
              <div className="text-xs text-teal-600 -mt-1">Health Care Center</div>
            </div>
          )}
        </div>
      </div>
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={[getSelectedKey()]}
        selectedKeys={[getSelectedKey()]}
        items={renderMenu(menuItems)}
      />
    </Sider>
  );
};

export default AdminSidebar; 