"use client";

import { signIn, useSession } from "next-auth/react";
import clsx from "clsx";
import { Share2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import SideNav from "./side-nav";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

interface DefaultHeaderProps {
  showNavigationBars?: boolean;
}

const DefaultHeader = ({ showNavigationBars = false }: DefaultHeaderProps) => {
  const { data: session } = useSession();

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
      <div className="h-24 flex items-center">
        <div className="container flex items-center justify-between">
          {/* Left Section - Logo & Tagline */}
          <section className="flex items-center gap-x-2 sm:gap-x-3.5">
            <SideNav />
            <Link
              href="/"
              className="flex items-center gap-1 sm:gap-2 font-mono"
            >
              <Image
                src="/images/kios-tetta.png"
                alt="Kios Tetta Logo"
                width={60}
                height={60}
                className="w-24 h-24 sm:w-24 sm:h-24 mt-2 pb-2"
              />
            </Link>

            <p className="font-mono text-xs sm:text-lg italic hidden xl:block text-gray-600">
              Top Up Games & Voucher Murah, Aman, Cepat
            </p>
          </section>

          {/* Right Section - Actions */}
          <section className="flex items-center gap-x-2 sm:gap-x-4">
            {/* Google Sign In Button */}
            {session?.user?.email ? (
              <Link href="/profile">
                <Avatar>
                  <AvatarImage
                    className="size-8 rounded-full"
                    src={session.user.image || ""}
                  />
                  <AvatarFallback className="bg-accent flex justify-center items-center size-8 rounded-full text-background">
                    <span>
                      {session.user
                        ? session.user.name?.at(0)?.toUpperCase()
                        : "?"}
                    </span>
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <button
                onClick={() => {
                  signIn("google");
                }}
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
            )}

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
    { name: "Mobile Legends", slug: "mobile-legends" },
    { name: "Free Fire", slug: "free-fire" },
    { name: "HD Island", slug: "hd-island" },
    { name: "PUBG", slug: "pubg" },
    { name: "Genshin Impact", slug: "genshin-impact" },
    { name: "Valorant", slug: "valorant" },
    { name: "Ragnarok", slug: "ragnarok" },
    { name: "League of Legends", slug: "league-of-legends" },
  ];

  const contentCategories = [
    { name: "Tutorials & Guides", slug: "tutorials-guides" },
    { name: "News & Updates", slug: "news-updates" },
    { name: "E-Sports", slug: "esports" },
    { name: "Promo & Discount", slug: "promo-discount" },
  ];

  return (
    <div className="relative z-40">
      {/* Top Navigation Bar - Game Categories */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-gradient-to-r from-green-500 to-green-600 py-3 sm:py-4 px-4 sm:px-6 shadow-lg"
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-start sm:justify-center space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-8 overflow-x-auto scrollbar-hide pb-1">
            {gameCategories.map((game, index) => (
              <Link key={game.slug} href={`/tags/${game.slug}`}>
                <motion.button
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  whileHover={{
                    scale: 1.05,
                    y: -2,
                    textShadow: "0 0 8px rgba(255,255,255,0.5)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="text-white font-bold text-xs sm:text-sm md:text-base whitespace-nowrap hover:text-green-100 transition-all duration-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-white/10 flex-shrink-0 min-w-fit"
                >
                  {game.name}
                </motion.button>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bottom Navigation Bar - Content Categories */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="bg-gradient-to-r from-gray-900 to-black py-3 sm:py-4 px-4 sm:px-6 shadow-xl"
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-start sm:justify-center space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-8 overflow-x-auto scrollbar-hide pb-1">
            {contentCategories.map((category, index) => (
              <Link key={category.slug} href={`/tags/${category.slug}`}>
                <motion.button
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                  whileHover={{
                    scale: 1.05,
                    y: -2,
                    textShadow: "0 0 8px rgba(255,255,255,0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="text-white font-bold text-xs sm:text-sm md:text-base whitespace-nowrap hover:text-green-400 transition-all duration-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-white/10 flex-shrink-0 min-w-fit"
                >
                  {category.name}
                </motion.button>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DefaultHeader;
