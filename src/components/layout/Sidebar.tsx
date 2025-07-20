import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Users, 
  Building, 
  Menu, 
  Table, 
  ShoppingCart, 
  Settings, 
  LogOut,
  User,
  X
} from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/users', icon: Users, label: 'Users' },
    { path: '/tenant', icon: Building, label: 'Restaurant Info' },
    { path: '/menu', icon: Menu, label: 'Menu Management' },
    { path: '/tables', icon: Table, label: 'Table Management' },
    { path: '/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-white shadow-lg w-64 min-h-screen flex flex-col">
      {/* Header with close button for mobile */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary-600">Restaurant POS</h1>
            <p className="text-sm text-gray-600 mt-1">Point of Sale System</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      
      <nav className="mt-6">
        <div className="px-4">
          {user && (
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <ul className="space-y-1 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 