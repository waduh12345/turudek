"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import PopularGridExplore from "./popular-list-game";

type Item = {
  title: string;
  publisher: string;
  gradient: string;
  imgSrc: string;
};

const toSlug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const ITEMS: Item[] = [
  {
    title: "Mobile Legends",
    publisher: "Moonton",
    gradient: "from-[#5B6AA4] to-[#8AA3D6]",
    imgSrc:
      "https://sbclbzad8s.ufs.sh/f/vI07edVR8nimBHyqimTrX8OM2IxYqlGKDH6TeJ5faC7mvZAn",
  },
  {
    title: "Mobile Legends Paket Irit",
    publisher: "Moonton",
    gradient: "from-[#5B6AA4] to-[#8AA3D6]",
    imgSrc:
      "https://sbclbzad8s.ufs.sh/f/vI07edVR8nimXy27KAbgivcQh9BdKO6FlxM7eWACLyN3uRjJ",
  },
  {
    title: "PUBG Mobile",
    publisher: "Tencent Games",
    gradient: "from-[#5B8FC7] to-[#7EB0E6]",
    imgSrc:
      "https://sbclbzad8s.ufs.sh/f/vI07edVR8nim3VP6ui3nbUa9clHr8GY0jRqu34VDMgNnOtLZ",
  },
  {
    title: "Free Fire",
    publisher: "Garena",
    gradient: "from-[#2F2741] to-[#4B3D6C]",
    imgSrc:
      "https://sbclbzad8s.ufs.sh/f/vI07edVR8nimRT7O5VLNMIdtETKzOgU7JuXyAepbm8GwYi19",
  },
  {
    title: "Joki Rank Eceran",
    publisher: "Toko Tetta",
    gradient: "from-[#C9C3CF] to-[#E3DFEA]",
    imgSrc:
      "https://sbclbzad8s.ufs.sh/f/vI07edVR8nimu8bKqsB3T7uZrRbWA2jDzfOvehmVoy8FwPni",
  },
  {
    title: "Joki Rank Paketan",
    publisher: "Toko Tetta",
    gradient: "from-[#F0EAE0] to-[#E5DBC8]",
    imgSrc:
      "https://sbclbzad8s.ufs.sh/f/vI07edVR8nime7sDHAygU7uxYWbzrFpDKVv8caQ0PhB6kti2",
  },
  {
    title: "Joki Main Bareng",
    publisher: "Toko Tetta",
    gradient: "from-[#1B1C20] to-[#31323A]",
    imgSrc:
      "https://sbclbzad8s.ufs.sh/f/vI07edVR8nimLztMy8lYvdZihbXxAuD8o4GNBHmtgf5TJkyE",
  },
  {
    title: "ROBLOX",
    publisher: "Roblox Corporation",
    gradient: "from-[#3F3A52] to-[#6B638A]",
    imgSrc:
      "https://sbclbzad8s.ufs.sh/f/vI07edVR8nimhjesnNrfOHsdF5ArRwGp1kiJ8NbcmBPn90h6",
  },
];

function PopularCard({ title, publisher, gradient, imgSrc }: Item) {
  return (
    <div
      className="
        relative group overflow-hidden rounded-2xl h-28 md:h-28
        transform-gpu will-change-[transform,opacity]
        transition-all duration-500 cursor-pointer
        hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/40
        ring-2 ring-white/15 hover:ring-rose-400/60
      "
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl p-px">
        <div
          className="absolute inset-0 rounded-2xl opacity-70 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,.10), transparent 30%), linear-gradient(135deg, rgba(244,63,94,.35), rgba(244,63,94,.12))",
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 rounded-[calc(theme(borderRadius.2xl)-1px)] bg-transparent"
          aria-hidden
        />
      </div>

      <div
        className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-80 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-95`}
      />

      <div className="pointer-events-none absolute inset-0 opacity-20 transition-opacity duration-500 group-hover:opacity-30 [background:repeating-linear-gradient(135deg,rgba(255,255,255,0.18)_0_16px,transparent_16px_48px)]" />
      <div className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 -skew-x-12 bg-white/10 blur-sm transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[230%]" />

      <div className="relative flex h-full items-center gap-4 p-4 md:p-6">
        <div className="relative h-16 w-16 md:h-20 md:w-20 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/15 transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:ring-rose-400/60">
          <Image
            src={imgSrc}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:rotate-[1.5deg]"
          />
        </div>
        <div className="min-w-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5">
          <h3 className="truncate text-base md:text-lg font-semibold text-white">
            {title}
          </h3>
          <p className="mt-1 truncate text-xs md:text-sm text-white/80 group-hover:text-white">
            {publisher}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PopularSection() {
  return (
    <>
      <section className="w-full bg-[#37353E] py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔥</span>
            <h2 className="text-lg font-bold text-white">POPULER SEKARANG!</h2>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-white/75">
            Berikut adalah beberapa produk yang paling populer saat ini.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {ITEMS.map((it) => (
              <Link key={it.title} href={`/game/${toSlug(it.title)}`} prefetch>
                <PopularCard {...it} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PopularGridExplore />
    </>
  );
}