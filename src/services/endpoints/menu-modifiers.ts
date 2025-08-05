import { AxiosInstance } from 'axios';

export interface MenuModifier {
  id: string;
  name: string;
  description?: string;
  price: number;
  isAvailable: boolean;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  menuItems?: any[];
}

export interface CreateMenuModifierDto {
  name: string;
  description?: string;
  price?: number;
  isAvailable?: boolean;
}

export interface UpdateMenuModifierDto extends Partial<CreateMenuModifierDto> {}

export class MenuModifierEndpoints {
  constructor(private api: AxiosInstance) {}

  async getAll(): Promise<MenuModifier[]> {
    const response = await this.api.get('/menu-modifiers');
    return response.data;
  }

  async getById(id: string): Promise<MenuModifier> {
    const response = await this.api.get(`/menu-modifiers/${id}`);
    return response.data;
  }

  async create(data: CreateMenuModifierDto): Promise<MenuModifier> {
    const response = await this.api.post('/menu-modifiers', data);
    return response.data;
  }

  async update(id: string, data: UpdateMenuModifierDto): Promise<MenuModifier> {
    const response = await this.api.patch(`/menu-modifiers/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await this.api.delete(`/menu-modifiers/${id}`);
  }

  async assignToMenuItem(modifierId: string, menuItemId: string): Promise<MenuModifier> {
    const response = await this.api.post(`/menu-modifiers/${modifierId}/assign/${menuItemId}`);
    return response.data;
  }

  async removeFromMenuItem(modifierId: string, menuItemId: string): Promise<MenuModifier> {
    const response = await this.api.delete(`/menu-modifiers/${modifierId}/assign/${menuItemId}`);
    return response.data;
  }
} 