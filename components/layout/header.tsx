"use client";

import clsx from "clsx";
import { Share2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import SideNav from "./side-nav";

interface DefaultHeaderProps {
  showNavigationBars?: boolean;
}

const DefaultHeader = ({ showNavigationBars = false }: DefaultHeaderProps) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Top Up Game Termurah 🚀",
          text: "Cek sekarang top up game favoritmu di sini!",
          url: window.location.href,
        });
      } catch (err) {
        console.error("Gagal share:", err);
      }
    } else {
      alert("Browser kamu tidak mendukung Web Share API.");
    }
  };

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-40",
        "bg-background shadow-sm",
        "flex flex-col"
      )}
    > 
      {/* Main Header */}
      <div className="h-16 flex items-center">
        <div className="container flex items-center justify-between">
          {/* Left Section - Logo & Tagline */}
          <section className="flex items-center gap-x-2 sm:gap-x-3.5">
            <SideNav />
            <Link
              href="/"
              className="flex items-center gap-1 sm:gap-2 font-mono"
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-green-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-green-500 tracking-wide underline">
                TOKOGAME
              </span>
            </Link>

            <p className="font-mono text-xs sm:text-sm italic hidden xl:block text-gray-600">
              Top Up Games & Voucher Murah, Aman, Cepat
            </p>
          </section>

          {/* Right Section - Actions */}
          <section className="flex items-center gap-x-2 sm:gap-x-4">
            {/* Google Sign In Button */}
            <button
              className={clsx(
                "bg-white text-gray-700 border border-gray-300",
                "px-2 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1 sm:gap-2",
                "rounded-lg hover:bg-gray-50 transition-colors",
                "text-xs sm:text-sm"
              )}
            >
              <Image
                src="/images/google-logo.png"
                width={14}
                height={14}
                alt="google logo"
                className="sm:w-4 sm:h-4"
              />
              <span className="hidden sm:inline">Sign in with Google</span>
              <span className="sm:hidden">Sign in</span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              aria-label="Share"
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Share2Icon size={18} className="sm:w-5 sm:h-5" />
            </button>
          </section>
        </div>
      </div>
      {/* Navigation Bars - Conditional Rendering */}
      {showNavigationBars && <NavigationBars />}
    </header>
  );
};

// Navigation Bars Component
const NavigationBars = () => {
  const gameCategories = [
    "Mobile Legends",
    "Free Fire", 
    "HD Island",
    "PUBG",
    "Genshin Impact",
    "Valorant",
    "Ragnarok",
    "League of Legends"
  ];

  const contentCategories = [
    "Tutorials & Guides",
    "News & Updates", 
    "E-Sports",
    "Promo & Discount"
  ];

  return (
    <div className="relative z-40">
      {/* Top Navigation Bar - Game Categories */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-gradient-to-r from-green-500 to-green-600 py-4 px-6 shadow-lg"
        style={{
          clipPath: "polygon(2% 0%, 98% 0%, 100% 100%, 0% 100%)"
        }}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-center space-x-8 overflow-x-auto scrollbar-hide">
            {gameCategories.map((game, index) => (
              <motion.button
                key={game}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  textShadow: "0 0 8px rgba(255,255,255,0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                className="text-white font-bold text-sm sm:text-base whitespace-nowrap hover:text-green-100 transition-all duration-300 px-3 py-1 rounded-lg hover:bg-white/10"
              >
                {game}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bottom Navigation Bar - Content Categories */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="bg-gradient-to-r from-gray-900 to-black py-4 px-6 shadow-xl"
        style={{
          clipPath: "polygon(2% 0%, 98% 0%, 100% 100%, 0% 100%)"
        }}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-center space-x-8 overflow-x-auto scrollbar-hide">
            {contentCategories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  textShadow: "0 0 8px rgba(255,255,255,0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                className="text-white font-bold text-sm sm:text-base whitespace-nowrap hover:text-green-400 transition-all duration-300 px-3 py-1 rounded-lg hover:bg-white/10"
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DefaultHeader;
