import React from 'react';
import { Outlet } from 'react-router-dom';

// This is a placeholder for the customer dashboard header
const CustomerHeader = () => (
  <header className="bg-teal-600 text-white shadow-md">
    <div className="container mx-auto py-4 px-6 flex justify-between items-center">
      <h1 className="text-xl font-bold">Customer Dashboard</h1>
      {/* User profile, notifications, etc. */}
    </div>
  </header>
);

// This is a placeholder for the customer sidebar
const CustomerSidebar = () => (
  <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
    <nav>
      <ul className="space-y-2">
        <li><a href="#" className="block p-2 rounded hover:bg-gray-700">Dashboard</a></li>
        <li><a href="#" className="block p-2 rounded hover:bg-gray-700">Lịch sử xét nghiệm</a></li>
        <li><a href="#" className="block p-2 rounded hover:bg-gray-700">Theo dõi chu kỳ</a></li>
        <li><a href="#" className="block p-2 rounded hover:bg-gray-700">Đặt lịch tư vấn</a></li>
        <li><a href="#" className="block p-2 rounded hover:bg-gray-700">Hỏi đáp</a></li>
        <li><a href="#" className="block p-2 rounded hover:bg-gray-700">Hồ sơ cá nhân</a></li>
      </ul>
    </nav>
  </aside>
);

const CustomerLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <CustomerHeader />
      <div className="flex flex-grow">
        <CustomerSidebar />
        <main className="flex-grow p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;