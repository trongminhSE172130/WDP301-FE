import React from "react";
import { Link } from "react-router-dom";
import { GiHealthNormal } from "react-icons/gi";
const Header: React.FC = () => {
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
        <div className="flex space-x-4">
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
        </div>
      </div>
    </header>
  );
};

export default Header;
