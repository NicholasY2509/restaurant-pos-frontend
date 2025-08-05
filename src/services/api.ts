import axios, { AxiosInstance } from 'axios';
import { logger, logApiError } from '../utils/logger';
import { AuthEndpoints, TenantEndpoints, UserEndpoints, MenuEndpoints, MenuModifierEndpoints } from './endpoints';
import { User, CreateUserDto, UpdateUserDto, UserCountResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class ApiService {
  private api: AxiosInstance;
  public auth: AuthEndpoints;
  public tenants: TenantEndpoints;
  public users: UserEndpoints;
  public menu: MenuEndpoints;
  public menuModifiers: MenuModifierEndpoints;

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
    this.menuModifiers = new MenuModifierEndpoints(this.api);

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
}

export const apiService = new ApiService();
export default apiService; 