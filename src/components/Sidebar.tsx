import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Building, 
  Menu, 
  Table, 
  ShoppingCart, 
  Settings, 
  LogOut,
  UserCheck,
  Shield,
  User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.WAITER, UserRole.KITCHEN]
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.WAITER, UserRole.KITCHEN]
    },
    {
      name: 'User Management',
      href: '/users',
      icon: UserCheck,
      roles: [UserRole.ADMIN, UserRole.MANAGER]
    },
    {
      name: 'Tenant Settings',
      href: '/tenant',
      icon: Building,
      roles: [UserRole.ADMIN]
    },
    {
      name: 'Menu Management',
      href: '/menu',
      icon: Menu,
      roles: [UserRole.ADMIN, UserRole.MANAGER]
    },
    {
      name: 'Table Management',
      href: '/tables',
      icon: Table,
      roles: [UserRole.ADMIN, UserRole.MANAGER]
    },
    {
      name: 'Orders',
      href: '/orders',
      icon: ShoppingCart,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.WAITER, UserRole.KITCHEN]
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      roles: [UserRole.ADMIN]
    }
  ];

  const filteredNavigationItems = navigationItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'Administrator';
      case UserRole.MANAGER:
        return 'Manager';
      case UserRole.WAITER:
        return 'Waiter';
      case UserRole.KITCHEN:
        return 'Kitchen Staff';
      default:
        return role;
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return <Shield className="w-4 h-4" />;
      case UserRole.MANAGER:
        return <Users className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Restaurant POS</h1>
        {user && (
          <div className="mt-2 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              {getRoleIcon(user.role)}
              <span>{getRoleDisplayName(user.role)}</span>
            </div>
            <div className="mt-1">{user.firstName} {user.lastName}</div>
          </div>
        )}
      </div>

      <nav className="space-y-2">
        {filteredNavigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 