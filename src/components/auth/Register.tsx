import React, { useState } from "react";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  UserOutlined,
  UserAddOutlined,
  ManOutlined,
  WomanOutlined,
  CalendarOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { DatePicker } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import locale from "antd/lib/date-picker/locale/vi_VN";
import { motion } from "framer-motion";

interface FormData {
  email: string;
  fullName: string;
  phone: string;
  gender: string;
  dob: string;
  password: string;
  confirmPassword: string;
}

interface RegisterProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showConfirmPassword: boolean;
  setShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: (e: React.FormEvent) => void;
  onSwitchToLogin: () => void;
}

const Register = ({
  formData,
  setFormData,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  handleSubmit,
  onSwitchToLogin,
}: RegisterProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fieldStates, setFieldStates] = useState<Record<string, string>>({});

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const validatePassword = (password: string) => {
    return (
      password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)
    );
  };

  // Handle input change with validation
  const handleInputChange = (field: string, value: string) => {
    setFormData((f) => ({ ...f, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Real-time validation feedback
    let isValid = false;
    switch (field) {
      case "email":
        isValid = validateEmail(value);
        break;
      case "fullName":
        isValid = value.trim().length >= 2;
        break;
      case "phone":
        isValid = validatePhone(value);
        break;
      case "password":
        isValid = validatePassword(value);
        break;
      case "confirmPassword":
        isValid = value === formData.password && value.length > 0;
        break;
    }

    if (value) {
      setFieldStates((prev) => ({
        ...prev,
        [field]: isValid ? "success" : "error",
      }));
    } else {
      setFieldStates((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Enhanced submit handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Comprehensive validation
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Họ và tên là bắt buộc";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Họ và tên phải có ít nhất 2 ký tự";
    }

    if (!formData.phone) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ (10-11 chữ số)";
    }

    if (!formData.gender) {
      newErrors.gender = "Vui lòng chọn giới tính";
    }

    if (!formData.dob) {
      newErrors.dob = "Vui lòng chọn ngày sinh";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      await handleSubmit(e);
      setIsLoading(false);
    } catch (error) {
      setErrors({ general: "Đăng ký thất bại. Vui lòng thử lại." });
      setIsLoading(false);
    }
  };

  // Get field validation icon
  const getFieldIcon = (field: string, defaultIcon: React.ReactNode) => {
    const state = fieldStates[field];
    if (state === "success")
      return <CheckCircleOutlined className="text-green-500" />;
    if (state === "error")
      return <ExclamationCircleOutlined className="text-red-500" />;
    return defaultIcon;
  };
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.08,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  };

  const buttonVariants = {
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98 },
  };

  return (
    <motion.div
      className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 backdrop-blur-sm"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.div className="mb-8 text-center" variants={itemVariants}>
        <div className="w-16 h-16 bg-gradient-to-r from-[#3B9AB8] to-[#2d7a94] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <UserAddOutlined className="text-white text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Đăng ký</h1>
        <p className="text-gray-500">
          Đã có tài khoản?{" "}
          <motion.button
            type="button"
            className="text-[#3B9AB8] font-semibold hover:text-[#2d7a94] transition-colors duration-200"
            onClick={onSwitchToLogin}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Đăng nhập ngay
          </motion.button>
        </p>
      </motion.div>

      <form onSubmit={handleFormSubmit} className="space-y-5">
        {/* General Error */}
        {errors.general && (
          <motion.div
            className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {errors.general}
          </motion.div>
        )}

        {/* Email field */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Địa chỉ Email
          </label>
          <div className="relative group">
            <div
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                errors.email
                  ? "text-red-500"
                  : fieldStates.email === "success"
                  ? "text-green-500"
                  : "text-gray-400 group-focus-within:text-[#3B9AB8]"
              }`}
            >
              {getFieldIcon("email", <MailOutlined className="text-lg" />)}
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Nhập Email của bạn"
              className={`w-full border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white ${
                errors.email
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                  : fieldStates.email === "success"
                  ? "border-green-300 focus:border-green-500 focus:ring-green-500/20"
                  : "border-gray-300 focus:border-[#3B9AB8] focus:ring-[#3B9AB8]/20"
              }`}
              required
            />
          </div>
          {errors.email && (
            <motion.p
              className="text-red-500 text-sm mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.email}
            </motion.p>
          )}
        </motion.div>

        {/* Full name field */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Họ và tên
          </label>
          <div className="relative group">
            <div
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                errors.fullName
                  ? "text-red-500"
                  : fieldStates.fullName === "success"
                  ? "text-green-500"
                  : "text-gray-400 group-focus-within:text-[#3B9AB8]"
              }`}
            >
              {getFieldIcon("fullName", <UserOutlined className="text-lg" />)}
            </div>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              placeholder="Nhập họ và tên của bạn"
              className={`w-full border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white ${
                errors.fullName
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                  : fieldStates.fullName === "success"
                  ? "border-green-300 focus:border-green-500 focus:ring-green-500/20"
                  : "border-gray-300 focus:border-[#3B9AB8] focus:ring-[#3B9AB8]/20"
              }`}
              required
            />
          </div>
          {errors.fullName && (
            <motion.p
              className="text-red-500 text-sm mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.fullName}
            </motion.p>
          )}
        </motion.div>

        {/* Phone field */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Số điện thoại
          </label>
          <div className="relative group">
            <div
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                errors.phone
                  ? "text-red-500"
                  : fieldStates.phone === "success"
                  ? "text-green-500"
                  : "text-gray-400 group-focus-within:text-[#3B9AB8]"
              }`}
            >
              {getFieldIcon("phone", <PhoneOutlined className="text-lg" />)}
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="Nhập số điện thoại của bạn"
              className={`w-full border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white ${
                errors.phone
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                  : fieldStates.phone === "success"
                  ? "border-green-300 focus:border-green-500 focus:ring-green-500/20"
                  : "border-gray-300 focus:border-[#3B9AB8] focus:ring-[#3B9AB8]/20"
              }`}
              required
            />
          </div>
          {errors.phone && (
            <motion.p
              className="text-red-500 text-sm mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.phone}
            </motion.p>
          )}
        </motion.div>

        {/* Gender and DOB row */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          variants={itemVariants}
        >
          {/* Gender field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Giới tính
            </label>
            <div className="flex gap-2">
              {[
                { value: "male", icon: <ManOutlined />, label: "Nam" },
                { value: "female", icon: <WomanOutlined />, label: "Nữ" },
              ].map((gender) => (
                <motion.button
                  key={gender.value}
                  type="button"
                  className={`px-4 py-3 rounded-xl border flex-1 flex items-center justify-center gap-2 font-medium transition-all duration-200 ${
                    formData.gender === gender.value
                      ? "bg-gradient-to-r from-[#3B9AB8] to-[#2d7a94] text-white border-[#3B9AB8] shadow-md"
                      : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-[#3B9AB8]/50"
                  }`}
                  onClick={() => handleInputChange("gender", gender.value)}
                  whileHover={
                    formData.gender !== gender.value ? { scale: 1.02 } : {}
                  }
                  whileTap={{ scale: 0.98 }}
                >
                  {gender.icon}
                  {gender.label}
                </motion.button>
              ))}
            </div>
            {errors.gender && (
              <motion.p
                className="text-red-500 text-sm mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {errors.gender}
              </motion.p>
            )}
          </div>

          {/* Date of birth field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ngày sinh
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#3B9AB8] transition-colors duration-200 z-10">
                <CalendarOutlined className="text-lg" />
              </div>
              <DatePicker
                locale={locale}
                placeholder="Chọn ngày sinh"
                format="DD/MM/YYYY"
                value={formData.dob ? dayjs(formData.dob) : null}
                onChange={(date: Dayjs | null) =>
                  handleInputChange(
                    "dob",
                    date ? date.format("YYYY-MM-DD") : ""
                  )
                }
                className={`w-full border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white ${
                  errors.dob
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-300 focus:border-[#3B9AB8] focus:ring-[#3B9AB8]/20"
                }`}
                style={{
                  height: "48px",
                  paddingLeft: "48px",
                }}
              />
            </div>
            {errors.dob && (
              <motion.p
                className="text-red-500 text-sm mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {errors.dob}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Password field */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Mật khẩu
          </label>
          <div className="relative group">
            <div
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                errors.password
                  ? "text-red-500"
                  : fieldStates.password === "success"
                  ? "text-green-500"
                  : "text-gray-400 group-focus-within:text-[#3B9AB8]"
              }`}
            >
              {getFieldIcon("password", <LockOutlined className="text-lg" />)}
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Nhập mật khẩu của bạn"
              className={`w-full border rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white ${
                errors.password
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                  : fieldStates.password === "success"
                  ? "border-green-300 focus:border-green-500 focus:ring-green-500/20"
                  : "border-gray-300 focus:border-[#3B9AB8] focus:ring-[#3B9AB8]/20"
              }`}
              required
            />
            <motion.button
              type="button"
              onClick={() => setShowPassword((s: boolean) => !s)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#3B9AB8] transition-colors duration-200"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {showPassword ? (
                <EyeInvisibleOutlined className="text-lg" />
              ) : (
                <EyeOutlined className="text-lg" />
              )}
            </motion.button>
          </div>
          {errors.password && (
            <motion.p
              className="text-red-500 text-sm mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.password}
            </motion.p>
          )}
        </motion.div>

        {/* Confirm Password field */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nhập lại mật khẩu
          </label>
          <div className="relative group">
            <div
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                errors.confirmPassword
                  ? "text-red-500"
                  : fieldStates.confirmPassword === "success"
                  ? "text-green-500"
                  : "text-gray-400 group-focus-within:text-[#3B9AB8]"
              }`}
            >
              {getFieldIcon(
                "confirmPassword",
                <LockOutlined className="text-lg" />
              )}
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              placeholder="Nhập lại mật khẩu của bạn"
              className={`w-full border rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white ${
                errors.confirmPassword
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                  : fieldStates.confirmPassword === "success"
                  ? "border-green-300 focus:border-green-500 focus:ring-green-500/20"
                  : "border-gray-300 focus:border-[#3B9AB8] focus:ring-[#3B9AB8]/20"
              }`}
              required
            />
            <motion.button
              type="button"
              onClick={() => setShowConfirmPassword((s: boolean) => !s)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#3B9AB8] transition-colors duration-200"
              aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {showConfirmPassword ? (
                <EyeInvisibleOutlined className="text-lg" />
              ) : (
                <EyeOutlined className="text-lg" />
              )}
            </motion.button>
          </div>
          {errors.confirmPassword && (
            <motion.p
              className="text-red-500 text-sm mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.confirmPassword}
            </motion.p>
          )}
        </motion.div>

        {/* Register button */}
        <motion.div className="pt-4" variants={itemVariants}>
          <motion.button
            type="submit"
            disabled={isLoading}
            className={`w-full font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-[#3B9AB8] to-[#2d7a94] hover:from-[#2d7a94] hover:to-[#1e5a6b] hover:-translate-y-0.5"
            } text-white`}
            variants={buttonVariants}
            whileHover={!isLoading ? "hover" : undefined}
            whileTap={!isLoading ? "tap" : undefined}
          >
            <span className="flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <LoadingOutlined className="animate-spin" />
                  Đang đăng ký...
                </>
              ) : (
                <>
                  <UserAddOutlined />
                  Đăng ký tài khoản
                </>
              )}
            </span>
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default Register;
