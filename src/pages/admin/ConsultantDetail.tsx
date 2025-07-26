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
  Avatar,
  Collapse,
  Statistic,
  Calendar,
  Badge,
  message
} from 'antd';
import { 
  ArrowLeftOutlined, 
  UserOutlined, 
  MailOutlined,
  TrophyOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  BookOutlined
} from '@ant-design/icons';
import type { Consultant } from '../../components/admin/consultant/ConsultantTable';
import type { Schedule } from '../../components/admin/schedule/ScheduleTypes';
import type { Service } from '../../components/admin/service/ServiceTypes';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { getConsultantById } from '../../service/api/consultantAPI';
import { getSchedulesByConsultantId } from '../../service/api/scheduleAPI';
import { getServiceById } from '../../service/api/serviceAPI';

const { Title, Text } = Typography;
const { Panel } = Collapse;

interface Statistics {
  total_bookings: number;
  completed_bookings: number;
  total_consultations: number;
  completion_rate: number | string;
  consultation_completion_rate?: number | string;
}

interface ConsultantWithStats extends Consultant {
  statistics?: Statistics;
}

const ConsultantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [consultant, setConsultant] = useState<ConsultantWithStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [schedulesLoading, setSchedulesLoading] = useState<boolean>(false);
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState<boolean>(false);

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
        if (response.success && response.data) {
          setConsultant(response.data);
          console.log('Consultant data:', response.data);
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

  // Load schedules của tư vấn viên
  useEffect(() => {
    const loadSchedules = async () => {
      if (!id) return;

      try {
        setSchedulesLoading(true);
        const response = await getSchedulesByConsultantId(id, {
          sortBy: 'date',
          sortOrder: 'desc',
          limit: 50 // Lấy 50 lịch gần nhất
        });
        if (response.success) {
          console.log('Schedules data from API:', response.data);
          // Debug từng schedule để xem format
          response.data.forEach((schedule, index) => {
            console.log(`Schedule ${index}:`, {
              id: schedule._id,
              date: schedule.date,
              time_slot: schedule.time_slot,
              created_at: schedule.created_at
            });
          });
          setSchedules(response.data);
        }
      } catch (error) {
        console.error('Error loading consultant schedules:', error);
        message.error('Có lỗi xảy ra khi tải lịch tư vấn');
      } finally {
        setSchedulesLoading(false);
      }
    };

    loadSchedules();
  }, [id]);

  // Load thông tin dịch vụ
  useEffect(() => {
    const loadServices = async () => {
      if (!consultant || !consultant.services || consultant.services.length === 0) return;
      
      try {
        setServicesLoading(true);
        const servicePromises = (consultant.services as string[]).map(async (serviceId) => {
          try {
            const response = await getServiceById(serviceId);
            if (response.success && response.data && response.data.service) {
              return response.data.service;
            }
            return null;
          } catch (error) {
            console.error(`Error loading service ${serviceId}:`, error);
            return null;
          }
        });
        
        const serviceResults = await Promise.all(servicePromises);
        const validServices = serviceResults.filter(service => service !== null) as Service[];
        setServices(validServices);
      } catch (error) {
        console.error('Error loading services:', error);
      } finally {
        setServicesLoading(false);
      }
    };
    
    loadServices();
  }, [consultant]);

  const handleBack = () => {
    navigate('/admin/consultants');
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



  const dateCellRender = (value: Dayjs) => {
    // Tìm các lịch trình trong ngày này
    const schedulesOnThisDate = schedules.filter(schedule => {
      if (!schedule.date) return false;
      const scheduleDate = dayjs(schedule.date);
      return scheduleDate.isSame(value, 'day');
    });

    if (schedulesOnThisDate.length === 0) return null;

    return (
      <div className="space-y-1">
        {schedulesOnThisDate.slice(0, 3).map(schedule => {
          const badgeStatus = schedule.is_booked ? 'success' : 'processing';
          
          return (
            <div key={schedule._id} className="text-xs">
              <Badge 
                status={badgeStatus} 
                text={
                  <span className="text-xs">
                    {schedule.time_slot} - {schedule.schedule_type === 'advice' ? 'Tư vấn' : 'Phân tích'}
                  </span>
                } 
              />
            </div>
          );
        })}
        {schedulesOnThisDate.length > 3 && (
          <div className="text-xs text-gray-400">+{schedulesOnThisDate.length - 3} khác</div>
        )}
      </div>
    );
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
    <div className="min-h-screen  p-6">
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
                {servicesLoading ? (
                  <span className="text-sm text-gray-500">Đang tải dịch vụ...</span>
                ) : services.length > 0 ? (
                  services.map((service) => (
                    <Tag key={service._id} color="blue" className="rounded-md px-3 py-1">
                      {service.title}
                    </Tag>
                  ))
                ) : (
                  <span className="text-sm text-gray-400">Chưa có dịch vụ được gán</span>
                )}
              </div>
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
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title={<span className="text-gray-600">Tổng lịch trình</span>}
                  value={consultant?.statistics?.total_bookings || schedules.length}
                  prefix={<TeamOutlined className="text-blue-500" />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={<span className="text-gray-600">Lịch đã đặt</span>}
                  value={consultant?.statistics?.completed_bookings || schedules.filter(s => s.is_booked).length}
                  prefix={<CheckCircleOutlined className="text-purple-500" />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={<span className="text-gray-600">Tổng tư vấn</span>}
                  value={consultant?.statistics?.total_consultations || 0}
                  prefix={<TeamOutlined className="text-green-500" />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={<span className="text-gray-600">Tỷ lệ hoàn thành</span>}
                  value={consultant?.statistics?.completion_rate || 0}
                  suffix="%"
                  prefix={<CheckCircleOutlined className="text-orange-500" />}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Col>
            </Row>
          </Card>

          {/* Tabs nội dung */}
          <Collapse defaultActiveKey={['1']} className="shadow-sm">
            {/* Lịch làm việc */}
            <Panel 
              header={<span className="font-medium text-gray-800">📅 Lịch trình tư vấn</span>} 
              key="1"
            >
              {schedulesLoading ? (
                <div className="text-center py-8">
                  <div className="text-gray-500">Đang tải lịch trình...</div>
                </div>
              ) : (
                <Calendar
                  dateCellRender={dateCellRender}
                  onSelect={setSelectedDate}
                  value={selectedDate}
                  className="bg-white"
                />
              )}
            </Panel>
          </Collapse>
        </Col>
      </Row>
    </div>
  );
};

export default ConsultantDetail; 