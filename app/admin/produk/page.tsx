"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Package,
  Eye,
  X,
  Save,
  DollarSign,
  Tag,
  Loader2,
} from "lucide-react";
import { useApiCall, useDebounce } from "@/hooks";
import { useTokenSync } from "@/hooks/use-token-sync";
import { api } from "@/services/api";
import { Product, CreateProductRequest, UpdateProductRequest } from "@/lib/types";
// import { ErrorHandler } from "@/lib/utils/error-handler";


export default function ProdukPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [formData, setFormData] = useState({
    product_category_id: 0,
    name: "",
    sku: "",
    description: "",
    buy_price: "",
    sell_price: "",
    status: 1 as 0 | 1,
    image: null as File | null,
  });
  
  // Debounce search term untuk UX yang lebih baik
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  // Token sync untuk authentication
  const { isAuthenticated, hasToken } = useTokenSync();

  // API calls
  const { 
    data: productsData, 
    loading: productsLoading, 
    error: productsError, 
    execute: fetchProducts 
  } = useApiCall(() => api.products.getProducts({
    page: currentPage,
    paginate: perPage,
    search: debouncedSearchTerm || undefined
  }));
  
  const { 
    data: categoriesData, 
    execute: fetchCategories 
  } = useApiCall(() => api.productCategories.getProductCategories({
    page: 1,
    paginate: 100 // Get all categories
  }));
  
  const { 
    loading: submitLoading, 
    execute: submitProduct 
  } = useApiCall(async (data: CreateProductRequest | UpdateProductRequest) => {
    if (editingProduct) {
      return api.products.updateProduct(data as UpdateProductRequest);
    } else {
      return api.products.createProduct(data as CreateProductRequest);
    }
  });
  
  const { 
    execute: deleteProduct 
  } = useApiCall((slug: string) => api.products.deleteProduct(slug));
  
  // Fetch data on mount and when dependencies change
  useEffect(() => {
    if (isAuthenticated && hasToken) {
      fetchProducts();
      fetchCategories();
    }
  }, [currentPage, debouncedSearchTerm, selectedCategory, isAuthenticated, hasToken]);
  
  const allProducts = productsData?.data?.data || [];
  const categories = categoriesData?.data?.data || [];
  
  // Filter products based on selected category
  const products = selectedCategory === "all" 
    ? allProducts 
    : allProducts.filter(product => product.product_category_id.toString() === selectedCategory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formData.name.trim()) {
      console.error("❌ Nama produk harus diisi");
      return;
    }
    if (!formData.sku.trim()) {
      console.error("❌ SKU harus diisi");
      return;
    }
    if (!formData.buy_price || parseFloat(formData.buy_price) <= 0) {
      console.error("❌ Harga beli harus diisi dan lebih dari 0");
      return;
    }
    if (!formData.sell_price || parseFloat(formData.sell_price) <= 0) {
      console.error("❌ Harga jual harus diisi dan lebih dari 0");
      return;
    }
    if (formData.product_category_id === 0) {
      console.error("❌ Kategori produk harus dipilih");
      return;
    }
    
    try {
      const submitData = {
        ...formData,
        buy_price: parseFloat(formData.buy_price),
        sell_price: parseFloat(formData.sell_price),
        ...(editingProduct && { slug: editingProduct.slug })
      };
      
      console.log('Submitting product data:', submitData);
      
      await submitProduct(submitData);
      
      // Refresh data
      await fetchProducts();
      
      // Reset form
      resetForm();
      
      // ErrorHandler.showSuccess(editingProduct ? "Produk berhasil diupdate" : "Produk berhasil ditambahkan");
      console.log("✅", editingProduct ? "Produk berhasil diupdate" : "Produk berhasil ditambahkan");
    } catch (error) {
      console.error('Error submitting product:', error);
      // ErrorHandler.showError("Gagal menyimpan produk");
      console.error("❌ Gagal menyimpan produk");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      product_category_id: product.product_category_id,
      name: product.name,
      sku: product.sku,
      description: product.description || "",
      buy_price: product.buy_price,
      sell_price: product.sell_price,
      status: product.status,
      image: null,
    });
    setShowForm(true);
  };

  const handleDelete = async (product: Product) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        await deleteProduct(product.slug);
        await fetchProducts();
        console.log("✅ Produk berhasil dihapus");
      } catch (error) {
        console.error('Error deleting product:', error);
        console.error("❌ Gagal menghapus produk");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      product_category_id: 0,
      name: "",
      sku: "",
      description: "",
      buy_price: "",
      sell_price: "",
      status: 1,
      image: null,
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1:
        return "bg-green-100 text-green-800";
      case 0:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getStatusText = (status: number) => {
    return status === 1 ? "Aktif" : "Tidak Aktif";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produk</h1>
          <p className="text-gray-600">
            Kelola produk gaming store Anda
            {allProducts.length > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                ({allProducts.length} total produk)
              </span>
            )}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Tambah Produk</span>
        </motion.button>
      </div>

      {/* Authentication Check */}
      {!isAuthenticated && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">Silakan login untuk mengakses halaman ini.</p>
        </div>
      )}
      
      {isAuthenticated && !hasToken && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Token tidak ditemukan. Silakan login ulang.</p>
        </div>
      )}
      
      {isAuthenticated && hasToken && (
        <>
          {/* Filter Info */}
          {selectedCategory !== "all" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-800 text-sm">
                Menampilkan {products.length} produk dari kategori: <strong>
                  {categories.find(cat => cat.id.toString() === selectedCategory)?.title}
                </strong>
              </p>
            </div>
          )}
          
          {/* Search and Filter */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1); // Reset to first page when filter changes
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id.toString()}>
                  {category.title}
                </option>
              ))}
            </select>
            {selectedCategory !== "all" && (
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setCurrentPage(1);
                }}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                title="Clear filter"
              >
                Clear Filter
              </button>
            )}
          </div>

          {/* Loading State */}
          {productsLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
              <span className="ml-2 text-gray-600">Memuat produk...</span>
            </div>
          )}
          
          {/* Error State */}
          {productsError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">Gagal memuat produk: {productsError}</p>
            </div>
          )}
          
          {/* Desktop Table View */}
          {!productsLoading && !productsError && (
            <div className="hidden lg:block bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                        Produk
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                        Kategori
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                        Harga Jual
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                        Harga Beli
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
                              <Package className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <div className="ml-3 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">{product.name}</div>
                            <div className="text-xs text-gray-500 truncate max-w-48">{product.description || '-'}</div>
                            <div className="text-xs text-gray-400">SKU: {product.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <Tag className="h-3 w-3 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-900 truncate">{product.category_title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <DollarSign className="h-3 w-3 text-gray-400 mr-1" />
                          <span className="text-xs font-medium text-gray-900">{formatPrice(product.sell_price)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <DollarSign className="h-3 w-3 text-gray-400 mr-1" />
                          <span className="text-xs font-medium text-gray-900">{formatPrice(product.buy_price)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            product.status
                          )}`}
                        >
                          {getStatusText(product.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button 
                            onClick={() => setSelectedProduct(product)}
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors duration-200"
                            title="Lihat Detail"
                          >
                            <Eye className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded transition-colors duration-200"
                            title="Edit"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors duration-200"
                            title="Hapus"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                </motion.tr>
              ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Mobile Card View */}
          {!productsLoading && !productsError && (
            <div className="lg:hidden space-y-4">
              {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{product.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => setSelectedProduct(product)}
                  className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors duration-200"
                  title="Lihat Detail"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleEdit(product)}
                  className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded transition-colors duration-200"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(product)}
                  className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors duration-200"
                  title="Hapus"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-500">Kategori:</span>
                  <div className="flex items-center mt-1">
                    <Tag className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-gray-900">{product.category_title}</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Harga Jual:</span>
                  <div className="flex items-center mt-1">
                    <DollarSign className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-gray-900 font-medium">{formatPrice(product.sell_price)}</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Harga Beli:</span>
                  <div className="flex items-center mt-1">
                    <DollarSign className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-gray-900 font-medium">{formatPrice(product.buy_price)}</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">SKU:</span>
                  <span className="ml-2 text-gray-900">{product.sku}</span>
                </div>
              </div>
            
              <div className="mt-3 flex items-center justify-between">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    product.status
                  )}`}
                >
                  {getStatusText(product.status)}
                </span>
              </div>
          </motion.div>
              ))}
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
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingProduct ? "Edit Produk" : "Tambah Produk"}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Produk *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Masukkan nama produk"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU *
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Masukkan SKU"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori Produk *
                    </label>
                    <select
                      value={formData.product_category_id}
                      onChange={(e) => setFormData({ ...formData, product_category_id: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    >
                      <option value={0}>Pilih kategori</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) as 0 | 1 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    >
                      <option value={1}>Aktif</option>
                      <option value={0}>Tidak Aktif</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Harga Beli *
                    </label>
                    <input
                      type="number"
                      value={formData.buy_price}
                      onChange={(e) => setFormData({ ...formData, buy_price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Masukkan harga beli"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Harga Jual *
                    </label>
                    <input
                      type="number"
                      value={formData.sell_price}
                      onChange={(e) => setFormData({ ...formData, sell_price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Masukkan harga jual"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Masukkan deskripsi produk"
                    rows={3}
                    required
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gambar Produk
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
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
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>{submitLoading ? "Menyimpan..." : (editingProduct ? "Update" : "Simpan")}</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
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
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Detail Produk</h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Product Image */}
                <div className="flex justify-center">
                  <div className="w-48 h-48 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                    <Package className="h-24 w-24 text-white" />
                  </div>
                </div>

                {/* Product Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Produk</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Nama Produk:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedProduct.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Kategori:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedProduct.category_title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">SKU:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedProduct.sku}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Harga Beli:</span>
                        <span className="text-sm font-medium text-gray-900">{formatPrice(selectedProduct.buy_price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Harga Jual:</span>
                        <span className="text-sm font-medium text-gray-900">{formatPrice(selectedProduct.sell_price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            selectedProduct.status
                          )}`}
                        >
                          {getStatusText(selectedProduct.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Deskripsi</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{selectedProduct.description || 'Tidak ada deskripsi'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
        </>
      )}
    </div>
  );
}
