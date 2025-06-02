import React from "react";
import {
  FiEye,
  FiEyeOff,
  FiMail,
  FiPhone,
  FiLock,
  FiUser,
} from "react-icons/fi";
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
      className="w-full max-w-md bg-white p-8"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      <motion.div className="mb-8" variants={itemVariants}>
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Đăng ký
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Đã có tài khoản?{" "}
          <motion.button
            type="button"
            className="text-[#3BA4B6] font-medium hover:underline cursor-pointer"
            onClick={onSwitchToLogin}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Đăng nhập
          </motion.button>
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email field */}
        <motion.div className="relative" variants={itemVariants}>
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
                setFormData((f: FormData) => ({ ...f, email: e.target.value }))
              }
              placeholder="Nhập Email của bạn"
              className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-[#3BA4B6] focus:border-[#3BA4B6]"
              required
            />
          </div>
        </motion.div>

        {/* Full name field */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Họ và tên
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FiUser size={18} />
            </span>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={(e) =>
                setFormData((f: FormData) => ({
                  ...f,
                  fullName: e.target.value,
                }))
              }
              placeholder="Nhập họ và tên của bạn"
              className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-[#3BA4B6] focus:border-[#3BA4B6]"
              required
            />
          </div>
        </motion.div>

        {/* Phone field */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số điện thoại
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FiPhone size={18} />
            </span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData((f: FormData) => ({ ...f, phone: e.target.value }))
              }
              placeholder="Nhập số điện thoại của bạn"
              className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-[#3BA4B6] focus:border-[#3BA4B6]"
              required
            />
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          variants={itemVariants}
        >
          {/* Gender field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giới tính
            </label>
            <div className="relative">
              <div className="flex gap-2 ">
                {["male", "female"].map((gender) => (
                  <motion.button
                    key={gender}
                    type="button"
                    className={`px-4 py-2 rounded-md border flex-1 
                      ${
                        formData.gender === gender
                          ? "bg-[#3BA4B6] text-white border-[#3BA4B6]"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }
                      font-medium transition`}
                    onClick={() =>
                      setFormData((f: FormData) => ({ ...f, gender }))
                    }
                    whileHover={
                      formData.gender !== gender ? { scale: 1.03 } : {}
                    }
                    whileTap={{ scale: 0.97 }}
                  >
                    {gender === "male" && "Nam"}
                    {gender === "female" && "Nữ"}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Date of birth field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày sinh
            </label>
            <div className="relative">
              {" "}
              <DatePicker
                locale={locale}
                placeholder="Chọn ngày sinh"
                format="DD/MM/YYYY"
                value={formData.dob ? dayjs(formData.dob) : null}
                onChange={(date: Dayjs | null) =>
                  setFormData((f) => ({
                    ...f,
                    dob: date ? date.format("YYYY-MM-DD") : "",
                  }))
                }
                className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-[#3BA4B6] focus:border-[#3BA4B6]"
                style={{ height: "42px" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Password field */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FiLock size={18} />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={(e) =>
                setFormData((f: FormData) => ({
                  ...f,
                  password: e.target.value,
                }))
              }
              placeholder="Nhập mật khẩu của bạn"
              className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-[#3BA4B6] focus:border-[#3BA4B6]"
              required
            />
            <motion.button
              type="button"
              onClick={() => setShowPassword((s: boolean) => !s)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </motion.button>
          </div>
        </motion.div>

        {/* Confirm Password field */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nhập lại mật khẩu
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FiLock size={18} />
            </span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData((f: FormData) => ({
                  ...f,
                  confirmPassword: e.target.value,
                }))
              }
              placeholder="Nhập lại mật khẩu của bạn"
              className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-[#3BA4B6] focus:border-[#3BA4B6]"
              required
            />
            <motion.button
              type="button"
              onClick={() => setShowConfirmPassword((s: boolean) => !s)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {showConfirmPassword ? (
                <FiEyeOff size={18} />
              ) : (
                <FiEye size={18} />
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Register button */}
        <motion.div className="pt-2" variants={itemVariants}>
          <motion.button
            type="submit"
            className="w-full bg-[#3BA4B6] hover:bg-[#2D8A99] text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Đăng ký
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default Register;
