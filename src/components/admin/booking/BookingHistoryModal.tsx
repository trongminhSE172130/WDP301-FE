import React from "react";
import {
  Modal,
  Card,
  Descriptions,
  Tag,
  Timeline,
  Alert,
  Divider,
  Space,
  Badge,
  Typography,
  Row,
  Col,
  Button,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  MedicineBoxOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import type { BookingHistoryModalProps } from "../../../types/bookingHistory";
import { STATUS_TEXT } from "../../../types/bookingHistory";
import {
  formatDate,
  formatDateTime,
  normalizeBookingData,
} from "../../../utils/bookingHistoryUtils";
import styles from "../../../styles/components/BookingHistoryModal.module.css"
const { Title, Text, Paragraph } = Typography;

const BookingHistoryModal: React.FC<BookingHistoryModalProps> = ({
  isOpen,
  onClose,
  bookingDetail,
  resultData,
}) => {
  const data = bookingDetail ? normalizeBookingData(bookingDetail) : null;

  const getStatusColor = (status: string) => {
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

  const getStatusText = (status: string) => {
    return STATUS_TEXT[status] || status;
  };

  if (!data) return null;

  return (
    <Modal
      title={
        <Space>
          <MedicineBoxOutlined style={{ color: "#1890ff" }} />
          <Title level={4} style={{ margin: 0 }}>
            Chi tiết đặt lịch
          </Title>
        </Space>
      }
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="close" type="primary" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={900}
      style={{ top: 20 }}
    >
      <div className="space-y-6">
        {/* Thông tin cơ bản */}
        <Card
          title={
            <Space>
              <FileTextOutlined />
              <span>Thông tin đặt lịch</span>
            </Space>
          }
          extra={
            <Tag
              color={getStatusColor(data.status)}
              icon={<CheckCircleOutlined />}
            >
              {getStatusText(data.status)}
            </Tag>
          }
        >
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item
              label={
                <Space>
                  <FileTextOutlined />
                  <span>Mã đặt lịch</span>
                </Space>
              }
            >
              <Text copyable>{data.id}</Text>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <UserOutlined />
                  <span>Người đặt</span>
                </Space>
              }
            >
              <Text strong>{data.patientName}</Text>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <CalendarOutlined />
                  <span>Ngày hẹn</span>
                </Space>
              }
            >
              <Badge
                status="processing"
                text={formatDate(data.scheduledDate)}
              />
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <ClockCircleOutlined />
                  <span>Thời gian</span>
                </Space>
              }
            >
              <Text strong>{data.timeSlot}</Text>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Thông tin dịch vụ */}
        <Card
          title={
            <Space>
              <ExperimentOutlined />
              <span>Thông tin dịch vụ</span>
            </Space>
          }
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Title level={5} className={styles.serviceTitle}>
                {data.serviceTitle}
              </Title>
              <Paragraph type="secondary">{data.serviceDescription}</Paragraph>
            </Col>

            <Col xs={24} md={12}>
              <Space
                direction="vertical"
                size="small"
                className={styles.spaceStyle}
              >
                <Text type="secondary">Thời gian thực hiện:</Text>
                <Text strong>{data.duration}</Text>
              </Space>
            </Col>

            <Col xs={24} md={12}>
              <Space
                direction="vertical"
                size="small"
                className={styles.spaceStyle}
              >
                <Text type="secondary">Loại mẫu:</Text>
                <Tag color="blue">{data.sampleType}</Tag>
              </Space>
            </Col>

            {/* Chi tiết xét nghiệm */}
            {data.testDetails && (
              <Col span={24}>
                <Divider orientation="left">Chi tiết xét nghiệm</Divider>

                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Text type="secondary">Các thông số xét nghiệm:</Text>
                    <div className={styles.parameterTags}>
                      {data.testDetails.parameters.map(
                        (param: string, index: number) => (
                          <Tag
                            key={index}
                            color="cyan"
                            className={styles.parameterTag}
                          >
                            {param}
                          </Tag>
                        )
                      )}
                    </div>
                  </Col>

                  <Col xs={24} md={12}>
                    <Space
                      direction="vertical"
                      size="small"
                      className={styles.spaceStyle}
                    >
                      <Text type="secondary">Chuẩn bị trước xét nghiệm:</Text>
                      <Alert
                        message={data.testDetails.preparation}
                        type="info"
                        showIcon
                        className={styles.noResultSubText}
                      />
                    </Space>
                  </Col>

                  <Col xs={24} md={12}>
                    <Space
                      direction="vertical"
                      size="small"
                      className={styles.spaceStyle}
                    >
                      <Text type="secondary">Thời gian có kết quả:</Text>
                      <Tag color="green" icon={<ClockCircleOutlined />}>
                        {data.testDetails.result_time}
                      </Tag>
                    </Space>
                  </Col>
                </Row>
              </Col>
            )}
          </Row>
        </Card>

        {/* Kết quả xét nghiệm */}
        <Card
          title={
            <Space>
              <CheckCircleOutlined />
              <span>Kết quả xét nghiệm</span>
            </Space>
          }
        >
          {resultData ? (
            <div>
              <Alert
                message="Kết quả đã sẵn sàng"
                description="Kết quả xét nghiệm của bạn đã được hoàn thành và sẵn sàng để xem."
                type="success"
                showIcon
                icon={<CheckCircleOutlined />}
                style={{ marginBottom: 16 }}
              />

              {/* Thông tin review */}
              {resultData.reviewInfo && (
                <Card size="small" style={{ marginBottom: 16 }}>
                  <Row gutter={[16, 8]}>
                    <Col xs={24} sm={12}>
                      <Space direction="vertical" size="small">
                        <Text type="secondary">Trạng thái:</Text>
                        <Tag color={resultData.reviewInfo.status === 'approved' ? 'green' : 'orange'}>
                          {resultData.reviewInfo.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                        </Tag>
                      </Space>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Space direction="vertical" size="small">
                        <Text type="secondary">Người duyệt:</Text>
                        <Text strong>{resultData.reviewInfo.reviewedBy || 'Chưa có'}</Text>
                      </Space>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Space direction="vertical" size="small">
                        <Text type="secondary">Ngày nộp:</Text>
                        <Text>{formatDateTime(resultData.reviewInfo.submittedAt)}</Text>
                      </Space>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Space direction="vertical" size="small">
                        <Text type="secondary">Ngày duyệt:</Text>
                        <Text>{resultData.reviewInfo.reviewedAt ? formatDateTime(resultData.reviewInfo.reviewedAt) : 'Chưa duyệt'}</Text>
                      </Space>
                    </Col>
                  </Row>
                </Card>
              )}

              {/* Kết quả các chỉ số test */}
              {resultData.testValues && resultData.testValues.length > 0 && (
                <Card size="small" style={{ marginBottom: 16 }}>
                  <Title level={5}>Kết quả các chỉ số:</Title>
                  <Row gutter={[16, 8]}>
                    {resultData.testValues.map((test: any, index: number) => (
                      <Col xs={24} sm={12} md={8} key={index}>
                        <Card size="small" style={{ textAlign: 'center' }}>
                          <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                            {test.displayName}
                          </Text>
                          <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                            {test.value}
                          </Text>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card>
              )}

              {/* Nhận xét của bác sĩ */}
              {resultData.doctorComment && (
                <Card size="small">
                  <Title level={5}>Nhận xét của bác sĩ:</Title>
                  <Paragraph>
                    <Text>{resultData.doctorComment}</Text>
                  </Paragraph>
                </Card>
              )}

              {/* Fallback: hiển thị raw data nếu không có format */}
              {!resultData.testValues && !resultData.doctorComment && (
                <Card size="small" className={styles.resultCard}>
                  <pre className={styles.resultCode}>
                    {JSON.stringify(resultData, null, 2)}
                  </pre>
                </Card>
              )}
            </div>
          ) : (
            <div className={styles.noResultContainer}>
              <ExclamationCircleOutlined className={styles.noResultIcon} />
              <div>
                <Text type="secondary" className={styles.noResultText}>
                  Kết quả xét nghiệm đang được xử lý
                </Text>
                <div className={styles.noResultTime}>
                  <Text type="secondary" className={styles.noResultSubText}>
                    Kết quả sẽ có trong{" "}
                    <Text strong>
                      {data.testDetails?.result_time || "3-5 ngày"}
                    </Text>
                  </Text>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Timeline thông tin thời gian */}
        <Card
          title={
            <Space>
              <CalendarOutlined />
              <span>Timeline</span>
            </Space>
          }
        >
          <Timeline>
            <Timeline.Item
              color="blue"
              dot={<CalendarOutlined className={styles.timelineIcon} />}
            >
              <Text strong>Ngày tạo đặt lịch</Text>
              <br />
              <Text type="secondary">{formatDateTime(data.createdAt)}</Text>
            </Timeline.Item>

            <Timeline.Item
              color="green"
              dot={<CheckCircleOutlined className={styles.timelineIcon} />}
            >
              <Text strong>Cập nhật lần cuối</Text>
              <br />
              <Text type="secondary">{formatDateTime(data.updatedAt)}</Text>
            </Timeline.Item>

            <Timeline.Item color="orange">
              <Text strong>Ngày hẹn khám</Text>
              <br />
              <Text type="secondary">
                {formatDate(data.scheduledDate)} lúc {data.timeSlot}
              </Text>
            </Timeline.Item>
          </Timeline>
        </Card>
      </div>
    </Modal>
  );
};

export default BookingHistoryModal;
