import { AxiosInstance } from 'axios';
import { User, CreateUserDto, UpdateUserDto, UserCountResponse } from '../../types';

export class UserEndpoints {
  constructor(private api: AxiosInstance) {}

  async getAllUsers(): Promise<User[]> {
    const response = await this.api.get<User[]>('/users');
    return response.data;
  }

  async getUser(id: number): Promise<User> {
    const response = await this.api.get<User>(`/users/${id}`);
    return response.data;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const response = await this.api.patch<User>(`/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await this.api.delete(`/users/${id}`);
  }

  // Enhanced User Management Methods
  async getUserById(id: string): Promise<User> {
    const response = await this.api.get<User>(`/users/${id}`);
    return response.data;
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const response = await this.api.post<User>('/users', userData);
    return response.data;
  }

  async updateUserById(id: string, userData: UpdateUserDto): Promise<User> {
    const response = await this.api.patch<User>(`/users/${id}`, userData);
    return response.data;
  }

  async deactivateUser(id: string): Promise<{ message: string }> {
    const response = await this.api.delete<{ message: string }>(`/users/${id}`);
    return response.data;
  }

  async getUserCount(): Promise<UserCountResponse> {
    const response = await this.api.get<UserCountResponse>('/users/count');
    return response.data;
  }

  async getMyProfile(): Promise<User> {
    const response = await this.api.get<User>('/users/profile/me');
    return response.data;
  }
} 