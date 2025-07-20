import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, DollarSign, Package } from 'lucide-react';

interface Modifier {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'addon' | 'topping' | 'customization';
  isAvailable: boolean;
  applicableItems: string[];
  maxQuantity?: number;
  createdAt: string;
}

const Modifiers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data - replace with API calls later
  const mockModifiers: Modifier[] = [
    {
      id: '1',
      name: 'Extra Cheese',
      description: 'Additional cheese topping',
      price: 1.50,
      type: 'topping',
      isAvailable: true,
      applicableItems: ['Pizza', 'Pasta'],
      maxQuantity: 3,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Bacon Bits',
      description: 'Crispy bacon pieces',
      price: 2.00,
      type: 'addon',
      isAvailable: true,
      applicableItems: ['Salads', 'Pizza'],
      createdAt: '2024-01-15'
    },
    {
      id: '3',
      name: 'Spicy Level',
      description: 'Choose your spice level',
      price: 0.00,
      type: 'customization',
      isAvailable: true,
      applicableItems: ['Pizza', 'Pasta', 'Salads'],
      maxQuantity: 1,
      createdAt: '2024-01-15'
    },
    {
      id: '4',
      name: 'Extra Large Size',
      description: 'Upgrade to extra large portion',
      price: 3.00,
      type: 'addon',
      isAvailable: false,
      applicableItems: ['Pizza', 'Pasta'],
      createdAt: '2024-01-15'
    },
    {
      id: '5',
      name: 'Gluten Free',
      description: 'Gluten free option',
      price: 1.00,
      type: 'customization',
      isAvailable: true,
      applicableItems: ['Pizza', 'Pasta'],
      createdAt: '2024-01-15'
    },
    {
      id: '6',
      name: 'Mushrooms',
      description: 'Fresh mushrooms',
      price: 1.25,
      type: 'topping',
      isAvailable: true,
      applicableItems: ['Pizza', 'Pasta'],
      maxQuantity: 2,
      createdAt: '2024-01-15'
    }
  ];

  const types = ['all', 'addon', 'topping', 'customization'];

  const filteredModifiers = mockModifiers.filter(modifier => {
    const matchesSearch = modifier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         modifier.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || modifier.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'addon': return 'bg-blue-100 text-blue-800';
      case 'topping': return 'bg-green-100 text-green-800';
      case 'customization': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'addon': return '➕';
      case 'topping': return '🧀';
      case 'customization': return '⚙️';
      default: return '📦';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Modifiers</h1>
          <p className="text-gray-600 mt-1">Manage add-ons, toppings, and customizations</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Modifier
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search modifiers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="sm:w-48">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Modifiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModifiers.map((modifier) => (
          <div key={modifier.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{getTypeIcon(modifier.type)}</span>
                  <h3 className="font-semibold text-gray-900 text-lg">{modifier.name}</h3>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(modifier.type)}`}>
                  {modifier.type.charAt(0).toUpperCase() + modifier.type.slice(1)}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{modifier.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="font-bold text-primary-600">
                    {modifier.price === 0 ? 'Free' : `$${modifier.price.toFixed(2)}`}
                  </span>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  modifier.isAvailable 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {modifier.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="p-4">
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Applicable Items:</h4>
                <div className="flex flex-wrap gap-1">
                  {modifier.applicableItems.map((item, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {modifier.maxQuantity && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Max Quantity:</h4>
                  <span className="text-sm text-gray-600">{modifier.maxQuantity}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>
                <button className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredModifiers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">⚙️</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No modifiers found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedType !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by adding your first modifier'
            }
          </p>
          {!searchTerm && selectedType === 'all' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Modifier
            </button>
          )}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">⚙️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Modifiers</p>
              <p className="text-2xl font-bold text-gray-900">{mockModifiers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockModifiers.filter(m => m.isAvailable).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Paid Modifiers</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockModifiers.filter(m => m.price > 0).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Free Modifiers</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockModifiers.filter(m => m.price === 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Modifier Modal - Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Modifier</h2>
            <p className="text-gray-600 mb-4">This feature will be implemented when the API is ready.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modifiers; 