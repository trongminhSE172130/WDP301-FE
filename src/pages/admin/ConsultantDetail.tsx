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
  Collapse,
  Rate,
  Statistic,
  Calendar,
  Badge,
  message
} from 'antd';
import { 
  ArrowLeftOutlined, 
  UserOutlined, 
  MailOutlined,
  EditOutlined,
  StarOutlined,
  CalendarOutlined,
  TrophyOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  BookOutlined
} from '@ant-design/icons';
import type { Consultant } from '../../components/admin/consultant/ConsultantTable';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { getConsultantById } from '../../service/api/consultantAPI';

const { Title, Text } = Typography;
const { Panel } = Collapse;

// Interface cho các dữ liệu bổ sung
interface ConsultationHistory {
  id: string;
  patientName: string;
  date: string;
  service: string;
  status: 'completed' | 'cancelled' | 'no-show';
  duration: number;
  rating?: number;
  notes?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: string;
}

// Dữ liệu mẫu cho các phần chưa có API
const consultationHistory: ConsultationHistory[] = [
  {
    id: 'C001',
    patientName: 'Nguyễn Thị Hoa',
    date: '2024-01-15',
    service: 'Tư vấn dinh dưỡng',
    status: 'completed',
    duration: 30,
    rating: 5,
    notes: 'Bệnh nhân hài lòng với lời khuyên'
  },
  {
    id: 'C002',
    patientName: 'Trần Văn Nam',
    date: '2024-01-14',
    service: 'Tư vấn sức khỏe',
    status: 'completed',
    duration: 45,
    rating: 4
  },
  {
    id: 'C003',
    patientName: 'Lê Thị Mai',
    date: '2024-01-13',
    service: 'Phân tích kết quả',
    status: 'cancelled',
    duration: 0
  }
];

const achievements: Achievement[] = [
  {
    id: 'A001',
    title: 'Tư vấn viên xuất sắc tháng 12',
    description: 'Đạt 98% đánh giá tích cực từ bệnh nhân',
    date: '2023-12-31',
    icon: '🏆'
  },
  {
    id: 'A002',
    title: 'Hoàn thành 500 ca tư vấn',
    description: 'Cột mốc quan trọng trong sự nghiệp',
    date: '2023-11-20',
    icon: '🎯'
  }
];

const ConsultantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  useEffect(() => {
    const loadConsultant = async () => {
      if (!id) {
        message.error('ID tư vấn viên không hợp lệ');
        navigate('/admin/consultants');
        return;
      }

      try {
        setLoading(true);
        const response = await getConsultantById(id);
        if (response.success) {
          setConsultant(response.data);
        } else {
          message.error('Không thể tải thông tin tư vấn viên');
          navigate('/admin/consultants');
        }
      } catch (error) {
        console.error('Error loading consultant:', error);
        message.error('Có lỗi xảy ra khi tải thông tin tư vấn viên');
        navigate('/admin/consultants');
      } finally {
        setLoading(false);
      }
    };

    loadConsultant();
  }, [id, navigate]);

  const handleBack = () => {
    navigate('/admin/consultants');
  };

  const handleEdit = () => {
    navigate(`/admin/consultants/${id}/edit`);
  };

  const handleManageSchedule = () => {
    navigate(`/admin/consultants/${id}/schedule`);
  };

  const getStatusTag = (consultant: Consultant) => {
    if (consultant.is_available_for_advice && consultant.is_available_for_analysis) {
      return <Tag color="success" className="rounded-full px-3 py-1">🟢 Sẵn sàng tư vấn</Tag>;
    } else if (consultant.is_available_for_advice || consultant.is_available_for_analysis) {
      return <Tag color="warning" className="rounded-full px-3 py-1">🟡 Có hạn chế</Tag>;
    } else {
      return <Tag color="default" className="rounded-full px-3 py-1">⚪ Không khả dụng</Tag>;
    }
  };

  const getConsultationStatusTag = (status: string) => {
    switch (status) {
      case 'completed':
        return <Tag color="success">Hoàn thành</Tag>;
      case 'cancelled':
        return <Tag color="error">Đã hủy</Tag>;
      case 'no-show':
        return <Tag color="warning">Không đến</Tag>;
      default:
        return <Tag>Không xác định</Tag>;
    }
  };

  const dateCellRender = () => {
    const hasAppointment = Math.random() > 0.7;
    return hasAppointment ? <Badge status="processing" /> : null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (!consultant) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Không tìm thấy thông tin tư vấn viên</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center">
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
            className="mr-4 hover:bg-gray-100"
          />
          <Title level={2} className="m-0 text-gray-800">Chi tiết tư vấn viên</Title>
        </div>
        <Space>
          <Button 
            type="default" 
            icon={<CalendarOutlined />}
            onClick={handleManageSchedule}
            className="border-blue-300 text-blue-600 hover:bg-blue-50"
          >
            Quản lý lịch
          </Button>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={handleEdit}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Chỉnh sửa
          </Button>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        {/* Thông tin cá nhân */}
        <Col xs={24} lg={8}>
          <Card className="shadow-sm mb-6">
            <div className="text-center mb-6">
              <Avatar size={120} icon={<UserOutlined />} className="mb-4 bg-blue-500" />
              <Title level={3} className="mb-1 text-gray-800">{consultant.full_name}</Title>
              <Text className="text-gray-500 text-base">{consultant.specialty}</Text>
              <div className="mt-3">
                {getStatusTag(consultant)}
              </div>
            </div>

            <Divider />

            <Descriptions column={1} size="small" className="mb-4">
              <Descriptions.Item label={<span className="font-medium text-gray-700">Email</span>}>
                <div className="flex items-center">
                  <MailOutlined className="mr-2 text-gray-400" />
                  <span className="text-gray-800">{consultant.email}</span>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label={<span className="font-medium text-gray-700">Bằng cấp</span>}>
                <div className="flex items-center">
                  <BookOutlined className="mr-2 text-gray-400" />
                  <span className="text-gray-800">{consultant.degree}</span>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label={<span className="font-medium text-gray-700">Kinh nghiệm</span>}>
                <div className="flex items-center">
                  <TrophyOutlined className="mr-2 text-gray-400" />
                  <span className="text-gray-800">{consultant.experience_years} năm</span>
                </div>
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <div className="mb-4">
              <Text className="font-medium text-gray-700 block mb-3">Khả năng làm việc</Text>
              <div className="space-y-2">
                {consultant.is_available_for_advice && (
                  <Tag color="green" className="px-3 py-1">✓ Có thể tư vấn</Tag>
                )}
                {consultant.is_available_for_analysis && (
                  <Tag color="blue" className="px-3 py-1">✓ Có thể phân tích</Tag>
                )}
              </div>
            </div>

            <Divider />

            <div>
              <Text className="font-medium text-gray-700 block mb-3">Dịch vụ đảm nhiệm</Text>
              <div className="flex flex-wrap gap-2">
                {consultant.services.length > 0 ? (
                  consultant.services.map((service, index) => (
                    <Tag key={`${service}-${index}`} color="blue" className="rounded-md px-3 py-1">
                      Dịch vụ {index + 1}
                    </Tag>
                  ))
                ) : (
                  <span className="text-sm text-gray-400">Chưa có dịch vụ được gán</span>
                )}
              </div>
            </div>
          </Card>

          {/* Thành tích */}
          <Card title={<span className="text-gray-800 font-medium">🏆 Thành tích</span>} className="shadow-sm">
            <div className="space-y-4">
              {achievements.map(achievement => (
                <div key={achievement.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{achievement.title}</div>
                    <div className="text-sm text-gray-600">{achievement.description}</div>
                    <div className="text-xs text-gray-500 mt-1">{achievement.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Nội dung chính */}
        <Col xs={24} lg={16}>
          {/* Thông tin giới thiệu */}
          <Card className="shadow-sm mb-6">
            <Title level={4} className="text-gray-800 mb-4">📝 Thông tin giới thiệu</Title>
            <Text className="text-gray-600 leading-relaxed">
              {consultant.bio}
            </Text>
          </Card>

          {/* Thống kê */}
          <Card className="shadow-sm mb-6">
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title={<span className="text-gray-600">Tư vấn tháng này</span>}
                  value={Math.floor(Math.random() * 30) + 10}
                  prefix={<TeamOutlined className="text-blue-500" />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title={<span className="text-gray-600">Đánh giá trung bình</span>}
                  value={4.8}
                  precision={1}
                  prefix={<StarOutlined className="text-yellow-500" />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title={<span className="text-gray-600">Tổng giờ tư vấn</span>}
                  value={consultant.experience_years * 50}
                  suffix="giờ"
                  prefix={<ClockCircleOutlined className="text-green-500" />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title={<span className="text-gray-600">Tỷ lệ hoàn thành</span>}
                  value={95.5}
                  precision={1}
                  suffix="%"
                  prefix={<CheckCircleOutlined className="text-purple-500" />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Col>
            </Row>
          </Card>

          {/* Tabs nội dung */}
          <Collapse defaultActiveKey={['1']} className="shadow-sm">
            {/* Lịch sử tư vấn */}
            <Panel 
              header={<span className="font-medium text-gray-800">📋 Lịch sử tư vấn gần đây</span>} 
              key="1"
            >
              <div className="space-y-4">
                {consultationHistory.map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-gray-800">{item.patientName}</div>
                        <div className="text-sm text-gray-600">{item.service}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">{item.date}</div>
                        {getConsultationStatusTag(item.status)}
                      </div>
                    </div>
                    {item.status === 'completed' && (
                      <div className="flex items-center space-x-4 mt-3">
                        <div className="text-sm text-gray-600">
                          <ClockCircleOutlined className="mr-1" />
                          {item.duration} phút
                        </div>
                        {item.rating && (
                          <div className="text-sm">
                            <Rate disabled defaultValue={item.rating} className="text-xs" />
                          </div>
                        )}
                      </div>
                    )}
                    {item.notes && (
                      <div className="mt-2 text-sm text-gray-600 italic">
                        "{item.notes}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Panel>

            {/* Lịch làm việc */}
            <Panel 
              header={<span className="font-medium text-gray-800">📅 Lịch làm việc tháng này</span>} 
              key="2"
            >
              <Calendar
                dateCellRender={dateCellRender}
                onSelect={setSelectedDate}
                value={selectedDate}
                className="bg-white"
              />
            </Panel>

            {/* Đánh giá từ bệnh nhân */}
            <Panel 
              header={<span className="font-medium text-gray-800">⭐ Đánh giá từ bệnh nhân</span>} 
              key="3"
            >
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-gray-800">Nguyễn Thị Hoa</div>
                      <Rate disabled defaultValue={5} className="text-sm" />
                    </div>
                    <div className="text-sm text-gray-500">2024-01-15</div>
                  </div>
                  <div className="text-gray-600 mt-2">
                    "Bác sĩ rất tận tâm và chuyên nghiệp. Lời khuyên rất hữu ích cho tôi."
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-gray-800">Trần Văn Nam</div>
                      <Rate disabled defaultValue={4} className="text-sm" />
                    </div>
                    <div className="text-sm text-gray-500">2024-01-14</div>
                  </div>
                  <div className="text-gray-600 mt-2">
                    "Dịch vụ tốt, thời gian chờ hợp lý."
                  </div>
                </div>
              </div>
            </Panel>
          </Collapse>
        </Col>
      </Row>
    </div>
  );
};

export default ConsultantDetail; 