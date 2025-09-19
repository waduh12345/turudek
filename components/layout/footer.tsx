"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mail, Facebook, Instagram, Music, Twitter, Youtube, MessageSquare, Gamepad2, Play, X } from "lucide-react";
import { useState } from "react";

const Footer = () => {
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  return (
    <footer className="bg-gray-50 py-12">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Kolom 1: Follow Kami */}
          <div className="space-y-6">
            <h4 className="sidebar-text text-lg font-bold text-black">Follow Kami</h4>
            
            {/* Social Media Icons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 bg-green-500 rounded flex items-center justify-center"
              >
                <Facebook size={16} className="text-white" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 bg-green-500 rounded flex items-center justify-center"
              >
                <Instagram size={16} className="text-white" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 bg-green-500 rounded flex items-center justify-center"
              >
                <Music size={16} className="text-white" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 bg-green-500 rounded flex items-center justify-center"
              >
                <Youtube size={16} className="text-white" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 bg-green-500 rounded flex items-center justify-center"
              >
                <Twitter size={16} className="text-white" />
              </motion.button>
            </div>

            {/* Logo Tokogame */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
              </div>
              <span className="sidebar-text text-xl font-bold text-green-500">TOKOGAME.COM</span>
            </div>

            {/* Copyright */}
            <p className="sidebar-text text-sm text-gray-500">
              Copyright © 2025 Tokogame All Rights Reserved
            </p>
          </div>

          {/* Kolom 2: Region & Site Map */}
          <div className="space-y-6">
            {/* Region */}
            <div>
              <h4 className="sidebar-text text-lg font-bold text-black mb-3">Region</h4>
              <div className="flex items-center gap-2">
                <div className="w-5 h-4 bg-red-500 rounded-sm flex items-center justify-center">
                  <div className="w-4 h-1 bg-white rounded-sm"></div>
                </div>
                <span className="sidebar-text text-gray-600">Indonesia (Rp)</span>
              </div>
            </div>

            {/* Site Map */}
            <div>
              <h4 className="sidebar-text text-lg font-bold text-black mb-3">Site Map</h4>
              <div className="space-y-2">
                <a href="#" className="sidebar-text block text-gray-600 hover:text-green-500 transition-colors">
                  News & Promos
                </a>
                <a href="#" className="sidebar-text block text-gray-600 hover:text-green-500 transition-colors">
                  Search Games
                </a>
                <a href="#" className="sidebar-text block text-gray-600 hover:text-green-500 transition-colors">
                  Terms
                </a>
              </div>
            </div>
          </div>

          {/* Kolom 3: Kontak Kami */}
          <div className="space-y-6">
            <h4 className="sidebar-text text-lg font-bold text-black">Kontak Kami</h4>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-green-500" />
                <span className="sidebar-text text-gray-600">cs@tokogame.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-green-500" />
                <span className="sidebar-text text-gray-600">partnerships@tokogame.com</span>
              </div>
            </div>

            {/* Google Play Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-black text-white px-4 py-3 rounded-lg flex items-center gap-3 hover:bg-gray-800 transition-colors"
            >
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <div className="w-0 h-0 border-l-[6px] border-l-green-500 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent"></div>
              </div>
              <div className="flex flex-col items-start">
                <span className="sidebar-text text-xs font-medium">GET IT ON</span>
                <span className="sidebar-text text-sm font-bold">Google Play</span>
              </div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsChatModalOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-50"
        aria-label="Chat Support"
      >
        <MessageSquare size={24} className="text-white" />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isChatModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 z-50"
              onClick={() => setIsChatModalOpen(false)}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-black px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border border-green-400">
                  <Gamepad2 size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Tokogame Customer Care</h3>
                  <p className="text-gray-300 text-xs">Bot</p>
                </div>
                <button
                  onClick={() => setIsChatModalOpen(false)}
                  className="ml-auto p-1 hover:bg-gray-800 rounded transition-colors"
                  aria-label="Close chat"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Start a conversation */}
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">Start a conversation</h4>
                  <p className="text-gray-500 text-xs mb-3">Expect a reply within a few minutes</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-green-500 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
                  >
                    <span className="font-medium text-sm">Start Chat</span>
                    <Play size={14} className="text-white" />
                  </motion.button>
                </div>

                {/* Chat on your favorite channel */}
                <div>
                  <h4 className="font-medium text-gray-800 text-sm mb-3">Chat on your favorite channel</h4>
                  <div className="space-y-2">
                    {/* WhatsApp */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">W</span>
                      </div>
                      <span className="text-gray-700 text-sm">WhatsApp</span>
                    </motion.button>

                    {/* Instagram */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Instagram size={16} className="text-white" />
                      </div>
                      <span className="text-gray-700 text-sm">Instagram</span>
                    </motion.button>

                    {/* Facebook Messenger */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <MessageSquare size={16} className="text-white" />
                      </div>
                      <span className="text-gray-700 text-sm">Facebook Messenger</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
