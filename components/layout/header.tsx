import clsx from "clsx";
import { Share2Icon, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SideNav from "./side-nav";

const DefaultHeader = () => {
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
          <section className="flex items-center gap-x-2 sm:gap-x-4">
            <SideNav />
            <Link href="/" className="flex items-center gap-1 sm:gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">T</span>
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-green-500">TOKOGAME</span>
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
              aria-label="Share" 
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Share2Icon size={18} className="sm:w-5 sm:h-5" />
            </button>
          </section>
        </div>
      </div>
    </header>
  );
};

export default DefaultHeader;
