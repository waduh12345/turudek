import BaseApiService from './base';
import { ApiResponse, PaginatedResponse } from '@/lib/types';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}

class ProductsService extends BaseApiService {
  async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);
    
    const endpoint = `products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.get<ApiResponse<PaginatedResponse<Product>>>(endpoint);
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return this.get<ApiResponse<Product>>(`products/${id}`);
  }

  async createProduct(data: CreateProductRequest): Promise<ApiResponse<Product>> {
    return this.post<ApiResponse<Product>>('products', data);
  }

  async updateProduct(data: UpdateProductRequest): Promise<ApiResponse<Product>> {
    const { id, ...updateData } = data;
    return this.put<ApiResponse<Product>>(`products/${id}`, updateData);
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return this.delete<ApiResponse<void>>(`products/${id}`);
  }
}

export const productsService = new ProductsService();
