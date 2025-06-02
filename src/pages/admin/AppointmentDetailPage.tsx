import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  Divider, 
  Row, 
  Col, 
  Tag, 
  Button, 
  Descriptions, 
  Space, 
  Avatar,
  Collapse
} from 'antd';
import { 
  ArrowLeftOutlined, 
  UserOutlined, 
  PhoneOutlined, 
  MailOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownOutlined
} from '@ant-design/icons';
import { appointmentsData } from '../../components/admin/appointment/AppointmentData';
import type { Appointment } from '../../components/admin/appointment/AppointmentTypes';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const AppointmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [noteCollapsed, setNoteCollapsed] = useState<boolean>(false);

  useEffect(() => {
    // Mô phỏng việc lấy dữ liệu
    setLoading(true);
    setTimeout(() => {
      const foundAppointment = appointmentsData.find(item => item.id === id);
      setAppointment(foundAppointment || null);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleBack = () => {
    navigate('/admin/appointments');
  };

  const toggleNoteCollapse = () => {
    setNoteCollapsed(!noteCollapsed);
  };

  // Trạng thái cuộc hẹn
  const getStatusTag = (status: string) => {
    switch (status) {
      case 'completed':
        return <Tag color="green" icon={<CheckCircleOutlined />}>Đã hoàn thành</Tag>;
      case 'cancelled':
        return <Tag color="red" icon={<CloseCircleOutlined />}>Đã hủy</Tag>;
      case 'scheduled':
      default:
        return <Tag color="blue" icon={<ClockCircleOutlined />}>Đã lên lịch</Tag>;
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!appointment) {
    return <div>Không tìm thấy thông tin cuộc hẹn</div>;
  }

  return (
    <div className="appointment-detail-page">
      {/* Tiêu đề và nút quay lại */}
      <div className="mb-6 flex items-center">
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBack}
          className="mr-4"
        />
        <Title level={2} className="m-0">Chi tiết cuộc hẹn</Title>
      </div>

      <Row gutter={[24, 24]}>
        {/* Thông tin bệnh nhân */}
        <Col xs={24} lg={8}>
          <Card className="shadow-sm">
            <div className="text-center mb-4">
              <Avatar size={100} src={null} icon={<UserOutlined />} />
              <Title level={3} className="mt-4 mb-0">Nithya Jayakumar</Title>
              <Text type="secondary">Nữ</Text>
              <div className="mt-2">
                {getStatusTag(appointment.status)}
              </div>
            </div>

            <Divider />

            <Descriptions layout="vertical" column={1}>
              <Descriptions.Item label="Số điện thoại">
                <Space>
                  <PhoneOutlined />
                  <Text>8745634522</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                <Space>
                  <MailOutlined />
                  <Text>Nithyajayakumar@gmail.com</Text>
                </Space>
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <div className="flex justify-center gap-2">
              <Button type="primary">Chỉnh sửa</Button>
              <Button danger>Hủy cuộc hẹn</Button>
            </div>
          </Card>
        </Col>

        {/* Thông tin chi tiết cuộc hẹn */}
        <Col xs={24} lg={16}>
          {/* Chỉ số gần đây */}
          <div className="mb-5 rounded-lg overflow-hidden border border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <Title level={4} className="m-0">Chỉ số gần đây</Title>
            </div>
            <Card className="shadow-sm border-0" bodyStyle={{ padding: '24px' }}>
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={8}>
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-100">
                    <Text strong>120mg/dt</Text>
                    <div>
                      <Text>Đường huyết</Text>
                    </div>
                    <div>
                      <Text type="secondary">Trước bữa ăn · 11/03/23</Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-100">
                    <Text strong>98.1°F</Text>
                    <div>
                      <Text>Nhiệt độ</Text>
                    </div>
                    <div>
                      <Text type="secondary">Hôm nay</Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-100">
                    <Text strong>120/80 mm hg</Text>
                    <div>
                      <Text>Huyết áp</Text>
                    </div>
                    <div>
                      <Text type="secondary">Hôm nay</Text>
                    </div>
                  </div>
                </Col>
              </Row>
              <Divider />
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={8}>
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-100">
                    <Text strong>120mg/dt</Text>
                    <div>
                      <Text>Đường huyết</Text>
                    </div>
                    <div>
                      <Text type="secondary">Sau bữa ăn · 11/03/23</Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-100">
                    <Text strong>160cm</Text>
                    <div>
                      <Text>Chiều cao</Text>
                    </div>
                    <div>
                      <Text type="secondary">20/03/23</Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-100">
                    <Text strong>55Kg</Text>
                    <div>
                      <Text>Cân nặng</Text>
                    </div>
                    <div>
                      <Text type="secondary">20/03/23</Text>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>

          {/* Ghi chú */}
          <div className="mb-5 rounded-lg overflow-hidden border border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <Title level={5} className="m-0">Ghi chú</Title>
                <Button 
                  type="text" 
                  icon={<DownOutlined rotate={noteCollapsed ? 180 : 0} />} 
                  onClick={toggleNoteCollapse}
                  className="transition-all duration-300 ease-in-out hover:bg-gray-100 hover:scale-105"
                />
              </div>
            </div>
            <Card className="shadow-sm border-0" bodyStyle={{ padding: '24px' }}>
              <div 
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  noteCollapsed 
                    ? 'max-h-0 opacity-0 m-0 p-0' 
                    : 'max-h-[500px] opacity-100'
                }`}
              >
                <Collapse 
                  bordered={false} 
                  className="bg-transparent" 
                  defaultActiveKey={['1']}
                >
                  <Panel 
                    header={
                      <span className="transition-colors duration-300 hover:text-blue-500">
                        Lý do cần tư vấn
                      </span>
                    } 
                    key="1" 
                    className="px-0 bg-transparent"
                  >
                    <Text>Bên phía bệnh nhân sẽ lý do cần phải tư vấn</Text>
                  </Panel>
                  <Panel 
                    header={
                      <span className="transition-colors duration-300 hover:text-blue-500">
                        Ghi chú của bác sĩ
                      </span>
                    } 
                    key="2" 
                    className="px-0 bg-transparent"
                  >
                    <Text>Bệnh nhân có biểu hiện lo lắng về tình trạng sức khỏe. Cần theo dõi thêm các chỉ số huyết áp và đường huyết. Đề xuất tái khám sau 2 tuần.</Text>
                  </Panel>
                </Collapse>
              </div>
            </Card>
          </div>

          {/* Bệnh nền */}
          <div className="mb-5 rounded-lg overflow-hidden border border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <Title level={5} className="m-0">Bệnh nền</Title>
            </div>
            <Card className="shadow-sm border-0" bodyStyle={{ padding: '24px' }}>
              <Row gutter={[24, 24]}>
                <Col span={12}>
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-100">
                    <Text strong>Rối loạn ngôn ngữ</Text>
                    <div className="mt-2">
                      <Tag closable className="mb-1 mr-1">Khó phát âm</Tag>
                      <Tag closable className="mb-1 mr-1">Mất khả năng phối hợp lời nói</Tag>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-100">
                    <Text strong>Rối loạn ngôn ngữ</Text>
                    <div className="mt-2">
                      <Tag closable className="mb-1 mr-1">Khó phát âm</Tag>
                      <Tag closable className="mb-1 mr-1">Mất khả năng phối hợp lời nói</Tag>
                    </div>
                  </div>
                </Col>
              </Row>
              <Divider className="my-4" />
              <div className="p-4 bg-gray-50 rounded-md border border-gray-100">
                <Text strong>Thể chất</Text>
                <div className="mt-2">
                  <Tag closable>Viêm khớp</Tag>
                </div>
              </div>
            </Card>
          </div>

          {/* Bác sĩ tư vấn */}
          <div className="mb-5 rounded-lg overflow-hidden border border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <Title level={5} className="m-0">Bác sĩ tư vấn</Title>
            </div>
            <Card className="shadow-sm border-0" bodyStyle={{ padding: '24px' }}>
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={8}>
                  <Avatar size={80} src={null} icon={<UserOutlined />} />
                </Col>
                <Col xs={24} sm={16}>
                  <Descriptions column={1} colon={false}>
                    <Descriptions.Item label="Tên">Trần Duy</Descriptions.Item>
                    <Descriptions.Item label="Chuyên ngành">Bác sĩ phụ khoa</Descriptions.Item>
                    <Descriptions.Item label="Kinh nghiệm">9 - 10 năm</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">0911772199</Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
              <Divider className="my-4" />
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={12}>
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-100">
                    <Title level={5}>Thời gian gặp mặt</Title>
                    <div>
                      <Text strong>Thời gian: </Text>
                      <Text>09:00 - 11:00</Text>
                    </div>
                    <div>
                      <Text strong>Phương thức: </Text>
                      <Text>Trực tiếp</Text>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>

          <div className="mt-10 text-right">
            <Button type="primary" size="large">Xem xét</Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AppointmentDetailPage; 