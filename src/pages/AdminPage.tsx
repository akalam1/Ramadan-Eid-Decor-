import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash, 
  Search,
  AlertCircle,
  X,
  Save,
  Upload,
  Image as ImageIcon,
  CheckSquare,
  Square,
  MoreHorizontal,
  Eye,
  EyeOff
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  details: { title: string; content: string; }[];
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  careInstructions: string[];
  images: string[];
  featured: boolean;
  status: 'active' | 'inactive';
}

const initialFormData: ProductFormData = {
  name: '',
  description: '',
  price: 0,
  quantity: 0,
  category: 'eid',
  details: [],
  dimensions: {
    length: 0,
    width: 0,
    height: 0,
    unit: 'cm'
  },
  careInstructions: [],
  images: [],
  featured: false,
  status: 'active'
};

const AdminPage = () => {
  const { products, loading, error, addProduct, updateProduct, deleteProduct, bulkUpdateProducts } = useProducts();
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const [newDetail, setNewDetail] = useState({ title: '', content: '' });
  const [newCareInstruction, setNewCareInstruction] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.name || !formData.category) {
        showNotification('error', 'Please fill in all required fields (name and category are required)');
        return;
      }

      if (formData.price <= 0) {
        showNotification('error', 'Please enter a valid price greater than 0');
        return;
      }

      // Ensure arrays are initialized
      const productData = {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity) || 0,
        details: formData.details || [],
        careInstructions: formData.careInstructions || [],
        images: formData.images || [],
        status: 'active',
        dimensions: formData.dimensions || {
          length: 0,
          width: 0,
          height: 0,
          unit: 'cm'
        }
      };

      if (editingProduct) {
        await updateProduct(editingProduct, productData);
        showNotification('success', `${productData.name} has been updated successfully`);
      } else {
        await addProduct(productData);
        showNotification('success', `${productData.name} has been added successfully`);
      }
      resetForm();
      setIsAddingProduct(false);
    } catch (err) {
      showNotification('error', 'Failed to save product. Please check your input and try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirmation === id) {
      try {
        if (!confirm('Are you sure you want to delete this product?')) {
          setDeleteConfirmation(null);
          return;
        }
        await deleteProduct(id);
        const productName = products.find(p => p.id === id)?.name;
        showNotification('success', `${productName || 'Product'} has been deleted successfully`);
        setDeleteConfirmation(null);
      } catch (err) {
        showNotification('error', 'Failed to delete product');
      }
    } else {
      setDeleteConfirmation(id);
    }
  };

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    try {
      if (action === 'delete') {
        if (!confirm('Are you sure you want to delete these products?')) {
          return;
        }
        await Promise.all(selectedProducts.map(id => deleteProduct(id)));
        showNotification('success', `${selectedProducts.length} products have been deleted successfully`);
      } else {
        await bulkUpdateProducts(selectedProducts, { status: action === 'activate' ? 'active' : 'inactive' });
        showNotification('success', `${selectedProducts.length} products have been ${action}d successfully`);
      }
      setSelectedProducts([]);
      setShowBulkActions(false);
    } catch (err) {
      showNotification('error', 'Failed to perform bulk action');
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingProduct(null);
    setIsAddingProduct(false);
    setNewDetail({ title: '', content: '' });
    setNewCareInstruction('');
  };

  const handleEdit = (product: any) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      quantity: product.quantity,
      category: product.category,
      details: product.details || [],
      dimensions: product.dimensions || initialFormData.dimensions,
      careInstructions: product.careInstructions || [],
      images: product.images || [],
      featured: product.featured || false,
      status: (product.status as 'active' | 'inactive') || 'active'
    });
    setEditingProduct(product.id);
    setIsAddingProduct(true);
  };

  const toggleProductSelection = (id: string) => {
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
    setShowBulkActions(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white pt-24 flex items-center justify-center">
        <Package className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white pt-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-light mb-2">Error Loading Products</h1>
          <p className="text-neutral-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white pt-24 pb-12">
      {/* Product Form Modal */}
      {isAddingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-neutral-800 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-light">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setIsAddingProduct(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-neutral-400 mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                      className="w-full bg-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-neutral-400 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                      className="w-full bg-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      min="0"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  >
                    <option value="eid">Eid Collection</option>
                    <option value="ramadan">Ramadan Essentials</option>
                    <option value="new">New Arrivals</option>
                  </select>
                </div>
              </div>

              {/* Product Details */}
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Product Details
                </label>
                {formData.details.map((detail, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={detail.title}
                      onChange={(e) => {
                        const newDetails = [...formData.details];
                        newDetails[index].title = e.target.value;
                        setFormData({...formData, details: newDetails});
                      }}
                      placeholder="Title"
                      className="flex-1 bg-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <input
                      type="text"
                      value={detail.content}
                      onChange={(e) => {
                        const newDetails = [...formData.details];
                        newDetails[index].content = e.target.value;
                        setFormData({...formData, details: newDetails});
                      }}
                      placeholder="Content"
                      className="flex-1 bg-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newDetails = formData.details.filter((_, i) => i !== index);
                        setFormData({...formData, details: newDetails});
                      }}
                      className="p-3 text-neutral-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      details: [...formData.details, { title: '', content: '' }]
                    });
                  }}
                  className="text-yellow-500 hover:text-yellow-400 text-sm"
                >
                  + Add Detail
                </button>
              </div>

              {/* Dimensions */}
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Dimensions
                </label>
                <div className="grid grid-cols-4 gap-4">
                  <input
                    type="number"
                    value={formData.dimensions.length}
                    onChange={(e) => setFormData({
                      ...formData,
                      dimensions: {...formData.dimensions, length: parseFloat(e.target.value)}
                    })}
                    placeholder="Length"
                    className="bg-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <input
                    type="number"
                    value={formData.dimensions.width}
                    onChange={(e) => setFormData({
                      ...formData,
                      dimensions: {...formData.dimensions, width: parseFloat(e.target.value)}
                    })}
                    placeholder="Width"
                    className="bg-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <input
                    type="number"
                    value={formData.dimensions.height}
                    onChange={(e) => setFormData({
                      ...formData,
                      dimensions: {...formData.dimensions, height: parseFloat(e.target.value)}
                    })}
                    placeholder="Height"
                    className="bg-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <select
                    value={formData.dimensions.unit}
                    onChange={(e) => setFormData({
                      ...formData,
                      dimensions: {...formData.dimensions, unit: e.target.value}
                    })}
                    className="bg-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="cm">cm</option>
                    <option value="in">in</option>
                    <option value="mm">mm</option>
                  </select>
                </div>
              </div>

              {/* Care Instructions */}
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Care Instructions
                </label>
                {formData.careInstructions.map((instruction, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={instruction}
                      onChange={(e) => {
                        const newInstructions = [...formData.careInstructions];
                        newInstructions[index] = e.target.value;
                        setFormData({...formData, careInstructions: newInstructions});
                      }}
                      className="flex-1 bg-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newInstructions = formData.careInstructions.filter((_, i) => i !== index);
                        setFormData({...formData, careInstructions: newInstructions});
                      }}
                      className="p-3 text-neutral-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      careInstructions: [...formData.careInstructions, '']
                    });
                  }}
                  className="text-yellow-500 hover:text-yellow-400 text-sm"
                >
                  + Add Care Instruction
                </button>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Image URLs
                </label>
                {formData.images.map((image, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => {
                        const newImages = [...formData.images];
                        newImages[index] = e.target.value;
                        setFormData({...formData, images: newImages});
                      }}
                      className="flex-1 bg-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="https://example.com/image.jpg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = formData.images.filter((_, i) => i !== index);
                        setFormData({...formData, images: newImages});
                      }}
                      className="p-3 text-neutral-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      images: [...formData.images, '']
                    });
                  }}
                  className="text-yellow-500 hover:text-yellow-400 text-sm"
                >
                  + Add Image URL
                </button>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  className="w-4 h-4 text-yellow-500 border-neutral-500 rounded focus:ring-yellow-500"
                />
                <label className="ml-2 text-sm text-neutral-400">
                  Featured Product
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="px-6 py-3 text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-yellow-500 text-black rounded-xl hover:bg-yellow-400 
                    transition-colors"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rest of the component remains the same */}
      {/* ... */}
    </div>
  );
};

export default AdminPage;