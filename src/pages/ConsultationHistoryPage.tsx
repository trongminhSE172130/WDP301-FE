import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Select,
  Button,
  Typography,
  Spin,
  Empty,
  Tag,
  Space,
  DatePicker,
  Avatar,
  message,
} from "antd";
import {
  CalendarOutlined,
  VideoCameraOutlined,
  UserOutlined,
  EyeOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

// Add isBetween plugin
dayjs.extend(isBetween);
import { getConsultationHistory } from "../service/api/consultantAPI";
import {
  transformConsultationData,
  groupConsultationsByDate,
  getStatusColor,
  getStatusText,
  canJoinMeeting,
} from "../utils/consultationHistoryUtils";
import type { ConsultationData } from "../types/consultationHistory";
import ConsultationDetailModal from "../components/consultant/ConsultationDetailModal";
import styles from "../styles/pages/ConsultationHistoryPage.module.css";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const ConsultationHistoryPage: React.FC = () => {
  const [consultations, setConsultations] = useState<ConsultationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: null as any,
    status: "all" as string,
  });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedConsultationId, setSelectedConsultationId] =
    useState<string>("");

  const fetchConsultationHistory = async () => {
    try {
      setLoading(true);
      const response = await getConsultationHistory();

      if (response.success) {
        const transformedData = response.data.map(transformConsultationData);
        setConsultations(transformedData);
      } else {
        message.error("Không thể tải danh sách lịch tư vấn");
      }
    } catch (error) {
      console.error("Error fetching consultation history:", error);
      message.error("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (consultation: ConsultationData) => {
    setSelectedConsultationId(consultation._id);
    setDetailModalVisible(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedConsultationId("");
  };

  useEffect(() => {
    fetchConsultationHistory();
  }, []);

  const filteredConsultations = consultations.filter((consultation) => {
    // Filter by status
    if (filters.status !== "all" && consultation.status !== filters.status) {
      return false;
    }

    // Filter by date range
    if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
      const consultationDate = dayjs(consultation.date, "DD/MM/YYYY");
      const [startDate, endDate] = filters.dateRange;
      if (!consultationDate.isBetween(startDate, endDate, "day", "[]")) {
        return false;
      }
    }

    return true;
  });

  const groupedConsultations = groupConsultationsByDate(filteredConsultations);

  const handleJoinMeeting = (consultation: ConsultationData) => {
    if (canJoinMeeting(consultation)) {
      window.open(consultation.meetingLink!, "_blank");
    } else {
      message.warning("Link cuộc họp chưa sẵn sàng hoặc cuộc họp đã kết thúc");
    }
  };

  const renderConsultationCard = (consultation: ConsultationData) => (
    <Card key={consultation._id} className={styles.consultationCard} hoverable>
      <Row align="middle">
        <Col xs={24} sm={16}>
          <Space size="middle">
            <div className={styles.avatarContainer}>
              <Avatar
                size={48}
                icon={<UserOutlined />}
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  consultation.consultantName
                )}&background=3b82f6&color=fff`}
              />
            </div>
            <div className={styles.consultantInfo}>
              <Title level={5} className={styles.consultantName}>
                {consultation.consultantName}
              </Title>
              <Text className={styles.consultantSpecialty}>
                {consultation.specialty}
              </Text>
            </div>
          </Space>
        </Col>
        <Col xs={24} sm={8}>
          <div className={styles.dateTimeInfo}>
            <Text className={styles.date}>{consultation.date}</Text>
            <br />
            <Text className={styles.time}>{consultation.time}</Text>
          </div>
        </Col>
      </Row>

      <div className={styles.cardFooter}>
        <div className={styles.statusInfo}>
          <Tag color={getStatusColor(consultation.status)}>
            {getStatusText(consultation.status)}
          </Tag>
          <Tag color={getStatusColor(consultation.meetingStatus, "meeting")}>
            {getStatusText(consultation.meetingStatus, "meeting")}
          </Tag>
          {consultation.question && (
            <Text className={styles.question}>"{consultation.question}"</Text>
          )}
        </div>
        <div className={styles.actionButtons}>
          {canJoinMeeting(consultation) ? (
            <Button
              type="primary"
              icon={<VideoCameraOutlined />}
              className={styles.joinButton}
              onClick={() => handleJoinMeeting(consultation)}
            >
              Tham gia
            </Button>
          ) : consultation.meetingLink &&
            consultation.meetingLink !== "null" ? (
            <Button
              disabled
              icon={<VideoCameraOutlined />}
              className={styles.disabledJoinButton}
            >
              Đã kết thúc
            </Button>
          ) : null}
          <Button
            type="default"
            icon={<EyeOutlined />}
            className={styles.detailButton}
            onClick={() => handleViewDetail(consultation)}
          >
            Chi tiết
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderConsultationGroup = (
    title: string,
    consultations: ConsultationData[]
  ) => {
    if (consultations.length === 0) return null;

    return (
      <div key={title} className={styles.sectionContainer}>
        <Title level={4} className={styles.sectionTitle}>
          {title} ({consultations.length})
        </Title>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {consultations.map(renderConsultationCard)}
        </Space>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin
          size="large"
          indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
        />
        <Text className={styles.loadingText}>Đang tải dữ liệu...</Text>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} className={styles.headerTitle}>
              Danh sách lịch tư vấn
            </Title>
          </Col>
        </Row>
      </div>

      {/* Filters */}
      <Card className={styles.filterCard}>
        <Row gutter={16} className={styles.filterRow}>
          <Col xs={24} sm={12} md={8}>
            <RangePicker
              style={{ width: "100%" }}
              placeholder={["Từ ngày", "Đến ngày"]}
              value={filters.dateRange}
              onChange={(dates) =>
                setFilters((prev) => ({ ...prev, dateRange: dates }))
              }
              format="DD/MM/YYYY"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: "100%" }}
              placeholder="Trạng thái"
              value={filters.status}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
            >
              <Option value="all">Tất cả</Option>
              <Option value="pending">Chờ xác nhận</Option>
              <Option value="confirmed">Đã xác nhận</Option>
              <Option value="in_progress">Đang diễn ra</Option>
              <Option value="completed">Hoàn thành</Option>
              <Option value="cancelled_by_user">Người dùng hủy</Option>
              <Option value="cancelled_by_consultant">Chuyên gia hủy</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={6}>
            <Button
              type="default"
              icon={<CalendarOutlined />}
              onClick={() => setFilters({ dateRange: null, status: "all" })}
              style={{ width: "100%" }}
            >
              Xóa bộ lọc
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Consultation List */}
      {filteredConsultations.length === 0 ? (
        <div className={styles.emptyState}>
          <Empty
            description="Không có lịch tư vấn nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          ></Empty>
        </div>
      ) : (
        <div>
          {renderConsultationGroup("Hôm nay", groupedConsultations.today)}
          {renderConsultationGroup("Ngày mai", groupedConsultations.tomorrow)}
          {renderConsultationGroup("Sắp tới", groupedConsultations.upcoming)}
          {renderConsultationGroup("Đã qua", groupedConsultations.past)}
        </div>
      )}

      {/* Detail Modal */}
      <ConsultationDetailModal
        visible={detailModalVisible}
        onClose={handleCloseDetailModal}
        consultationId={selectedConsultationId}
      />
    </div>
  );
};

export default ConsultationHistoryPage;
