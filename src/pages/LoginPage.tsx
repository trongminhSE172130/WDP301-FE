import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import doctorTeam from "../assets/img/freepik-export-202406130959061bQ8 1.png";
import logo from "../assets/img/streamline_health-care-2-solid.png";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { registerUser, loginUser } from "../service/api/authApi";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return true;
    // exp là số giây kể từ epoch
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isTokenExpired(token)) {
      localStorage.removeItem("token");
      // Nếu có lưu user thì xóa luôn
      localStorage.removeItem("user");
      navigate("/login");
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      try {
        const res = await loginUser(loginFormData);
        console.log('Login response:', res);
        
        // Xử lý response theo structure mới từ backend
        if (res.data && res.data.success && res.data.token && res.data.user) {
          // Note: SessionManager sẽ được gọi tự động trong loginUser function
          toast.success("Đăng nhập thành công!");
          navigate("/");
          window.location.reload();
        } else {
          alert("Đăng nhập thất bại. Không nhận được token.");
        }
      } catch (error: unknown) {
        type AxiosError = { response?: { data?: { message?: string } } };
        let message = "Đăng nhập thất bại. Vui lòng thử lại!";
        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error
        ) {
          const axiosError = error as AxiosError;
          const errorMessage = axiosError.response?.data?.message;
          if (typeof errorMessage === "string") {
            message = errorMessage;
          }
        }
        alert(message);
      }
    } else {
      // Xử lý đăng ký
      try {
        const registerData = {
          full_name: registerFormData.fullName,
          email: registerFormData.email,
          phone: registerFormData.phone,
          gender: registerFormData.gender,
          dob: registerFormData.dob,
          password: registerFormData.password,
          role: "user"
        };
        const res = await registerUser(registerData);
        console.log('Register response:', res);
        // Nếu backend trả về user, có thể lưu vào localStorage nếu muốn
        if (res.data && res.data.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
          console.log('User after register:', localStorage.getItem('user'));
        }
        // Xóa user khỏi localStorage sau khi đăng ký thành công
        localStorage.removeItem('user');
        toast.success("Đăng ký thành công! Hãy đăng nhập.");
        setIsLogin(true);
      } catch (error: unknown) {
        // Đơn giản hóa lấy message lỗi từ backend
        type RegisterError = { response?: { data?: { message?: string } } };
        const err = error as RegisterError;
        const message = err?.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!";
        alert(message);
      }
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={7000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
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
    </>
  );
};

export default LoginPage;
