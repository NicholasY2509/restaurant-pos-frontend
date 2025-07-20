import { AxiosInstance } from 'axios';
import { Tenant } from '../../types';

export class TenantEndpoints {
  constructor(private api: AxiosInstance) {}

  async getCurrentTenant(): Promise<Tenant> {
    const response = await this.api.get<Tenant>('/tenants/current');
    return response.data;
  }

  async getAllTenants(): Promise<Tenant[]> {
    const response = await this.api.get<Tenant[]>('/tenants');
    return response.data;
  }

  async getTenant(id: number): Promise<Tenant> {
    const response = await this.api.get<Tenant>(`/tenants/${id}`);
    return response.data;
  }

  async updateTenant(id: number, data: Partial<Tenant>): Promise<Tenant> {
    const response = await this.api.patch<Tenant>(`/tenants/${id}`, data);
    return response.data;
  }

  async deleteTenant(id: number): Promise<void> {
    await this.api.delete(`/tenants/${id}`);
  }
} 