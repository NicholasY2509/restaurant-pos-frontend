import React, { useRef, useState, useEffect } from 'react';
import { Loader2, Save, X, Image as ImageIcon } from 'lucide-react';
import { NumericFormat } from 'react-number-format';
import { Category, MenuItem } from '../../../services/endpoints/menu';
import apiService from '../../../services/api';

interface MenuItemFormModalProps {
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

const MenuItemFormModal: React.FC<MenuItemFormModalProps> = ({
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
    <form
      className="px-4"
      onSubmit={e => { e.preventDefault(); handleSubmit(); }}
      autoComplete="off"
    >
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
          <NumericFormat
            value={formData.price || ''}
            onValueChange={(values) => {
              setFormData({ ...formData, price: values.floatValue || 0 });
            }}
            thousandSeparator="."
            decimalSeparator=","
            prefix="Rp "
            placeholder="Enter price"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            decimalScale={0}
            allowNegative={false}
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
          <div className="flex flex-row items-center gap-3">
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
            {imagePreview && (
              <img
                src={
                  imagePreview.startsWith('blob:')
                    ? imagePreview
                    : `${process.env.REACT_APP_BACKEND_URL}${imagePreview}`
                }
                alt="Preview"
                className="rounded w-20 h-20 object-cover border ml-2"
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          disabled={submitting || uploading}
        >
          Cancel
        </button>
        <button
          type="submit"
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
    </form>
  );
};

export default MenuItemFormModal; 