import React from 'react';
import { Outlet } from 'react-router-dom';

interface AdminLayoutProps {
  role: 'Consultant' | 'Staff' | 'Manager' | 'Admin';
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ role }) => {
  // Different menu items based on role
  const getMenuItems = () => {
    const commonItems = [
      { name: 'Dashboard', link: `/${role.toLowerCase()}/dashboard` },
      { name: 'Hồ sơ cá nhân', link: `/${role.toLowerCase()}/profile` },
    ];
    
    // Role-specific menu items
    switch (role) {
      case 'Consultant':
        return [
          ...commonItems,
          { name: 'Lịch tư vấn', link: '/consultant/schedule' },
          { name: 'Hỏi đáp', link: '/consultant/questions' },
          { name: 'Phiên tư vấn', link: '/consultant/sessions' },
        ];
      case 'Staff':
        return [
          ...commonItems,
          { name: 'Quản lý xét nghiệm', link: '/staff/tests' },
          { name: 'Quản lý đơn hàng', link: '/staff/orders' },
          { name: 'Quản lý khách hàng', link: '/staff/customers' },
        ];
      case 'Manager':
        return [
          ...commonItems,
          { name: 'Quản lý nhân viên', link: '/manager/staff' },
          { name: 'Quản lý dịch vụ', link: '/manager/services' },
          { name: 'Báo cáo', link: '/manager/reports' },
          { name: 'Quản lý blog', link: '/manager/blog' },
        ];
      case 'Admin':
        return [
          ...commonItems,
          { name: 'Quản lý người dùng', link: '/admin/users' },
          { name: 'Cấu hình hệ thống', link: '/admin/settings' },
          { name: 'Quản lý quyền', link: '/admin/permissions' },
          { name: 'Logs hệ thống', link: '/admin/logs' },
        ];
      default:
        return commonItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-indigo-700 text-white shadow-md">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <h1 className="text-xl font-bold">{role} Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span>Xin chào, [Tên người dùng]</span>
            <button className="bg-indigo-800 px-3 py-1 rounded">Đăng xuất</button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-grow">
        <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
          <nav>
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.link} 
                    className="block p-2 rounded hover:bg-gray-700"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        
        <main className="flex-grow p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;