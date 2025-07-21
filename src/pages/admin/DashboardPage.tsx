import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Divider, Spin, message, Select } from 'antd';
import {
  UserOutlined,
  MoneyCollectOutlined,
  ShoppingOutlined,
  TeamOutlined,
  CalendarOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import StatsCard from '../../components/admin/dashboard/StatsCard';
import BookingsChart from '../../components/admin/dashboard/BookingsChart';
import RevenueChart from '../../components/admin/dashboard/RevenueChart';
import ServicesChart from '../../components/admin/dashboard/ServicesChart';
import dashboardAPI, { 
  type OverviewData,
  type BookingStatsResponse,
  type RevenueStatsData,
  type ServiceBooking,
} from '../../service/api/dashboardAPI';

const { Title } = Typography;

const DashboardPage: React.FC = () => {
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [bookingStats, setBookingStats] = useState<BookingStatsResponse['data']['booking_stats'] | null>(null);
  const [revenueStats, setRevenueStats] = useState<RevenueStatsData[]>([]);
  const [serviceStats, setServiceStats] = useState<ServiceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<string>('30d');

  // Fetch overview data from API
  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setLoading(true);
        console.log('Fetching dashboard overview data...');
        const response = await dashboardAPI.getOverview();
        console.log('API Response:', response);
        
        if (response.success) {
          setOverviewData(response.data.overview);
          console.log('Overview data set:', response.data.overview);
        } else {
          console.error('API returned success: false');
          message.error('Không thể tải dữ liệu dashboard');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        message.error('Có lỗi xảy ra khi tải dữ liệu dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  // Fetch chart data từ API
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setChartsLoading(true);
        
        // Fetch all chart data with timeRange
        const [bookingResponse, revenueResponse, serviceResponse] = await Promise.allSettled([
          dashboardAPI.getBookingStats(timeRange),
          dashboardAPI.getRevenueStats(timeRange),
          dashboardAPI.getServiceStats(timeRange),
        ]);

        // Process booking stats
        if (bookingResponse.status === 'fulfilled' && bookingResponse.value.success) {
          console.log('Booking API Response:', bookingResponse.value);
          console.log('Daily Trend Data:', bookingResponse.value.data.booking_stats.daily_trend);
          setBookingStats(bookingResponse.value.data.booking_stats);
        } else {
          console.log('Booking API failed:', bookingResponse);
          setBookingStats(null);
        }

        // Process revenue stats
        if (revenueResponse.status === 'fulfilled' && revenueResponse.value.success) {
          const dailyTrend = revenueResponse.value.data.revenue_stats.daily_trend;
          const mappedRevenueData = dailyTrend.map(item => ({
            date: item._id,
            total_revenue: item.revenue
          }));
          setRevenueStats(mappedRevenueData);
        } else {
          console.log('Revenue API failed:', revenueResponse);
        }

        // Process service stats
        if (serviceResponse.status === 'fulfilled' && serviceResponse.value.success) {
          console.log('Service API Response:', serviceResponse.value);
          setServiceStats(serviceResponse.value.data.service_performance.service_bookings);
        } else {
          console.log('Service API failed:', serviceResponse);
        }

      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setChartsLoading(false);
      }
    };

    fetchChartData();
  }, [timeRange]);

  // Map API data to stats format
  const stats = overviewData ? [
    { 
      id: 1, 
      title: 'Tổng số người dùng', 
      value: overviewData.total_users, 
      increase: 0, // Có thể tính toán % tăng trưởng sau
      icon: <UserOutlined /> 
    },
    { 
      id: 2, 
      title: 'Tổng số tư vấn viên', 
      value: overviewData.total_consultants, 
      increase: 0,
      icon: <TeamOutlined /> 
    },
    { 
      id: 3, 
      title: 'Doanh thu tổng', 
      value: overviewData.total_revenue, 
      prefix: '₫', 
      increase: 0,
      icon: <MoneyCollectOutlined /> 
    },
    { 
      id: 4, 
      title: 'Tổng booking', 
      value: overviewData.total_bookings, 
      increase: 0,
      icon: <CalendarOutlined /> 
    },
    { 
      id: 5, 
      title: 'Booking hôm nay', 
      value: overviewData.today_bookings, 
      increase: 0,
      icon: <DashboardOutlined /> 
    },
    { 
      id: 6, 
      title: 'Booking đang chờ', 
      value: overviewData.pending_bookings, 
      increase: 0,
      icon: <ShoppingOutlined /> 
    },
  ] : [];

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
      <Title level={2}>Bảng điều khiển</Title>
        <Select
          value={timeRange}
          onChange={(value) => setTimeRange(value)}
          style={{ width: 200 }}
          options={[
            { value: '7d', label: '7 ngày' },
            { value: '30d', label: '30 ngày' },
            { value: '90d', label: '90 ngày' },
            { value: '1y', label: '1 năm' },
          ]}
        />
      </div>
      <Divider />
      
      {/* Stats Cards */}
      {stats.length > 0 && <StatsCard stats={stats} />}

      {/* Charts */}
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} lg={12}>
          <BookingsChart 
            data={bookingStats?.daily_trend || []} 
            loading={chartsLoading} 
          />
        </Col>
        <Col xs={24} lg={12}>
          <ServicesChart data={serviceStats} loading={chartsLoading} />
        </Col>
      </Row>

      {/* Revenue Chart */}
      <Row className="mt-6">
        <Col span={24}>
          <RevenueChart data={revenueStats} loading={chartsLoading} />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage; 