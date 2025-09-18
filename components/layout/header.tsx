import clsx from "clsx";
import { Share2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SideNav from "./side-nav";

const DefaultHeader = () => {
  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-40",
        "bg-background shadow h-16",
        "flex items-center"
      )}
    >
      <div className="container flex items-center justify-between">
        <section className="flex items-center gap-x-4">
          <SideNav />
          <Link href="/">
            <Image
              src="/images/app-logo.webp"
              width={164}
              height={25}
              alt="App Logo"
            />
          </Link>

          <p className="font-mono text-lg italic hidden lg:block">
            Top Up Games & Voucher Murah, Aman, Cepat
          </p>
        </section>

        <section className="flex justify-end gap-x-4">
          <button
            className={clsx(
              "bg-foreground text-background",
              "p-0.5 flex items-center",
              "rounded-md"
            )}
          >
            <div className="p-1.5 bg-white rounded-l-sm">
              <Image
                src="/images/google-logo.png"
                width={20}
                height={20}
                alt="goolge logo"
              />
            </div>

            <span className="inline-block px-3">Login dengan google</span>
          </button>

          <button>
            <Share2Icon size={25} />
          </button>
        </section>
      </div>
    </header>
  );
};

export default DefaultHeader;
