import React, { useState, useEffect } from "react";
import {
  Modal,
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Space,
  Avatar,
  Divider,
  Spin,
  Button,
  message,
  Descriptions,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  VideoCameraOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getConsultationHistoryById } from "../../service/api/consultantAPI";
import type { ConsultationData } from "../../types/consultationHistory";
import {
  getStatusColor,
  getStatusText,
  canJoinMeeting,
  transformConsultationData,
} from "../../utils/consultationHistoryUtils";
import styles from "../../styles/components/ConsultationDetailModal.module.css";

const { Title, Text, Paragraph } = Typography;

interface ConsultationDetailModalProps {
  visible: boolean;
  onClose: () => void;
  consultationId: string;
}

const ConsultationDetailModal: React.FC<ConsultationDetailModalProps> = ({
  visible,
  onClose,
  consultationId,
}) => {
  const [loading, setLoading] = useState(false);
  const [consultationDetail, setConsultationDetail] =
    useState<ConsultationData | null>(null);

  const fetchConsultationDetail = async () => {
    if (!consultationId) return;

    try {
      setLoading(true);
      const response = await getConsultationHistoryById(consultationId);

      if (response.success && response.data) {
        const transformedData = transformConsultationData(response.data);
        setConsultationDetail(transformedData);
      } else {
        message.error("Không thể tải chi tiết lịch tư vấn");
      }
    } catch (error) {
      console.error("Error fetching consultation detail:", error);
      message.error("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && consultationId) {
      fetchConsultationDetail();
    }
  }, [visible, consultationId]);

  const handleJoinMeeting = () => {
    if (consultationDetail && consultationDetail.meetingLink) {
      window.open(consultationDetail.meetingLink, "_blank");
    } else {
      message.warning("Link cuộc họp chưa sẵn sàng");
    }
  };

  const formatDateTime = (dateStr: string, timeStr: string) => {
    const date = dayjs(dateStr);
    return {
      date: date.format("DD/MM/YYYY"),
      dayOfWeek: date.format("dddd"),
      time: timeStr,
    };
  };

  const getMeetingStatusInfo = (status: string) => {
    switch (status) {
      case "not_created":
        return { color: "default", text: "Chưa tạo" };
      case "pending_setup":
        return { color: "orange", text: "Chờ thiết lập" };
      case "created":
        return { color: "blue", text: "Đã tạo" };
      case "started":
        return { color: "green", text: "Đang diễn ra" };
      case "ended":
        return { color: "default", text: "Đã kết thúc" };
      case "cancelled":
        return { color: "red", text: "Đã hủy" };
      default:
        return { color: "default", text: status };
    }
  };

  if (loading) {
    return (
      <Modal
        title="Chi tiết lịch tư vấn"
        open={visible}
        onCancel={onClose}
        footer={null}
        width={800}
        className={styles.modal}
      >
        <div className={styles.loadingContainer}>
          <Spin
            size="large"
            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
          />
          <Text className={styles.loadingText}>Đang tải chi tiết...</Text>
        </div>
      </Modal>
    );
  }

  if (!consultationDetail) {
    return (
      <Modal
        title="Chi tiết lịch tư vấn"
        open={visible}
        onCancel={onClose}
        footer={null}
        width={800}
        className={styles.modal}
      >
        <div className={styles.errorContainer}>
          <Text>Không thể tải thông tin chi tiết</Text>
        </div>
      </Modal>
    );
  }

  const dateTimeInfo = formatDateTime(
    consultationDetail.date,
    consultationDetail.time
  );

  const meetingStatusInfo = getMeetingStatusInfo(
    consultationDetail.meetingStatus
  );

  return (
    <Modal
      title="Chi tiết lịch tư vấn"
      open={visible}
      onCancel={onClose}
      width={800}
      className={styles.modal}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
        consultationDetail.meetingLink &&
          canJoinMeeting(consultationDetail) && (
            <Button
              key="join"
              type="primary"
              icon={<VideoCameraOutlined />}
              onClick={handleJoinMeeting}
              className={styles.joinButton}
            >
              Tham gia cuộc họp
            </Button>
          ),
      ]}
    >
      <div className={styles.content}>
        {/* Consultant Information */}
        <Card className={styles.consultantCard}>
          <Row align="middle" gutter={16}>
            <Col flex="none">
              <Avatar
                size={64}
                icon={<UserOutlined />}
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  consultationDetail.consultantName
                )}&background=3b82f6&color=fff`}
                className={styles.avatar}
              />
            </Col>
            <Col flex="auto">
              <Title level={4} className={styles.consultantName}>
                {consultationDetail.consultantName}
              </Title>
              <Text className={styles.consultantEmail}>
                {consultationDetail.consultantEmail}
              </Text>
              <br />
              <Tag color="blue" className={styles.scheduleTypeTag}>
                {consultationDetail.scheduleType === "advice"
                  ? "Tư vấn"
                  : "Phân tích"}
              </Tag>
            </Col>
          </Row>
        </Card>

        <Divider />

        {/* Booking Information */}
        <Descriptions
          title="Thông tin đặt lịch"
          bordered
          column={1}
          size="small"
          className={styles.descriptions}
        >
          <Descriptions.Item
            label={
              <Space>
                <CalendarOutlined />
                Ngày hẹn
              </Space>
            }
          >
            <Space>
              <Text strong>{dateTimeInfo.date}</Text>
              <Text type="secondary">({dateTimeInfo.dayOfWeek})</Text>
            </Space>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space>
                <ClockCircleOutlined />
                Thời gian
              </Space>
            }
          >
            <Text strong>{dateTimeInfo.time}</Text>
          </Descriptions.Item>

          <Descriptions.Item label="Trạng thái đặt lịch">
            <Tag color={getStatusColor(consultationDetail.status)}>
              {getStatusText(consultationDetail.status)}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Trạng thái cuộc họp">
            <Tag color={meetingStatusInfo.color}>{meetingStatusInfo.text}</Tag>
          </Descriptions.Item>

          {consultationDetail.question && (
            <Descriptions.Item
              label={
                <Space>
                  <QuestionCircleOutlined />
                  Câu hỏi
                </Space>
              }
            >
              <Paragraph className={styles.question}>
                "{consultationDetail.question}"
              </Paragraph>
            </Descriptions.Item>
          )}

          <Descriptions.Item label="Ngày đặt lịch">
            <Text>
              {dayjs(consultationDetail.createdAt).format("DD/MM/YYYY HH:mm")}
            </Text>
          </Descriptions.Item>

          {consultationDetail.meetingLink && (
            <Descriptions.Item
              label={
                <Space>
                  <VideoCameraOutlined />
                  Link cuộc họp
                </Space>
              }
            >
              {canJoinMeeting(consultationDetail) ? (
                <Button
                  type="link"
                  icon={<VideoCameraOutlined />}
                  onClick={handleJoinMeeting}
                  className={styles.meetingLinkButton}
                >
                  Tham gia cuộc họp
                </Button>
              ) : (
                <Space direction="vertical" size="small">
                  <Text type="secondary">
                    <CheckCircleOutlined /> Link meeting:
                  </Text>
                  <Text copyable={{ text: consultationDetail.meetingLink }}>
                    {consultationDetail.meetingLink}
                  </Text>
                  {consultationDetail.status === "completed" && (
                    <Tag color="green">Đã hoàn thành</Tag>
                  )}
                </Space>
              )}
            </Descriptions.Item>
          )}
        </Descriptions>
      </div>
    </Modal>
  );
};

export default ConsultationDetailModal;
