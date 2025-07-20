import axios, { AxiosInstance } from 'axios';
import { logger, logApiError } from '../utils/logger';
import { AuthEndpoints, TenantEndpoints, UserEndpoints, MenuEndpoints } from './endpoints';
import { User, CreateUserDto, UpdateUserDto, UserCountResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class ApiService {
  private api: AxiosInstance;
  public auth: AuthEndpoints;
  public tenants: TenantEndpoints;
  public users: UserEndpoints;
  public menu: MenuEndpoints;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Initialize endpoint classes
    this.auth = new AuthEndpoints(this.api);
    this.tenants = new TenantEndpoints(this.api);
    this.users = new UserEndpoints(this.api);
    this.menu = new MenuEndpoints(this.api);

    this.setupInterceptors();
  }

  private setupInterceptors() {
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
      (response) => {
        logger.info(`API Success: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
          status: response.status,
          url: response.config.url,
          method: response.config.method
        });
        return response;
      },
      (error) => {
        logApiError(`${error.config?.method?.toUpperCase()} ${error.config?.url}`, error);
        
        if (error.response?.status === 401) {
          logger.warn('Authentication failed, clearing auth data', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          // Don't redirect automatically, let the component handle it
        }
        return Promise.reject(error);
      }
    );
  }

  // Convenience methods for backward compatibility
  async login(credentials: any): Promise<any> {
    return this.auth.login(credentials);
  }

  async register(userData: any): Promise<any> {
    return this.auth.register(userData);
  }

  async getProfile(): Promise<any> {
    return this.auth.getProfile();
  }

  async getCurrentTenant(): Promise<any> {
    return this.tenants.getCurrentTenant();
  }

  async getAllTenants(): Promise<any> {
    return this.tenants.getAllTenants();
  }

  async getTenant(id: number): Promise<any> {
    return this.tenants.getTenant(id);
  }

  async updateTenant(id: number, data: any): Promise<any> {
    return this.tenants.updateTenant(id, data);
  }

  async deleteTenant(id: number): Promise<void> {
    return this.tenants.deleteTenant(id);
  }

  async getAllUsers(): Promise<any> {
    return this.users.getAllUsers();
  }

  async getUser(id: number): Promise<any> {
    return this.users.getUser(id);
  }

  async updateUser(id: number, data: any): Promise<any> {
    return this.users.updateUser(id, data);
  }

  async deleteUser(id: number): Promise<void> {
    return this.users.deleteUser(id);
  }

  // Enhanced User Management Methods
  async getUsers(): Promise<User[]> {
    const response = await this.api.get('/users');
    return response.data;
  }

  async getUserById(id: string): Promise<User> {
    const response = await this.api.get(`/users/${id}`);
    return response.data;
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const response = await this.api.post('/users', userData);
    return response.data;
  }

  async updateUserById(id: string, userData: UpdateUserDto): Promise<User> {
    const response = await this.api.patch(`/users/${id}`, userData);
    return response.data;
  }

  async deactivateUser(id: string): Promise<{ message: string }> {
    const response = await this.api.delete(`/users/${id}`);
    return response.data;
  }

  async getUserCount(): Promise<UserCountResponse> {
    const response = await this.api.get('/users/count');
    return response.data;
  }

  async getMyProfile(): Promise<User> {
    const response = await this.api.get('/users/profile/me');
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService; 