"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Download, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  ChevronDown,
  ChevronRight,
  CheckSquare,
  Square,
  RefreshCw
} from 'lucide-react';
import { digiflazzService, DigiflazzProduct } from '@/services/api/digiflazz';
import { productsService } from '@/services/api/products';
import { productCategoriesService } from '@/services/api/product-categories';
import { ProductCategory } from '@/lib/types';

interface MigrationProgress {
  total: number;
  completed: number;
  failed: number;
  current?: string;
}

export default function MigrasiProdukPage() {
  const [digiflazzProducts, setDigiflazzProducts] = useState<DigiflazzProduct[]>([]);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [expandedBrands, setExpandedBrands] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState<MigrationProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load Digiflazz products
      const digiflazzResponse = await digiflazzService.getProducts();
      const products = digiflazzResponse.data;
      setDigiflazzProducts(products);
      
      // Group products by brand (for auto-expand functionality)
      const grouped = digiflazzService.groupProductsByBrand(products);
      
      // Auto-expand first few brands
      const brands = Object.keys(grouped);
      setExpandedBrands(new Set(brands.slice(0, 3)));

      // Load product categories
      const categoriesResponse = await productCategoriesService.getProductCategories({ paginate: 100 });
      setProductCategories(categoriesResponse.data.data);
    } catch (err) {
      setError('Gagal memuat data produk Digiflazz');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search, category, and brand
  const getFilteredProducts = () => {
    let filtered = digiflazzProducts;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product =>
        product.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (selectedBrand) {
      filtered = filtered.filter(product =>
        product.brand.toLowerCase().includes(selectedBrand.toLowerCase())
      );
    }

    return digiflazzService.groupProductsByBrand(filtered);
  };

  const filteredGroupedProducts = getFilteredProducts();

  // Handle product selection
  const toggleProductSelection = (skuCode: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(skuCode)) {
      newSelected.delete(skuCode);
    } else {
      newSelected.add(skuCode);
    }
    setSelectedProducts(newSelected);
  };

  // Handle brand selection (select all products in a brand)
  const toggleBrandSelection = (brand: string) => {
    const brandProducts = filteredGroupedProducts[brand] || [];
    const brandSkus = brandProducts.map(p => p.buyer_sku_code);
    const allSelected = brandSkus.every(sku => selectedProducts.has(sku));
    
    const newSelected = new Set(selectedProducts);
    if (allSelected) {
      brandSkus.forEach(sku => newSelected.delete(sku));
    } else {
      brandSkus.forEach(sku => newSelected.add(sku));
    }
    setSelectedProducts(newSelected);
  };

  // Handle brand expansion
  const toggleBrandExpansion = (brand: string) => {
    const newExpanded = new Set(expandedBrands);
    if (newExpanded.has(brand)) {
      newExpanded.delete(brand);
    } else {
      newExpanded.add(brand);
    }
    setExpandedBrands(newExpanded);
  };

  // Get category ID by name
  const getCategoryIdByName = (categoryName: string): number | null => {
    const category = productCategories.find(cat => 
      cat.title.toLowerCase().includes(categoryName.toLowerCase()) ||
      categoryName.toLowerCase().includes(cat.title.toLowerCase())
    );
    return category?.id || null;
  };

  // Migrate selected products
  const migrateProducts = async () => {
    if (selectedProducts.size === 0) {
      setError('Pilih minimal satu produk untuk di-migrasi');
      return;
    }

    setMigrating(true);
    setError(null);
    setSuccess(null);
    setMigrationProgress({ total: selectedProducts.size, completed: 0, failed: 0 });

    const selectedProductsList = digiflazzProducts.filter(p => selectedProducts.has(p.buyer_sku_code));
    let completed = 0;
    let failed = 0;

    for (const product of selectedProductsList) {
      try {
        setMigrationProgress(prev => prev ? { ...prev, current: product.product_name } : null);
        
        const categoryId = getCategoryIdByName(product.category);
        if (!categoryId) {
          console.warn(`Category not found for: ${product.category}`);
          failed++;
          continue;
        }

        const createData = {
          product_category_id: categoryId,
          name: product.product_name,
          sku: product.buyer_sku_code,
          description: product.desc || '',
          buy_price: product.price,
          sell_price: product.price, // You might want to add markup here
          status: 1 as 0 | 1, // Active
        };

        await productsService.createProduct(createData);
        completed++;
      } catch (err) {
        console.error(`Failed to migrate product ${product.product_name}:`, err);
        failed++;
      }
    }

    setMigrationProgress({ total: selectedProductsList.length, completed, failed });
    setMigrating(false);
    
    if (completed > 0) {
      setSuccess(`Berhasil migrasi ${completed} produk. ${failed > 0 ? `${failed} produk gagal.` : ''}`);
      setSelectedProducts(new Set());
    } else {
      setError('Gagal migrasi semua produk yang dipilih');
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedBrand('');
  };

  // Get unique categories and brands for filter dropdowns
  const uniqueCategories = [...new Set(digiflazzProducts.map(p => p.category))];
  const uniqueBrands = [...new Set(digiflazzProducts.map(p => p.brand))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-7 w-7 text-emerald-600" />
            Migrasi Produk Digiflazz
          </h1>
          <p className="text-gray-600 mt-1">
            Migrasikan produk dari Digiflazz ke sistem internal
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Total Produk</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{digiflazzProducts.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium text-gray-600">Dipilih</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{selectedProducts.size}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Brand</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{Object.keys(filteredGroupedProducts).length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Kategori</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{uniqueCategories.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">Cari Produk</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari berdasarkan nama, brand, atau kategori..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              title="Pilih kategori produk"
            >
              <option value="">Semua Kategori</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              title="Pilih brand produk"
            >
              <option value="">Semua Brand</option>
              {uniqueBrands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Migration Progress */}
      <AnimatePresence>
        {migrationProgress && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
              <span className="font-medium text-blue-900">Migrasi Produk</span>
            </div>
            <div className="text-sm text-blue-700 mb-2">
              {migrationProgress.current && `Sedang memproses: ${migrationProgress.current}`}
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(migrationProgress.completed / migrationProgress.total) * 100}%`
                }}
              />
            </div>
            <div className="text-xs text-blue-600 mt-1">
              {migrationProgress.completed} dari {migrationProgress.total} selesai
              {migrationProgress.failed > 0 && ` (${migrationProgress.failed} gagal)`}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error/Success Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2"
          >
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2"
          >
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800">{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Produk Digiflazz</h2>
            <button
              onClick={migrateProducts}
              disabled={selectedProducts.size === 0 || migrating}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {migrating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Migrasi ({selectedProducts.size})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
            <p className="text-gray-600">Memuat produk Digiflazz...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {Object.entries(filteredGroupedProducts).map(([brand, products]) => {
              const isExpanded = expandedBrands.has(brand);
              const brandSkus = products.map(p => p.buyer_sku_code);
              const selectedInBrand = brandSkus.filter(sku => selectedProducts.has(sku)).length;
              const allSelected = selectedInBrand === brandSkus.length;
              const someSelected = selectedInBrand > 0 && selectedInBrand < brandSkus.length;

              return (
                <div key={brand} className="p-4">
                  {/* Brand Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <button
                      onClick={() => toggleBrandExpansion(brand)}
                      className="flex items-center gap-2 text-left flex-1 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                      <div className="flex items-center gap-2">
                        {allSelected ? (
                          <CheckSquare className="h-5 w-5 text-emerald-600" />
                        ) : someSelected ? (
                          <div className="h-5 w-5 border-2 border-emerald-600 rounded bg-emerald-100 flex items-center justify-center">
                            <div className="h-2 w-2 bg-emerald-600 rounded-full" />
                          </div>
                        ) : (
                          <Square className="h-5 w-5 text-gray-400" />
                        )}
                        <span className="font-semibold text-gray-900">{brand}</span>
                        <span className="text-sm text-gray-500">({products.length} produk)</span>
                        {selectedInBrand > 0 && (
                          <span className="text-sm text-emerald-600 font-medium">
                            ({selectedInBrand} dipilih)
                          </span>
                        )}
                      </div>
                    </button>
                    <button
                      onClick={() => toggleBrandSelection(brand)}
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      {allSelected ? 'Batal Pilih Semua' : 'Pilih Semua'}
                    </button>
                  </div>

                  {/* Products in Brand */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-6 space-y-2"
                      >
                        {products.map((product) => {
                          const isSelected = selectedProducts.has(product.buyer_sku_code);
                          return (
                            <motion.div
                              key={product.buyer_sku_code}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={`p-3 rounded-lg border transition-all ${
                                isSelected 
                                  ? 'border-emerald-200 bg-emerald-50' 
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => toggleProductSelection(product.buyer_sku_code)}
                                  className="flex-shrink-0"
                                >
                                  {isSelected ? (
                                    <CheckSquare className="h-5 w-5 text-emerald-600" />
                                  ) : (
                                    <Square className="h-5 w-5 text-gray-400" />
                                  )}
                                </button>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium text-gray-900 truncate">
                                      {product.product_name}
                                    </h4>
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                      {product.buyer_sku_code}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span>Kategori: {product.category}</span>
                                    <span>Type: {product.type}</span>
                                    <span className="font-medium text-emerald-600">
                                      Rp {product.price.toLocaleString('id-ID')}
                                    </span>
                                  </div>
                                  {product.desc && (
                                    <p className="text-xs text-gray-500 mt-1">{product.desc}</p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <span className={`px-2 py-1 rounded ${
                                    product.buyer_product_status 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {product.buyer_product_status ? 'Aktif' : 'Tidak Aktif'}
                                  </span>
                                  <span className={`px-2 py-1 rounded ${
                                    product.seller_product_status 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {product.seller_product_status ? 'Seller Aktif' : 'Seller Tidak Aktif'}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

        {!loading && Object.keys(filteredGroupedProducts).length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Tidak ada produk yang ditemukan</p>
            <p className="text-sm">Coba ubah filter pencarian</p>
          </div>
        )}
      </div>
    </div>
  );
}
