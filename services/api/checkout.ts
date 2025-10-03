import BaseApiService from './base';
import { ApiResponse } from '@/lib/types';

// Checkout request interface
export interface CheckoutRequest {
  product_id: number;
  user_id: string;
  phone_number: string;
  email_receipt?: boolean;
  discount_code?: string;
  payment_method: string;
}

// Checkout response interface
export interface CheckoutResponse {
  id: number;
  order_id: string;
  product_id: number;
  user_id: string;
  phone_number: string;
  email_receipt: boolean;
  discount_code?: string;
  payment_method: string;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  payment_url?: string;
  payment_instructions?: string;
}

class CheckoutService extends BaseApiService {
  constructor() {
    super();
    // Override base URL for public API
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-topup.naditechno.id/api/v1';
  }

  async checkout(data: CheckoutRequest): Promise<ApiResponse<CheckoutResponse>> {
    return this.post<ApiResponse<CheckoutResponse>>('transaction/checkout', data);
  }
}

export const checkoutService = new CheckoutService();
