import React, { useState, useEffect } from 'react';
import { Users, Building, Menu, Table, ShoppingCart, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import { UserRole } from '../../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [userCount, setUserCount] = useState<{ count: number; limit: number }>({ count: 0, limit: 5 });
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (user && (user.role === UserRole.ADMIN || user.role === UserRole.MANAGER)) {
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      const [countData, usersData] = await Promise.all([
        apiService.users.getUserCount(),
        apiService.users.getAllUsers()
      ]);
      setUserCount(countData);
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

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
        return <Shield className="w-6 h-6" />;
      case UserRole.MANAGER:
        return <Users className="w-6 h-6" />;
      default:
        return <UserCheck className="w-6 h-6" />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-red-500';
      case UserRole.MANAGER:
        return 'bg-blue-500';
      case UserRole.WAITER:
        return 'bg-green-500';
      case UserRole.KITCHEN:
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const stats = [
    {
      name: 'Total Users',
      value: userCount.count,
      limit: userCount.limit,
      icon: Users,
      color: 'bg-blue-500',
      description: 'Active staff members'
    },
    {
      name: 'Menu Items',
      value: 0,
      icon: Menu,
      color: 'bg-green-500',
      description: 'Available menu items'
    },
    {
      name: 'Tables',
      value: 0,
      icon: Table,
      color: 'bg-purple-500',
      description: 'Restaurant tables'
    },
    {
      name: 'Orders',
      value: 0,
      icon: ShoppingCart,
      color: 'bg-orange-500',
      description: 'Today\'s orders'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user?.firstName}! You are logged in as a {getRoleDisplayName(user?.role || UserRole.WAITER)}.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow border p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color} text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    {stat.limit && (
                      <p className="ml-2 text-sm text-gray-500">/ {stat.limit}</p>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{stat.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Role-based Content */}
      {(user?.role === UserRole.ADMIN || user?.role === UserRole.MANAGER) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Management Overview */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Management</h2>
            <div className="space-y-4">
              {Object.values(UserRole).map((role) => {
                const count = users.filter(user => user.role === role && user.isActive).length;
                return (
                  <div key={role} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${getRoleColor(role)} text-white`}>
                        {getRoleIcon(role)}
                      </div>
                      <span className="font-medium capitalize">{role}</span>
                    </div>
                    <span className="text-lg font-semibold">{count}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {userCount.count} of {userCount.limit} user slots used
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {user?.role === UserRole.ADMIN && userCount.count < userCount.limit && (
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Add New User
                </button>
              )}
              <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                View Orders
              </button>
              <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Manage Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role-specific Dashboard */}
      {user?.role === UserRole.WAITER && (
        <div className="bg-white rounded-lg shadow border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Waiter Dashboard</h2>
          <p className="text-gray-600">Manage tables and take orders efficiently.</p>
          {/* Add waiter-specific content */}
        </div>
      )}

      {user?.role === UserRole.KITCHEN && (
        <div className="bg-white rounded-lg shadow border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Kitchen Dashboard</h2>
          <p className="text-gray-600">View and manage incoming orders.</p>
          {/* Add kitchen-specific content */}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 