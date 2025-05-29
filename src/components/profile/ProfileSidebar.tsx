import React from "react";
import { Link, useLocation } from "react-router-dom";

const ProfileSidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Mock user data
  const userData = {
    username: "UserName",
    id: "Sdt-0123456789",
    location: "48 Văn Lương, BBVT",
    avatar: "https://picture.dzogame.vn/Img/cap5_pp_058.jpg",
  };

  const navigationItems = [
    {
      path: "/profile",
      label: "Thông tin chi tiết",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      path: "/consultation-history",
      label: "Lịch sử tư vấn",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      path: "/cycle-tracking",
      label: "Chỉ số kinh nguyệt",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      path: "/purchased-services",
      label: "Dịch vụ đã mua",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="md:w-1/3 bg-white rounded-4xl shadow-md p-6 border border-gray-300 flex flex-col h-full">
      <div className="text-center mb-6">
        <img
          src={userData.avatar}
          alt="Profile"
          className="w-40 h-40 rounded-full mx-auto mb-4 object-cover border-2 border-gray-300"
        />
        <h2 className="text-xl font-semibold text-gray-800">
          {userData.username}
        </h2>
        <p className="text-gray-600 text-sm mb-2 font-bold">{userData.id}</p>
        <p className="text-gray-600 text-sm font-bold">{userData.location}</p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex-grow space-y-3">
        {navigationItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block w-full py-4 px-4 rounded-4xl transition-colors text-center font-medium flex items-center justify-center gap-2 ${
              currentPath === item.path
                ? "bg-[#3B9AB8] text-white hover:bg-[#2d7a94]"
                : "bg-white border border-[#3B9AB8] text-gray-700 hover:bg-gray-50"
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </div>

      {/* Logout Button - Fixed at bottom */}
      <div className="mt-6">
        <Link
          to="/login"
          className="block w-full py-4 px-4 border border-red-500 text-red-500 rounded-4xl hover:bg-red-50 transition-colors font-medium text-center flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Đăng xuất
        </Link>
      </div>
    </div>
  );
};

export default ProfileSidebar;
