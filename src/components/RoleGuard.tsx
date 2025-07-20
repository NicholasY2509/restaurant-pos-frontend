import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles, 
  fallback = <div className="p-4 text-center text-gray-500">Access denied</div> 
}): React.ReactElement | null => {
  const { user } = useAuth();

  if (!user) {
    return fallback as React.ReactElement;
  }

  if (!allowedRoles.includes(user.role)) {
    return fallback as React.ReactElement;
  }

  return <>{children}</>;
};

export default RoleGuard; 