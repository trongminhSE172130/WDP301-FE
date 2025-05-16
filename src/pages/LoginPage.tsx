import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import doctorTeam from "../assets/img/freepik-export-202406130959061bQ8 1.png";
import logo from "../assets/img/streamline_health-care-2-solid.png";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

const LoginPage = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);

  // Form data cho đăng nhập
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  // Form data cho đăng ký
  const [registerFormData, setRegisterFormData] = useState({
    email: "",
    fullName: "",
    phone: "",
    gender: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Tự động chuyển giao diện theo URL
  useEffect(() => {
    if (location.pathname === "/register") setIsLogin(false);
    else setIsLogin(true);
  }, [location.pathname]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý đăng nhập/đăng ký
    console.log(isLogin ? loginFormData : registerFormData);
  };

  return (
    <div className="min-h-screen flex">
      {/* Phần bên trái - Hình ảnh và logo */}
      <div className="hidden md:block w-1/2 bg-[#8CAAB9] relative overflow-hidden">
        {/* Logo */}
        <div className="absolute top-10 left-10 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 flex items-center justify-center">
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
        <div className="absolute bottom-0 left-0 right-0 w-full flex justify-center">
          <img
            src={doctorTeam}
            alt="Medical Team"
            className="w-full h-auto object-cover max-h-[95vh]"
            style={{ filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.2))" }}
          />
        </div>
      </div>
      {/* Phần bên phải - Form đăng nhập */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center p-6 md:p-10 relative overflow-y-auto">
        {isLogin ? (
          <Login
            formData={loginFormData}
            setFormData={setLoginFormData}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
            handleSubmit={handleSubmit}
            onSwitchToRegister={() => setIsLogin(false)}
          />
        ) : (
          <Register
            formData={registerFormData}
            setFormData={setRegisterFormData}
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
