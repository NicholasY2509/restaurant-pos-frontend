import { AxiosInstance } from 'axios';
import { User } from '../../types';

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
} 