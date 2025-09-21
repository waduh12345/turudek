"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Package,
  Eye,
  X,
  Save,
  Upload,
  Star,
  DollarSign,
  Tag,
} from "lucide-react";

// Dummy data
const products = [
  {
    id: 1,
    name: "PlayStation 5",
    category: "Gaming Consoles",
    price: 7500000,
    stock: 15,
    status: "active",
    rating: 4.8,
    image: "/images/ps5.jpg",
    description: "Next-generation gaming console with 4K gaming and ray tracing",
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    name: "Xbox Series X",
    category: "Gaming Consoles",
    price: 6200000,
    stock: 8,
    status: "active",
    rating: 4.7,
    image: "/images/xbox.jpg",
    description: "Most powerful Xbox console with 4K gaming and quick resume",
    createdAt: "2024-01-02",
  },
  {
    id: 3,
    name: "Nintendo Switch",
    category: "Gaming Consoles",
    price: 3800000,
    stock: 25,
    status: "active",
    rating: 4.6,
    image: "/images/switch.jpg",
    description: "Hybrid gaming console for home and portable gaming",
    createdAt: "2024-01-03",
  },
  {
    id: 4,
    name: "Gaming PC RTX 4080",
    category: "Gaming PCs",
    price: 15000000,
    stock: 5,
    status: "active",
    rating: 4.9,
    image: "/images/pc.jpg",
    description: "High-performance gaming PC with RTX 4080 graphics card",
    createdAt: "2024-01-04",
  },
  {
    id: 5,
    name: "Steam Deck",
    category: "Gaming Consoles",
    price: 4500000,
    stock: 0,
    status: "out_of_stock",
    rating: 4.5,
    image: "/images/steam-deck.jpg",
    description: "Portable gaming PC with Steam OS",
    createdAt: "2024-01-05",
  },
];

const categories = [
  "Gaming Consoles",
  "Gaming PCs",
  "Gaming Accessories",
  "Mobile Gaming",
];

export default function ProdukPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<typeof products[0] | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    status: "active",
    description: "",
  });

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    setShowForm(false);
    setEditingProduct(null);
    setFormData({ name: "", category: "", price: "", stock: "", status: "active", description: "" });
  };

  const handleEdit = (product: typeof products[0]) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      status: product.status,
      description: product.description,
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      // Handle delete here
      console.log("Delete product:", id);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", category: "", price: "", stock: "", status: "active", description: "" });
    setEditingProduct(null);
    setShowForm(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "out_of_stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produk</h1>
          <p className="text-gray-600">Kelola produk gaming store Anda</p>
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
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="all">Semua Kategori</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <Filter className="h-5 w-5" />
          <span>Filter</span>
        </button>
      </div>

      {/* Desktop Table View */}
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
                  Harga
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                  Stok
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                  Rating
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product, index) => (
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
                        <div className="text-xs text-gray-500 truncate max-w-48">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <Tag className="h-3 w-3 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-900 truncate">{product.category}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <DollarSign className="h-3 w-3 text-gray-400 mr-1" />
                      <span className="text-xs font-medium text-gray-900">{formatPrice(product.price)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-900">{product.stock}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        product.status
                      )}`}
                    >
                      {product.status === "out_of_stock" ? "Habis" : product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                      <span className="text-xs text-gray-900">{product.rating}</span>
                    </div>
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
                        onClick={() => handleDelete(product.id)}
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

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredProducts.map((product, index) => (
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
                  onClick={() => handleDelete(product.id)}
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
                  <span className="text-gray-900">{product.category}</span>
                </div>
              </div>
              <div>
                <span className="text-gray-500">Harga:</span>
                <div className="flex items-center mt-1">
                  <DollarSign className="h-3 w-3 text-gray-400 mr-1" />
                  <span className="text-gray-900 font-medium">{formatPrice(product.price)}</span>
                </div>
              </div>
              <div>
                <span className="text-gray-500">Stok:</span>
                <span className="ml-2 text-gray-900">{product.stock}</span>
              </div>
              <div>
                <span className="text-gray-500">Rating:</span>
                <div className="flex items-center mt-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                  <span className="text-gray-900">{product.rating}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  product.status
                )}`}
              >
                {product.status === "out_of_stock" ? "Habis" : product.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

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
                      Nama Produk
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
                      Kategori
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    >
                      <option value="">Pilih kategori</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Harga
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Masukkan harga"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stok
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Masukkan stok"
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
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                    <option value="out_of_stock">Habis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gambar Produk
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Klik untuk upload atau drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
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
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all duration-200"
                  >
                    <Save className="h-4 w-4" />
                    <span>{editingProduct ? "Update" : "Simpan"}</span>
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
                        <span className="text-sm font-medium text-gray-900">{selectedProduct.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Harga:</span>
                        <span className="text-sm font-medium text-gray-900">{formatPrice(selectedProduct.price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Stok:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedProduct.stock}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            selectedProduct.status
                          )}`}
                        >
                          {selectedProduct.status === "out_of_stock" ? "Habis" : selectedProduct.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Rating:</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm font-medium text-gray-900">{selectedProduct.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Deskripsi</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
