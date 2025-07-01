import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Spin, Alert, Button, Typography, Divider, message } from 'antd';
import axios from 'axios';

const { Title } = Typography;

interface PaymentDetail {
  _id: string;
  subscription_plan: {
    name: string;
    description: string;
    price: number;
    duration_days: number;
    duration_months: number;
  };
  full_name: string;
  email: string;
  phone: string;
  note?: string;
  created_at: string;
  paymentUrl?: string;
  // ... các trường khác nếu cần
}

const PaymentConfirmPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<PaymentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const paymentUrl = (location.state as { paymentUrl?: string } | undefined)?.paymentUrl;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios.get(`/payment/${id}`)
      .then(res => {
        setDetail(res.data.data);
        setError(null);
        if (res.data.success && res.data.data && res.data.data.subscription_plan && res.data.data.status === 'success') {
          setTimeout(() => {
            navigate(`/subscriptions/${res.data.data.subscription_plan._id}`, {
              state: { paymentSuccess: true }
            });
          }, 1500);
        }
      })
      .catch(() => setError('Không thể tải chi tiết thanh toán.'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const handleConfirm = () => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    } else if (detail?.paymentUrl) {
      window.location.href = detail.paymentUrl;
    } else {
      message.error('Không tìm thấy link thanh toán!');
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 py-16 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl w-full flex flex-col md:flex-row gap-8">
        {loading ? <Spin /> : error ? <Alert type="error" message={error} showIcon /> : detail && (
          <>
            {/* Cột trái: Phương thức thanh toán */}
            <div className="flex-1 min-w-[260px] border-r border-gray-200 pr-8 mb-8 md:mb-0">
              <Title level={5} className="mb-4">Phương thức thanh toán</Title>
              <div className="flex items-center gap-2 mb-2">
                <input type="radio" checked readOnly />
                <img src="https://sandbox.vnpayment.vn/apis/assets/images/logo-icon/vnpay-logo.svg" alt="VNPay" style={{ height: 28 }} />
                <span className="ml-2">VNPay</span>
              </div>
            </div>
            {/* Cột phải: Thông tin hóa đơn */}
            <div className="flex-1 min-w-[260px]">
              <Title level={5} className="mb-4">Tổng hóa đơn</Title>
              <div className="mb-2 flex items-center gap-2">
                <span role="img" aria-label="package">🩺</span>
                <span>{detail.subscription_plan.name}</span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <span role="img" aria-label="desc">💬</span>
                <span>{detail.subscription_plan.description}</span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <span role="img" aria-label="price">💰</span>
                <span>Giá tiền: {formatPrice(detail.subscription_plan.price)} / {detail.subscription_plan.duration_months > 0 ? `${detail.subscription_plan.duration_months} tháng` : `${detail.subscription_plan.duration_days} ngày`}</span>
              </div>
              <Divider />
              <div className="flex justify-between mb-2">
                <span>Giảm giá</span>
                <span>0đ</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Tổng tiền</span>
                <span>{formatPrice(detail.subscription_plan.price)}</span>
              </div>
              <Button type="primary" block size="large" className="mt-8" onClick={handleConfirm}>
                Xác nhận
              </Button>
              <Button block className="mt-2" onClick={() => navigate(-1)}>
                Quay lại
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentConfirmPage; 