"use client";

import Image from "next/image";
import React from "react";
// [DITAMBAH] Import font Oxanium untuk konsistensi brand
import { Oxanium } from "next/font/google";

const oxanium = Oxanium({ subsets: ["latin"], weight: ["600", "700"] });

const PromotionBanner = () => {
  return (
    <section
      className="
        relative overflow-hidden
        py-14 md:py-20
        text-white
      "
      style={{
        // [DIUBAH] Layer base: deep dark + radial YELLOW dan CYAN glow
        background:
          "radial-gradient(1200px 600px at 80% -10%, rgba(250, 204, 21, 0.35), transparent 55%), radial-gradient(900px 500px at 10% 110%, rgba(34, 211, 238, 0.3), transparent 60%), #17181d",
      }}
    >
      {/* --- Decorative grid (scanline) --- */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px, 28px 28px",
          maskImage:
            "radial-gradient(1500px 700px at 50% 0%, black 35%, transparent 70%)",
        }}
      />

      {/* --- Soft noise texture --- */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%222%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.6%22/></svg>')",
        }}
      />

      {/* --- Neon YELLOW border glow --- */}
      <div className="pointer-events-none absolute inset-0 p-px">
        <div
          className="absolute inset-0"
          style={{
            // [DIUBAH] Gradien border dari 'rose' ke 'yellow'
            background:
              "linear-gradient(135deg, rgba(250,204,21,.35), rgba(250,204,21,.12))",
            mask: "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
            WebkitMask:
              "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
          }}
        />
      </div>

      {/* --- diagonals light sweep (netral, biarkan) --- */}
      <div className="absolute -top-20 left-0 h-40 w-full rotate-6 bg-gradient-to-r from-transparent via-white/15 to-transparent blur-lg opacity-30" />
      <div className="absolute -bottom-20 left-0 h-40 w-full -rotate-6 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-lg opacity-20" />

      {/* --- Floating shapes (pads/triangles) --- */}
      {/* [DIUBAH] Warna floating shapes dari 'rose'/'red' ke 'yellow'/'cyan' */}
      <div className="absolute -left-10 top-6 h-24 w-24 rounded-full bg-yellow-400/20 blur-2xl" />
      <div className="absolute right-10 bottom-6 h-28 w-28 rounded-full bg-cyan-400/20 blur-2xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4">
        {/* Brand */}
        <div className="mb-8 flex items-center justify-center gap-3">
          {/* [DIUBAH] Logo container disesuaikan jadi 'rounded-full' */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 shadow">
            <Image
              src="/images/turu-store.webp"
              alt="logo"
              width={100}
              height={100}
              className="rounded-full" // Pastikan gambar logo juga circular
            />
          </div>
          {/* [DIUBAH] Teks brand disesuaikan dengan style header */}
          <span
            className={`${oxanium.className} text-3xl font-bold tracking-tight md:text-4xl`}
          >
            Turu{" "}
            <span className="bg-gradient-to-r from-yellow-300 via-cyan-400 to-yellow-300 bg-clip-text text-transparent">
              Store
            </span>
          </span>
        </div>

        {/* Headline */}
        {/* [DIUBAH] Headline disesuaikan dengan voice 'Turu Store' */}
        <h1 className="mx-auto max-w-6xl text-center text-2xl font-bold leading-tight md:text-4xl">
          Top Up Sambil Turu?{" "}
          <span className="text-yellow-400">Bisa.</span>{" "}
          <span className="text-white/90">Harga Rebah,</span>{" "}
          <span className="text-white/90">Proses Instan.</span>
        </h1>

        {/* Subcopy */}
        {/* [DIUBAH] Subcopy disesuaikan dengan voice 'Turu Store' */}
        <p className="mx-auto mt-4 max-w-4xl text-center text-base leading-relaxed text-white/80 md:text-lg">
          Gas diamond ML, Robux, Valorant, Steam, apa aja. Gak pake lama, gak
          pake ribet. Biar kami yang melek, lo tinggal main.
        </p>

        {/* CTAs */}
        <div className="mt-7 flex items-center justify-center gap-3">
          <a
            href="#topup"
            className="
              inline-flex items-center justify-center rounded-xl
              bg-gradient-to-br from-yellow-400 to-yellow-500
              px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg
              transition-all duration-300 hover:scale-[1.03] hover:shadow-yellow-400/30
            "
          >
            Mulai Top Up
          </a>
          <a
            href="#promo"
            className="
              inline-flex items-center justify-center rounded-xl
              bg-white/5 px-5 py-3 text-sm font-semibold text-white
              ring-1 ring-white/15 backdrop-blur
              transition-all duration-300 hover:bg-white/10
            "
          >
            Lihat Promo
          </a>
        </div>

        {/* Trust badges / marquee mini */}
        {/* [DIUBAH] Teks trust badges disesuaikan dengan voice 'Turu Store' */}
        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-2 text-center text-xs text-white/70 sm:grid-cols-4">
          <div className="rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10">
            ⚡ Proses Cepat (Gak Pake Turu)
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10">
            🔒 100% Amanah
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10">
            🎁 Diskon Kaum Rebahan
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10">
            🕐 Admin Nolep 24/7
          </div>
        </div>
      </div>

      {/* Spotlight mask (netral, biarkan) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage:
            "radial-gradient(600px 300px at 50% 30%, black 40%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(600px 300px at 50% 30%, black 40%, transparent 70%)",
          background:
            "radial-gradient(500px 250px at 50% 30%, rgba(255,255,255,.08), transparent 70%)",
        }}
      />
    </section>
  );
};

export default PromotionBanner;