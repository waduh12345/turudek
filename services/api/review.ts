// services/api/topup-reviews.ts
import BaseApiService from "./base";
import { ApiResponse } from "@/lib/types";

/** Entity Review Topup */
export interface TopupReview {
  id: number;
  user_id: number | null;
  name: string;
  review: string;
  rating: number;
  order_id?: string;
  created_at: string;
  updated_at: string;
}

/** Filters untuk listing GET /transaction/topup/reviews */
export interface TopupReviewFilters {
  paginate?: number;
  search?: string;
  page?: number;
  started_at?: string;
  ended_at?: string;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

/** Body POST */
export interface CreateTopupReviewRequest {
  user_id?: number;
  name: string;
  review: string;
  rating: number;
}

export interface CreateTopupReviewResponse {
  message?: string;
  review: TopupReview;
  order_id?: string;
}

function buildQuery(params: Record<string, unknown>): string {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") q.append(k, String(v));
  });
  const qs = q.toString();
  return qs ? `?${qs}` : "";
}

class TopupReviewsService extends BaseApiService {
  constructor() {
    super();
    this.baseURL =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://api-topup.naditechno.id/api/v1";
  }

  /** GET /transaction/topup/reviews */
  async getReviews(
    filters: TopupReviewFilters = { paginate: 10, search: "", page: 1 }
  ): Promise<ApiResponse<Paginated<TopupReview>>> {
    const query = buildQuery({
      paginate: filters.paginate ?? 10,
      search: filters.search ?? "",
      page: filters.page ?? 1,
      started_at: filters.started_at,
      ended_at: filters.ended_at,
    });

    return this.get<ApiResponse<Paginated<TopupReview>>>(
      `transaction/topup/reviews${query}`
    );
  }

  /**
   * POST /transaction/topups/order/:orderId
   * Wajib kirim orderId pada path (bukan di body).
   */
  async createReviewByOrder(
    orderId: string,
    data: CreateTopupReviewRequest
  ): Promise<ApiResponse<CreateTopupReviewResponse>> {
    return this.post<ApiResponse<CreateTopupReviewResponse>>(
      `transaction/topups/order/${encodeURIComponent(orderId)}`,
      data
    );
  }
}

export const topupReviewsService = new TopupReviewsService();
export type { CreateTopupReviewRequest as TopupReviewCreateBody };