import React from 'react';
import { Card } from 'antd';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { RevenueStatsData } from '../../../service/api/dashboardAPI';

interface RevenueChartProps {
  data: RevenueStatsData[];
  loading?: boolean;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data, loading = false }) => {
  const chartData = data && data.length > 0 ? data.map(item => ({
    date: item.date.split('-').slice(1).reverse().join('/'),
    total_revenue: item.total_revenue
  })) : [];

  const formatCurrency = (value: number) => {
    return (value / 1000000).toFixed(1) + 'M';
  };

  return (
    <Card title="Doanh thu" loading={loading}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip formatter={(value) => [(value as number / 1000000).toFixed(1) + 'M VND', 'Doanh thu']} />
          <Line type="monotone" dataKey="total_revenue" stroke="#52c41a" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RevenueChart; 