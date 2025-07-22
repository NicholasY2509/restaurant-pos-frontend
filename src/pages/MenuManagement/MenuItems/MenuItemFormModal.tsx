import React, { useRef, useState, useEffect } from 'react';
import { Loader2, Save, X, Image as ImageIcon } from 'lucide-react';
import { Category, MenuItem } from '../../../services/endpoints/menu';
import apiService from '../../../services/api';

interface MenuItemFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  formData: Partial<CreateMenuItemFormData>;
  setFormData: (data: Partial<CreateMenuItemFormData>) => void;
  submitting: boolean;
  isEdit?: boolean;
  categories: Category[];
  selectedMenu?: MenuItem | null;
}

interface CreateMenuItemFormData {
  id?: number;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  preparationTime: number;
}

function formatRupiah(value: number | string) {
  if (value === '' || value === null || value === undefined) return '';
  const number = typeof value === 'string' ? value.replace(/[^\d]/g, '') : value;
  return 'Rp ' + Number(number).toLocaleString('id-ID');
}

function parseRupiah(value: string) {
  const digits = value.replace(/[^\d]/g, '');
  return digits ? parseInt(digits, 10) : 0;
}

const MenuItemFormModal: React.FC<MenuItemFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  formData,
  setFormData,
  submitting,
  isEdit = false,
  categories,
  selectedMenu
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImagePreview(formData.imageUrl || '');
  }, [formData.imageUrl]);

  if (!open) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return null;
    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', imageFile);
      // @ts-ignore: api is private, but we need to access the axios instance
      const response = await apiService.api.post('/menu-items/upload-image', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploading(false);
      return response.data.imageUrl;
    } catch (err) {
      setUploading(false);
      alert('Image upload failed.');
      return null;
    }
  };

  const handleSubmit = async () => {
    let imageUrl = formData.imageUrl || '';
    if (imageFile) {
      const uploadedUrl = await handleImageUpload();
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
        setFormData({ ...formData, imageUrl });
      } else {
        return;
      }
    } 
    const payload: CreateMenuItemFormData = {
      name: formData.name || '',
      description: formData.description || '',
      price: formData.price || 0,
      categoryId: formData.categoryId || '',
      imageUrl,
      preparationTime: formData.preparationTime || 0,
    };
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{isEdit ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter item name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter item description"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price *
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={formData.price === undefined || formData.price === null || formData.price === 0 ? '' : formatRupiah(formData.price)}
              onChange={(e) => {
                const parsed = parseRupiah(e.target.value);
                setFormData({ ...formData, price: parsed });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Rp 0"
              min={0}
              autoComplete="off"
            />
            <p className="text-xs text-gray-500 mt-1">Harga hanya boleh bilangan bulat (tanpa desimal)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              value={formData.categoryId || ''}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preparation Time (minutes) *
            </label>
            <input
              type="number"
              value={formData.preparationTime || ''}
              onChange={(e) => setFormData({ ...formData, preparationTime: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter preparation time"
              min={0}
              step={1}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image *
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 border border-gray-300 rounded-lg flex items-center hover:bg-gray-50"
                disabled={uploading || submitting}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                {imageFile ? imageFile.name : 'Choose Image'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={uploading || submitting}
              />
              {uploading && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
            </div>
            {imagePreview && (
              <img
                src={
                  imagePreview.startsWith('blob:')
                    ? imagePreview
                    : `${process.env.REACT_APP_BACKEND_URL}${imagePreview}`
                }
                alt="Preview"
                className="mt-2 rounded w-24 h-24 object-cover border"
              />
            )}
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={submitting || uploading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || uploading}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {submitting || uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                {isEdit ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEdit ? 'Update Item' : 'Create Item'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemFormModal; 