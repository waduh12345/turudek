import BaseApiService from './base';
import { ApiResponse } from '@/lib/types';

// Checkout request interface
export interface CheckoutRequest {
  user_id?: number; // Optional - only if user is logged in
  product_id: number;
  customer_no: string; // Game ID or customer number
  customer_name?: string; // Optional customer name
  customer_email?: string; // Optional customer email
  customer_phone: string; // WhatsApp number for notifications
}

// Checkout response interface
export interface CheckoutResponse {
  id: number;
  user_id: number | null;
  product_id: number;
  provider: string;
  reference: string;
  ref_number: number;
  order_id: string;
  product_details: {
    id: number;
    sku: string;
    name: string;
    slug: string;
    status: number;
    buy_price: string;
    created_at: string;
    sell_price: string;
    updated_at: string;
    description: string;
    product_category_id: number;
  };
  response: any;
  customer_no: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  sn: string | null;
  amount: number;
  payment_link: string;
  expires_at: string | null;
  paid_at: string | null;
  status_payment: number;
  status: number;
  created_at: string;
  updated_at: string;
  product: {
    id: number;
    product_category_id: number;
    name: string;
    slug: string;
    sku: string;
    description: string;
    buy_price: string;
    sell_price: string;
    status: number;
    created_at: string;
    updated_at: string;
  };
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
