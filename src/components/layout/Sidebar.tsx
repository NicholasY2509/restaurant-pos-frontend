import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
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
  X,
  ChevronDown,
  ChevronRight,
  Package,
  Tag,
  Plus
} from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

interface MenuItem {
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  subItems?: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { user, logout } = useAuth();
  const { tenant } = useTenant();
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

  const menuItems: MenuItem[] = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/users', icon: Users, label: 'Users' },
    { 
      path: '/menu', 
      icon: Menu, 
      label: 'Menu Management',
      subItems: [
        { path: '/menu/items', icon: Package, label: 'Menu Items' },
        { path: '/menu/categories', icon: Tag, label: 'Categories' },
        { path: '/menu/modifiers', icon: Plus, label: 'Modifiers' },
      ]
    },
    { path: '/tenant', icon: Building, label: 'Restaurant Info' },
    { path: '/tables', icon: Table, label: 'Table Management' },
    { path: '/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
  };

  const toggleDropdown = (path: string) => {
    setOpenDropdowns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const isDropdownOpen = (path: string) => openDropdowns.has(path);

  const isActive = (item: MenuItem) => {
    if (item.subItems) {
      return item.subItems.some(subItem => location.pathname === subItem.path) || 
             location.pathname.startsWith(item.path);
    }
    return location.pathname === item.path;
  };

  // Auto-open dropdown when sub-item is active
  React.useEffect(() => {
    menuItems.forEach(item => {
      if (item.subItems && isActive(item) && !openDropdowns.has(item.path)) {
        setOpenDropdowns(prev => new Set(Array.from(prev).concat(item.path)));
      }
    });
  }, [location.pathname]);

  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.icon;
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isItemActive = isActive(item);
    const isOpen = isDropdownOpen(item.path);

    if (hasSubItems) {
      return (
        <li key={item.path}>
          <button
            onClick={() => toggleDropdown(item.path)}
            className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isItemActive
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center">
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </div>
            {isOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          
          {isOpen && (
            <ul className="ml-6 mt-1 space-y-1">
              {item.subItems!.map((subItem) => {
                const SubIcon = subItem.icon;
                const isSubActive = location.pathname === subItem.path;
                
                return (
                  <li key={subItem.path}>
                    <Link
                      to={subItem.path}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isSubActive
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <SubIcon className="w-4 h-4 mr-3" />
                      {subItem.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </li>
      );
    }

    return (
      <li key={item.path}>
        <Link
          to={item.path}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            isItemActive
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Icon className="w-5 h-5 mr-3" />
          {item.label}
        </Link>
      </li>
    );
  };

  return (
    <div className="bg-white shadow-lg w-64 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary-600">
              {tenant ? tenant.name : 'Restaurant POS'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {tenant ? 'Admin Dashboard' : 'Point of Sale System'}
            </p>
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
          {menuItems.map(renderMenuItem)}
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