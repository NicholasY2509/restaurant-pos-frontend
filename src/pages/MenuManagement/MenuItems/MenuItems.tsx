import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import MenuItemsTable from './MenuItemsTable';
import MenuItemsFilters from './MenuItemsFilters';
import MenuItemFormModal from './MenuItemFormModal';
import ModifierAssignmentModal from './ModifierAssignmentModal';
import { MenuItem, Category } from '../../../services/endpoints/menu';
import apiService from '../../../services/api';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import toast from 'react-hot-toast';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

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
  const [showSheet, setShowSheet] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateMenuItemFormData>>(initialFormData);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuItemsLoading, setMenuItemsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModifierModal, setShowModifierModal] = useState(false);
  const [selectedMenuItemForModifiers, setSelectedMenuItemForModifiers] = useState<MenuItem | null>(null);

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
    setShowSheet(true);
  };

  const handleManageModifiers = (item: MenuItem) => {
    setSelectedMenuItemForModifiers(item);
    setShowModifierModal(true);
  };

  const handleDelete = async (item: MenuItem) => {
    setIsDeleting(true);
    try {
      await apiService.menu.deleteMenuItem(item.id);
      toast.success('Menu item deleted successfully');
      setShowDeleteModal(false);
      setSelectedMenuItem(null);
      fetchMenuItems(); // Refresh the menu items list
    } catch (err) {
      toast.error('Failed to delete menu item');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (payload: any) => {
    setIsSubmitting(true);
    setError('');
    try {
      if (selectedMenu) {
        await apiService.menu.updateMenuItem(selectedMenu.id, payload);
        toast.success('Menu item updated successfully');
      } else {
        await apiService.menu.createMenuItem(payload);
        toast.success('Menu item created successfully');
      }
      setShowSheet(false);
      setFormData(initialFormData);
      setSelectedMenu(null);
      fetchMenuItems();
    } catch (err: any) {
      setError(err?.message || 'Failed to save menu item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModifierUpdate = () => {
    fetchMenuItems(); // Refresh menu items to show updated modifiers
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Items</h1>
          <p className="text-gray-600 mt-1">Manage your restaurant menu items</p>
        </div>
        <button
          onClick={() => { setShowSheet(true); setFormData(initialFormData); setSelectedMenu(null); }}
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
          onDelete={(item) => {
            setShowDeleteModal(true);
            setSelectedMenuItem(item);
          }}
          onManageModifiers={handleManageModifiers}
        />
      )}
      <Sheet open={showSheet} onOpenChange={setShowSheet}>
        <SheetContent side="right" className="w-full max-w-md">
          <SheetHeader>
            <SheetTitle>{selectedMenu ? "Edit Menu Item" : "Add Menu Item"}</SheetTitle>
            <SheetDescription>
              {selectedMenu
                ? "Update the details of your menu item."
                : "Fill in the details to add a new menu item."}
            </SheetDescription>
          </SheetHeader>
          <MenuItemFormModal
            onClose={() => { setShowSheet(false); setSelectedMenu(null); }}
            onSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            submitting={isSubmitting}
            isEdit={!!selectedMenu}
            categories={categories}
            selectedMenu={selectedMenu}
          />
        </SheetContent>
      </Sheet>
      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <span className="font-bold">{selectedMenuItem?.name}</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => {
              if (selectedMenuItem) {
                handleDelete(selectedMenuItem);
              }
            }}
            disabled={!selectedMenuItem || isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
      </AlertDialog>

      {/* Modifier Assignment Modal */}
      <ModifierAssignmentModal
        menuItem={selectedMenuItemForModifiers}
        isOpen={showModifierModal}
        onClose={() => {
          setShowModifierModal(false);
          setSelectedMenuItemForModifiers(null);
        }}
        onUpdate={handleModifierUpdate}
      />
    </div>
  );
};

export default MenuItems; 