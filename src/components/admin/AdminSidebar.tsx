import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  QuestionCircleOutlined,
  SolutionOutlined,
  ExperimentOutlined,
  ShoppingCartOutlined,
  CustomerServiceOutlined,
  UsergroupAddOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  BookOutlined,
  MedicineBoxOutlined,
  FileOutlined,
  FormOutlined,
  TagsOutlined,
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
  role: 'Consultant' | 'Staff' | 'Manager' | 'Admin';
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Different menu items based on role
  const getMenuItems = (): MenuItem[] => {
    const commonItems = [
      { key: 'dashboard', icon: <DashboardOutlined />, label: 'Tổng quan', link: `/${role.toLowerCase()}/dashboard` },
    ];
    
    // Role-specific menu items
    switch (role) {
      case 'Consultant':
        return [
          ...commonItems,
          { key: 'schedule', icon: <CalendarOutlined />, label: 'Lịch tư vấn', link: '/consultant/schedule' },
          { key: 'questions', icon: <QuestionCircleOutlined />, label: 'Hỏi đáp', link: '/consultant/questions' },
          { key: 'sessions', icon: <SolutionOutlined />, label: 'Phiên tư vấn', link: '/consultant/sessions' },
        ];
      case 'Staff':
        return [
          ...commonItems,
          { key: 'tests', icon: <ExperimentOutlined />, label: 'Quản lý xét nghiệm', link: '/staff/tests' },
          { key: 'orders', icon: <ShoppingCartOutlined />, label: 'Quản lý đơn hàng', link: '/staff/orders' },
          { key: 'customers', icon: <CustomerServiceOutlined />, label: 'Quản lý khách hàng', link: '/staff/customers' },
        ];
      case 'Manager':
        return [
          ...commonItems,
          { key: 'staff', icon: <UsergroupAddOutlined />, label: 'Quản lý nhân viên', link: '/manager/staff' },
          { key: 'services', icon: <AppstoreOutlined />, label: 'Quản lý dịch vụ', link: '/manager/services' },
          { key: 'reports', icon: <BarChartOutlined />, label: 'Báo cáo', link: '/manager/reports' },
          { 
            key: 'blog', 
            icon: <BookOutlined />, 
            label: 'Quản lý blog',
            children: [
              { key: 'blog-posts', icon: <FormOutlined />, label: 'Bài viết', link: '/manager/blog' },
              { key: 'blog-categories', icon: <TagsOutlined />, label: 'Danh mục', link: '/manager/blog-categories' },
            ]
          },
        ];
      case 'Admin':
        return [
          ...commonItems,
          { key: 'users', icon: <TeamOutlined />, label: 'Quản lý người dùng', link: '/admin/users' },
          { key: 'appointments', icon: <CalendarOutlined />, label: 'Cuộc hẹn', link: '/admin/appointments' },
          { key: 'patients', icon: <MedicineBoxOutlined />, label: 'Quản lý bệnh nhân', link: '/admin/patients' },
          { key: 'services', icon: <AppstoreOutlined />, label: 'Quản lý dịch vụ', link: '/admin/services' },
          { key: 'schedule', icon: <CalendarOutlined />, label: 'Quản lý lịch trình', link: '/admin/schedule' },
          { key: 'documents', icon: <FileOutlined />, label: 'Quản lý tài liệu', link: '/admin/documents' },
          { 
            key: 'blog', 
            icon: <BookOutlined />, 
            label: 'Quản lý blog',
            children: [
              { key: 'blog-posts', icon: <FormOutlined />, label: 'Bài viết', link: '/admin/blog' },
              { key: 'blog-categories', icon: <TagsOutlined />, label: 'Danh mục', link: '/admin/blog-categories' },
            ]
          },
        ];
      default:
        return commonItems;
    }
  };

  const menuItems = getMenuItems();

  // Determine which keys should be open by default based on current path
  const getDefaultOpenKeys = (): string[] => {
    if (currentPath.includes('/blog')) {
      return ['blog'];
    }
    return [];
  };
  
  // Determine selected key based on current path
  const getSelectedKey = (): string => {
    if (currentPath.includes('/blog-categories')) {
      return 'blog-categories';
    }
    if (currentPath.includes('/blog')) {
      return 'blog-posts';
    }
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
        defaultOpenKeys={getDefaultOpenKeys()}
        items={renderMenu(menuItems)}
      />
    </Sider>
  );
};

export default AdminSidebar; 