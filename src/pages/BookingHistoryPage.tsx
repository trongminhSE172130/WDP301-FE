import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  Button,
  Tag,
  Space,
  Typography,
  Spin,
  Empty,
  Pagination,
  Descriptions,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  FileTextOutlined,
  FilterOutlined,
  EyeOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  BookingHistory,
  getBookingDetailRaw,
  type BookingHistoryParams,
} from "../service/api/bookingAPI";
import { toast } from "react-toastify";
import BookingHistoryModal from "../components/profile/BookingHistoryModal";
import type { BookingData, BookingPagination } from "../types/bookingHistory";
import { STATUS_TEXT, RESULT_STATUS_TEXT } from "../types/bookingHistory";
import dayjs from "dayjs";
import styles from "../styles/pages/BookingHistoryPage.module.css";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const BookingHistoryPage: React.FC = () => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBookingDetail, setSelectedBookingDetail] = useState<any>(null);
  const [resultData, setResultData] = useState<any>(null);
  const [viewingResult, setViewingResult] = useState<string | null>(null);
  const [filters, setFilters] = useState<BookingHistoryParams>({
    page: 1,
    limit: 10,
    sort_by: "created_at",
    sort_order: "desc",
  });
  const [pagination, setPagination] = useState<BookingPagination>({
    currentPage: 1,
    totalPages: 1,
    totalBookings: 0,
    hasNext: false,
    hasPrev: false,
  });

  const fetchBookingHistory = async () => {
    try {
      setLoading(true);
      const response = await BookingHistory(filters);
      //   console.log(response);
      if (response.success) {
        setBookings(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error("Error fetching booking history:", error);
      toast.error("Không thể tải lịch sử đặt lịch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingHistory();
  }, [filters]);

  const handleFilterChange = (key: keyof BookingHistoryParams, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const getAntdStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "orange";
      case "confirmed":
        return "blue";
      case "processing":
        return "cyan";
      case "completed":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  const getAntdResultStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "orange";
      case "ready":
        return "green";
      case "processing":
        return "blue";
      default:
        return "default";
    }
  };

  const ViewResult = async (bookingId: string) => {
    try {
      setViewingResult(bookingId);
      const response = await getBookingDetailRaw(bookingId);
      if (response.success) {
        // API trả về response.data.booking và response.data.result
        // Lưu booking detail raw và result data
        setSelectedBookingDetail(response.data.booking);
        setResultData(response.data.result);
        setModalOpen(true);

        console.log("Booking detail:", response.data.booking);
        console.log("Test result data:", response.data.result);
      } else {
        toast.error("Không thể lấy kết quả đặt lịch");
      }
    } catch (error) {
      console.log("Error fetching booking result:", error);
      toast.error("Không thể lấy kết quả đặt lịch");
    } finally {
      setViewingResult(null);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBookingDetail(null);
    setResultData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Title level={2}>Lịch sử đặt lịch</Title>
          <Text type="secondary">Xem lại tất cả các lịch hẹn đã đặt</Text>
        </div>

        {/* Filters */}
        <Card
          title={
            <Space>
              <FilterOutlined />
              <span>Bộ lọc</span>
            </Space>
          }
          style={{ marginBottom: 24 }}
        >
          <Row gutter={[16, 16]}>
            {/* Status Filter */}
            <Col xs={24} sm={12} md={6}>
              <Text strong>Trạng thái</Text>
              <Select
                placeholder="Chọn trạng thái"
                style={{ width: "100%", marginTop: 8 }}
                value={filters.status || undefined}
                onChange={(value) => handleFilterChange("status", value)}
                allowClear
              >
                <Option value="pending">Chờ xử lý</Option>
                <Option value="confirmed">Đã xác nhận</Option>
                <Option value="processing">Đang xử lý</Option>
                <Option value="completed">Hoàn thành</Option>
                <Option value="cancelled">Đã hủy</Option>
              </Select>
            </Col>

            {/* Date Range */}
            <Col xs={24} sm={12} md={8}>
              <Text strong>Khoảng thời gian</Text>
              <RangePicker
                style={{ width: "100%", marginTop: 8 }}
                onChange={(dates) => {
                  if (dates) {
                    handleFilterChange(
                      "from_date",
                      dates[0]?.format("YYYY-MM-DD")
                    );
                    handleFilterChange(
                      "to_date",
                      dates[1]?.format("YYYY-MM-DD")
                    );
                  } else {
                    handleFilterChange("from_date", undefined);
                    handleFilterChange("to_date", undefined);
                  }
                }}
                value={
                  filters.from_date && filters.to_date
                    ? [dayjs(filters.from_date), dayjs(filters.to_date)]
                    : undefined
                }
              />
            </Col>

            {/* Sort By */}
            <Col xs={24} sm={12} md={6}>
              <Text strong>Sắp xếp theo</Text>
              <Select
                style={{ width: "100%", marginTop: 8 }}
                value={filters.sort_by}
                onChange={(value) => handleFilterChange("sort_by", value)}
              >
                <Option value="created_at">Ngày tạo</Option>
                <Option value="scheduled_date">Ngày hẹn</Option>
                <Option value="updated_at">Ngày cập nhật</Option>
              </Select>
            </Col>

            {/* Sort Order */}
            <Col xs={24} sm={12} md={4}>
              <Text strong>Thứ tự</Text>
              <Select
                style={{ width: "100%", marginTop: 8 }}
                value={filters.sort_order}
                onChange={(value) => handleFilterChange("sort_order", value)}
              >
                <Option value="desc">Mới nhất</Option>
                <Option value="asc">Cũ nhất</Option>
              </Select>
            </Col>
          </Row>
        </Card>

        {/* Booking List */}
        {loading ? (
          <div className={styles.loadingContainer}>
            <Spin
              size="large"
              indicator={
                <LoadingOutlined className={styles.loadingIcon} spin />
              }
            />
            <div className={styles.loadingText}>
              <Text>Đang tải dữ liệu...</Text>
            </div>
          </div>
        ) : bookings.length === 0 ? (
          <Card>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Không có lịch sử đặt lịch nào"
            />
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card
                key={booking._id}
                hoverable
                actions={[
                  booking.canViewResult && (
                    <Button
                      key="view"
                      type="primary"
                      icon={
                        viewingResult === booking._id ? (
                          <LoadingOutlined />
                        ) : (
                          <EyeOutlined />
                        )
                      }
                      loading={viewingResult === booking._id}
                      onClick={() => ViewResult(booking._id)}
                    >
                      {viewingResult === booking._id
                        ? "Đang tải..."
                        : "Xem kết quả"}
                    </Button>
                  ),
                ].filter(Boolean)}
              >
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <div className={styles.bookingHeader}>
                      <Title level={4} className={styles.bookingTitle}>
                        {booking.service}
                      </Title>
                      <Space>
                        <Tag color={getAntdStatusColor(booking.status)}>
                          {STATUS_TEXT[booking.status] || booking.status}
                        </Tag>
                        <Tag
                          color={getAntdResultStatusColor(booking.resultStatus)}
                        >
                          {RESULT_STATUS_TEXT[booking.resultStatus] ||
                            booking.resultStatus}
                        </Tag>
                      </Space>
                    </div>
                  </Col>

                  <Col span={24}>
                    <Descriptions column={{ xs: 1, sm: 2, md: 4 }} size="small">
                      <Descriptions.Item
                        label={
                          <Space>
                            <CalendarOutlined />
                            <span>Ngày hẹn</span>
                          </Space>
                        }
                      >
                        {formatDate(booking.appointmentDate)}
                      </Descriptions.Item>

                      <Descriptions.Item
                        label={
                          <Space>
                            <ClockCircleOutlined />
                            <span>Thời gian</span>
                          </Space>
                        }
                      >
                        {booking.appointmentTime}
                      </Descriptions.Item>

                      <Descriptions.Item
                        label={
                          <Space>
                            <UserOutlined />
                            <span>Bác sĩ</span>
                          </Space>
                        }
                      >
                        {booking.consultantName}
                      </Descriptions.Item>

                      <Descriptions.Item
                        label={
                          <Space>
                            <FileTextOutlined />
                            <span>Ngày đặt</span>
                          </Space>
                        }
                      >
                        {formatDateTime(booking.bookingDate)}
                      </Descriptions.Item>
                    </Descriptions>
                  </Col>

                  <Col span={24}>
                    <Text type="secondary">{booking.serviceDescription}</Text>
                  </Col>
                </Row>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className={styles.paginationContainer}>
            <Pagination
              current={pagination.currentPage}
              total={pagination.totalBookings}
              pageSize={filters.limit}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} của ${total} kết quả`
              }
              onChange={(page, pageSize) => {
                handleFilterChange("page", page);
                if (pageSize !== filters.limit) {
                  handleFilterChange("limit", pageSize);
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Modal hiển thị kết quả */}
      <BookingHistoryModal
        isOpen={modalOpen}
        onClose={closeModal}
        bookingDetail={selectedBookingDetail}
        resultData={resultData}
      />
    </div>
  );
};

export default BookingHistoryPage;
