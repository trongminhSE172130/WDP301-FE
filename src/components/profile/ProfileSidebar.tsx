import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useProfile } from '../../context/ProfileContext';
import { logoutUser, uploadAvatar } from '../../service/api/authApi';

const ProfileSidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { profile, setProfile, refreshProfile } = useProfile();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    setProfile(null);
    navigate('/login');
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        await uploadAvatar(e.target.files[0]);
        await refreshProfile(); // Cập nhật lại avatar mới
      } catch {
        alert('Upload avatar thất bại!');
      }
    }
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

  if (!profile) {
    return <div className="p-8 text-center">Đang tải...</div>;
  }

  return (
    <div className="md:w-1/3 bg-white rounded-4xl shadow-md p-6 border border-gray-300 flex flex-col h-full">
      <div className="text-center mb-6">
        <div className="relative w-40 h-40 mx-auto mb-4">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border-2 border-gray-300"
            />
          ) : (
            <div
              className="w-40 h-40 rounded-full flex items-center justify-center text-5xl font-bold text-white bg-[#3B9AB8]"
            >
              {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : "U"}
            </div>
          )}
          {/* Nút upload avatar */}
          <label className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow cursor-pointer border border-gray-200 hover:bg-gray-100 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3B9AB8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          {profile.full_name}
        </h2>
        <p className="text-gray-600 text-sm mb-2 font-bold">{profile.phone || profile._id}</p>
        <p className="text-gray-600 text-sm font-bold">{profile.location || ''}</p>
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
        <button
          onClick={handleLogout}
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
        </button>
      </div>
    </div>
  );
};

export default ProfileSidebar;
