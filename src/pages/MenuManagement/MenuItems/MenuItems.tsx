import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import MenuItemsTable from './MenuItemsTable';
import MenuItemsFilters from './MenuItemsFilters';
import MenuItemFormModal from './MenuItemFormModal';
import { MenuItem, Category } from '../../../services/endpoints/menu';
import apiService from '../../../services/api';

interface CreateMenuItemFormData {
  id?: number;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  preparationTime: number;
}

const initialFormData: CreateMenuItemFormData = {
  id: undefined,
  name: '',
  description: '',
  price: 0,
  categoryId: '',
  imageUrl: '',
  preparationTime: 0,
};

const MenuItems: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateMenuItemFormData>>(initialFormData);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuItemsLoading, setMenuItemsLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const data = await apiService.menu.getAllCategories();
      setCategories(data);
    } catch (err) {
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchMenuItems = async () => {
    try {
      setMenuItemsLoading(true);
      const data = await apiService.menu.getAllMenuItems();
      setMenuItems(data);
    } catch (err) {
      setMenuItems([]);
    } finally {
      setMenuItemsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
  }, []);

  const categoryOptions = ['all', ...categories.map(c => c.name)];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleView = (item: MenuItem) => {
    alert(`View: ${item.name}`);
  };
  const handleEdit = (item: MenuItem) => {
    setSelectedMenu(item);
    setFormData({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      categoryId: item.categoryId || '',
      imageUrl: item.imageUrl || '',
      preparationTime: item.preparationTime || 0,
    });
    setShowAddModal(true);
  };
  const handleDelete = (item: MenuItem) => {
    alert(`Delete: ${item.name}`);
  };

  const handleSubmit = async (payload: any) => {
    setIsSubmitting(true);
    setError('');
    try {
      if (selectedMenu) {
        await apiService.menu.updateMenuItem(selectedMenu.id, payload);
      } else {
        await apiService.menu.createMenuItem(payload);
      }
      setShowAddModal(false);
      setFormData(initialFormData);
      setSelectedMenu(null);
      fetchMenuItems();
    } catch (err: any) {
      setError(err?.message || 'Failed to save menu item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Items</h1>
          <p className="text-gray-600 mt-1">Manage your restaurant menu items</p>
        </div>
        <button
          onClick={() => { setShowAddModal(true); setFormData(initialFormData); }}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Menu Item
        </button>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <MenuItemsFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categoryOptions}
      />
      {menuItemsLoading ? (
        <div className="text-center py-8">Loading menu items...</div>
      ) : (
        <MenuItemsTable
          items={filteredItems}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      <MenuItemFormModal
        open={showAddModal}
        onClose={() => { setShowAddModal(false); setSelectedMenu(null); }}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        submitting={isSubmitting}
        isEdit={!!selectedMenu}
        categories={categories}
        selectedMenu={selectedMenu}
      />
    </div>
  );
};

export default MenuItems; 