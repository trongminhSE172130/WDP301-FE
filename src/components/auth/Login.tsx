import React from "react";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";

const Login = ({
  formData,
  setFormData,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  handleSubmit,
  onSwitchToRegister,
}) => {
  return (
    <div className="w-full max-w-md bg-white  p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Đăng nhập
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Chưa có tài khoản?{" "}
          <button
            type="button"
            className="text-[#3BA4B6] font-medium hover:underline"
            onClick={onSwitchToRegister}
          >
            Đăng ký
          </button>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email field */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Địa chỉ Email
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FiMail size={18} />
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((f) => ({ ...f, email: e.target.value }))
              }
              placeholder="Nhập địa chỉ Email của bạn"
              className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-[#3BA4B6] focus:border-[#3BA4B6]"
              required
            />
          </div>
        </div>

        {/* Password field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FiLock size={18} />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="Nhập mật khẩu"
              value={formData.password}
              onChange={(e) =>
                setFormData((f) => ({ ...f, password: e.target.value }))
              }
              placeholder="Nhập mật khẩu của bạn"
              className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-[#3BA4B6] focus:border-[#3BA4B6]"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>

        {/* Remember me & Forgot password */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe((s) => !s)}
              className="h-4 w-4 text-[#3BA4B6] border-gray-300 rounded focus:ring-[#3BA4B6]"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700"
            >
              Ghi nhớ tôi
            </label>
          </div>
          <a
            href="#"
            className="text-sm text-[#3BA4B6] font-medium hover:underline"
          >
            Quên mật khẩu?
          </a>
        </div>

        {/* Login button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-[#3BA4B6] hover:bg-[#2D8A99] text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Đăng nhập
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
