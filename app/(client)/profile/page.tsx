// app/profile/page.tsx (atau path yang sesuai)
"use client";

import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import PromotionBanner from "@/components/section/promotion-banner";
import {
  LogOut,
  Plus,
  Wallet,
  Mail,
  User2,
  Sparkles,
  Receipt,
  Gift,
} from "lucide-react";

const Page = () => {
  const { data } = useSession();
  const initial = (
    data?.user?.name?.trim()?.charAt(0) ||
    data?.user?.email?.trim()?.charAt(0) ||
    "U"
  )?.toUpperCase();

  return (
    <>
      {/* BACKDROP: diubah ke aksen kuning */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-20 bg-black" />
        {/* [DIUBAH] Glow merah diubah jadi kuning */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-56 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(250,204,21,0.25),rgba(250,204,21,0)_60%)]" />
        <div className="pointer-events-none absolute left-1/2 top-28 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-yellow-600/20 blur-[90px]" />
      </div>

      <div className="container relative pb-24 pt-10">
        {/* HEADER STRIP */}
        <div className="mb-8 flex items-center gap-3">
          {/* [DIUBAH] Garis aksen */}
          <div className="h-9 w-1 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-500" />
          <h1 className="text-xl font-semibold tracking-wide">
            {/* [DIUBAH] Badge aksen */}
            <span className="mr-2 inline-flex items-center gap-1 rounded-md bg-yellow-400/10 px-2 py-0.5 text-xs font-medium text-yellow-300 ring-1 ring-yellow-400/30">
              <Sparkles className="h-3.5 w-3.5" />
              Live
            </span>
            Profil Pengguna
          </h1>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* PROFILE CARD */}
          <section className="col-span-12 rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6 text-white shadow-[0_15px_40px_-20px_rgba(0,0,0,.8)] backdrop-blur md:col-span-5">
            <div className="mb-6 flex items-center gap-5">
              {/* Avatar dengan cincin conic gradient */}
              <div className="relative">
                {/* [DIUBAH] Gradient cincin avatar (Yellow-Cyan) */}
                <div className="absolute -inset-1 rounded-2xl bg-[conic-gradient(from_180deg_at_50%_50%,#facc15_0deg,#22d3ee_120deg,transparent_200deg,transparent_360deg)] opacity-90 blur-[6px]" />
                <div className="relative rounded-2xl bg-zinc-900 p-1">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      className="h-20 w-20 rounded-xl object-cover"
                      src={data?.user?.image || ""}
                    />
                    {/* [DIUBAH] Fallback avatar */}
                    <AvatarFallback className="flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-3xl font-bold text-slate-900">
                      {initial}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              <section className="min-w-0 space-y-1.5">
                <div className="flex items-center gap-2">
                  <User2 className="h-4 w-4 text-zinc-300" />
                  <h2 className="truncate text-lg font-semibold">
                    {data?.user?.name || "User"}
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{data?.user?.email}</span>
                </div>

                {/* Saldo + Aksi */}
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-1.5 text-sm text-white ring-1 ring-zinc-800">
                    {/* [DIUBAH] Ikon saldo */}
                    <Wallet className="h-4 w-4 text-yellow-400" />
                    <span className="font-medium">Saldo</span>
                    <span className="ml-1 font-mono">Rp 0</span>
                  </span>
                  {/* [DIUBAH] Tombol Top Up (CTA Utama) */}
                  <button className="inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-3 py-1.5 text-sm font-semibold text-slate-900 shadow-[0_10px_20px_-10px_rgba(250,204,21,.5)] ring-1 ring-yellow-500/30 transition hover:bg-yellow-500 active:scale-[0.99]">
                    <Plus className="h-4 w-4" />
                    Top Up
                  </button>
                </div>
              </section>
            </div>

            {/* STATS (Netral, tidak perlu diubah) */}
            <div className="grid grid-cols-3 gap-3">
              <StatCard label="Order" value="0" />
              <StatCard label="Voucher" value="0" />
              <StatCard label="Level" value="Starter" />
            </div>

            {/* [TETAP] Tombol Logout tetap merah (Aksi Destruktif) */}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-600/60 bg-red-600/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-600/20"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </button>
          </section>

          {/* TABS */}
          <div className="col-span-12 rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6 text-white shadow-[0_15px_40px_-20px_rgba(0,0,0,.8)] backdrop-blur md:col-span-7">
            <Tabs defaultValue="orders">
              <TabsList className="mb-6 flex gap-2 rounded-xl bg-black/40 p-1 ring-1 ring-zinc-800">
                <TabsTrigger
                  value="orders"
                  className="group relative flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-zinc-300 transition data-[state=active]:text-slate-900" // [DIUBAH] Teks aktif
                >
                  <span className="relative z-10 inline-flex items-center gap-2">
                    {/* [DIUBAH] Ikon non-aktif dan aktif */}
                    <Receipt className="h-4 w-4 text-yellow-400 group-data-[state=active]:text-slate-900" />
                    Recent Order
                  </span>
                  {/* [DIUBAH] Background tab aktif */}
                  <span className="absolute inset-0 -z-10 rounded-lg bg-transparent transition group-data-[state=active]:bg-yellow-400" />
                </TabsTrigger>
                <TabsTrigger
                  value="referral"
                  className="group relative flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-zinc-300 transition data-[state=active]:text-slate-900" // [DIUBAH] Teks aktif
                >
                  <span className="relative z-10 inline-flex items-center gap-2">
                    {/* [DIUBAH] Ikon non-aktif dan aktif */}
                    <Gift className="h-4 w-4 text-yellow-400 group-data-[state=active]:text-slate-900" />
                    Referral Bonus
                  </span>
                  {/* [DIUBAH] Background tab aktif */}
                  <span className="absolute inset-0 -z-10 rounded-lg bg-transparent transition group-data-[state=active]:bg-yellow-400" />
                </TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="mt-2">
                <EmptyCard
                  title="Riwayat orderan masih kosong. zZz"
                  desc="Gas top up dulu, nanti riwayatnya muncul di sini."
                  ctaLabel="Top Up Sekarang"
                />
              </TabsContent>

              <TabsContent value="referral" className="mt-2">
                <EmptyCard
                  title="Referral masih kosong"
                  desc="Coba ajak temen lo top up di sini biar dapet bonus."
                  ctaLabel="Lihat Program Referral"
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <PromotionBanner />
    </>
  );
};

function StatCard({ label, value }: { label: string; value: string }) {
  // [TETAP] Style netral ini sudah bagus
  return (
    <div className="rounded-xl border border-zinc-800 bg-black/60 px-4 py-3 text-center">
      <p className="text-[11px] uppercase tracking-wider text-zinc-400">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function EmptyCard({
  title,
  desc,
  ctaLabel,
}: {
  title: string;
  desc: string;
  ctaLabel: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-700 bg-black/50 p-5 ring-1 ring-black/20">
      {/* [DIUBAH] Badge disesuaikan */}
      <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-yellow-400/40 bg-yellow-400/10 px-2 py-1 text-xs font-medium text-yellow-300">
        Status
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-zinc-300">{desc}</p>
      {/* [DIUBAH] Tombol CTA disesuaikan */}
      <button className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-yellow-400 px-3 py-1.5 text-sm font-semibold text-slate-900 shadow-[0_10px_20px_-10px_rgba(250,204,21,.5)] ring-1 ring-yellow-500/30 transition hover:bg-yellow-500">
        {ctaLabel}
      </button>
    </div>
  );
}

export default Page;