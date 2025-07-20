import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import { Tenant } from '../types';
import { toast } from 'react-hot-toast';
import { Building, Edit, Save, X, Globe, Calendar } from 'lucide-react';

const Tenant: React.FC = () => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
  });

  useEffect(() => {
    fetchTenant();
  }, []);

  const fetchTenant = async () => {
    try {
      const data = await apiService.getCurrentTenant();
      setTenant(data);
      setFormData({
        name: data.name,
        subdomain: data.subdomain,
      });
    } catch (error) {
      toast.error('Failed to fetch restaurant information');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!tenant) return;

    try {
      const updatedTenant = await apiService.updateTenant(tenant.id, formData);
      setTenant(updatedTenant);
      setEditing(false);
      toast.success('Restaurant information updated successfully');
    } catch (error) {
      toast.error('Failed to update restaurant information');
    }
  };

  const handleCancel = () => {
    if (tenant) {
      setFormData({
        name: tenant.name,
        subdomain: tenant.subdomain,
      });
    }
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="text-center py-12">
        <Building className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No restaurant information found</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Restaurant Information</h1>
          <p className="text-gray-600 mt-2">Manage your restaurant details and settings</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="btn-primary flex items-center"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </button>
        )}
      </div>

      {/* Restaurant Info Card */}
      <div className="card">
        <div className="space-y-6">
          {/* Restaurant Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Restaurant Name
            </label>
            {editing ? (
              <input
                type="text"
                className="input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            ) : (
              <div className="flex items-center">
                <Building className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-lg font-medium text-gray-900">{tenant.name}</span>
              </div>
            )}
          </div>

          {/* Subdomain */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subdomain
            </label>
            {editing ? (
              <input
                type="text"
                className="input"
                value={formData.subdomain}
                onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
              />
            ) : (
              <div className="flex items-center">
                <Globe className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-lg font-medium text-gray-900">
                  {tenant.subdomain}.restaurant-pos.com
                </span>
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              tenant.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {tenant.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* Created Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Created Date
            </label>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-gray-900">
                {new Date(tenant.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Last Updated */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Updated
            </label>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-gray-900">
                {new Date(tenant.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          {editing && (
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleSave}
                className="btn-primary flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="btn-secondary flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Account Type:</span>
              <span className="font-medium">Multi-tenant SaaS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Subscription:</span>
              <span className="font-medium text-green-600">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Plan:</span>
              <span className="font-medium">Starter</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">API Version:</span>
              <span className="font-medium">v1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Database:</span>
              <span className="font-medium">MySQL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Backend:</span>
              <span className="font-medium">NestJS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tenant; 