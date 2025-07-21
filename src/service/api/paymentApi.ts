import apiClient from "../instance";

export interface PaymentHistoryResponse {
    success: boolean;
    count: number;
    data: PaymentHistory[];
}
export interface PaymentHistoryDetailResponse{
    success: boolean;
    data: PaymentHistory;
} 
export interface PaymentHistory {
  _id: string;
  user_id: string;
  subscription_plan_id: {
    _id: string;
    name: string;
    description: string;
    price: number;
    duration_days: number; 
    duration_months?: number; 
    is_active: boolean;
    created_at: string;
    updated_at: string;
    __v: number;
  }
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  payment_method: 'vnpay';
  platform: 'web' | 'mobile';
  transaction_ref: string;
  vnp_TxnRef: string;
  created_at: string;
  updated_at: string;
  __v: number;
}

export const getPaymentHistory = async (): Promise<PaymentHistoryResponse> => {
    const response = await apiClient.get("/payment/history");
    return response.data;
}

export const getPaymentHistoryById = async (id: string): Promise<PaymentHistoryDetailResponse> => {
    const response = await apiClient.get(`/payment/${id}`);
    return response.data;
}