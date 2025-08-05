import { AxiosInstance } from 'axios';

// Menu Item Types
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  category: Category;
  imageUrl: string;
  preparationTime: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  modifiers?: any[];
}

interface CreateMenuItemRequest {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  preparationTime: number;
}

interface UpdateMenuItemRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  isAvailable?: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
  color: string;
  tenantId: number;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  color?: string;
  isActive?: boolean;
  tenantId?: number;
}

export class MenuEndpoints {
  constructor(private api: AxiosInstance) {}

  async getAllMenuItems(): Promise<MenuItem[]> {
    const response = await this.api.get<MenuItem[]>('/menu-items');
    return response.data;
  }

  async getMenuItem(id: number): Promise<MenuItem> {
    const response = await this.api.get<MenuItem>(`/menu-items/${id}`);
    return response.data;
  }

  async createMenuItem(data: CreateMenuItemRequest): Promise<MenuItem> {
    const response = await this.api.post<MenuItem>('/menu-items', data);
    return response.data;
  }

  async updateMenuItem(id: number, data: UpdateMenuItemRequest): Promise<MenuItem> {
    const response = await this.api.patch<MenuItem>(`/menu-items/${id}`, data);
    return response.data;
  }

  async deleteMenuItem(id: number): Promise<void> {
    await this.api.delete(`/menu-items/${id}`);
  }

  async getMenuByCategory(category: string): Promise<MenuItem[]> {
    const response = await this.api.get<MenuItem[]>(`/menu-items/category/${category}`);
    return response.data;
  }

  async toggleMenuItemAvailability(id: number): Promise<MenuItem> {
    const response = await this.api.patch<MenuItem>(`/menu-items/${id}/toggle-availability`);
    return response.data;
  }

  // Category Management Methods
  async getAllCategories(): Promise<Category[]> {
    const response = await this.api.get<Category[]>('/menu-categories');
    return response.data;
  }

  async getCategory(id: number): Promise<Category> {
    const response = await this.api.get<Category>(`/menu-categories/${id}`);
    return response.data;
  }

  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    const response = await this.api.post<Category>('/menu-categories', data);
    return response.data;
  }

  async updateCategory(id: number, data: UpdateCategoryRequest): Promise<Category> {
    const response = await this.api.patch<Category>(`/menu-categories/${id}`, data);
    return response.data;
  }

  async deleteCategory(id: number): Promise<void> {
    await this.api.delete(`/menu-categories/${id}`);
  }

  async toggleCategoryStatus(id: number): Promise<Category> {
    const response = await this.api.patch<Category>(`/menu-categories/${id}/toggle-status`);
    return response.data;
  }
} 