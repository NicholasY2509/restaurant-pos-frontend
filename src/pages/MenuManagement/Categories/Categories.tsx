import React, { useState, useEffect } from 'react';
import apiService from '../../../services/api';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../../services/endpoints/menu';
import toast from 'react-hot-toast';
import { useTenant } from '../../../contexts/TenantContext';
import CategoriesTable from './CategoriesTable';
import CategoryFormModal from './CategoryFormModal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

const Categories: React.FC = () => {
  const { tenant } = useTenant();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: '',
    description: '',
    color: '#3B82F6',
    tenantId: tenant?.id || 0
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await apiService.menu.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, tenantId: tenant?.id || 0 }));
  }, [tenant]);

  const handleAddCategory = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!tenant?.id) {
      toast.error('No tenant selected');
      return;
    }
    try {
      setSubmitting(true);
      await apiService.menu.createCategory({ ...formData, tenantId: tenant.id });
      toast.success('Category created successfully');
      setShowAddModal(false);
      setFormData({ name: '', description: '', color: '#3B82F6', tenantId: tenant.id });
      fetchCategories();
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCategory = async () => {
    if (!selectedCategory || !formData.name.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!tenant?.id) {
      toast.error('No tenant selected');
      return;
    }
    try {
      setSubmitting(true);
      const updateData: UpdateCategoryRequest = {
        name: formData.name,
        description: formData.description,
        color: formData.color,
        tenantId: tenant.id
      };
      await apiService.menu.updateCategory(selectedCategory.id, updateData);
      toast.success('Category updated successfully');
      setShowEditModal(false);
      setSelectedCategory(null);
      setFormData({ name: '', description: '', color: '#3B82F6', tenantId: tenant.id });
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    try {
      await apiService.menu.deleteCategory(category.id);
      toast.success('Category deleted successfully');
      setShowDeleteModal(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  const handleToggleStatus = async (category: Category) => {
    try {
      await apiService.menu.toggleCategoryStatus(category.id);
      toast.success(`Category ${category.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchCategories();
    } catch (error) {
      console.error('Error toggling category status:', error);
      toast.error('Failed to update category status');
    }
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
      tenantId: tenant?.id || 0
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', color: '#3B82F6', tenantId: tenant?.id || 0 });
    setSelectedCategory(null);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <span className="ml-2 text-gray-600">Loading categories...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Categories</h1>
          <p className="text-gray-600 mt-1">Organize your menu with categories</p>
        </div>
        <button
          onClick={() => { setShowAddModal(true); resetForm(); }}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          + Add Category
        </button>
      </div>
      <CategoriesTable
        categories={categories}
        onEdit={openEditModal}
        onDelete={(category: Category) => {
          setShowDeleteModal(true);
          setSelectedCategory(category);
        }}
        onToggleStatus={handleToggleStatus}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <CategoryFormModal
        open={showAddModal}
        onClose={() => { setShowAddModal(false); resetForm(); }}
        onSubmit={handleAddCategory}
        formData={formData}
        setFormData={setFormData}
        submitting={submitting}
        isEdit={false}
      />
      <CategoryFormModal
        open={showEditModal}
        onClose={() => { setShowEditModal(false); resetForm(); }}
        onSubmit={handleEditCategory}
        formData={formData}
        setFormData={setFormData}
        submitting={submitting}
        isEdit={true}
      />
      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this category?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => {
              if (selectedCategory) {
                handleDeleteCategory(selectedCategory);
              }
            }}
            disabled={!selectedCategory}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Categories; 