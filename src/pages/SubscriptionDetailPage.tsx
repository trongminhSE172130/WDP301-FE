import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getSubscriptionPlanDetail } from '../service/api/subscriptionAPI';
import { Spin, Alert, Button, Tag, Descriptions, Typography } from 'antd';
import type { SubscriptionPlan } from '../service/api/subscriptionAPI';
import instance from '../service/instance';
import { message } from 'antd';

const { Title } = Typography;

const SubscriptionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [paying, setPaying] = useState(false);
  const paymentSuccess = location.state && location.state.paymentSuccess;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getSubscriptionPlanDetail(id)
      .then(data => {
        setPlan(data);
        setError(null);
      })
      .catch(() => setError('Không thể tải chi tiết gói dịch vụ.'))
      .finally(() => setLoading(false));
  }, [id]);

  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  const formatDuration = (days: number, months: number) => months > 0 ? `${months} tháng` : `${days} ngày`;

  const handleBuy = async () => {
    if (!plan) return;
    setPaying(true);
    try {
      const res = await instance.post('/payment/create', {
        subscription_plan_id: plan._id
      });
      if (res.data && res.data.data && res.data.data.paymentUrl) {
        window.open(res.data.data.paymentUrl, '_blank');
        message.success('Đang chuyển đến cổng thanh toán...');
      } else {
        message.success('Tạo thanh toán thành công!');
      }
    } catch {
      message.error('Tạo thanh toán thất bại!');
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-r from-teal-600 via-cyan-500 to-blue-500 py-16 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full flex flex-col items-center">
        {loading ? <Spin /> : error ? <Alert type="error" message={error} showIcon /> : plan && (
          <>
            <Title level={3} className="text-teal-600 mb-4 text-center">{plan.name}</Title>
            <Descriptions column={1} bordered size="middle" labelStyle={{ width: '40%' }}>
              <Descriptions.Item label="Mô tả">
                <div className="text-gray-700 leading-relaxed">{plan.description}</div>
              </Descriptions.Item>
              <Descriptions.Item label="Giá tiền">
                <span className="text-xl font-bold text-green-600">{formatPrice(plan.price)}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Thời hạn">
                <Tag color="blue">{formatDuration(plan.duration_days, plan.duration_months)}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={plan.is_active ? 'green' : 'default'}>{plan.is_active ? '🟢 Đang hoạt động' : '⚫ Tạm dừng'}</Tag>
              </Descriptions.Item>
            </Descriptions>
            {paymentSuccess && (
              <Alert type="success" message="Thanh toán thành công!" showIcon className="mt-6 mb-2" />
            )}
            <Button type="primary" block className="mt-6" onClick={handleBuy} loading={paying} disabled={!plan.is_active || paymentSuccess} style={paymentSuccess ? { opacity: 0.5, pointerEvents: 'none' } : {}}>
              Mua gói
            </Button>
            <Button block className="mt-2" onClick={() => navigate(-1)}>
              Quay lại
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionDetailPage; 