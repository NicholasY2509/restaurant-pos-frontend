import React from 'react';
import { Eye, Edit, Trash2, Tag, Settings } from 'lucide-react';
import { MenuItem } from '../../../services/endpoints/menu';

interface MenuItemsTableProps {
  items: MenuItem[];
  onView: (item: MenuItem) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
  onManageModifiers: (item: MenuItem) => void;
}

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const MenuItemsTable: React.FC<MenuItemsTableProps> = ({ 
  items, 
  onView, 
  onEdit, 
  onDelete, 
  onManageModifiers 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
          <div className="h-48 bg-gray-100 flex items-center justify-center">
            {item.imageUrl ? (
              <img src={`${apiUrl}${item.imageUrl}`} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-gray-400 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-2xl">🍽️</span>
                </div>
                <p className="text-sm">No image</p>
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                item.isAvailable 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {item.isAvailable ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold text-primary-600">Rp {Number(item.price).toLocaleString('id-ID')}</span>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.category.name}</span>
            </div>

            {/* Modifiers Section */}
            {item.modifiers && item.modifiers.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <Tag className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-sm font-medium text-gray-700">Modifiers ({item.modifiers.length})</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.modifiers.slice(0, 3).map((modifier: any, index: number) => (
                    <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {modifier.name}
                      {modifier.price > 0 && ` (+${modifier.price})`}
                    </span>
                  ))}
                  {item.modifiers.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      +{item.modifiers.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button 
                onClick={() => onManageModifiers(item)}
                className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Manage modifiers"
              >
                <Settings className="w-4 h-4 mr-1" />
                Modifiers
              </button>
              <button 
                onClick={() => onEdit(item)}
                className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
              <button 
                onClick={() => onDelete(item)}
                className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuItemsTable; 