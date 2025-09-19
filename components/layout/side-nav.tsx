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
  Youtube
} from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

const SideNav = () => {
  return (
    <SheetPrimitive.Root data-slot="sheet">
      <SheetPrimitive.Trigger data-slot="sheet-trigger">
        <TextAlignJustifyIcon size={22} strokeWidth={2.5} />
      </SheetPrimitive.Trigger>
      <SheetPrimitive.Portal data-slot="sheet-portal">
        <AnimatePresence>
          <SheetPrimitive.Overlay
            data-slot="sheet-overlay"
            className={clsx(
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50"
            )}
          />
        </AnimatePresence>
        <SheetPrimitive.Content
          data-slot="sheet-content"
          className={clsx(
            "bg-white data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col w-80 h-full shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 left-0 top-0"
          )}
        >
          <SheetPrimitive.Title className="sr-only">
            Navigation Menu
          </SheetPrimitive.Title>
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col h-full p-6"
          >
            {/* Close Button */}
            <div className="flex justify-end mb-6">
              <SheetPrimitive.Close asChild>
                <button className="p-1 hover:bg-gray-100 rounded transition-colors" aria-label="Close sidebar">
                  <X size={18} className="text-black" />
                </button>
              </SheetPrimitive.Close>
            </div>

            {/* Navigation Links */}
            <div className="space-y-4 mb-8">
              <motion.a
                href="/produk"
                whileHover={{ x: 3 }}
                className="flex items-center gap-3 w-full text-left py-2 hover:bg-gray-50 transition-colors"
              >
                <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                  <Search size={14} className="text-white" />
                </div>
                <span className="sidebar-text font-medium text-black text-sm">Cari Game</span>
              </motion.a>

              <motion.button
                whileHover={{ x: 3 }}
                className="flex items-center gap-3 w-full text-left py-2 hover:bg-gray-50 transition-colors"
              >
                <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                  <Newspaper size={14} className="text-white" />
                </div>
                <span className="sidebar-text font-medium text-black text-sm">Berita dan Promo</span>
              </motion.button>

              <motion.a
                href="/syarat-ketentuan"
                whileHover={{ x: 3 }}
                className="flex items-center gap-3 w-full text-left py-2 hover:bg-gray-50 transition-colors"
              >
                <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                  <AlertCircle size={14} className="text-white" />
                </div>
                <span className="sidebar-text font-medium text-black text-sm">Syarat & Ketentuan</span>
              </motion.a>

              <motion.a
                href="/riwayat"
                whileHover={{ x: 3 }}
                className="flex items-center gap-3 w-full text-left py-2 hover:bg-gray-50 transition-colors"
              >
                <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                  <Ticket size={14} className="text-white" />
                </div>
                <span className="sidebar-text font-medium text-black text-sm">Riwayat Order</span>
              </motion.a>
            </div>

            {/* Help & Support */}
            <div className="mb-6">
              <h3 className="sidebar-text text-xs font-bold text-black mb-3 tracking-widest uppercase">HELP & SUPPORT</h3>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-green-500" />
                <span className="sidebar-text text-black text-sm">cs@tokogame.com</span>
              </div>
            </div>

            {/* Partnerships */}
            <div className="mb-6">
              <h3 className="sidebar-text text-xs font-bold text-black mb-3 tracking-widest uppercase">PARTNERSHIPS</h3>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-green-500" />
                <span className="sidebar-text text-black text-sm">partnerships@tokogame.com</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="mb-6">
              <h3 className="sidebar-text text-xs font-bold text-black mb-3 tracking-widest uppercase">SOCIAL MEDIA</h3>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-7 h-7 bg-green-500 rounded flex items-center justify-center"
                >
                  <span className="text-white font-bold text-xs">f</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-7 h-7 bg-green-500 rounded flex items-center justify-center"
                >
                  <Instagram size={14} className="text-white" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-7 h-7 bg-green-500 rounded flex items-center justify-center"
                >
                  <Music size={14} className="text-white" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-7 h-7 bg-green-500 rounded flex items-center justify-center"
                >
                  <Twitter size={14} className="text-white" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-7 h-7 bg-green-500 rounded flex items-center justify-center"
                >
                  <Youtube size={14} className="text-white" />
                </motion.button>
              </div>
            </div>

            {/* Download Android App */}
            <div className="mb-6">
              <h3 className="sidebar-text text-xs font-bold text-black mb-3 tracking-widest uppercase">DOWNLOAD ANDROID APP</h3>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-black text-white px-3 py-2 rounded flex items-center gap-2 w-full"
              >
                <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[4px] border-l-green-500 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent"></div>
                </div>
                <div className="flex flex-col items-start">
                  <span className="sidebar-text text-xs font-medium">GET IT ON</span>
                  <span className="sidebar-text text-xs font-bold">Google Play</span>
                </div>
              </motion.button>
            </div>

            {/* Region */}
            <div className="mt-auto">
              <h3 className="sidebar-text text-xs font-bold text-black mb-3 tracking-widest uppercase">REGION</h3>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 bg-red-500 rounded-sm flex items-center justify-center">
                  <div className="w-3 h-1 bg-white rounded-sm"></div>
                </div>
                <span className="sidebar-text text-black text-sm">Indonesia (Rp)</span>
              </div>
            </div>
          </motion.div>
        </SheetPrimitive.Content>
      </SheetPrimitive.Portal>
    </SheetPrimitive.Root>
  );
};

export default SideNav;
