import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import { User } from '../types';
import { toast } from 'react-hot-toast';
import { Users as UsersIcon, Edit, Trash2, Plus, Search } from 'lucide-react';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await apiService.getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await apiService.deleteUser(userId);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-mobile">
      {/* Header */}
      <div className="flex-mobile justify-between items-start sm:items-center">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-mobile-3xl font-bold text-gray-900">Users</h1>
          <p className="text-mobile text-gray-600 mt-2">Manage your restaurant staff and users</p>
        </div>
        <button className="btn-primary flex items-center w-full sm:w-auto justify-center">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table - Desktop */}
      <div className="hidden lg:block card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <UsersIcon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-primary-600 hover:text-primary-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <div className="text-mobile font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                  <div className="flex items-center mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded-lg">
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new user.'}
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
              <UsersIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-red-100 rounded-lg">
              <UsersIcon className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
              <UsersIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-sm font-medium text-gray-600">Staff</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'staff').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users; 