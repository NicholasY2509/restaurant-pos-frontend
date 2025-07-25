import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import { Tenant } from '../../types';
import { toast } from 'react-hot-toast';
import { Building, Edit, Save, X, Globe, Calendar } from 'lucide-react';
import { logger, logUserAction } from '../../utils/logger';
import { useTenant } from '../../contexts/TenantContext';

const TenantPage: React.FC = () => {
  const { tenant, refreshTenant, loading } = useTenant();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
  });

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name,
        subdomain: tenant.subdomain,
      });
    }
  }, [tenant]);

  const handleSave = async () => {
    if (!tenant) return;

    try {
      logUserAction('Updating tenant information', { tenantId: tenant.id, changes: formData });
      await apiService.updateTenant(tenant.id, formData);
      await refreshTenant(); // Refresh the tenant context
      setEditing(false);
      logger.info('Successfully updated tenant information', { tenantId: tenant.id });
      toast.success('Restaurant information updated successfully');
    } catch (error) {
      logger.error('Failed to update restaurant information', error as Error, { tenantId: tenant.id });
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
    <div className="space-mobile">
      {/* Header */}
      <div className="flex-mobile justify-between items-start sm:items-center">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-mobile-3xl font-bold text-gray-900">Restaurant Information</h1>
          <p className="text-mobile text-gray-600 mt-2">Manage your restaurant details and settings</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="btn-primary flex items-center w-full sm:w-auto justify-center"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </button>
        )}
      </div>

      {/* Restaurant Info Card */}
      <div className="card">
        <div className="space-mobile">
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
            <div className="flex-mobile space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleSave}
                className="btn-primary flex items-center justify-center w-full sm:w-auto"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="btn-secondary flex items-center justify-center w-full sm:w-auto"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="card">
          <h3 className="text-mobile-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 text-mobile">Account Type:</span>
              <span className="font-medium text-mobile">Multi-tenant SaaS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-mobile">Subscription:</span>
              <span className="font-medium text-green-600 text-mobile">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-mobile">Plan:</span>
              <span className="font-medium text-mobile">Starter</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-mobile-lg font-semibold text-gray-900 mb-4">System Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 text-mobile">API Version:</span>
              <span className="font-medium text-mobile">v1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-mobile">Database:</span>
              <span className="font-medium text-mobile">MySQL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-mobile">Backend:</span>
              <span className="font-medium text-mobile">NestJS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantPage; 