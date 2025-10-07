"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Newspaper,
  Menu,
  X,
  LogOut,
  User,
  Gamepad2,
  ChevronDown,
  Tag,
  Coins,
  Icon,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    name: "Produk",
    icon: Tag,
    submenu: [
      { name: "Produk", href: "/admin/produk", icon: Package },
      { name: "Kategori Produk", href: "/admin/kategori-produk", icon: Tag },
      { name: "Migrasi Produk", href: "/admin/migrasi-produk", icon: Package },
    ]
  },
  // { name: "Kategori Produk", href: "/admin/kategori-produk", icon: Tag },
  // { name: "Produk", href: "/admin/produk", icon: Package },
  { name: "Transaksi", href: "/admin/transaksi", icon: ShoppingCart },
  { name: "Deposit", href: "/admin/deposit", icon: Coins },
  { 
    name: "News", 
    href: "/admin/news", 
    icon: Newspaper,
    submenu: [
      { name: "Kategori", href: "/admin/news/kategori", icon: Tag },
      { name: "Tags", href: "/admin/news/tags", icon: Tag },
      { name: "News", href: "/admin/news", icon: Newspaper },
    ]
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedSidebarState = localStorage.getItem('admin-sidebar-collapsed');
    if (savedSidebarState !== null) {
      setSidebarCollapsed(JSON.parse(savedSidebarState));
    }
  }, []);

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('admin-sidebar-collapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (userMenuOpen) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  // Show loading while session is being fetched
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need to be logged in to access this page.</p>
          <a 
            href="/auth/login" 
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: sidebarCollapsed ? "4rem" : "16rem",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden lg:block fixed inset-y-0 left-0 z-30 bg-gradient-to-b from-emerald-900 to-green-800 shadow-xl"
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-emerald-700">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-green-500">
                <Gamepad2 className="h-5 w-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-lg font-bold text-white">Gaming Store</h1>
                  <p className="text-xs text-gray-400">Admin Panel</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-6">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.submenu && item.submenu.some(sub => pathname === sub.href));
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isSubmenuOpen = openSubmenu === item.name;
              
              return (
                <div key={item.name}>
                  {hasSubmenu ? (
                    <div>
                      <button
                        onClick={() => setOpenSubmenu(isSubmenuOpen ? null : item.name)}
                        className={`group relative flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg"
                            : "text-gray-300 hover:bg-emerald-700 hover:text-white"
                        }`}
                        title={sidebarCollapsed ? item.name : undefined}
                      >
                        <div className="flex items-center">
                          <item.icon
                            className={`h-5 w-5 ${
                              isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                            } ${sidebarCollapsed ? "mx-auto" : "mr-3"}`}
                          />
                          {!sidebarCollapsed && (
                            <span className="truncate">{item.name}</span>
                          )}
                        </div>
                        {!sidebarCollapsed && (
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              isSubmenuOpen ? "rotate-180" : ""
                            }`}
                          />
                        )}
                        
                        {/* Tooltip for collapsed sidebar */}
                        {sidebarCollapsed && (
                          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                            {item.name}
                          </div>
                        )}
                      </button>
                      
                      {/* Submenu */}
                      {!sidebarCollapsed && isSubmenuOpen && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.submenu.map((subItem) => {
                            const isSubActive = pathname === subItem.href;
                            return (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                  isSubActive
                                    ? "bg-emerald-600 text-white"
                                    : "text-gray-300 hover:bg-emerald-700 hover:text-white"
                                }`}
                              >
                                <subItem.icon
                                  className={`h-4 w-4 mr-3 ${
                                    isSubActive ? "text-white" : "text-gray-400"
                                  }`}
                                />
                                <span className="truncate">{subItem.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : item.href ? (
                    <Link
                      href={item.href}
                      className={`group relative flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg"
                          : "text-gray-300 hover:bg-emerald-700 hover:text-white"
                      }`}
                      title={sidebarCollapsed ? item.name : undefined}
                    >
                      <item.icon
                        className={`h-5 w-5 ${
                          isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                        } ${sidebarCollapsed ? "mx-auto" : "mr-3"}`}
                      />
                      {!sidebarCollapsed && (
                        <span className="truncate">{item.name}</span>
                      )}
                      
                      {/* Tooltip for collapsed sidebar */}
                      {sidebarCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                          {item.name}
                        </div>
                      )}
                    </Link>
                  ) : (
                    <div className="group relative flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-gray-300">
                      <item.icon
                        className={`h-5 w-5 text-gray-400 ${sidebarCollapsed ? "mx-auto" : "mr-3"}`}
                      />
                      {!sidebarCollapsed && (
                        <span className="truncate">{item.name}</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-emerald-700 p-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-green-500">
                <User className="h-5 w-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {session?.user?.email}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : "-100%",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-emerald-900 to-green-800 shadow-xl lg:hidden"
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-emerald-700">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-green-500">
                <Gamepad2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Gaming Store</h1>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            </div>
            <button
              title="Close Sidebar"
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.submenu && item.submenu.some(sub => pathname === sub.href));
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isSubmenuOpen = openSubmenu === item.name;
              
              return (
                <div key={item.name}>
                  {hasSubmenu ? (
                    <div>
                      <button
                        onClick={() => setOpenSubmenu(isSubmenuOpen ? null : item.name)}
                        className={`group flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg"
                            : "text-gray-300 hover:bg-emerald-700 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center">
                          <item.icon
                            className={`mr-3 h-5 w-5 ${
                              isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                            }`}
                          />
                          {item.name}
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            isSubmenuOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      
                      {/* Submenu */}
                      {isSubmenuOpen && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.submenu.map((subItem) => {
                            const isSubActive = pathname === subItem.href;
                            return (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                  isSubActive
                                    ? "bg-emerald-600 text-white"
                                    : "text-gray-300 hover:bg-emerald-700 hover:text-white"
                                }`}
                              >
                                <subItem.icon
                                  className={`mr-3 h-4 w-4 ${
                                    isSubActive ? "text-white" : "text-gray-400"
                                  }`}
                                />
                                {subItem.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : item.href ? (
                    <Link
                      href={item.href}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg"
                          : "text-gray-300 hover:bg-emerald-700 hover:text-white"
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 ${
                          isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                        }`}
                      />
                      {item.name}
                    </Link>
                  ) : (
                    <div className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-gray-300">
                      <item.icon className="mr-3 h-5 w-5 text-gray-400" />
                      {item.name}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-emerald-700 p-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-green-500">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {session?.user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div 
        className="transition-all duration-300 ease-in-out"
        style={{
          marginLeft: sidebarCollapsed ? "4rem" : "16rem",
        }}
      >
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <button
            title="Open Sidebar"
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Desktop sidebar toggle */}
          <button
            title="Toggle Sidebar"
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 hidden lg:block"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-green-500">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="hidden lg:block">{session?.user?.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
                    >
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
