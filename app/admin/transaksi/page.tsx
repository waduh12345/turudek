"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Eye,
  Download,
  User,
  Package,
  DollarSign,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  X,
} from "lucide-react";

// Dummy data
const transactions = [
  {
    id: "TXN-001",
    customer: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+62 812-3456-7890",
    },
    product: {
      name: "PlayStation 5",
      category: "Gaming Consoles",
      price: 7500000,
    },
    quantity: 1,
    total: 7500000,
    status: "completed",
    paymentMethod: "Bank Transfer",
    orderDate: "2024-01-15",
    completedDate: "2024-01-16",
    shippingAddress: "Jl. Sudirman No. 123, Jakarta",
  },
  {
    id: "TXN-002",
    customer: {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+62 813-4567-8901",
    },
    product: {
      name: "Xbox Series X",
      category: "Gaming Consoles",
      price: 6200000,
    },
    quantity: 1,
    total: 6200000,
    status: "pending",
    paymentMethod: "Credit Card",
    orderDate: "2024-01-15",
    completedDate: null,
    shippingAddress: "Jl. Thamrin No. 456, Jakarta",
  },
  {
    id: "TXN-003",
    customer: {
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+62 814-5678-9012",
    },
    product: {
      name: "Nintendo Switch",
      category: "Gaming Consoles",
      price: 3800000,
    },
    quantity: 2,
    total: 7600000,
    status: "shipped",
    paymentMethod: "E-Wallet",
    orderDate: "2024-01-14",
    completedDate: null,
    shippingAddress: "Jl. Gatot Subroto No. 789, Jakarta",
  },
  {
    id: "TXN-004",
    customer: {
      name: "Sarah Wilson",
      email: "sarah@example.com",
      phone: "+62 815-6789-0123",
    },
    product: {
      name: "Gaming PC RTX 4080",
      category: "Gaming PCs",
      price: 15000000,
    },
    quantity: 1,
    total: 15000000,
    status: "completed",
    paymentMethod: "Bank Transfer",
    orderDate: "2024-01-14",
    completedDate: "2024-01-15",
    shippingAddress: "Jl. HR Rasuna Said No. 321, Jakarta",
  },
  {
    id: "TXN-005",
    customer: {
      name: "David Brown",
      email: "david@example.com",
      phone: "+62 816-7890-1234",
    },
    product: {
      name: "Steam Deck",
      category: "Gaming Consoles",
      price: 4500000,
    },
    quantity: 1,
    total: 4500000,
    status: "cancelled",
    paymentMethod: "Credit Card",
    orderDate: "2024-01-13",
    completedDate: null,
    shippingAddress: "Jl. Senayan No. 654, Jakarta",
  },
  {
    id: "TXN-006",
    customer: {
      name: "Lisa Garcia",
      email: "lisa@example.com",
      phone: "+62 817-8901-2345",
    },
    product: {
      name: "Gaming Headset",
      category: "Gaming Accessories",
      price: 1200000,
    },
    quantity: 3,
    total: 3600000,
    status: "processing",
    paymentMethod: "E-Wallet",
    orderDate: "2024-01-13",
    completedDate: null,
    shippingAddress: "Jl. Kebayoran Baru No. 987, Jakarta",
  },
];

const statusConfig = {
  completed: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
    label: "Selesai",
  },
  pending: {
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    label: "Menunggu",
  },
  processing: {
    icon: AlertCircle,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    label: "Diproses",
  },
  shipped: {
    icon: Truck,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    label: "Dikirim",
  },
  cancelled: {
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
    label: "Dibatalkan",
  },
};

export default function TransaksiPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState<typeof transactions[0] | null>(null);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getTotalRevenue = () => {
    return transactions
      .filter(t => t.status === "completed")
      .reduce((sum, t) => sum + t.total, 0);
  };

  const getTotalOrders = () => {
    return transactions.length;
  };

  const getCompletedOrders = () => {
    return transactions.filter(t => t.status === "completed").length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Transaksi</h1>
        <p className="text-gray-600">Kelola dan pantau semua transaksi pelanggan</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-6"
        >
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">{formatPrice(getTotalRevenue())}</p>
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
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{getTotalOrders()}</p>
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
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-green-500">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{getCompletedOrders()}</p>
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
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">
                {transactions.filter(t => t.status === "pending").length}
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
            placeholder="Cari transaksi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="all">Semua Status</option>
          <option value="pending">Menunggu</option>
          <option value="processing">Diproses</option>
          <option value="shipped">Dikirim</option>
          <option value="completed">Selesai</option>
          <option value="cancelled">Dibatalkan</option>
        </select>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <Filter className="h-5 w-5" />
          <span>Filter</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all duration-200">
          <Download className="h-5 w-5" />
          <span>Export</span>
        </button>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Transaksi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pelanggan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction, index) => {
                const status = statusConfig[transaction.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;
                
                return (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{transaction.id}</div>
                      <div className="text-sm text-gray-500">{transaction.paymentMethod}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{transaction.customer.name}</div>
                          <div className="text-sm text-gray-500">{transaction.customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{transaction.product.name}</div>
                      <div className="text-sm text-gray-500">
                        {transaction.quantity}x • {transaction.product.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatPrice(transaction.total)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.orderDate}</div>
                      {transaction.completedDate && (
                        <div className="text-sm text-gray-500">Selesai: {transaction.completedDate}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedTransaction(transaction)}
                          className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {transaction.status === "pending" && (
                          <button className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors duration-200">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        {transaction.status === "processing" && (
                          <button className="text-emerald-600 hover:text-emerald-900 p-2 hover:bg-emerald-50 rounded-lg transition-colors duration-200">
                            <Truck className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop-strong"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Detail Transaksi</h2>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Transaction Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Transaksi</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">ID Transaksi:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedTransaction.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tanggal Order:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedTransaction.orderDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Metode Pembayaran:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedTransaction.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total:</span>
                      <span className="text-sm font-bold text-gray-900">{formatPrice(selectedTransaction.total)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Pelanggan</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Nama:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedTransaction.customer.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedTransaction.customer.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Telepon:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedTransaction.customer.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Produk</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{selectedTransaction.product.name}</h4>
                      <p className="text-sm text-gray-600">{selectedTransaction.product.category}</p>
                      <p className="text-sm text-gray-600">Jumlah: {selectedTransaction.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatPrice(selectedTransaction.product.price)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Alamat Pengiriman</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-900">{selectedTransaction.shippingAddress}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
