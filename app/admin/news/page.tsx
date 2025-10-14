"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Newspaper,
  Eye,
  X,
  Save,
  Upload,
  Calendar,
  Tag,
  Globe,
  Lock,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { useApiCall, useDebounce } from "@/hooks";
import { useTokenSync } from "@/hooks/use-token-sync";
import { api } from "@/services/api";
import {
  NewsArticle,
  CreateNewsArticleRequest,
  UpdateNewsArticleRequest,
} from "@/lib/types";
import { getImageUrl } from "@/lib/image-url";
import Image from "next/image";

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [retryTrigger, setRetryTrigger] = useState(0);
  const [formData, setFormData] = useState({
    news_category_id: 0,
    title: "",
    sub_title: "",
    content: "",
    published_at: "",
    status: 1 as 0 | 1,
    tag_ids: [] as number[],
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Debounce search term untuk UX yang lebih baik
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Token sync untuk authentication
  const { isAuthenticated, hasToken } = useTokenSync();

  // API calls
  const {
    data: articlesData,
    loading: articlesLoading,
    error: articlesError,
    execute: fetchArticles,
  } = useApiCall(api.newsArticles.getNewsArticles);

  const { loading: submitLoading, execute: submitArticle } = useApiCall(
    api.newsArticles.createNewsArticle
  );

  const { loading: updateLoading, execute: updateArticle } = useApiCall(
    api.newsArticles.updateNewsArticle
  );

  const { execute: deleteArticle } = useApiCall(
    api.newsArticles.deleteNewsArticle
  );

  // Fetch categories and tags for dropdowns
  const { data: categoriesData, execute: fetchCategories } = useApiCall(
    api.newsCategories.getNewsCategories
  );

  const { data: tagsData, execute: fetchTags } = useApiCall(
    api.newsTags.getNewsTags
  );

  // Load data on component mount and when search/page changes
  useEffect(() => {
    if (isAuthenticated && hasToken) {
      const params: {
        page: number;
        paginate: number;
        search?: string;
        status?: number;
        news_category_id?: number;
      } = {
        page: currentPage,
        paginate: perPage,
      };

      // Only add optional parameters if they have values
      if (debouncedSearchTerm) {
        params.search = debouncedSearchTerm;
      }

      if (statusFilter !== "all") {
        params.status = statusFilter === "published" ? 1 : 0;
      }

      if (categoryFilter !== "all") {
        params.news_category_id = parseInt(categoryFilter);
      }

      // console.log('Fetching articles with params:', params);

      fetchArticles(params).catch((error) => {
        console.error("Error in fetchArticles:", error);
      });

      fetchCategories({ page: 1, paginate: 100 }).catch((error) => {
        console.error("Error in fetchCategories:", error);
      });

      fetchTags({ page: 1, paginate: 100 }).catch((error) => {
        console.error("Error in fetchTags:", error);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentPage,
    debouncedSearchTerm,
    categoryFilter,
    statusFilter,
    isAuthenticated,
    hasToken,
    retryTrigger,
  ]);

  // Get data from API responses
  const articles = articlesData?.data?.data || [];
  const pagination = articlesData?.data;
  const categories = categoriesData?.data?.data || [];
  const tags = tagsData?.data?.data || [];

  // Debug logging
  // console.log('Categories loaded:', categories);
  // console.log('Current categoryFilter:', categoryFilter);
  // console.log('Articles loaded:', articles.length);

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
    switch (status) {
      case 1:
        return "Published";
      case 0:
        return "Draft";
      default:
        return "Draft";
    }
  };

  const getTotalViews = () => {
    return articles.reduce((sum, article) => sum + article.view_count, 0);
  };

  const getPublishedCount = () => {
    return articles.filter((article) => article.status === 1).length;
  };

  const getDraftCount = () => {
    return articles.filter((article) => article.status === 0).length;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.title.trim()) {
      console.error("Judul artikel harus diisi");
      return;
    }

    if (!formData.content.trim()) {
      console.error("Konten artikel harus diisi");
      return;
    }

    if (!formData.news_category_id) {
      console.error("Kategori harus dipilih");
      return;
    }

    if (!formData.published_at) {
      console.error("Tanggal publikasi harus diisi");
      return;
    }

    try {
      const submitData: CreateNewsArticleRequest | UpdateNewsArticleRequest = {
        news_category_id: formData.news_category_id,
        title: formData.title.trim(),
        sub_title: formData.sub_title.trim() || null,
        content: formData.content.trim(),
        published_at: formData.published_at,
        status: formData.status,
        tag_ids: formData.tag_ids,
        image: formData.image,
      };

      if (editingNews) {
        await updateArticle(
          editingNews.slug,
          submitData as UpdateNewsArticleRequest
        );
      } else {
        await submitArticle(submitData as CreateNewsArticleRequest);
      }

      // Refresh data
      setRetryTrigger((prev) => prev + 1);

      resetForm();
    } catch (error) {
      console.error("Error submitting news article:", error);
    }
  };

  const handleEdit = (article: NewsArticle) => {
    setEditingNews(article);

    // Format published_at for datetime-local input
    const publishedAtFormatted = new Date(article.published_at)
      .toISOString()
      .slice(0, 16);

    setFormData({
      news_category_id: article.news_category_id,
      title: article.title,
      sub_title: article.sub_title || "",
      content: article.content,
      published_at: publishedAtFormatted,
      status: article.status,
      tag_ids: article.tags.map((tag) => tag.id),
      image: null,
    });

    // Set image preview if article has an image
    if (article.image) {
      setImagePreview(getImageUrl(article.image));
    } else {
      setImagePreview(null);
    }

    setShowForm(true);
  };

  const handleDelete = async (article: NewsArticle) => {
    if (confirm(`Are you sure you want to delete "${article.title}"?`)) {
      try {
        await deleteArticle(article.slug);

        // Refresh data
        setRetryTrigger((prev) => prev + 1);
      } catch (error) {
        console.error("Error deleting news article:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      news_category_id: 0,
      title: "",
      sub_title: "",
      content: "",
      published_at: "",
      status: 1,
      tag_ids: [],
      image: null,
    });
    setImagePreview(null);
    setEditingNews(null);
    setShowForm(false);
  };

  // Show loading state
  if (articlesLoading && !articlesData && !articlesError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-emerald-500" />
          <p className="text-gray-600">Loading articles...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (articlesError && !articlesData && !articlesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            Error loading articles:{" "}
            {typeof articlesError === "string"
              ? articlesError
              : "Unknown error"}
          </p>
          <button
            onClick={() => {
              setRetryTrigger((prev) => prev + 1);
            }}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show authentication required
  if (!isAuthenticated || !hasToken) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Authentication required to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">News & Articles</h1>
          <p className="text-gray-600">
            Kelola artikel dan berita gaming store Anda
            {pagination && (
              <span className="ml-2 text-sm text-gray-500">
                ({pagination.total} total)
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
              <p className="text-2xl font-semibold text-gray-900">
                {articles.length}
              </p>
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
              <p className="text-2xl font-semibold text-gray-900">
                {getPublishedCount()}
              </p>
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
              <p className="text-2xl font-semibold text-gray-900">
                {getDraftCount()}
              </p>
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
              <p className="text-2xl font-semibold text-gray-900">
                {getTotalViews().toLocaleString()}
              </p>
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
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => {
              // console.log('Category filter changed to:', e.target.value);
              setCategoryFilter(e.target.value);
              setCurrentPage(1); // Reset to first page when filter changes
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            aria-label="Filter by category"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id.toString()}>
                {category.name}
              </option>
            ))}
          </select>
          {categoryFilter !== "all" && (
            <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              ✓
            </div>
          )}
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1); // Reset to first page when filter changes
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          aria-label="Filter by status"
        >
          <option value="all">Semua Status</option>
          <option value="published">Dipublikasi</option>
          <option value="draft">Draft</option>
        </select>
        {(categoryFilter !== "all" || statusFilter !== "all" || searchTerm) && (
          <button
            onClick={() => {
              setCategoryFilter("all");
              setStatusFilter("all");
              setSearchTerm("");
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Clear Filters
          </button>
        )}
        {articlesLoading && (
          <div className="flex items-center text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Searching...
          </div>
        )}
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {articles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            {/* Article Image */}
            <div className="relative h-48 bg-gradient-to-r from-emerald-500 to-green-500">
              {article.image ? (
                <Image
                  src={getImageUrl(article.image)}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-white opacity-50" />
                </div>
              )}
              <div className="absolute top-4 right-4">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    article.status
                  )}`}
                >
                  {getStatusText(article.status)}
                </span>
              </div>
            </div>

            {/* Article Content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-emerald-600">
                  {article.category_name}
                </span>
                <div className="flex items-center text-sm text-gray-500">
                  <Eye className="h-4 w-4 mr-1" />
                  {article.view_count}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {article.title}
              </h3>

              {article.sub_title && (
                <p className="text-gray-500 text-sm mb-2 line-clamp-1">
                  {article.sub_title}
                </p>
              )}

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {article.content.substring(0, 150)}...
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag.name}
                  </span>
                ))}
              </div>

              {/* Article Meta */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(article.published_at).toLocaleDateString("id-ID")}
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-400">
                    {article.read_time} min read
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    title="View article details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(article)}
                    className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                    title="Edit article"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(article)}
                    className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Delete article"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-xs text-gray-500">{article.slug}</span>
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
                  title="Close form"
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
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
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
                      value={formData.news_category_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          news_category_id: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                      aria-label="Select category"
                    >
                      <option value={0}>Pilih kategori</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub Judul (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.sub_title}
                    onChange={(e) =>
                      setFormData({ ...formData, sub_title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Masukkan sub judul artikel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konten Artikel
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Masukkan konten artikel lengkap"
                    rows={8}
                    required
                    aria-label="Article content"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: parseInt(e.target.value) as 0 | 1,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      aria-label="Select status"
                    >
                      <option value={0}>Draft</option>
                      <option value={1}>Dipublikasi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Publikasi
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.published_at}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          published_at: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                    {tags.map((tag) => (
                      <label key={tag.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.tag_ids.includes(tag.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                tag_ids: [...formData.tag_ids, tag.id],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                tag_ids: formData.tag_ids.filter(
                                  (id) => id !== tag.id
                                ),
                              });
                            }
                          }}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">
                          {tag.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gambar Artikel
                  </label>
                  <div className="space-y-4">
                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="relative">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData({ ...formData, image: null });
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          title="Remove image"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {/* File Input */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-500 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                        aria-label="Upload article image"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          Klik untuk upload atau drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </label>
                    </div>
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
                    disabled={submitLoading || updateLoading}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitLoading || updateLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>
                      {submitLoading || updateLoading
                        ? editingNews
                          ? "Updating..."
                          : "Saving..."
                        : editingNews
                        ? "Update"
                        : "Simpan"}
                    </span>
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
                <h2 className="text-xl font-semibold text-gray-900">
                  Detail Artikel
                </h2>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  title="Close article details"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Article Header */}
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    {selectedArticle.title}
                  </h1>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(
                        selectedArticle.published_at
                      ).toLocaleDateString("id-ID")}
                    </span>
                    <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {selectedArticle.view_count} views
                    </span>
                    <span className="flex items-center">
                      <span className="text-xs text-gray-400">
                        {selectedArticle.read_time} min read
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-sm font-medium text-emerald-600">
                      {selectedArticle.category_name}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        selectedArticle.status
                      )}`}
                    >
                      {getStatusText(selectedArticle.status)}
                    </span>
                  </div>
                </div>

                {/* Article Image */}
                <div className="flex justify-center">
                  {selectedArticle.image ? (
                    <Image
                      src={getImageUrl(selectedArticle.image)}
                      alt={selectedArticle.title}
                      className="w-full max-w-md h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full max-w-md h-48 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-16 w-16 text-white" />
                    </div>
                  )}
                </div>

                {/* Article Content */}
                <div className="space-y-4">
                  {selectedArticle.sub_title && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Sub Judul
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {selectedArticle.sub_title}
                      </p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Konten
                    </h3>
                    <div className="prose max-w-none">
                      <p className="text-gray-600 leading-relaxed">
                        {selectedArticle.content}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedArticle.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Article Meta */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Informasi Artikel
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Slug:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {selectedArticle.slug}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Dibuat:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {new Date(
                            selectedArticle.created_at
                          ).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Dipublikasi:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {new Date(
                            selectedArticle.published_at
                          ).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {getStatusText(selectedArticle.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-gray-700">
            Menampilkan {pagination.from} sampai {pagination.to} dari{" "}
            {pagination.total} artikel
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm">
              Halaman {currentPage} dari {pagination.last_page}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, pagination.last_page)
                )
              }
              disabled={currentPage === pagination.last_page}
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
