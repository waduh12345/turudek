"use client";

import { motion } from "framer-motion";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Gamepad2,
  Star,
  Eye,
} from "lucide-react";

// Dummy data
const stats = [
  {
    name: "Total Revenue",
    value: "Rp 45,231,000",
    change: "+12.5%",
    changeType: "positive",
    icon: DollarSign,
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Total Orders",
    value: "1,234",
    change: "+8.2%",
    changeType: "positive",
    icon: ShoppingCart,
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Total Products",
    value: "89",
    change: "+3.1%",
    changeType: "positive",
    icon: Package,
    color: "from-emerald-500 to-green-500",
  },
  {
    name: "Active Users",
    value: "2,456",
    change: "-2.4%",
    changeType: "negative",
    icon: Users,
    color: "from-orange-500 to-red-500",
  },
];

const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    product: "PlayStation 5",
    amount: "Rp 7,500,000",
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    product: "Xbox Series X",
    amount: "Rp 6,200,000",
    status: "pending",
    date: "2024-01-15",
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    product: "Nintendo Switch",
    amount: "Rp 3,800,000",
    status: "shipped",
    date: "2024-01-14",
  },
  {
    id: "ORD-004",
    customer: "Sarah Wilson",
    product: "Gaming PC",
    amount: "Rp 15,000,000",
    status: "completed",
    date: "2024-01-14",
  },
  {
    id: "ORD-005",
    customer: "David Brown",
    product: "Steam Deck",
    amount: "Rp 4,500,000",
    status: "processing",
    date: "2024-01-13",
  },
];

const topProducts = [
  {
    name: "PlayStation 5",
    sales: 45,
    revenue: "Rp 337,500,000",
    image: "/images/ps5.jpg",
  },
  {
    name: "Xbox Series X",
    sales: 32,
    revenue: "Rp 198,400,000",
    image: "/images/xbox.jpg",
  },
  {
    name: "Nintendo Switch",
    sales: 28,
    revenue: "Rp 106,400,000",
    image: "/images/switch.jpg",
  },
  {
    name: "Gaming PC",
    sales: 15,
    revenue: "Rp 225,000,000",
    image: "/images/pc.jpg",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "processing":
      return "bg-emerald-100 text-emerald-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your gaming store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200"
          >
            <div className="flex items-center">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {stat.changeType === "positive" ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`ml-2 text-sm font-medium ${
                  stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.change}
              </span>
              <span className="ml-1 text-sm text-gray-500">from last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <button className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-green-500">
                    <Gamepad2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.product}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{order.amount}</p>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <span className="text-xs text-gray-500">{order.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
            <button className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{product.revenue}</p>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-500">4.8</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 p-6 text-white"
      >
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button className="flex items-center space-x-3 rounded-lg bg-white/20 p-4 hover:bg-white/30 transition-colors duration-200">
            <Package className="h-5 w-5" />
            <span className="text-sm font-medium">Add Product</span>
          </button>
          <button className="flex items-center space-x-3 rounded-lg bg-white/20 p-4 hover:bg-white/30 transition-colors duration-200">
            <ShoppingCart className="h-5 w-5" />
            <span className="text-sm font-medium">View Orders</span>
          </button>
          <button className="flex items-center space-x-3 rounded-lg bg-white/20 p-4 hover:bg-white/30 transition-colors duration-200">
            <DollarSign className="h-5 w-5" />
            <span className="text-sm font-medium">Manage Pricing</span>
          </button>
          <button className="flex items-center space-x-3 rounded-lg bg-white/20 p-4 hover:bg-white/30 transition-colors duration-200">
            <Eye className="h-5 w-5" />
            <span className="text-sm font-medium">View Analytics</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
