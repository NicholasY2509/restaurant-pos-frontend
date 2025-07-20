import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User, 
  Tenant,
  ApiResponse 
} from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get('/auth/profile');
    return response.data;
  }

  // Tenant endpoints
  async getCurrentTenant(): Promise<Tenant> {
    const response: AxiosResponse<Tenant> = await this.api.get('/tenants/current');
    return response.data;
  }

  async getAllTenants(): Promise<Tenant[]> {
    const response: AxiosResponse<Tenant[]> = await this.api.get('/tenants');
    return response.data;
  }

  async getTenant(id: number): Promise<Tenant> {
    const response: AxiosResponse<Tenant> = await this.api.get(`/tenants/${id}`);
    return response.data;
  }

  async updateTenant(id: number, data: Partial<Tenant>): Promise<Tenant> {
    const response: AxiosResponse<Tenant> = await this.api.patch(`/tenants/${id}`, data);
    return response.data;
  }

  async deleteTenant(id: number): Promise<void> {
    await this.api.delete(`/tenants/${id}`);
  }

  async getAllUsers(): Promise<User[]> {
    const response: AxiosResponse<User[]> = await this.api.get('/users');
    return response.data;
  }

  async getUser(id: number): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get(`/users/${id}`);
    return response.data;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const response: AxiosResponse<User> = await this.api.patch(`/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await this.api.delete(`/users/${id}`);
  }
}

export const apiService = new ApiService();
export default apiService; 