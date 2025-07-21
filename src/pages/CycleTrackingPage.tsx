import React, { useState, useEffect } from "react";
import {
  getFemaleTrackings,
  type FemaleTracking,
} from "../service/api/femaleReproductiveTrackingApi";
import {
  CalendarOutlined,
  HeartOutlined,
  BarChartOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

// Helper functions for date calculations
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("vi-VN");
};

const calculateDaysBetween = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Progress Bar Component
const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  const progressPercentage = Math.min(progress, 100);
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <div
        className={`bg-[#3B9AB8] h-2.5 rounded-full transition-all duration-300`}
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>
  );
};

const getCurrentCycleInfo = (trackings: FemaleTracking[]) => {
  if (!trackings.length) return null;

  // Get the most recent cycle
  const latestCycle = trackings.sort(
    (a, b) =>
      new Date(b.cycle_start_date).getTime() -
      new Date(a.cycle_start_date).getTime()
  )[0];

  const startDate = new Date(latestCycle.cycle_start_date);
  const today = new Date();
  const currentDay =
    calculateDaysBetween(latestCycle.cycle_start_date, today.toISOString()) + 1;

  // Calculate predicted end date based on cycle length
  const predictedEndDate = new Date(startDate);
  predictedEndDate.setDate(startDate.getDate() + latestCycle.cycle_length);

  return {
    startDate: latestCycle.cycle_start_date,
    predictedEndDate: predictedEndDate.toISOString(),
    day: currentDay,
    totalDays: latestCycle.cycle_length,
    cycleData: latestCycle,
  };
};

const calculateAverageStats = (trackings: FemaleTracking[]) => {
  if (!trackings.length)
    return { averageCycleLength: 0, averagePeriodLength: 5 };

  const totalLength = trackings.reduce(
    (sum, cycle) => sum + cycle.cycle_length,
    0
  );
  const averageCycleLength = Math.round(totalLength / trackings.length);

  return {
    averageCycleLength,
    averagePeriodLength: 5, // Default period length since API doesn't provide this
  };
};

const predictNextPeriod = (trackings: FemaleTracking[]): string => {
  if (!trackings.length) return "";

  const latestCycle = trackings.sort(
    (a, b) =>
      new Date(b.cycle_start_date).getTime() -
      new Date(a.cycle_start_date).getTime()
  )[0];

  const nextPeriodDate = new Date(latestCycle.cycle_start_date);
  nextPeriodDate.setDate(nextPeriodDate.getDate() + latestCycle.cycle_length);

  return nextPeriodDate.toISOString();
};

const CycleTrackingPage: React.FC = () => {
  const [trackingData, setTrackingData] = useState<FemaleTracking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        setLoading(true);
        const response = await getFemaleTrackings();
        if (response.success) {
          setTrackingData(response.data);
        } else {
          setError("Không thể tải dữ liệu theo dõi chu kỳ");
        }
      } catch (err) {
        setError("Đã xảy ra lỗi khi tải dữ liệu");
        console.error("Error fetching female tracking data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingData();
  }, []);

  // Calculate derived data
  const currentCycle = getCurrentCycleInfo(trackingData);
  const averageStats = calculateAverageStats(trackingData);
  const nextPeriod = predictNextPeriod(trackingData);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-6 bg-white rounded-4xl border border-gray-300">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <LoadingOutlined className="text-4xl text-[#3B9AB8] mb-4" spin />
              <p className="text-gray-600">
                Đang tải dữ liệu theo dõi chu kỳ...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentCycle) {
    return (
      <div className="container mx-auto px-6 py-6 bg-white rounded-4xl border border-gray-300">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-12">
            <HeartOutlined className="text-6xl text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {error || "Chưa có dữ liệu chu kỳ"}
            </h2>
            <p className="text-gray-600 mb-6">
              Hãy bắt đầu theo dõi chu kỳ kinh nguyệt của bạn để có thông tin
              chi tiết
            </p>
            <motion.button
              className="px-6 py-3 bg-[#3B9AB8] text-white rounded-lg hover:bg-[#2d7a94] transition-colors flex items-center gap-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PlusOutlined />
              Thêm chu kỳ mới
            </motion.button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-6 py-6 bg-white rounded-4xl border border-gray-300">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Theo dõi chu kỳ kinh nguyệt
          </h1>
          <p className="text-gray-600">
            Theo dõi và dự đoán chu kỳ kinh nguyệt của bạn
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Cycle Status */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Chu kỳ hiện tại
              </h2>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-600">Ngày bắt đầu</p>
                  <p className="text-lg font-medium text-[#3B9AB8]">
                    {formatDate(currentCycle.startDate)}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-[#3B9AB8] text-white flex items-center justify-center mb-2">
                    <div>
                      <div className="text-2xl font-bold">
                        {currentCycle.day}
                      </div>
                      <div className="text-xs">
                        Ngày {currentCycle.totalDays}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Chu kỳ hiện tại</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Dự kiến kết thúc</p>
                  <p className="text-lg font-medium text-[#3B9AB8]">
                    {formatDate(currentCycle.predictedEndDate)}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <ProgressBar
                progress={(currentCycle.day / currentCycle.totalDays) * 100}
              />

              {/* Cycle Info */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Thời gian rụng trứng</p>
                  <p className="text-lg font-medium text-[#3B9AB8]">
                    {formatDate(currentCycle.cycleData.ovulation_day)}
                  </p>
                </div>
                <div className="bg-pink-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Cửa sổ thụ thai</p>
                  <p className="text-sm font-medium text-pink-600">
                    {currentCycle.cycleData.fertility_window || "Chưa xác định"}
                  </p>
                </div>
              </div>

              {currentCycle.cycleData.notes && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Ghi chú</p>
                  <p className="text-gray-800">
                    {currentCycle.cycleData.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Calendar Section */}
            {/* <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Lịch theo dõi
              </h2>
              <div className="h-64 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                Calendar Component
              </div>
            </div> */}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <BarChartOutlined className="text-[#3B9AB8]" />
                Thống kê
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Chu kỳ trung bình</p>
                  <p className="text-lg font-medium">
                    {averageStats.averageCycleLength} ngày
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Thời gian kinh nguyệt</p>
                  <p className="text-lg font-medium">
                    {averageStats.averagePeriodLength} ngày
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Chu kỳ tiếp theo</p>
                  <p className="text-lg font-medium text-[#3B9AB8]">
                    {formatDate(nextPeriod)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Tổng số chu kỳ đã theo dõi
                  </p>
                  <p className="text-lg font-medium text-green-600">
                    {trackingData.length} chu kỳ
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Cycles */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CalendarOutlined className="text-[#3B9AB8]" />
                Chu kỳ gần đây
              </h2>
              <div className="space-y-3">
                {trackingData.slice(0, 3).map((cycle, index) => (
                  <div
                    key={cycle._id}
                    className={`p-3 rounded-lg border-l-4 ${
                      index === 0
                        ? "border-[#3B9AB8] bg-blue-50"
                        : "border-gray-300 bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">
                          {formatDate(cycle.cycle_start_date)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Chu kỳ {cycle.cycle_length} ngày
                        </p>
                        {cycle.notes && (
                          <p className="text-xs text-gray-500 mt-1">
                            {cycle.notes}
                          </p>
                        )}
                      </div>
                      {index === 0 && (
                        <span className="px-2 py-1 bg-[#3B9AB8] text-white text-xs rounded-full">
                          Hiện tại
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CycleTrackingPage;
