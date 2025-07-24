import React from 'react';
import { Row, Col, Statistic, Card } from 'antd';
import { StarOutlined, CommentOutlined } from '@ant-design/icons';
import type { FeedbackStatistics } from '../../../service/api/feedbackAPI';

interface FeedbackStatsProps {
  statistics: FeedbackStatistics | null;
  loading: boolean;
}

const FeedbackStats: React.FC<FeedbackStatsProps> = ({ statistics, loading }) => {
  return (
    <Card className="mb-4" loading={loading}>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Statistic 
            title="Tổng số feedback" 
            value={statistics?.total || 0} 
            prefix={<CommentOutlined />} 
          />
        </Col>
        <Col span={6}>
          <Statistic 
            title="Đánh giá trung bình" 
            value={statistics?.avg_ratings?.avg_rating?.toFixed(1) || 0} 
            prefix={<StarOutlined />} 
            suffix="/ 5"
          />
        </Col>
        <Col span={6}>
          <Statistic 
            title="Đánh giá dịch vụ" 
            value={statistics?.avg_ratings?.avg_service_quality?.toFixed(1) || 0} 
            suffix="/ 5"
          />
        </Col>
        <Col span={6}>
          <Statistic 
            title="Đánh giá tư vấn viên" 
            value={statistics?.avg_ratings?.avg_consultant?.toFixed(1) || 0} 
            suffix="/ 5"
          />
        </Col>
      </Row>
    </Card>
  );
};

export default FeedbackStats; 