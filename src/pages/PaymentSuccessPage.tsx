import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Typography, Button, Descriptions, Result } from 'antd';

const { Title } = Typography;

function formatPrice(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const successParam = params.get('success');
  const messageParam = params.get('message');
  const amountParam = params.get('amount');
  const subscriptionIdParam = params.get('subscriptionId');
  const paymentIdParam = params.get('paymentId');

  const isSuccess = successParam === 'true';

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-r from-teal-600 via-cyan-500 to-blue-500 py-16 px-4">
      <Card className="shadow-xl rounded-2xl max-w-2xl w-full">
        <Result
          status={isSuccess ? 'success' : 'error'}
          title={<Title level={3} className="text-teal-600">{isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}</Title>}
          subTitle={isSuccess ? 'Cảm ơn bạn đã sử dụng dịch vụ của GenHealth Center.' : (messageParam || 'Giao dịch không thành công.')}
        />
        <Descriptions column={1} bordered size="middle" className="mb-4 mt-2">
          {paymentIdParam && <Descriptions.Item label="Mã thanh toán">{paymentIdParam}</Descriptions.Item>}
          {amountParam && <Descriptions.Item label="Số tiền">{formatPrice(Number(amountParam))}</Descriptions.Item>}
          {subscriptionIdParam && <Descriptions.Item label="Gói dịch vụ">{subscriptionIdParam}</Descriptions.Item>}
          {messageParam && <Descriptions.Item label="Thông báo">{messageParam}</Descriptions.Item>}
        </Descriptions>
        <Button type="primary" block onClick={() => navigate('/subscriptions')}>
          Quay về trang gói dịch vụ
        </Button>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage; 