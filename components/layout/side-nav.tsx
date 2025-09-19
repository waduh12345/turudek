"use client";

import * as SheetPrimitive from "@radix-ui/react-dialog";
import {
  TextAlignJustifyIcon,
  X,
  Search,
  Newspaper,
  AlertCircle,
  Ticket,
  Mail,
  Instagram,
  Music,
  Twitter,
  Youtube,
} from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const SideNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <SheetPrimitive.Root data-slot="sheet" open={isOpen} onOpenChange={setIsOpen}>
      <SheetPrimitive.Trigger data-slot="sheet-trigger">
        <TextAlignJustifyIcon size={22} strokeWidth={2.5} />
      </SheetPrimitive.Trigger>
      <SheetPrimitive.Portal data-slot="sheet-portal">
        <AnimatePresence>
          {isOpen && (
            <SheetPrimitive.Overlay
              data-slot="sheet-overlay"
              className={clsx(
                "fixed inset-0 z-50 bg-black/50"
              )}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full h-full"
              />
            </SheetPrimitive.Overlay>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isOpen && (
            <SheetPrimitive.Content
              data-slot="sheet-content"
              className={clsx(
                "bg-white fixed z-50 flex flex-col w-80 h-full shadow-lg left-0 top-0"
              )}
            >
              <SheetPrimitive.Title className="sr-only">
                Navigation Menu
              </SheetPrimitive.Title>
              <motion.div
                initial={{ x: -320, opacity: 0, scale: 0.95 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: -320, opacity: 0, scale: 0.95 }}
                transition={{ 
                  duration: 0.4, 
                  ease: [0.25, 0.46, 0.45, 0.94],
                  scale: { duration: 0.3 }
                }}
                className="flex flex-col h-full p-6 font-mono tracking-wide italic"
              >
            {/* Close Button */}
            <motion.div 
              className="flex justify-end mb-1"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.05, duration: 0.3 }}
            >
              <SheetPrimitive.Close asChild>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Close sidebar"
                >
                  <motion.div
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <X size={18} className="text-black" />
                  </motion.div>
                </motion.button>
              </SheetPrimitive.Close>
            </motion.div>

            {/* Navigation Links */}
            <div className="space-y-3 mb-8">
              <motion.a
                href="/produk"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                whileHover={{ x: 3, scale: 1.02 }}
                className="flex items-center gap-3 w-full text-left py-2 hover:bg-gray-50 transition-colors rounded-lg"
              >
                <motion.div 
                  className="w-5 h-5 bg-green-500 rounded flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Search size={14} className="text-white" />
                </motion.div>
                <span className="sidebar-text font-medium text-black text-sm">
                  Cari Game
                </span>
              </motion.a>

              <motion.a
                href="/news"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                whileHover={{ x: 3, scale: 1.02 }}
                className="flex items-center gap-3 w-full text-left py-2 hover:bg-gray-50 transition-colors rounded-lg"
              >
                <motion.div 
                  className="w-5 h-5 bg-green-500 rounded flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Newspaper size={14} className="text-white" />
                </motion.div>
                <span className="sidebar-text font-medium text-black text-sm">
                  Berita dan Promo
                </span>
              </motion.a>

              <motion.a
                href="/syarat-ketentuan"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                whileHover={{ x: 3, scale: 1.02 }}
                className="flex items-center gap-3 w-full text-left py-2 hover:bg-gray-50 transition-colors rounded-lg"
              >
                <motion.div 
                  className="w-5 h-5 bg-green-500 rounded flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <AlertCircle size={14} className="text-white" />
                </motion.div>
                <span className="sidebar-text font-medium text-black text-sm">
                  Syarat & Ketentuan
                </span>
              </motion.a>

              <motion.a
                href="/riwayat"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.3 }}
                whileHover={{ x: 3, scale: 1.02 }}
                className="flex items-center gap-3 w-full text-left py-2 hover:bg-gray-50 transition-colors rounded-lg"
              >
                <motion.div 
                  className="w-5 h-5 bg-green-500 rounded flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Ticket size={14} className="text-white" />
                </motion.div>
                <span className="sidebar-text font-medium text-black text-sm">
                  Riwayat Order
                </span>
              </motion.a>
            </div>

            {/* Help & Support */}
            <motion.div 
              className="mb-6"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <h3 className="sidebar-text text-xs font-bold text-black mb-3 tracking-widest uppercase">
                HELP & SUPPORT
              </h3>
              <div className="flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
                  <Mail size={16} className="text-green-500" />
                </motion.div>
                <span className="sidebar-text text-black text-sm">
                  cs@tokogame.com
                </span>
              </div>
            </motion.div>

            {/* Partnerships */}
            <motion.div 
              className="mb-6"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.3 }}
            >
              <h3 className="sidebar-text text-xs font-bold text-black mb-3 tracking-widest uppercase">
                PARTNERSHIPS
              </h3>
              <div className="flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
                  <Mail size={16} className="text-green-500" />
                </motion.div>
                <span className="sidebar-text text-black text-sm">
                  partnerships@tokogame.com
                </span>
              </div>
            </motion.div>

            {/* Social Media */}
            <motion.div 
              className="mb-6"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <h3 className="sidebar-text text-xs font-bold text-black mb-3 tracking-widest uppercase">
                SOCIAL MEDIA
              </h3>
              <div className="flex gap-3">
                <motion.button
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, duration: 0.3, type: "spring" }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-7 h-7 bg-green-500 rounded flex items-center justify-center"
                >
                  <span className="text-white font-bold text-xs">f</span>
                </motion.button>
                <motion.button
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.55, duration: 0.3, type: "spring" }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-7 h-7 bg-green-500 rounded flex items-center justify-center"
                >
                  <Instagram size={14} className="text-white" />
                </motion.button>
                <motion.button
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.6, duration: 0.3, type: "spring" }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-7 h-7 bg-green-500 rounded flex items-center justify-center"
                >
                  <Music size={14} className="text-white" />
                </motion.button>
                <motion.button
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.65, duration: 0.3, type: "spring" }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-7 h-7 bg-green-500 rounded flex items-center justify-center"
                >
                  <Twitter size={14} className="text-white" />
                </motion.button>
                <motion.button
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.7, duration: 0.3, type: "spring" }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-7 h-7 bg-green-500 rounded flex items-center justify-center"
                >
                  <Youtube size={14} className="text-white" />
                </motion.button>
              </div>
            </motion.div>

            {/* Download Android App */}
            <motion.div 
              className="mb-6"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.3 }}
            >
              <h3 className="sidebar-text text-xs font-bold text-black mb-3 tracking-widest uppercase">
                DOWNLOAD ANDROID APP
              </h3>
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="bg-black text-white px-3 py-2 rounded flex items-center gap-2 w-full shadow-lg"
              >
                <motion.div 
                  className="w-5 h-5 bg-white rounded flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-0 h-0 border-l-[4px] border-l-green-500 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent"></div>
                </motion.div>
                <div className="flex flex-col items-start">
                  <span className="sidebar-text text-xs font-medium">
                    GET IT ON
                  </span>
                  <span className="sidebar-text text-xs font-bold">
                    Google Play
                  </span>
                </div>
              </motion.button>
            </motion.div>

            {/* Region */}
            <motion.div 
              className="mt-auto"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <h3 className="sidebar-text text-xs font-bold text-black mb-3 tracking-widest uppercase">
                REGION
              </h3>
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-4 h-3 bg-red-500 rounded-sm flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <div className="w-3 h-1 bg-white rounded-sm"></div>
                </motion.div>
                <span className="sidebar-text text-black text-sm">
                  Indonesia (Rp)
                </span>
              </div>
            </motion.div>
              </motion.div>
            </SheetPrimitive.Content>
          )}
        </AnimatePresence>
      </SheetPrimitive.Portal>
    </SheetPrimitive.Root>
  );
};

export default SideNav;
