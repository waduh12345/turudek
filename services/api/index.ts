// Export all API services
export { authService } from './auth';
export { productsService } from './products';
export { ordersService } from './orders';
export { productCategoriesService } from './product-categories';
export { default as BaseApiService } from './base';
export type { ApiResponse, ApiError } from './base';
export type { LoginRequest, LoginResponse, User } from './auth';
export type { Product, CreateProductRequest, UpdateProductRequest } from './products';
export type { Order, CreateOrderRequest, UpdateOrderStatusRequest } from './orders';
export type { 
  ProductCategory, 
  CreateProductCategoryRequest, 
  UpdateProductCategoryRequest,
  ProductCategoryPaginationParams,
  ProductCategoryPaginatedResponse
} from './product-categories';

// Main API service instance
import { authService } from './auth';
import { productsService } from './products';
import { ordersService } from './orders';
import { productCategoriesService } from './product-categories';

export const api = {
  auth: authService,
  products: productsService,
  orders: ordersService,
  productCategories: productCategoriesService,
};
