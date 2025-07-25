import React from 'react';
import { Card, Table, Progress, Statistic, Row, Col } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { ServiceBooking } from '../../../service/api/dashboardAPI';

interface ServicesChartProps {
  data: ServiceBooking[];
  loading?: boolean;
}

const ServicesChart: React.FC<ServicesChartProps> = ({ data, loading = false }) => {
  const chartData = data && data.length > 0 ? data : [];

  // Colors cho chart
  const colors = ['#1890ff', '#52c41a', '#722ed1', '#fa8c16', '#eb2f96', '#13c2c2'];

  // Columns cho table
  const columns = [
    {
      title: 'Tên dịch vụ',
      dataIndex: 'service_name',
      key: 'service_name',
      width: '30%',
      render: (text: string) => (
        <div style={{ fontWeight: 500 }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Tổng booking',
      dataIndex: 'total_bookings',
      key: 'total_bookings',
      width: '15%',
      align: 'center' as const,
      render: (value: number) => (
        <Statistic 
          value={value} 
          valueStyle={{ fontSize: '16px', color: '#1890ff' }}
        />
      ),
    },
    {
      title: 'Đã hoàn thành',
      dataIndex: 'completed_bookings',
      key: 'completed_bookings',
      width: '15%',
      align: 'center' as const,
      render: (value: number) => (
        <Statistic 
          value={value} 
          valueStyle={{ fontSize: '16px', color: '#52c41a' }}
        />
      ),
    },
    {
      title: 'Tỷ lệ hoàn thành',
      dataIndex: 'completion_rate',
      key: 'completion_rate',
      width: '25%',
      render: (rate: number) => {
        const status = rate >= 80 ? 'success' : rate >= 50 ? 'normal' : 'exception';
        return (
          <div>
            <Progress 
              percent={rate} 
              status={status}
              size="small"
              format={percent => `${percent}%`}
            />
          </div>
        );
      },
    },
    {
      title: 'Hiệu suất',
      key: 'performance',
      width: '15%',
      align: 'center' as const,
      render: (record: ServiceBooking) => {
        const { completion_rate } = record;
        let color = '#f5222d'; // Kém
        let text = 'Kém';
        
        if (completion_rate >= 80) {
          color = '#52c41a';
          text = 'Tốt';
        } else if (completion_rate >= 50) {
          color = '#fa8c16';
          text = 'TB';
        }
        
        return (
          <div 
            style={{
              color,
              fontWeight: 600,
              padding: '4px 8px',
              borderRadius: '4px',
              backgroundColor: `${color}15`,
              border: `1px solid ${color}30`
            }}
          >
            {text}
          </div>
        );
      },
    },
  ];

  // Tính toán thống kê tổng quan
  const totalBookings = chartData.reduce((sum, item) => sum + item.total_bookings, 0);
  const totalCompleted = chartData.reduce((sum, item) => sum + item.completed_bookings, 0);
  const avgCompletionRate = chartData.length > 0 
    ? chartData.reduce((sum, item) => sum + item.completion_rate, 0) / chartData.length 
    : 0;

  return (
    <Card title="Hiệu suất dịch vụ" loading={loading}>
      {/* Thống kê tổng quan */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card size="small">
            <Statistic
              title="Tổng booking"
              value={totalBookings}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic
              title="Đã hoàn thành"
              value={totalCompleted}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic
              title="Tỷ lệ TB"
              value={avgCompletionRate}
              precision={1}
              suffix="%"
              valueStyle={{ color: avgCompletionRate >= 70 ? '#52c41a' : '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ booking */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ marginBottom: 16 }}>Phân bố booking theo dịch vụ</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="service_name" 
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              fontSize={12}
            />
            <YAxis />
            <Tooltip 
              formatter={(value) => [value, 'Số booking']}
              labelFormatter={(label) => `Dịch vụ: ${label}`}
            />
            <Bar dataKey="total_bookings" radius={[4, 4, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bảng chi tiết */}
      <div>
        <h4 style={{ marginBottom: 16 }}>Chi tiết hiệu suất từng dịch vụ</h4>
        <Table
          columns={columns}
          dataSource={chartData.map((item, index) => ({ ...item, key: index }))}
          pagination={false}
          size="small"
          scroll={{ x: true }}
        />
      </div>
    </Card>
  );
};

export default ServicesChart; 