import { useState } from "react";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  MailOutlined,
  LockOutlined,
  LoginOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

interface LoginProps {
  formData: {
    email: string;
    password: string;
    [key: string]: any;
  };
  setFormData: React.Dispatch<React.SetStateAction<{ email: string; password: string; [key: string]: any }>>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({
  formData,
  setFormData,
  showPassword,
  setShowPassword,
  handleSubmit,
  onSwitchToRegister,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [fieldStates, setFieldStates] = useState<{ [key: string]: 'success' | 'error' | undefined }>({});

  // Validate email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle input change with validation
  const handleInputChange = (field: string, value: string) => {
    setFormData((f) => ({ ...f, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }

    // Real-time validation feedback
    if (field === "email" && value) {
      setFieldStates((prev) => ({
        ...prev,
        email: validateEmail(value) ? "success" : "error",
      }));
    } else if (field === "password" && value) {
      setFieldStates((prev) => ({
        ...prev,
        password: value.length >= 6 ? "success" : "error",
      }));
    }
  };

  // Enhanced submit handler
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      await handleSubmit(e);
    } catch (error) {
      setErrors({ general: "Đăng nhập thất bại. Vui lòng thử lại." });
    } finally {
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
        staggerChildren: 0.1,
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
      className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 backdrop-blur-sm"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.div className="mb-8 text-center" variants={itemVariants}>
        <div className="w-16 h-16 bg-gradient-to-r from-[#3B9AB8] to-[#2d7a94] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <LoginOutlined className="text-white text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Đăng nhập</h1>
        <p className="text-gray-500">
          Chưa có tài khoản?{" "}
          <motion.button
            type="button"
            className="text-[#3B9AB8] font-semibold hover:text-[#2d7a94] transition-colors duration-200"
            onClick={onSwitchToRegister}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Đăng ký ngay
          </motion.button>
        </p>
      </motion.div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
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
              placeholder="Nhập địa chỉ Email của bạn"
              className={`w-full border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white ${
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
              className={`w-full border rounded-xl py-3.5 pl-12 pr-12 focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white ${
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
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#3B9AB8] transition-colors duration-200"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
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

        {/* Login button */}
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
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <LoginOutlined />
                  Đăng nhập
                </>
              )}
            </span>
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default Login;
