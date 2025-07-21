import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  AppstoreOutlined,
  BookOutlined,
  CrownOutlined,
  PhoneOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { SessionManager } from "../utils/sessionManager";

const Header: React.FC = () => {
  const [user, setUser] = useState<{
    full_name?: string;
    [key: string]: unknown;
  } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const updateUserState = () => {
    // Sử dụng SessionManager để lấy user info
    if (SessionManager.isSessionValid()) {
      const userInfo = SessionManager.getUserInfo();
      const userRole = SessionManager.getUserRole();

      // CHỈ hiển thị thông tin nếu là user thường, không hiển thị admin/consultant
      if (userRole === "user") {
        setUser(userInfo);
      } else {
        setUser(null); // Không hiển thị admin/consultant info trong Header
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    updateUserState();
  }, []);

  // Cập nhật user state khi route changes (ví dụ từ admin về user area)
  useEffect(() => {
    updateUserState();
  }, [location.pathname]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    SessionManager.clearSession();
    window.location.href = "/";
  };

  return (
    <header className="bg-gradient-to-r from-[#3B9AB8] to-[#2d7a94] text-white shadow-lg border-b border-white/10">
      <div className="container mx-auto py-4 px-6 flex justify-between items-center">
        {/* Logo và Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <HeartOutlined className="text-white text-xl" />
          </div>
          <Link
            to="/"
            className="text-2xl font-bold text-white hover:text-blue-100 transition-colors duration-200"
          >
            GenHealth Center
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden lg:block">
          <ul className="flex space-x-8">
            {[
              { to: "/", icon: <HomeOutlined />, label: "Trang chủ" },
              { to: "/services", icon: <AppstoreOutlined />, label: "Dịch vụ" },
              { to: "/blog", icon: <BookOutlined />, label: "Blog" },
              {
                to: "/subscriptions",
                icon: <CrownOutlined />,
                label: "Mua gói",
              },
              { to: "/contact", icon: <PhoneOutlined />, label: "Liên hệ" },
            ].map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                >
                  <span className="text-blue-100 group-hover:text-white transition-colors">
                    {item.icon}
                  </span>
                  <span className="font-medium group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-3 py-2 px-4 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
                onClick={() => setDropdownOpen((open) => !open)}
              >
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#3B9AB8] font-bold text-sm shadow-sm">
                  {user.full_name
                    ? user.full_name.charAt(0).toUpperCase()
                    : "U"}
                </div>
                <span className="hidden sm:inline font-medium">
                  Hi, {user.full_name || "User"}
                </span>
                <DownOutlined
                  className={`text-xs transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white text-gray-800 rounded-xl shadow-2xl z-50 border border-gray-100 animate-fade-in transition-all duration-200 ease-out overflow-hidden">
                  {/* Arrow */}
                  <div className="absolute -top-2 right-6 w-4 h-4 bg-white rotate-45 border-t border-l border-gray-100"></div>

                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-150 group"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <UserOutlined className="text-blue-500 group-hover:text-blue-600" />
                      <span className="font-medium">Trang cá nhân</span>
                    </Link>

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 transition-all duration-150 text-red-600 group"
                    >
                      <LogoutOutlined className="group-hover:text-red-700" />
                      <span className="font-medium group-hover:text-red-700">
                        Đăng xuất
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-white text-[#3B9AB8] rounded-lg font-medium hover:bg-blue-50 transition-all duration-200 shadow-sm"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
