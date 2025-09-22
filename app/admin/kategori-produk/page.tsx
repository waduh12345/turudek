"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Tag,
  Gamepad2,
  Monitor,
  Headphones,
  Smartphone,
  X,
  Save,
  Loader2,
} from "lucide-react";
import { useApiCall, useDebounce } from "@/hooks";
import { useTokenSync } from "@/hooks/use-token-sync";
import { api } from "@/services/api";
import { ProductCategory, CreateProductCategoryRequest, UpdateProductCategoryRequest } from "@/lib/types";
import { ErrorHandler } from "@/lib/utils";

// Icon mapping for categories
const getCategoryIcon = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('game') || lowerTitle.includes('topup')) return Gamepad2;
  if (lowerTitle.includes('voucher')) return Tag;
  if (lowerTitle.includes('accessory')) return Headphones;
  if (lowerTitle.includes('mobile')) return Smartphone;
  return Monitor;
};

const getCategoryColor = (index: number) => {
  const colors = [
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-green-500", 
    "from-green-500 to-emerald-500",
    "from-orange-500 to-red-500",
    "from-purple-500 to-pink-500",
    "from-indigo-500 to-blue-500"
  ];
  return colors[index % colors.length];
};

export default function KategoriProdukPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  
  // Debounce search term untuk UX yang lebih baik
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [formData, setFormData] = useState<CreateProductCategoryRequest>({
    title: "",
    description: "",
    status: 1,
    sub_title: "",
    parent_id: null,
    image: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  // Token synchronization
  const { isAuthenticated, hasToken } = useTokenSync();

  // API calls
  const { 
    data: categoriesData, 
    loading: categoriesLoading, 
    error: categoriesError, 
    execute: fetchCategories 
  } = useApiCall(() => api.productCategories.getProductCategories({
    page: currentPage,
    paginate: perPage,
    search: debouncedSearchTerm || undefined
  }));

  const { 
    loading: submitLoading, 
    execute: submitCategory 
  } = useApiCall(async (data: CreateProductCategoryRequest | UpdateProductCategoryRequest) => {
    if (editingCategory) {
      return api.productCategories.updateProductCategory({
        ...data,
        slug: editingCategory.slug
      } as UpdateProductCategoryRequest);
    } else {
      return api.productCategories.createProductCategory(data as CreateProductCategoryRequest);
    }
  });

  const { 
    loading: deleteLoading, 
    execute: deleteCategory 
  } = useApiCall((slug: string) => api.productCategories.deleteProductCategory(slug));

  // Load categories on component mount and when search/page changes
  useEffect(() => {
    if (isAuthenticated && hasToken) {
      fetchCategories();
    }
  }, [currentPage, debouncedSearchTerm, isAuthenticated, hasToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data being submitted:', formData);
    
    // Validate required fields
    if (!formData.title || !formData.title.trim()) {
      alert('Title is required');
      return;
    }
    
    if (formData.status === undefined || formData.status === null) {
      alert('Status is required');
      return;
    }
    
    try {
      await submitCategory(formData);
      setShowForm(false);
      setEditingCategory(null);
      resetForm();
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error('Form submission error:', error);
      // Error is handled by useApiCall hook
    }
  };

  const handleEdit = (category: ProductCategory) => {
    setEditingCategory(category);
    setFormData({
      title: category.title,
      description: category.description || "",
      status: category.status,
      sub_title: category.sub_title || "",
      parent_id: category.parent_id,
      image: null,
    });
    setShowForm(true);
  };

  const handleDelete = async (category: ProductCategory) => {
    if (confirm(`Are you sure you want to delete "${category.title}"?`)) {
      try {
        await deleteCategory(category.slug);
        fetchCategories(); // Refresh the list
      } catch (error) {
        // Error is handled by useApiCall hook
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      status: 1,
      sub_title: "",
      parent_id: null,
      image: null,
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kategori Produk</h1>
          <p className="text-gray-600">Kelola kategori produk gaming store Anda</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Tambah Kategori</span>
        </motion.button>
      </div>


      {/* Authentication Check */}
      {!isAuthenticated && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            <strong>Authentication Required:</strong> Please login to access this page.
          </p>
        </div>
      )}

      {isAuthenticated && !hasToken && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            <strong>Token Missing:</strong> Authentication token not found. Please refresh the page or login again.
          </p>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari kategori..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Loading State */}
      {categoriesLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <span className="ml-2 text-gray-600">Loading categories...</span>
        </div>
      )}

      {/* Error State */}
      {categoriesError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error loading categories: {categoriesError}</p>
          <button 
            onClick={() => fetchCategories()}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Categories Grid */}
      {!categoriesLoading && !categoriesError && categoriesData?.data.data && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categoriesData.data.data.map((category, index) => {
            const IconComponent = getCategoryIcon(category.title);
            const colorClass = getCategoryColor(index);
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${colorClass}`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      disabled={deleteLoading}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                    >
                      {deleteLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
                {category.sub_title && (
                  <p className="text-sm text-gray-500 mb-2">{category.sub_title}</p>
                )}
                <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Tag className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Slug: {category.slug}</span>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        category.status === 1
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {category.status === 1 ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!categoriesLoading && !categoriesError && categoriesData?.data.data.length === 0 && (
        <div className="text-center py-12">
          <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? "Try adjusting your search terms." : "Get started by creating your first category."}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Category
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop-strong"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingCategory ? "Edit Kategori" : "Tambah Kategori"}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Masukkan title kategori"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub Title
                  </label>
                  <input
                    type="text"
                    value={formData.sub_title || ""}
                    onChange={(e) => setFormData({ ...formData, sub_title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Masukkan sub title (opsional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Masukkan deskripsi kategori"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: JPEG, PNG, JPG, WebP, SVG (max 5MB)
                  </p>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Batal
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={submitLoading}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all duration-200 disabled:opacity-50"
                  >
                    {submitLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>{editingCategory ? "Update" : "Simpan"}</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {!categoriesLoading && !categoriesError && categoriesData?.data.data && categoriesData.data.data.length > 0 && (
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-gray-700">
            Showing {categoriesData.data.from} to {categoriesData.data.to} of {categoriesData.data.total} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!categoriesData.data.prev_page_url}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm bg-emerald-500 text-white rounded-lg">
              {categoriesData.data.current_page}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!categoriesData.data.next_page_url}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
