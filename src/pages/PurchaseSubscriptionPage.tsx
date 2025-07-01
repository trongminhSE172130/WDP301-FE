import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Alert, Button } from 'antd';
import { motion } from 'framer-motion';
import apiClient from '../service/instance';
import { useNavigate } from 'react-router-dom';

interface SubscriptionPlan {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration_days: number;
  duration_months: number;
  is_active: boolean;
}

const PurchaseSubscriptionPage: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    apiClient.get('/subscriptions/plans')
      .then(res => {
        setPlans(res.data.data || []);
        setError(null);
      })
      .catch(() => {
        setError('Không thể tải danh sách gói đăng ký.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCardClick = (planId: string) => {
    navigate(`/subscriptions/${planId}`);
  };

  return (
    <div>
      {/* Hero section giống HomePage */}
      <section className="bg-gradient-to-r from-teal-600 via-cyan-500 to-blue-500 text-white py-20 mb-[-60px] relative z-10">
        <div className="container mx-auto px-6 flex flex-col items-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold mb-6 text-center"
          >
            Mua gói dịch vụ
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl mb-8 max-w-2xl text-center"
          >
            Chọn gói dịch vụ phù hợp để nhận được nhiều quyền lợi và ưu đãi chăm sóc sức khỏe toàn diện từ GenHealth Center.
          </motion.p>
        </div>
      </section>
      {/* Danh sách gói dịch vụ */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="relative z-20"
      >
        <div className="max-w-5xl mx-auto px-4" style={{ marginTop: -80 }}>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
            {loading ? <Spin /> : (
              <Row gutter={[24, 24]}>
                {plans.map(plan => (
                  <Col xs={24} sm={12} md={8} key={plan._id}>
                    <Card
                      title={<span style={{ fontWeight: 600, fontSize: 20 }}>{plan.name}</span>}
                      bordered={false}
                      onClick={() => handleCardClick(plan._id)}
                      style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer' }}
                      headStyle={{ background: '#e6fffb', borderRadius: '16px 16px 0 0' }}
                    >
                      <div style={{ minHeight: 80, marginBottom: 16 }}>{plan.description}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#13c2c2', marginBottom: 8 }}>
                        {plan.price.toLocaleString('vi-VN')} đ
                      </div>
                      <div style={{ color: '#888', marginBottom: 16 }}>
                        Thời hạn: {plan.duration_months > 0 ? `${plan.duration_months} tháng` : `${plan.duration_days} ngày`}
                      </div>
                      <Button type="primary" block style={{ borderRadius: 8 }} disabled={!plan.is_active}>
                        Mua ngay
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PurchaseSubscriptionPage; 