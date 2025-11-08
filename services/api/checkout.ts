// services/api/checkout.ts
import BaseApiService from "./base";
import { ApiResponse } from "@/lib/types";

export type MidtransPaymentType = "bank_transfer" | "qris";
export type MidtransChannel = "bca" | "bni" | "bri" | "cimb" | "qris";

export interface CheckoutRequest {
  user_id?: number;
  product_id: number;
  customer_no: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone: string;
  midtrans_payment_type: MidtransPaymentType;
  midtrans_channel: MidtransChannel;
}

export interface CheckoutProductDetails {
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
}

export interface CheckoutProduct {
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
}

export interface CheckoutResponse {
  id: number;
  user_id: number | null;
  product_id: number;
  provider: string;
  reference: string;
  ref_number: number;
  order_id: string;
  product_details: CheckoutProductDetails;
  /** payload dari provider; biarkan unknown lalu lakukan narrowing saat dipakai */
  response: unknown;
  customer_no: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string;
  sn: string | null;
  amount: number;
  payment_link: string | null;

  // Midtrans fields
  midtrans_payment_type?: MidtransPaymentType;
  midtrans_transaction_id?: string | null;
  /** URL QR (qris) atau nomor VA (VA) */
  midtrans_account_number?: string | null;
  /** kode tambahan jika ada */
  midtrans_account_code?: string | null;
  midtrans_channel?: MidtransChannel;

  expires_at: string | null;
  paid_at: string | null;
  status_payment: number;
  status: number;
  created_at: string;
  updated_at: string;
  product: CheckoutProduct;
}

class CheckoutService extends BaseApiService {
  constructor() {
    super();
    this.baseURL =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://api-topup.naditechno.id/api/v1";
  }

  async checkout(
    data: CheckoutRequest
  ): Promise<ApiResponse<CheckoutResponse>> {
    return this.post<ApiResponse<CheckoutResponse>>(
      "transaction/checkout",
      data
    );
  }
}

export const checkoutService = new CheckoutService();