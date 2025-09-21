"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Newspaper,
  Eye,
  X,
  Save,
  Upload,
  Calendar,
  User,
  Tag,
  Globe,
  Lock,
  Image as ImageIcon,
} from "lucide-react";

// Dummy data
const news = [
  {
    id: 1,
    title: "PlayStation 5 Pro Akan Dirilis Tahun 2024",
    slug: "playstation-5-pro-akan-dirilis-tahun-2024",
    excerpt: "Sony mengumumkan PlayStation 5 Pro dengan performa yang lebih powerful dan fitur ray tracing yang ditingkatkan.",
    content: "Sony Interactive Entertainment telah mengumumkan bahwa PlayStation 5 Pro akan dirilis pada akhir tahun 2024. Konsol gaming terbaru ini akan menawarkan performa yang lebih powerful dibandingkan dengan PS5 standar, dengan peningkatan signifikan dalam hal ray tracing dan frame rate yang lebih tinggi.",
    category: "Gaming News",
    author: "Admin",
    status: "published",
    featured: true,
    image: "/images/ps5-pro.jpg",
    tags: ["PlayStation", "Gaming", "Console"],
    publishedAt: "2024-01-15",
    createdAt: "2024-01-15",
    views: 1250,
  },
  {
    id: 2,
    title: "Xbox Game Pass Menambah 10 Game Baru Bulan Ini",
    slug: "xbox-game-pass-menambah-10-game-baru-bulan-ini",
    excerpt: "Microsoft menambahkan 10 game baru ke Xbox Game Pass termasuk beberapa game eksklusif yang sangat dinantikan.",
    content: "Microsoft telah mengumumkan penambahan 10 game baru ke Xbox Game Pass untuk bulan ini. Game-game tersebut termasuk beberapa judul eksklusif yang sangat dinantikan oleh para gamer, serta beberapa indie game yang menarik.",
    category: "Gaming News",
    author: "Admin",
    status: "published",
    featured: false,
    image: "/images/xbox-game-pass.jpg",
    tags: ["Xbox", "Game Pass", "Gaming"],
    publishedAt: "2024-01-14",
    createdAt: "2024-01-14",
    views: 890,
  },
  {
    id: 3,
    title: "Nintendo Switch 2 Dikonfirmasi Akan Rilis 2025",
    slug: "nintendo-switch-2-dikonfirmasi-akan-rilis-2025",
    excerpt: "Nintendo secara resmi mengkonfirmasi bahwa Switch 2 akan dirilis pada tahun 2025 dengan spesifikasi yang lebih canggih.",
    content: "Nintendo telah secara resmi mengkonfirmasi bahwa konsol gaming terbaru mereka, yang sementara ini disebut Switch 2, akan dirilis pada tahun 2025. Konsol ini akan menawarkan spesifikasi yang lebih canggih dibandingkan dengan Switch generasi pertama.",
    category: "Gaming News",
    author: "Admin",
    status: "draft",
    featured: false,
    image: "/images/switch-2.jpg",
    tags: ["Nintendo", "Switch", "Console"],
    publishedAt: null,
    createdAt: "2024-01-13",
    views: 0,
  },
  {
    id: 4,
    title: "Review: Cyberpunk 2077 Phantom Liberty",
    slug: "review-cyberpunk-2077-phantom-liberty",
    excerpt: "Review lengkap DLC Phantom Liberty untuk Cyberpunk 2077 yang membawa pengalaman gaming yang lebih baik.",
    content: "Phantom Liberty adalah DLC terbaru untuk Cyberpunk 2077 yang membawa banyak perbaikan dan konten baru. DLC ini menceritakan kisah baru dengan karakter yang menarik dan gameplay yang lebih polished.",
    category: "Game Review",
    author: "Admin",
    status: "published",
    featured: true,
    image: "/images/cyberpunk-dlc.jpg",
    tags: ["Cyberpunk 2077", "Review", "DLC"],
    publishedAt: "2024-01-12",
    createdAt: "2024-01-12",
    views: 2100,
  },
  {
    id: 5,
    title: "Tips dan Trik Gaming untuk Pemula",
    slug: "tips-dan-trik-gaming-untuk-pemula",
    excerpt: "Panduan lengkap untuk pemula yang baru memulai perjalanan gaming mereka.",
    content: "Gaming adalah hobi yang menyenangkan dan bisa menjadi cara yang bagus untuk menghabiskan waktu luang. Bagi pemula, ada beberapa tips dan trik yang bisa membantu meningkatkan pengalaman gaming mereka.",
    category: "Tips & Tricks",
    author: "Admin",
    status: "published",
    featured: false,
    image: "/images/gaming-tips.jpg",
    tags: ["Tips", "Gaming", "Pemula"],
    publishedAt: "2024-01-11",
    createdAt: "2024-01-11",
    views: 1560,
  },
];

