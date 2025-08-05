import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Tag } from 'lucide-react';
import { MenuItem } from '../../../services/endpoints/menu';
import { MenuModifier } from '../../../services/endpoints/menu-modifiers';
import { logger } from '../../../utils/logger';
import apiService from '../../../services/api';

interface ModifierAssignmentModalProps {
  menuItem: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const ModifierAssignmentModal: React.FC<ModifierAssignmentModalProps> = ({
  menuItem,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [allModifiers, setAllModifiers] = useState<MenuModifier[]>([]);
  const [loading, setLoading] = useState(false);
  const [assignedModifiers, setAssignedModifiers] = useState<MenuModifier[]>([]);

  useEffect(() => {
    if (isOpen && menuItem) {
      loadModifiers();
      setAssignedModifiers(menuItem.modifiers || []);
    }
  }, [isOpen, menuItem]);

  const loadModifiers = async () => {
    try {
      setLoading(true);
      const modifiers = await apiService.menuModifiers.getAll();
      setAllModifiers(modifiers);
    } catch (error) {
      logger.error('Failed to load modifiers:', error as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignModifier = async (modifier: MenuModifier) => {
    if (!menuItem) return;

    try {
      await apiService.menuModifiers.assignToMenuItem(modifier.id, menuItem.id.toString());
      setAssignedModifiers([...assignedModifiers, modifier]);
      onUpdate();
    } catch (error) {
      logger.error('Failed to assign modifier:', error as Error);
    }
  };

  const handleRemoveModifier = async (modifier: MenuModifier) => {
    if (!menuItem) return;

    try {
      await apiService.menuModifiers.removeFromMenuItem(modifier.id, menuItem.id.toString());
      setAssignedModifiers(assignedModifiers.filter(m => m.id !== modifier.id));
      onUpdate();
    } catch (error) {
      logger.error('Failed to remove modifier:', error as Error);
    }
  };

  const isAssigned = (modifier: MenuModifier) => {
    return assignedModifiers.some(m => m.id === modifier.id);
  };

  const availableModifiers = allModifiers.filter(modifier => !isAssigned(modifier));

  if (!isOpen || !menuItem) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Manage Modifiers</h2>
            <p className="text-gray-600 mt-1">
              Assign modifiers to "{menuItem.name}"
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading modifiers...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Available Modifiers */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Available Modifiers ({availableModifiers.length})
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {availableModifiers.map((modifier) => (
                    <div
                      key={modifier.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">{modifier.name}</span>
                          <span className="text-sm font-bold text-primary-600">
                            {modifier.price === 0 ? 'Free' : `$${modifier.price.toFixed(2)}`}
                          </span>
                        </div>
                        {modifier.description && (
                          <p className="text-sm text-gray-600">{modifier.description}</p>
                        )}
                        <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                          modifier.isAvailable 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {modifier.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAssignModifier(modifier)}
                        className="ml-3 p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Assign modifier"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {availableModifiers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Tag className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p>No available modifiers</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Assigned Modifiers */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Assigned Modifiers ({assignedModifiers.length})
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {assignedModifiers.map((modifier) => (
                    <div
                      key={modifier.id}
                      className="flex items-center justify-between p-3 border border-blue-200 bg-blue-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">{modifier.name}</span>
                          <span className="text-sm font-bold text-primary-600">
                            {modifier.price === 0 ? 'Free' : `$${modifier.price.toFixed(2)}`}
                          </span>
                        </div>
                        {modifier.description && (
                          <p className="text-sm text-gray-600">{modifier.description}</p>
                        )}
                        <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                          modifier.isAvailable 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {modifier.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveModifier(modifier)}
                        className="ml-3 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove modifier"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {assignedModifiers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Tag className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p>No modifiers assigned</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifierAssignmentModal; 