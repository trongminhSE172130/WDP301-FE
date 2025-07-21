import React, { useState, useEffect } from "react";
import {
  getPaymentHistory,
  type PaymentHistory,
} from "../service/api/paymentApi";
import {
  ShoppingOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
  CreditCardOutlined,
  GiftOutlined,
  FilterOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import PaymentHistoryModal from "../components/payment/PaymentHistoryModal";

// Helper functions
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("vi-VN");
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
      return <CheckCircleOutlined className="text-green-500" />;
    case "pending":
      return <ClockCircleOutlined className="text-yellow-500" />;
    case "failed":
      return <ExclamationCircleOutlined className="text-red-500" />;
    default:
      return <ClockCircleOutlined className="text-gray-500" />;
  }
};

const getStatusText = (status: string): string => {
  switch (status) {
    case "completed":
      return "Đang sử dụng";
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
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
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

const isExpiring = (expiryDate: string): boolean => {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = Math.ceil(
    (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
};

const isExpired = (expiryDate: string): boolean => {
  const now = new Date();
  const expiry = new Date(expiryDate);
  return expiry < now;
};

// Progress Bar Component
const ProgressBar: React.FC<{ progress: number; isExpiring?: boolean }> = ({
  progress,
  isExpiring = false,
}) => {
  const progressPercentage = Math.max(0, Math.min(100, progress));
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className={`h-2.5 rounded-full transition-all duration-300 ${
          isExpiring ? "bg-yellow-500" : "bg-[#3B9AB8]"
        }`}
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>
  );
};

const PurchasedServicesPage: React.FC = () => {
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>("");

  const handleOpenModal = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPaymentId("");
  };

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        setLoading(true);
        const response = await getPaymentHistory();
        if (response.success) {
          setPaymentHistory(response.data);
          setFilteredHistory(response.data);
        } else {
          setError("Không thể tải lịch sử thanh toán");
        }
      } catch (err) {
        setError("Đã xảy ra lỗi khi tải dữ liệu");
        console.error("Error fetching payment history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  // Filter and sort logic
  useEffect(() => {
    let filtered = [...paymentHistory];

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((payment) => {
        const expiryDate = calculateExpiryDate(
          payment.created_at,
          payment.subscription_plan_id.duration_days
        );
        const expired = isExpired(expiryDate);
        const expiring = isExpiring(expiryDate);

        switch (filterStatus) {
          case "active":
            return payment.status === "completed" && !expired;
          case "expiring":
            return payment.status === "completed" && expiring && !expired;
          case "expired":
            return payment.status === "completed" && expired;
          case "pending":
            return payment.status === "pending";
          case "failed":
            return payment.status === "failed";
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "price-high":
          return b.amount - a.amount;
        case "price-low":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    setFilteredHistory(filtered);
  }, [paymentHistory, filterStatus, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="inline-block"
                  >
                    <LoadingOutlined className="text-5xl text-[#3B9AB8] mb-6" />
                  </motion.div>
                  <motion.h3
                    className="text-xl font-semibold text-gray-800 mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Đang tải dịch vụ của bạn...
                  </motion.h3>
                  <motion.p
                    className="text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Vui lòng chờ trong giây lát
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (error || paymentHistory.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-block"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-[#3B9AB8] to-[#2d7a94] rounded-full flex items-center justify-center mb-6 mx-auto">
                    <GiftOutlined className="text-3xl text-white" />
                  </div>
                </motion.div>

                <motion.h2
                  className="text-2xl font-bold text-gray-800 mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {error || "Chưa có dịch vụ nào được mua"}
                </motion.h2>

                <motion.p
                  className="text-gray-600 mb-8 max-w-md mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Khám phá các gói dịch vụ chăm sóc sức khỏe toàn diện của
                  GenHealth để bắt đầu hành trình sống khỏe mạnh
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <motion.button
                    className="px-8 py-4 bg-gradient-to-r from-[#3B9AB8] to-[#2d7a94] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <PlusOutlined className="text-lg" />
                    Khám phá dịch vụ
                  </motion.button>

                  <motion.button
                    className="px-8 py-4 border-2 border-[#3B9AB8] text-[#3B9AB8] rounded-xl font-semibold hover:bg-[#3B9AB8] hover:text-white transition-all duration-300 flex items-center gap-3"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ShoppingOutlined className="text-lg" />
                    Xem gói khuyến mãi
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Header */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#3B9AB8] to-[#2d7a94] rounded-2xl flex items-center justify-center shadow-lg">
                  <CreditCardOutlined className="text-2xl text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Dịch vụ đã mua
                  </h1>
                  <p className="text-gray-600">
                    Quản lý và theo dõi {paymentHistory.length} gói dịch vụ của
                    bạn
                  </p>
                </div>
              </div>

              <motion.button
                className="px-6 py-4 bg-gradient-to-r from-[#3B9AB8] to-[#2d7a94] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlusOutlined className="text-lg" />
                Mua thêm dịch vụ
              </motion.button>
            </div>
          </motion.div>

          {/* Filter and Sort Controls */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <FilterOutlined className="text-[#3B9AB8]" />
                  <span className="text-sm font-medium text-gray-700">
                    Lọc theo:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "all", label: "Tất cả" },
                    { key: "active", label: "Đang sử dụng" },
                    { key: "expiring", label: "Sắp hết hạn" },
                    { key: "expired", label: "Hết hạn" },
                    { key: "pending", label: "Đang xử lý" },
                    { key: "failed", label: "Thất bại" },
                  ].map((status) => (
                    <motion.button
                      key={status.key}
                      onClick={() => setFilterStatus(status.key)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        filterStatus === status.key
                          ? "bg-[#3B9AB8] text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {status.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <SortAscendingOutlined className="text-[#3B9AB8]" />
                  <span className="text-sm font-medium text-gray-700">
                    Sắp xếp:
                  </span>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#3B9AB8]/20 focus:border-[#3B9AB8] transition-all duration-200"
                  title="Sắp xếp dịch vụ"
                  aria-label="Sắp xếp dịch vụ"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="price-high">Giá cao nhất</option>
                  <option value="price-low">Giá thấp nhất</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Services Grid */}
          <AnimatePresence>
            <div className="grid grid-cols-1 gap-8">
              {filteredHistory.map((payment, index) => {
                const expiryDate = calculateExpiryDate(
                  payment.created_at,
                  payment.subscription_plan_id.duration_days
                );
                const expired = isExpired(expiryDate);
                const expiring = isExpiring(expiryDate);

                let finalStatus = getStatusText(payment.status);
                if (payment.status === "completed") {
                  if (expired) {
                    finalStatus = "Hết hạn";
                  } else if (expiring) {
                    finalStatus = "Sắp hết hạn";
                  }
                }

                return (
                  <motion.div
                    key={payment._id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="flex flex-col lg:flex-row">
                      {/* Enhanced Service Icon/Image Section */}
                      <div className="lg:w-1/4">
                        <div className="w-full h-56 lg:h-full bg-gradient-to-br from-[#3B9AB8] via-[#2d7a94] to-[#1e5f73] flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                          <div className="text-center text-white z-10">
                            <motion.div
                              animate={{ rotate: [0, 360] }}
                              transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="w-20 h-20 border-2 border-white/30 rounded-full flex items-center justify-center mb-4 mx-auto"
                            >
                              <GiftOutlined className="text-3xl" />
                            </motion.div>
                            <h4 className="text-lg font-bold mb-1">
                              Gói Dịch Vụ
                            </h4>
                            <p className="text-sm opacity-90">
                              GenHealth Premium
                            </p>
                            <div className="mt-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                              {payment.subscription_plan_id.duration_days} ngày
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Content Section */}
                      <div className="p-8 lg:w-3/4">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                          <div className="flex-1">
                            <motion.h3
                              className="text-2xl font-bold text-gray-800 mb-3"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              {payment.subscription_plan_id.name}
                            </motion.h3>

                            <motion.p
                              className="text-gray-600 text-base mb-4 leading-relaxed"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              {payment.subscription_plan_id.description}
                            </motion.p>

                            <motion.div
                              className="flex items-center gap-3"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 }}
                            >
                              <div className="flex items-center gap-2">
                                {getStatusIcon(payment.status)}
                                <span
                                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                    expired
                                      ? "bg-red-100 text-red-700 border border-red-200"
                                      : expiring
                                      ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                                      : getStatusColor(payment.status)
                                  }`}
                                >
                                  {finalStatus}
                                </span>
                              </div>
                            </motion.div>
                          </div>

                          <motion.div
                            className="text-right mt-4 lg:mt-0"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            <p className="text-3xl font-bold text-[#3B9AB8] mb-2">
                              {formatPrice(payment.amount)}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <CreditCardOutlined />
                              <span>
                                {payment.payment_method.toUpperCase()}
                              </span>
                            </div>
                          </motion.div>
                        </div>

                        {/* Enhanced Info Grid */}
                        <motion.div
                          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-2 mb-2">
                              <CalendarOutlined className="text-[#3B9AB8]" />
                              <span className="text-sm font-medium text-gray-600">
                                Ngày mua
                              </span>
                            </div>
                            <p className="font-bold text-gray-800">
                              {formatDate(payment.created_at)}
                            </p>
                          </div>

                          <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                            <div className="flex items-center gap-2 mb-2">
                              <CalendarOutlined className="text-green-600" />
                              <span className="text-sm font-medium text-gray-600">
                                Hết hạn
                              </span>
                            </div>
                            <p className="font-bold text-gray-800">
                              {formatDate(expiryDate)}
                            </p>
                          </div>

                          <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                            <div className="flex items-center gap-2 mb-2">
                              <ClockCircleOutlined className="text-purple-600" />
                              <span className="text-sm font-medium text-gray-600">
                                Thời hạn
                              </span>
                            </div>
                            <p className="font-bold text-gray-800">
                              {payment.subscription_plan_id.duration_days} ngày
                            </p>
                          </div>

                          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                            <div className="flex items-center gap-2 mb-2">
                              <CreditCardOutlined className="text-orange-600" />
                              <span className="text-sm font-medium text-gray-600">
                                Mã GD
                              </span>
                            </div>
                            <p className="font-bold text-gray-800 text-xs">
                              {payment.transaction_ref}
                            </p>
                          </div>
                        </motion.div>

                        {/* Enhanced Progress Bar */}
                        {payment.status === "completed" && !expired && (
                          <motion.div
                            className="mb-6"
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                          >
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-sm font-medium text-gray-700">
                                Thời gian còn lại
                              </span>
                              <span className="text-sm font-bold text-[#3B9AB8]">
                                {Math.max(
                                  0,
                                  Math.ceil(
                                    (new Date(expiryDate).getTime() -
                                      new Date().getTime()) /
                                      (1000 * 60 * 60 * 24)
                                  )
                                )}{" "}
                                ngày
                              </span>
                            </div>
                            <div className="relative">
                              <ProgressBar
                                progress={
                                  ((new Date(expiryDate).getTime() -
                                    new Date().getTime()) /
                                    (payment.subscription_plan_id
                                      .duration_days *
                                      24 *
                                      60 *
                                      60 *
                                      1000)) *
                                  100
                                }
                                isExpiring={expiring}
                              />
                            </div>
                          </motion.div>
                        )}

                        {/* Enhanced Footer */}
                        <motion.div
                          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 }}
                        >
                          <div className="text-sm text-gray-500 flex items-center gap-4">
                            <span>Platform: {payment.platform}</span>
                            <span>•</span>
                            <span>
                              Cập nhật: {formatDate(payment.updated_at)}
                            </span>
                          </div>

                          <div className="flex gap-3">
                            <motion.button
                              onClick={() => handleOpenModal(payment._id)}
                              className="px-6 py-3 border-2 border-[#3B9AB8] text-[#3B9AB8] rounded-xl font-semibold hover:bg-[#3B9AB8] hover:text-white transition-all duration-300 flex items-center gap-2"
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Chi tiết →
                            </motion.button>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        </div>
      </div>

      {/* Payment History Modal */}
      <PaymentHistoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        paymentId={selectedPaymentId}
      />
    </div>
  );
};

export default PurchasedServicesPage;
