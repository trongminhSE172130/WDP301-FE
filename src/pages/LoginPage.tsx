import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import doctorTeam from "../assets/img/freepik-export-202406130959061bQ8 1.png";
import logo from "../assets/img/streamline_health-care-2-solid.png";
import { FiEye, FiEyeOff, FiX } from "react-icons/fi";
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

const LoginPage = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Tự động chuyển giao diện theo URL
  useEffect(() => {
    if (location.pathname === "/register") setIsLogin(false);
    else setIsLogin(true);
  }, [location.pathname]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý đăng nhập/đăng ký
  };

  return (
    <div className="min-h-screen flex">
      {/* Phần bên trái - Hình ảnh và logo */}
      <div className="hidden md:block w-1/2 bg-[#8CAAB9] relative overflow-hidden">
        {/* Logo */}
        <div className="absolute top-10 left-10 z-20">
          <div className="flex items-center gap-3">
            <div className="  p-2  flex items-center justify-center">
              <img src={logo} alt="logo" className="text-3xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-white text-5xl font-bold tracking-tight">
                GenHealth
              </span>
            </div>
          </div>
        </div>
        {/* Vòng tròn lớn trang trí */}
        <div className="absolute top-0 left-0 w-full h-full">
          <svg width="100%" height="100%" viewBox="0 0 800 800">
            <circle
              cx="400"
              cy="400"
              r="300"
              stroke="#B6C8D1"
              strokeWidth="3"
              fill="none"
              opacity="0.3"
            />
          </svg>
        </div>
        {/* Hình ảnh team bác sĩ */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
          <img
            src={doctorTeam}
            alt="Medical Team"
            className="max-h-[80vh] object-contain"
            style={{ filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.2))" }}
          />
        </div>
      </div>
      {/* Phần bên phải - Form đăng nhập */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center p-6 md:p-10 relative">
        {/* Nút đóng */}
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <FiX size={24} />
        </button>
        {isLogin ? (
          <Login
            formData={formData}
            setFormData={setFormData}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
            handleSubmit={handleSubmit}
            onSwitchToRegister={() => setIsLogin(false)}
          />
        ) : (
          <Register
            formData={formData}
            setFormData={setFormData}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            handleSubmit={handleSubmit}
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
