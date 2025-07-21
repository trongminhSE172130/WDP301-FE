import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  CalendarOutlined,
  HistoryOutlined,
  HeartOutlined,
  ShoppingOutlined,
  LogoutOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import { useProfile } from "../../context/ProfileContext";
import { logoutUser, uploadAvatar } from "../../service/api/authApi";

const ProfileSidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { profile, setProfile, refreshProfile } = useProfile();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    setProfile(null);
    navigate("/login");
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        await uploadAvatar(e.target.files[0]);
        await refreshProfile(); // Cập nhật lại avatar mới
      } catch {
        alert("Upload avatar thất bại!");
      }
    }
  };

  const navigationItems = [
    {
      path: "/profile",
      label: "Thông tin chi tiết",
      icon: <UserOutlined className="text-lg" />,
    },
    {
      path: "/consultation-history",
      label: "Danh sách lịch tư vấn",
      icon: <CalendarOutlined className="text-lg" />,
    },
    {
      path: "/bookings-history",
      label: "Lịch sử đặt lịch",
      icon: <HistoryOutlined className="text-lg" />,
    },
    {
      path: "/cycle-tracking",
      label: "Chỉ số kinh nguyệt",
      icon: <HeartOutlined className="text-lg" />,
    },
    {
      path: "/purchased-services",
      label: "Dịch vụ đã mua",
      icon: <ShoppingOutlined className="text-lg" />,
    },
  ];

  if (!profile) {
    return <div className="p-8 text-center">Đang tải...</div>;
  }

  return (
    <div className="w-full max-w-sm bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header với background gradient */}
      <div className="bg-gradient-to-r from-[#3B9AB8] to-[#2d7a94] px-6 py-8 text-center relative">
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-5"></div>

        {/* Avatar section */}
        <div className="relative w-28 h-28 mx-auto mb-4 z-10">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold text-[#3B9AB8] bg-white border-4 border-white shadow-lg">
              {profile.full_name
                ? profile.full_name.charAt(0).toUpperCase()
                : "U"}
            </div>
          )}

          {/* Upload button với design mới */}
          <label className="absolute -bottom-1 -right-1 bg-white rounded-full p-2.5 shadow-lg cursor-pointer border-2 border-gray-100 hover:bg-gray-50 transition-all duration-200 hover:scale-110">
            <CameraOutlined className="text-[#3B9AB8] text-sm" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
              aria-label="Upload avatar"
            />
          </label>
        </div>

        {/* User info */}
        <div className="relative z-10">
          <h2 className="text-xl font-bold text-white mb-1 drop-shadow-sm">
            {profile.full_name}
          </h2>
          <p className="text-blue-100 text-sm mb-1">
            {profile.phone || profile._id}
          </p>
          <p className="text-blue-100 text-xs">
            {profile.location || "Vị trí chưa cập nhật"}
          </p>
        </div>
      </div>

      {/* Navigation section */}
      <div className="p-6">
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 ${
                currentPath === item.path
                  ? "bg-[#3B9AB8] text-white shadow-md transform scale-[1.02]"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#3B9AB8] hover:translate-x-1"
              }`}
            >
              <div
                className={`flex-shrink-0 ${
                  currentPath === item.path
                    ? "text-white"
                    : "text-gray-500 group-hover:text-[#3B9AB8]"
                }`}
              >
                {item.icon}
              </div>
              <span className="font-medium text-sm">{item.label}</span>
              {currentPath === item.path && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
              )}
            </Link>
          ))}
        </div>

        {/* Logout Button */}
        <div className="mt-8 pt-6 border-t border-gray-200 cusor-pointer">
          <button
            onClick={handleLogout}
            className="group w-full flex items-center gap-3 py-3 px-4 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:translate-x-1"
          >
            <LogoutOutlined className="text-lg flex-shrink-0" />
            <span className="font-medium text-sm">Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
