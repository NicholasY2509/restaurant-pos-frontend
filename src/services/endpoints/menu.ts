import { AxiosInstance } from 'axios';

// You can define types here or import from types file
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateMenuItemRequest {
  name: string;
  description: string;
  price: number;
  category: string;
}

interface UpdateMenuItemRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  isAvailable?: boolean;
}

export class MenuEndpoints {
  constructor(private api: AxiosInstance) {}

  async getAllMenuItems(): Promise<MenuItem[]> {
    const response = await this.api.get<MenuItem[]>('/menu');
    return response.data;
  }

  async getMenuItem(id: number): Promise<MenuItem> {
    const response = await this.api.get<MenuItem>(`/menu/${id}`);
    return response.data;
  }

  async createMenuItem(data: CreateMenuItemRequest): Promise<MenuItem> {
    const response = await this.api.post<MenuItem>('/menu', data);
    return response.data;
  }

  async updateMenuItem(id: number, data: UpdateMenuItemRequest): Promise<MenuItem> {
    const response = await this.api.patch<MenuItem>(`/menu/${id}`, data);
    return response.data;
  }

  async deleteMenuItem(id: number): Promise<void> {
    await this.api.delete(`/menu/${id}`);
  }

  async getMenuByCategory(category: string): Promise<MenuItem[]> {
    const response = await this.api.get<MenuItem[]>(`/menu/category/${category}`);
    return response.data;
  }

  async toggleMenuItemAvailability(id: number): Promise<MenuItem> {
    const response = await this.api.patch<MenuItem>(`/menu/${id}/toggle-availability`);
    return response.data;
  }
} 