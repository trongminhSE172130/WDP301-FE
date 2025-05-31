import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface StatsItem {
  id: number;
  title: string;
  value: number;
  increase: number;
  icon: React.ReactNode;
  prefix?: string;
}

interface StatsCardProps {
  stats: StatsItem[];
}

const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  return (
    <Row gutter={[16, 16]} className="w-full">
      {stats.map((stat) => (
        <Col xs={24} sm={24} md={8} lg={8} key={stat.id}>
          <Card 
            bordered={false} 
            className="w-full rounded-lg shadow-sm"
          >
            <div className="relative">
              <div className="absolute top-0 right-0 bg-blue-50 p-2 rounded-full flex items-center justify-center w-10 h-10 text-blue-500">
                {stat.icon}
              </div>
            </div>

            <Text type="secondary" className="block text-sm mb-1">
              {stat.title}
            </Text>

            <div className="flex items-baseline">
              <Text strong className="text-2xl mr-2">
                {stat.prefix}{stat.value.toLocaleString('vi-VN')}
              </Text>
              
              <div className="bg-green-50 px-2 py-0.5 rounded-full inline-flex items-center">
                <ArrowUpOutlined className="text-green-500 text-xs mr-1" />
                <Text className="text-green-500 text-xs">
                  {stat.increase}%
                </Text>
              </div>
            </div>

            <Text type="secondary" className="block text-xs mt-2">
              so với tháng trước
            </Text>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatsCard; 