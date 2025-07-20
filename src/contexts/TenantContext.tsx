import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tenant } from '../types';
import apiService from '../services/api';
import { logger } from '../utils/logger';

interface TenantContextType {
  tenant: Tenant | null;
  loading: boolean;
  error: string | null;
  refreshTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTenant = async () => {
    try {
      setLoading(true);
      setError(null);
      logger.info('Fetching tenant information for context');
      const tenantData = await apiService.getCurrentTenant();
      setTenant(tenantData);
      logger.info('Tenant information loaded successfully', { tenantId: tenantData.id, name: tenantData.name });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tenant information';
      setError(errorMessage);
      logger.error('Failed to fetch tenant information in context', err as Error);
    } finally {
      setLoading(false);
    }
  };

  const refreshTenant = async () => {
    await fetchTenant();
  };

  useEffect(() => {
    fetchTenant();
  }, []);

  const value: TenantContextType = {
    tenant,
    loading,
    error,
    refreshTenant,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = (): TenantContextType => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}; 