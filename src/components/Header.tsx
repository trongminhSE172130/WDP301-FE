import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { GiHealthNormal } from "react-icons/gi";

const Header: React.FC = () => {
  const [user, setUser] = useState<{ full_name?: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <header className="bg-teal-600 text-white shadow-md">
      <div className="container mx-auto py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold flex -gap-10 items-center">
          <GiHealthNormal className="mr-2 text-3xl" />
          <Link to="/">GenHealth Center</Link>
        </h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:underline">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:underline">
                Dịch vụ
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:underline">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/appointment" className="hover:underline">
                Đặt lịch
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">
                Liên hệ
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex space-x-4 items-center">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-2 focus:outline-none"
                onClick={() => setDropdownOpen((open) => !open)}
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-teal-600 font-bold text-lg">
                  {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="hidden sm:inline">Hi, {user.full_name || "User"}</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white text-gray-800 rounded-xl shadow-2xl z-50 border border-gray-100 animate-fade-in transition-all duration-200 ease-out drop-shadow-lg">
                  {/* Mũi tên chỉ lên */}
                  <div className="absolute -top-2 right-6 w-4 h-4 bg-white rotate-45 border-t border-l border-gray-100 shadow-sm"></div>
                  <Link
                    to="/profile"
                    className="block px-5 py-3 rounded-t-xl hover:bg-gradient-to-r hover:from-teal-50 hover:to-teal-100 transition-colors duration-150 font-small"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span className="inline-block mr-2"></span> Trang cá nhân
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-5 py-3 rounded-b-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 transition-colors duration-150 font-small text-red-600"
                  >
                    <span className="inline-block mr-2"></span> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-white text-teal-600 px-4 py-2 rounded-md font-medium"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="bg-teal-700 text-white px-4 py-2 rounded-md font-medium"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
