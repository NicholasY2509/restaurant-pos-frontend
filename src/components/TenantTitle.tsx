import React, { useEffect } from 'react';
import { useTenant } from '../contexts/TenantContext';

const TenantTitle: React.FC = () => {
  const { tenant } = useTenant();

  useEffect(() => {
    const originalTitle = document.title;
    
    if (tenant) {
      document.title = `${tenant.name} - Admin Dashboard`;
    } else {
      document.title = 'Restaurant POS - Admin Dashboard';
    }

    // Cleanup function to restore original title when component unmounts
    return () => {
      document.title = originalTitle;
    };
  }, [tenant]);

  return null; // This component doesn't render anything
};

export default TenantTitle; 