import BaseApiService from './base';
import { ApiResponse } from './base';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  token_type: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

class AuthService extends BaseApiService {
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await this.post<ApiResponse<LoginResponse>>('login', credentials);
    
    // Store token after successful login
    if (response.code === 200 && response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async logout(): Promise<void> {
    this.setToken(null);
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return this.get<ApiResponse<User>>('profile');
  }

  async refreshToken(): Promise<ApiResponse<LoginResponse>> {
    return this.post<ApiResponse<LoginResponse>>('refresh');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
