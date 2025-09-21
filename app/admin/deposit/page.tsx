"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Coins,
  User,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  X,
  Save,
  Download,
  Eye,
  DollarSign,
} from "lucide-react";

// Dummy data
const deposits = [
  {
    id: "DEP-001",
    customer: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+62 812-3456-7890",
    },
    amount: 1000000,
    method: "Bank Transfer",
    status: "completed",
    transactionId: "TXN-123456789",
    depositDate: "2024-01-15",
    processedDate: "2024-01-15",
    notes: "Deposit untuk pembelian PS5",
  },
  {
    id: "DEP-002",
    customer: {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+62 813-4567-8901",
    },
    amount: 500000,
    method: "E-Wallet",
    status: "pending",
    transactionId: "TXN-987654321",
    depositDate: "2024-01-15",
    processedDate: null,
    notes: "Deposit via OVO",
  },
  {
    id: "DEP-003",
    customer: {
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+62 814-5678-9012",
    },
    amount: 2000000,
    method: "Credit Card",
    status: "processing",
    transactionId: "TXN-456789123",
    depositDate: "2024-01-14",
    processedDate: null,
    notes: "Deposit untuk pembelian gaming PC",
  },
  {
    id: "DEP-004",
    customer: {
      name: "Sarah Wilson",
      email: "sarah@example.com",
      phone: "+62 815-6789-0123",
    },
    amount: 750000,
    method: "Bank Transfer",
    status: "completed",
    transactionId: "TXN-789123456",
    depositDate: "2024-01-14",
    processedDate: "2024-01-14",
    notes: "Deposit untuk pembelian Nintendo Switch",
  },
  {
    id: "DEP-005",
    customer: {
      name: "David Brown",
      email: "david@example.com",
      phone: "+62 816-7890-1234",
    },
    amount: 1500000,
    method: "E-Wallet",
    status: "cancelled",
    transactionId: "TXN-321654987",
    depositDate: "2024-01-13",
    processedDate: null,
    notes: "Deposit dibatalkan oleh customer",
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
  cancelled: {
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
    label: "Dibatalkan",
  },
};

export default function DepositPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingDeposit, setEditingDeposit] = useState<typeof deposits[0] | null>(null);
  const [selectedDeposit, setSelectedDeposit] = useState<typeof deposits[0] | null>(null);
  const [formData, setFormData] = useState({
    customerEmail: "",
    amount: "",
    method: "",
    notes: "",
  });

  const filteredDeposits = deposits.filter((deposit) => {
    const matchesSearch = 
      deposit.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || deposit.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getTotalDeposits = () => {
    return deposits
      .filter(d => d.status === "completed")
      .reduce((sum, d) => sum + d.amount, 0);
  };

  const getPendingDeposits = () => {
    return deposits
      .filter(d => d.status === "pending")
      .reduce((sum, d) => sum + d.amount, 0);
  };

  const getTotalCount = () => {
    return deposits.length;
  };

  const getCompletedCount = () => {
    return deposits.filter(d => d.status === "completed").length;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    setShowForm(false);
    setEditingDeposit(null);
    setFormData({ customerEmail: "", amount: "", method: "", notes: "" });
  };

  const handleEdit = (deposit: typeof deposits[0]) => {
    setEditingDeposit(deposit);
    setFormData({
      customerEmail: deposit.customer.email,
      amount: deposit.amount.toString(),
      method: deposit.method,
      notes: deposit.notes,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this deposit?")) {
      // Handle delete here
      console.log("Delete deposit:", id);
    }
  };

  const resetForm = () => {
    setFormData({ customerEmail: "", amount: "", method: "", notes: "" });
    setEditingDeposit(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deposit</h1>
          <p className="text-gray-600">Kelola deposit dan saldo pelanggan</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Tambah Deposit</span>
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
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Deposit</p>
              <p className="text-2xl font-semibold text-gray-900">{formatPrice(getTotalDeposits())}</p>
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
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Deposit</p>
              <p className="text-2xl font-semibold text-gray-900">{formatPrice(getPendingDeposits())}</p>
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
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
              <Coins className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Transaksi</p>
              <p className="text-2xl font-semibold text-gray-900">{getTotalCount()}</p>
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
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Berhasil</p>
              <p className="text-2xl font-semibold text-gray-900">{getCompletedCount()}</p>
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
            placeholder="Cari deposit..."
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

      {/* Deposits Table */}
      <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Deposit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pelanggan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metode
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
              {filteredDeposits.map((deposit, index) => {
                const status = statusConfig[deposit.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;
                
                return (
                  <motion.tr
                    key={deposit.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{deposit.id}</div>
                      <div className="text-sm text-gray-500">{deposit.transactionId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{deposit.customer.name}</div>
                          <div className="text-sm text-gray-500">{deposit.customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatPrice(deposit.amount)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{deposit.method}</span>
                      </div>
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
                      <div className="text-sm text-gray-900">{deposit.depositDate}</div>
                      {deposit.processedDate && (
                        <div className="text-sm text-gray-500">Diproses: {deposit.processedDate}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => setSelectedDeposit(deposit)}
                        className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                        <button
                          onClick={() => handleEdit(deposit)}
                          className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(deposit.id)}
                          className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingDeposit ? "Edit Deposit" : "Tambah Deposit"}
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
                    Email Pelanggan
                  </label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Masukkan email pelanggan"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jumlah Deposit
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Masukkan jumlah deposit"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Metode Pembayaran
                  </label>
                  <select
                    value={formData.method}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  >
                    <option value="">Pilih metode</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="E-Wallet">E-Wallet</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Masukkan catatan (opsional)"
                    rows={3}
                  />
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
                    <span>{editingDeposit ? "Update" : "Simpan"}</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deposit Detail Modal */}
      <AnimatePresence>
        {selectedDeposit && (
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
                <h2 className="text-xl font-semibold text-gray-900">Detail Deposit</h2>
                <button
                  onClick={() => setSelectedDeposit(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Deposit Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Deposit</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">ID Deposit:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedDeposit.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Jumlah:</span>
                        <span className="text-sm font-bold text-gray-900">{formatPrice(selectedDeposit.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Metode:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedDeposit.method}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            selectedDeposit.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : selectedDeposit.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : selectedDeposit.status === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedDeposit.status === "completed" ? "Selesai" : 
                           selectedDeposit.status === "pending" ? "Menunggu" :
                           selectedDeposit.status === "processing" ? "Diproses" : "Dibatalkan"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Tanggal Deposit:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedDeposit.depositDate}</span>
                      </div>
                      {selectedDeposit.processedDate && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Tanggal Diproses:</span>
                          <span className="text-sm font-medium text-gray-900">{selectedDeposit.processedDate}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Pelanggan</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Nama:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedDeposit.customer.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedDeposit.customer.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Telepon:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedDeposit.customer.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedDeposit.notes && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Catatan</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-900">{selectedDeposit.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
