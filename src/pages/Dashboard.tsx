import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { Tenant, User } from '../types';
import { 
  Users, 
  Building, 
  Menu, 
  Table, 
  ShoppingCart, 
  TrendingUp,
  Calendar,
  Clock
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [tenantData, usersData] = await Promise.all([
          apiService.getCurrentTenant(),
          apiService.getAllUsers()
        ]);
        setTenant(tenantData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: Users,
      color: 'bg-blue-500',
      change: '+2 this month'
    },
    {
      title: 'Menu Items',
      value: 0, // Will be implemented when menu module is complete
      icon: Menu,
      color: 'bg-green-500',
      change: 'Coming soon'
    },
    {
      title: 'Tables',
      value: 0, // Will be implemented when table module is complete
      icon: Table,
      color: 'bg-yellow-500',
      change: 'Coming soon'
    },
    {
      title: 'Orders Today',
      value: 0, // Will be implemented when order module is complete
      icon: ShoppingCart,
      color: 'bg-purple-500',
      change: 'Coming soon'
    }
  ];

  return (
    <div className="space-mobile">
      {/* Header */}
      <div>
        <h1 className="text-mobile-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-mobile text-gray-600 mt-2">
          Welcome back, {user?.firstName}! Here's what's happening with your restaurant.
        </p>
      </div>

      {/* Restaurant Info */}
      {tenant && (
        <div className="card">
          <div className="flex-mobile items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-mobile-xl font-semibold text-gray-900">{tenant.name}</h2>
              <p className="text-mobile text-gray-600">Subdomain: {tenant.subdomain}</p>
              <p className="text-sm text-gray-500">
                Status: {tenant.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Created</p>
              <p className="text-sm font-medium">
                {new Date(tenant.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid-mobile">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center">
                <div className={`p-2 sm:p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="mt-3 sm:mt-4">
                <p className="text-sm text-gray-500">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="card">
          <h3 className="text-mobile-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-primary-600 mr-3" />
                <span className="font-medium text-mobile">Manage Users</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <Building className="w-5 h-5 text-primary-600 mr-3" />
                <span className="font-medium text-mobile">Update Restaurant Info</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <Menu className="w-5 h-5 text-primary-600 mr-3" />
                <span className="font-medium text-mobile">Manage Menu</span>
              </div>
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-mobile-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium">System initialized</p>
                <p className="text-xs text-gray-500">Just now</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium">Restaurant account created</p>
                <p className="text-xs text-gray-500">
                  {tenant ? new Date(tenant.createdAt).toLocaleDateString() : 'Recently'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Features */}
      <div className="card">
        <h3 className="text-mobile-lg font-semibold text-gray-900 mb-4">Coming Soon</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <Menu className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mb-2" />
            <h4 className="font-medium text-mobile">Menu Management</h4>
            <p className="text-sm text-gray-500">Add, edit, and organize your menu items</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <Table className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mb-2" />
            <h4 className="font-medium text-mobile">Table Management</h4>
            <p className="text-sm text-gray-500">Manage restaurant tables and seating</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mb-2" />
            <h4 className="font-medium text-mobile">Order Processing</h4>
            <p className="text-sm text-gray-500">Process orders and track sales</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 