import React from 'react';
import { Card, Table, Progress, Statistic, Row, Col, Tag } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { BookingDailyTrend } from '../../../service/api/dashboardAPI';

interface BookingsChartProps {
  data: BookingDailyTrend[];
  loading?: boolean;
}

const BookingsChart: React.FC<BookingsChartProps> = ({ data, loading = false }) => {
  const chartData = data && data.length > 0 ? data.map(item => ({
    date: item._id,
    'Tổng booking': item.count,
    'Hoàn thành': item.completed,
    'Đã hủy': item.cancelled,
    'Đang xử lý': item.count - item.completed - item.cancelled,
    completion_rate: item.count > 0 ? Math.round((item.completed / item.count) * 100) : 0,
    cancel_rate: item.count > 0 ? Math.round((item.cancelled / item.count) * 100) : 0,
  })) : [];

  // Tính toán thống kê tổng quan
  const totalBookings = chartData.reduce((sum, item) => sum + item['Tổng booking'], 0);
  const totalCompleted = chartData.reduce((sum, item) => sum + item['Hoàn thành'], 0);
  const totalCancelled = chartData.reduce((sum, item) => sum + item['Đã hủy'], 0);
  const totalPending = totalBookings - totalCompleted - totalCancelled;
  
  const overallCompletionRate = totalBookings > 0 ? Math.round((totalCompleted / totalBookings) * 100) : 0;
  const overallCancelRate = totalBookings > 0 ? Math.round((totalCancelled / totalBookings) * 100) : 0;

  // Columns cho bảng chi tiết
  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      width: '15%',
      render: (date: string) => (
        <div style={{ fontWeight: 500 }}>
          {new Date(date).toLocaleDateString('vi-VN')}
        </div>
      ),
    },
    {
      title: 'Tổng booking',
      dataIndex: 'Tổng booking',
      key: 'total',
      width: '12%',
      align: 'center' as const,
      render: (value: number) => (
        <Statistic 
          value={value} 
          valueStyle={{ fontSize: '14px', color: '#1890ff' }}
        />
      ),
    },
    {
      title: 'Hoàn thành',
      dataIndex: 'Hoàn thành',
      key: 'completed',
      width: '12%',
      align: 'center' as const,
      render: (value: number) => (
        <Statistic 
          value={value} 
          valueStyle={{ fontSize: '14px', color: '#52c41a' }}
        />
      ),
    },
    {
      title: 'Đã hủy',
      dataIndex: 'Đã hủy',
      key: 'cancelled',
      width: '12%',
      align: 'center' as const,
      render: (value: number) => (
        <Statistic 
          value={value} 
          valueStyle={{ fontSize: '14px', color: '#ff4d4f' }}
        />
      ),
    },
    {
      title: 'Đang xử lý',
      dataIndex: 'Đang xử lý',
      key: 'pending',
      width: '12%',
      align: 'center' as const,
      render: (value: number) => (
        <Statistic 
          value={value} 
          valueStyle={{ fontSize: '14px', color: '#fa8c16' }}
        />
      ),
    },
    {
      title: 'Tỷ lệ hoàn thành',
      dataIndex: 'completion_rate',
      key: 'completion_rate',
      width: '20%',
      render: (rate: number) => {
        const status = rate >= 80 ? 'success' : rate >= 50 ? 'normal' : 'exception';
        return (
          <Progress 
            percent={rate} 
            status={status}
            size="small"
            format={percent => `${percent}%`}
          />
        );
      },
    },
    {
      title: 'Hiệu suất',
      key: 'performance',
      width: '17%',
      align: 'center' as const,
      render: (record: { completion_rate: number; cancel_rate: number }) => {
        const { completion_rate, cancel_rate } = record;
        
        if (completion_rate >= 80 && cancel_rate <= 10) {
          return <Tag color="success">Xuất sắc</Tag>;
        } else if (completion_rate >= 60 && cancel_rate <= 20) {
          return <Tag color="processing">Tốt</Tag>;
        } else if (completion_rate >= 40) {
          return <Tag color="warning">Trung bình</Tag>;
        } else {
          return <Tag color="error">Cần cải thiện</Tag>;
        }
      },
    },
  ];

  return (
    <Card title="Thống kê chi tiết Booking" loading={loading}>
      {/* Thống kê tổng quan */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Tổng booking"
              value={totalBookings}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Đã hoàn thành"
              value={totalCompleted}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Đã hủy"
              value={totalCancelled}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Đang xử lý"
              value={totalPending}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Thống kê tỷ lệ */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card size="small">
            <Statistic
              title="Tỷ lệ hoàn thành"
              value={overallCompletionRate}
              suffix="%"
              valueStyle={{ 
                color: overallCompletionRate >= 70 ? '#52c41a' : overallCompletionRate >= 50 ? '#fa8c16' : '#ff4d4f' 
              }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small">
            <Statistic
              title="Tỷ lệ hủy"
              value={overallCancelRate}
              suffix="%"
              valueStyle={{ 
                color: overallCancelRate <= 10 ? '#52c41a' : overallCancelRate <= 20 ? '#fa8c16' : '#ff4d4f' 
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ xu hướng */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ marginBottom: 16 }}>Xu hướng booking theo ngày</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => new Date(value).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(value) => `Ngày: ${new Date(value).toLocaleDateString('vi-VN')}`}
            />
            <Legend />
            <Bar dataKey="Tổng booking" fill="#1890ff" />
            <Bar dataKey="Hoàn thành" fill="#52c41a" />
            <Bar dataKey="Đã hủy" fill="#ff4d4f" />
            <Bar dataKey="Đang xử lý" fill="#fa8c16" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bảng chi tiết */}
      <div>
        <h4 style={{ marginBottom: 16 }}>Chi tiết booking theo ngày</h4>
        <Table
          columns={columns}
          dataSource={chartData.map((item, index) => ({ ...item, key: index }))}
          pagination={false}
          size="small"
          scroll={{ x: true }}
          summary={() => (
            <Table.Summary.Row style={{ backgroundColor: '#fafafa' }}>
              <Table.Summary.Cell index={0}>
                <strong>Tổng cộng</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <strong style={{ color: '#1890ff' }}>{totalBookings}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <strong style={{ color: '#52c41a' }}>{totalCompleted}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3}>
                <strong style={{ color: '#ff4d4f' }}>{totalCancelled}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4}>
                <strong style={{ color: '#fa8c16' }}>{totalPending}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5}>
                <Progress 
                  percent={overallCompletionRate} 
                  size="small" 
                  status={overallCompletionRate >= 70 ? 'success' : 'normal'}
                />
              </Table.Summary.Cell>
              <Table.Summary.Cell index={6}>
                {overallCompletionRate >= 80 && overallCancelRate <= 10 ? (
                  <Tag color="success">Xuất sắc</Tag>
                ) : overallCompletionRate >= 60 ? (
                  <Tag color="processing">Tốt</Tag>
                ) : (
                  <Tag color="warning">Cần cải thiện</Tag>
                )}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </div>
    </Card>
  );
};

export default BookingsChart; 