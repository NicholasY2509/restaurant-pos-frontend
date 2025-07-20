import { AxiosInstance } from 'axios';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../../types';

export class AuthEndpoints {
  constructor(private api: AxiosInstance) {}

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response = await this.api.get<User>('/auth/profile');
    return response.data;
  }
} 