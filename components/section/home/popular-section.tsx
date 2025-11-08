"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  publicProductCategoriesService,
  PublicProductCategory,
} from "@/services/api/public-product-categories";
import { useApiCall } from "@/hooks";
import PopularGridExplore from "./popular-list-game";

const DUMMY_IMG =
  "https://sbclbzad8s.ufs.sh/f/vI07edVR8nimBHyqimTrX8OM2IxYqlGKDH6TeJ5faC7mvZAn";

const toSlug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

function PopularCard({
  title,
  imgSrc,
}: {
  title: string;
  imgSrc: string;
}) {
  return (
    // [DIUBAH] Warna ring hover diubah dari 'rose' ke 'yellow'
    <div className="relative group overflow-hidden rounded-2xl h-28 md:h-28 transform-gpu transition-all duration-500 cursor-pointer hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/40 ring-2 ring-white/15 hover:ring-yellow-400/60">
      <div className="pointer-events-none absolute inset-0 rounded-2xl p-px">
        <div
          className="absolute inset-0 rounded-2xl opacity-70 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            // [DIUBAH] Warna gradien glow diubah dari RGBA 'rose' ke RGBA 'yellow' (250, 204, 21 adalah yellow-400)
            background:
              "linear-gradient(135deg, rgba(255,255,255,.10), transparent 30%), linear-gradient(135deg, rgba(250,204,21,.35), rgba(250,204,21,.12))",
          }}
        />
      </div>

      {/* [DIUBAH] Menghilangkan prop 'gradient' dan memakai warna solid yang konsisten */}
      <div
        className={`absolute inset-0 bg-[#2b2a30] opacity-80`}
      />

      <div className="relative flex h-full items-center gap-4 p-4 md:p-6">
        {/* [DIUBAH] Warna ring hover diubah dari 'rose' ke 'yellow' */}
        <div className="relative h-16 w-16 md:h-20 md:w-20 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/15 transition duration-500 group-hover:ring-yellow-400/60">
          <Image
            src={imgSrc || DUMMY_IMG}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[1.5deg]"
            unoptimized
          />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-base md:text-lg font-semibold text-white">
            {title}
          </h3>
          {/* [DIUBAH] Teks sub-card disesuaikan */}
          <p className="mt-1 truncate text-xs md:text-sm text-white/80 group-hover:text-white">
            Lagi di-push rank
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PopularSection() {
  const [parents, setParents] = useState<PublicProductCategory[]>([]);
  const [subs, setSubs] = useState<PublicProductCategory[]>([]);

  const { data: parentRes, execute: fetchParents } = useApiCall(() =>
    publicProductCategoriesService.getProductCategories({
      page: 1,
      paginate: 100,
      is_parent: 1,
      status: 1,
    })
  );

  const { data: subRes, execute: fetchSubs } = useApiCall(() =>
    publicProductCategoriesService.getProductCategories({
      page: 1,
      paginate: 200,
      status: 1,
    })
  );

  useEffect(() => {
    fetchParents();
    fetchSubs();
  }, [fetchParents, fetchSubs]);

  useEffect(() => {
    if (parentRes?.data?.data) setParents(parentRes.data.data);
    if (subRes?.data?.data) setSubs(subRes.data.data);
  }, [parentRes, subRes]);

  // ... (logika 'popularItems' tidak berubah, sudah bagus) ...
  const popularItems = useMemo(() => {
    const gamesParent = parents.find(
      (p) =>
        p.title.toLowerCase() === "games" || p.title.toLowerCase() === "game"
    );

    const filtered = gamesParent
      ? subs.filter((c) => c.parent_id === gamesParent.id)
      : subs;

    // ✅ sort tanpa field 'order': pakai created_at (desc) lalu title (A-Z)
    const sorted = [...filtered].sort((a, b) => {
      const tB = new Date(b.created_at).getTime();
      const tA = new Date(a.created_at).getTime();
      if (!Number.isNaN(tA) && !Number.isNaN(tB) && tA !== tB) {
        return tB - tA; // baru duluan
      }
      return a.title.localeCompare(b.title, "id", { sensitivity: "base" });
    });

    return sorted.slice(0, 6).map((c) => ({
      title: c.title,
      imgSrc: c.image || DUMMY_IMG,
      slug: c.slug ?? toSlug(c.title),
    }));
  }, [parents, subs]);

  return (
    <>
      {/* Background section sudah pas (bg-[#37353E]) */}
      <section className="w-full bg-[#37353E] py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔥</span>
            {/* [DIUBAH] Judul disesuaikan dengan voice 'Turu Store' */}
            <h2 className="text-lg font-bold text-white">
              YANG LAGI DI-GRINDING
            </h2>
          </div>
          {/* [DIUBAH] Sub-judul disesuaikan dengan voice 'Turu Store' */}
          <p className="mt-2 max-w-2xl text-sm text-white/75">
            Nih, yang lagi sering di-checkout sama kaum rebahan. Gas.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {popularItems.map((it) => (
              <Link key={it.slug} href={`/game/${it.slug}`} prefetch>
                <PopularCard title={it.title} imgSrc={it.imgSrc} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PopularGridExplore />
    </>
  );
}