const categories = [
  "Gaming News",
  "Game Review",
  "Tips & Tricks",
  "Hardware",
  "Software",
];

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState<typeof news[0] | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<typeof news[0] | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    status: "draft",
    featured: false,
    tags: "",
  });

  const filteredNews = news.filter((article) => {
    const matchesSearch = 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || article.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || article.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTotalViews = () => {
    return news.reduce((sum, article) => sum + article.views, 0);
  };

  const getPublishedCount = () => {
    return news.filter(article => article.status === "published").length;
  };

  const getDraftCount = () => {
    return news.filter(article => article.status === "draft").length;
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    setShowForm(false);
    setEditingNews(null);
    setFormData({ title: "", excerpt: "", content: "", category: "", status: "draft", featured: false, tags: "" });
  };

  const handleEdit = (article: typeof news[0]) => {
    setEditingNews(article);
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      status: article.status,
      featured: article.featured,
      tags: article.tags.join(", "),
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this article?")) {
      // Handle delete here
      console.log("Delete article:", id);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", excerpt: "", content: "", category: "", status: "draft", featured: false, tags: "" });
    setEditingNews(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">News & Articles</h1>
          <p className="text-gray-600">Kelola artikel dan berita gaming store Anda</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Tulis Artikel</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-6"
        >
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
              <Newspaper className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Artikel</p>
              <p className="text-2xl font-semibold text-gray-900">{news.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-6"
        >
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Dipublikasi</p>
              <p className="text-2xl font-semibold text-gray-900">{getPublishedCount()}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-6"
        >
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Draft</p>
              <p className="text-2xl font-semibold text-gray-900">{getDraftCount()}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-6"
        >
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-green-500">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-semibold text-gray-900">{getTotalViews().toLocaleString()}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari artikel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="all">Semua Kategori</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="all">Semua Status</option>
          <option value="published">Dipublikasi</option>
          <option value="draft">Draft</option>
          <option value="archived">Diarsipkan</option>
        </select>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <Filter className="h-5 w-5" />
          <span>Filter</span>
        </button>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filteredNews.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            {/* Article Image */}
            <div className="relative h-48 bg-gradient-to-r from-emerald-500 to-green-500">
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="h-16 w-16 text-white opacity-50" />
              </div>
              {article.featured && (
                <div className="absolute top-4 left-4">
                  <span className="bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                    Featured
                  </span>
                </div>
              )}
              <div className="absolute top-4 right-4">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    article.status
                  )}`}
                >
                  {article.status}
                </span>
              </div>
            </div>

            {/* Article Content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-emerald-600">{article.category}</span>
                <div className="flex items-center text-sm text-gray-500">
                  <Eye className="h-4 w-4 mr-1" />
                  {article.views}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {article.title}
              </h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {article.excerpt}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Article Meta */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {article.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {article.publishedAt || article.createdAt}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setSelectedArticle(article)}
                    className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(article)}
                    className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-xs text-gray-500">
                  {article.slug}
                </span>
              </div>
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
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingNews ? "Edit Artikel" : "Tulis Artikel Baru"}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Judul Artikel
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Masukkan judul artikel"
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ringkasan
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Masukkan ringkasan artikel"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konten Artikel
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Masukkan konten artikel lengkap"
                    rows={8}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Dipublikasi</option>
                      <option value="archived">Diarsipkan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="gaming, console, review"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                    Jadikan artikel featured
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gambar Artikel
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
                    <span>{editingNews ? "Update" : "Simpan"}</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Article Detail Modal */}
      <AnimatePresence>
        {selectedArticle && (
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
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Detail Artikel</h2>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Article Header */}
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">{selectedArticle.title}</h1>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {selectedArticle.author}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {selectedArticle.publishedAt || selectedArticle.createdAt}
                    </span>
                    <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {selectedArticle.views} views
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-sm font-medium text-emerald-600">{selectedArticle.category}</span>
                    {selectedArticle.featured && (
                      <span className="bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        selectedArticle.status
                      )}`}
                    >
                      {selectedArticle.status}
                    </span>
                  </div>
                </div>

                {/* Article Image */}
                <div className="flex justify-center">
                  <div className="w-full max-w-md h-48 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-white" />
                  </div>
                </div>

                {/* Article Content */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Ringkasan</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedArticle.excerpt}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Konten</h3>
                    <div className="prose max-w-none">
                      <p className="text-gray-600 leading-relaxed">{selectedArticle.content}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedArticle.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Article Meta */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Informasi Artikel</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Slug:</span>
                        <span className="ml-2 font-medium text-gray-900">{selectedArticle.slug}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Dibuat:</span>
                        <span className="ml-2 font-medium text-gray-900">{selectedArticle.createdAt}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Dipublikasi:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {selectedArticle.publishedAt || "Belum dipublikasi"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <span className="ml-2 font-medium text-gray-900">{selectedArticle.status}</span>
                      </div>
                    </div>
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
