import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
  BellOutlined,
  SendOutlined,
  ClockCircleOutlined,
  StopOutlined
} from '@ant-design/icons';
import type { NotificationStats } from './PushNotificationTypes';

interface PushNotificationStatsProps {
  stats: NotificationStats;
}

const PushNotificationStats: React.FC<PushNotificationStatsProps> = ({ stats }) => {
  return (
    <Card style={{ marginBottom: '24px' }}>
      <Row gutter={16}>
        <Col span={4}>
          <Statistic
            title="Tổng số"
            value={stats.total}
            prefix={<BellOutlined />}
          />
        </Col>
        <Col span={4}>
          <Statistic
            title="Đã gửi"
            value={stats.sent}
            valueStyle={{ color: '#3f8600' }}
            prefix={<SendOutlined />}
          />
        </Col>
        <Col span={4}>
          <Statistic
            title="Đã lên lịch"
            value={stats.scheduled}
            valueStyle={{ color: '#1890ff' }}
            prefix={<ClockCircleOutlined />}
          />
        </Col>
        <Col span={4}>
          <Statistic
            title="Bản nháp"
            value={stats.draft}
            valueStyle={{ color: '#666' }}
          />
        </Col>
        <Col span={4}>
          <Statistic
            title="Đã hủy"
            value={stats.cancelled}
            valueStyle={{ color: '#cf1322' }}
            prefix={<StopOutlined />}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default PushNotificationStats; 