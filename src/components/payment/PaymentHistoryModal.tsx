import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getPaymentHistoryById,
  type PaymentHistory,
} from "../../service/api/paymentApi";
import {
  CloseOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
  LoadingOutlined,
  PhoneOutlined,
  DesktopOutlined,
  BankOutlined,
  SafetyOutlined,
  GiftOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

interface PaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentId: string;
}

// Helper functions
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircleOutlined className="text-green-500 text-2xl" />;
    case "pending":
      return <ClockCircleOutlined className="text-yellow-500 text-2xl" />;
    case "failed":
      return <ExclamationCircleOutlined className="text-red-500 text-2xl" />;
    default:
      return <ClockCircleOutlined className="text-gray-500 text-2xl" />;
  }
};

const getStatusText = (status: string): string => {
  switch (status) {
    case "completed":
      return "Thành công";
    case "pending":
      return "Đang xử lý";
    case "failed":
      return "Thất bại";
    default:
      return "Không xác định";
  }
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case "completed":
      return "text-green-600 bg-green-50 border-green-200";
    case "pending":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "failed":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

const calculateExpiryDate = (
  createdDate: string,
  durationDays: number
): string => {
  const created = new Date(createdDate);
  const expiry = new Date(created);
  expiry.setDate(created.getDate() + durationDays);
  return expiry.toISOString();
};

const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({
  isOpen,
  onClose,
  paymentId,
}) => {
  const [payment, setPayment] = useState<PaymentHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentDetail = async () => {
      if (!isOpen || !paymentId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await getPaymentHistoryById(paymentId);
        if (response.success) {
          setPayment(response.data);
        } else {
          setError("Không thể tải chi tiết thanh toán");
        }
      } catch (err) {
        setError("Đã xảy ra lỗi khi tải dữ liệu");
        console.error("Error fetching payment detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetail();
  }, [isOpen, paymentId]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-[#3B9AB8] to-[#2d7a94] p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <FileTextOutlined className="text-2xl text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Chi tiết thanh toán
                  </h2>
                  <p className="text-white/80">Thông tin giao dịch chi tiết</p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <CloseOutlined className="text-white text-lg" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="inline-block mb-4"
                  >
                    <LoadingOutlined className="text-4xl text-[#3B9AB8]" />
                  </motion.div>
                  <p className="text-gray-600">
                    Đang tải chi tiết thanh toán...
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <ExclamationCircleOutlined className="text-5xl text-red-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Có lỗi xảy ra
                </h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <motion.button
                  onClick={onClose}
                  className="px-6 py-3 bg-[#3B9AB8] text-white rounded-xl font-semibold hover:bg-[#2d7a94] transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Đóng
                </motion.button>
              </div>
            )}

            {payment && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Payment Status Section */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800">
                      Trạng thái giao dịch
                    </h3>
                    <div
                      className={`flex items-center gap-3 px-4 py-2 rounded-xl border-2 ${getStatusColor(
                        payment.status
                      )}`}
                    >
                      {getStatusIcon(payment.status)}
                      <span className="font-bold text-lg">
                        {getStatusText(payment.status)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <DollarOutlined className="text-[#3B9AB8] text-xl" />
                        <span className="text-sm text-gray-600 font-medium">
                          Số tiền
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-[#3B9AB8]">
                        {formatPrice(payment.amount)}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <BankOutlined className="text-green-600 text-xl" />
                        <span className="text-sm text-gray-600 font-medium">
                          Phương thức
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-800">
                        {payment.payment_method.toUpperCase()}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        {payment.platform === "web" ? (
                          <DesktopOutlined className="text-blue-600 text-xl" />
                        ) : (
                          <PhoneOutlined className="text-purple-600 text-xl" />
                        )}
                        <span className="text-sm text-gray-600 font-medium">
                          Platform
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-800 capitalize">
                        {payment.platform}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Information */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#3B9AB8] to-[#2d7a94] rounded-xl flex items-center justify-center">
                      <GiftOutlined className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Thông tin dịch vụ
                      </h3>
                      <p className="text-gray-600">
                        Chi tiết gói dịch vụ đã mua
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-blue-200">
                    <h4 className="text-2xl font-bold text-gray-800 mb-3">
                      {payment.subscription_plan_id.name}
                    </h4>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {payment.subscription_plan_id.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <CalendarOutlined className="text-[#3B9AB8] text-lg" />
                          <div>
                            <p className="text-sm text-gray-600">
                              Thời hạn gói
                            </p>
                            <p className="font-bold text-gray-800">
                              {payment.subscription_plan_id.duration_days} ngày
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <DollarOutlined className="text-green-600 text-lg" />
                          <div>
                            <p className="text-sm text-gray-600">Giá gói</p>
                            <p className="font-bold text-gray-800">
                              {formatPrice(payment.subscription_plan_id.price)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <CalendarOutlined className="text-blue-600 text-lg" />
                          <div>
                            <p className="text-sm text-gray-600">
                              Ngày bắt đầu
                            </p>
                            <p className="font-bold text-gray-800">
                              {formatDate(payment.created_at)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <CalendarOutlined className="text-red-600 text-lg" />
                          <div>
                            <p className="text-sm text-gray-600">
                              Ngày hết hạn
                            </p>
                            <p className="font-bold text-gray-800">
                              {formatDate(
                                calculateExpiryDate(
                                  payment.created_at,
                                  payment.subscription_plan_id.duration_days
                                )
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                      <SafetyOutlined className="text-gray-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Chi tiết giao dịch
                      </h3>
                      <p className="text-gray-600">
                        Thông tin kỹ thuật và bảo mật
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-3 mb-3">
                        <InfoCircleOutlined className="text-[#3B9AB8] text-lg" />
                        <span className="font-medium text-gray-700">
                          Mã giao dịch
                        </span>
                      </div>
                      <p className="text-sm font-mono bg-gray-100 p-2 rounded border break-all">
                        {payment.transaction_ref}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-3 mb-3">
                        <BankOutlined className="text-green-600 text-lg" />
                        <span className="font-medium text-gray-700">
                          VNPay Reference
                        </span>
                      </div>
                      <p className="text-sm font-mono bg-gray-100 p-2 rounded border break-all">
                        {payment.vnp_TxnRef}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-3 mb-3">
                        <CalendarOutlined className="text-blue-600 text-lg" />
                        <span className="font-medium text-gray-700">
                          Ngày tạo
                        </span>
                      </div>
                      <p className="font-medium text-gray-800">
                        {formatDate(payment.created_at)}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-3 mb-3">
                        <CalendarOutlined className="text-purple-600 text-lg" />
                        <span className="font-medium text-gray-700">
                          Cập nhật cuối
                        </span>
                      </div>
                      <p className="font-medium text-gray-800">
                        {formatDate(payment.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <motion.button
                    onClick={onClose}
                    className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Đóng
                  </motion.button>

                  {payment.status === "completed" && (
                    <motion.button
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-[#3B9AB8] to-[#2d7a94] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Sử dụng dịch vụ
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentHistoryModal;
