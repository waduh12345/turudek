"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";

/* =================== Types & helpers =================== */

type Item = { title: string; imgSrc: string };
type TabKey =
  | "topup"
  | "joki_mlbb"
  | "joki_hok"
  | "topup_link"
  | "pulsa"
  | "voucher"
  | "entertainment"
  | "tagihan";

const toSlug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const TABS: { key: TabKey; label: string }[] = [
  { key: "topup", label: "Top Up Games" },
  { key: "joki_mlbb", label: "Joki MLBB" },
  { key: "joki_hok", label: "Joki HOK" },
  { key: "topup_link", label: "Top Up via LINK" },
  { key: "pulsa", label: "Pulsa & Data" },
  { key: "voucher", label: "Voucher" },
  { key: "entertainment", label: "Entertainment" },
  { key: "tagihan", label: "Tagihan" },
];

/* =================== IMG & DATA (lengkap) =================== */

const IMG = {
  ml: "https://sbclbzad8s.ufs.sh/f/vI07edVR8nimBHyqimTrX8OM2IxYqlGKDH6TeJ5faC7mvZAn",
  ml_irit:
    "https://sbclbzad8s.ufs.sh/f/vI07edVR8nimXy27KAbgivcQh9BdKO6FlxM7eWACLyN3uRjJ",
  pubg: "https://sbclbzad8s.ufs.sh/f/vI07edVR8nim3VP6ui3nbUa9clHr8GY0jRqu34VDMgNnOtLZ",
  ff: "https://sbclbzad8s.ufs.sh/f/vI07edVR8nimRT7O5VLNMIdtETKzOgU7JuXyAepbm8GwYi19",
  roblox:
    "https://sbclbzad8s.ufs.sh/f/vI07edVR8nimhjesnNrfOHsdF5ArRwGp1kiJ8NbcmBPn90h6",
  hok: "https://sbclbzad8s.ufs.sh/f/vI07edVR8nimWBvAGPIUpaHfhYZ6TbExXLAOcok09dev58zW",
  delta_steam:
    "https://sbclbzad8s.ufs.sh/f/vI07edVR8nimTQPuMy8H2sdjPYSuM58QClLIafzNBcUVtO3b",
  delta_garena:
    "https://sbclbzad8s.ufs.sh/f/vI07edVR8nimnMY27gFD9PZSOQx7FlLCH2KWrNha6yg5ud8Y",
  aoe: "https://sbclbzad8s.ufs.sh/f/vI07edVR8nimsyhsMvzK9e2PTBSNRIt3QdlL570mxhbDEvqG",
  pb: "https://sbclbzad8s.ufs.sh/f/vI07edVR8nimpi5uheKqYjo879VwiPkuEr3Jhgm4QZybeITA",
  magic:
    "https://sbclbzad8s.ufs.sh/f/vI07edVR8nimoxNgJkZQyEeKvXgpZWw368ijzDaukdl1N0xn",
};

const DATA: Record<TabKey, Item[]> = {
  topup: [
    { title: "Mobile Legends", imgSrc: IMG.ml },
    { title: "Paket Irit ML", imgSrc: IMG.ml_irit },
    { title: "PUBG Mobile", imgSrc: IMG.pubg },
    { title: "Free Fire", imgSrc: IMG.ff },
    { title: "ROBLOX", imgSrc: IMG.roblox },
    { title: "Honor of Kings", imgSrc: IMG.hok },
    { title: "Delta Force (Steam)", imgSrc: IMG.delta_steam },
    { title: "Delta Force (Garena)", imgSrc: IMG.delta_garena },
    { title: "Age of Empires Mobile", imgSrc: IMG.aoe },
    { title: "Point Blank Zepetto", imgSrc: IMG.pb },
    { title: "Magic Chess", imgSrc: IMG.magic },
  ],
  joki_mlbb: [
    { title: "Joki Mythic", imgSrc: IMG.ml },
    { title: "Joki Paket Irit", imgSrc: IMG.ml_irit },
    { title: "Joki Classic Boost", imgSrc: IMG.magic },
    { title: "Joki Rank Cepat", imgSrc: IMG.ml },
    { title: "Joki Skin Event", imgSrc: IMG.ml_irit },
  ],
  joki_hok: [
    { title: "Joki HOK Rank", imgSrc: IMG.hok },
    { title: "Joki HOK Event", imgSrc: IMG.hok },
    { title: "Joki HOK Fast", imgSrc: IMG.hok },
  ],
  topup_link: [
    { title: "Top Up via Link ML", imgSrc: IMG.ml },
    { title: "Top Up via Link PUBG", imgSrc: IMG.pubg },
    { title: "Top Up via Link FF", imgSrc: IMG.ff },
  ],
  pulsa: [
    { title: "Pulsa 25K", imgSrc: IMG.roblox },
    { title: "Pulsa 50K", imgSrc: IMG.roblox },
    { title: "Data 10GB", imgSrc: IMG.roblox },
  ],
  voucher: [
    { title: "Voucher Google Play", imgSrc: IMG.roblox },
    { title: "Voucher Steam", imgSrc: IMG.delta_steam },
    { title: "Voucher Garena", imgSrc: IMG.delta_garena },
  ],
  entertainment: [
    { title: "Netflix Gift", imgSrc: IMG.roblox },
    { title: "Spotify Premium", imgSrc: IMG.roblox },
  ],
  tagihan: [
    { title: "PLN Token", imgSrc: IMG.roblox },
    { title: "PDAM", imgSrc: IMG.roblox },
  ],
};

/* =================== UI Components =================== */

const PAGE_SIZE = 10;

function Tabs({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (k: TabKey) => void;
}) {
  return (
    <div className="mb-5 flex flex-wrap gap-4">
      {TABS.map((t) => {
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={[
              "rounded-2xl px-5 py-3 text-base font-semibold transition-colors",
              "ring-1 ring-white/10 shadow-sm",
              isActive
                ? "bg-[#DC143C] text-white"
                : "bg-[#3A3F45] text-white/90 hover:bg-[#454A51]",
            ].join(" ")}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

function GameCard({ title, imgSrc }: Item) {
  return (
    <div
      className="
        group relative overflow-hidden rounded-2xl bg-[#2B2A2F]
        ring-1 ring-white/10 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
        hover:scale-[1.04] hover:shadow-2xl hover:shadow-black/30 hover:ring-rose-500/50 cursor-pointer
      "
    >
      <div
        className="
          relative aspect-[3/4] w-full rounded-2xl
          ring-1 ring-transparent transition duration-500 group-hover:ring-rose-500/40
        "
      >
        <Image
          src={imgSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-90" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-4">
          <div className="relative overflow-hidden">
            <span className="absolute inset-0 bg-white/20 mix-blend-overlay opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100" />
            <h3
              className="
                relative z-10 font-bold leading-tight text-white drop-shadow-sm
                text-base sm:text-lg opacity-0 translate-y-2
                transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)]
                group-hover:opacity-100 group-hover:translate-y-0
                [mask-image:linear-gradient(90deg,transparent,white_12%,white_88%,transparent)]
                [mask-size:200%_100%] [mask-position:left]
                group-hover:[mask-position:right]
              "
            >
              {title}
            </h3>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-2xl p-px transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]">
        <div
          className="absolute inset-0 rounded-2xl opacity-70 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(135deg, rgba(244,63,94,.35), rgba(244,63,94,.15))",
          }}
        />
        <div className="absolute inset-0 rounded-[calc(theme(borderRadius.2xl)-1px)] bg-transparent" />
      </div>
    </div>
  );
}

/* =================== Page =================== */

export default function PopularGridExplore() {
  const [active, setActive] = useState<TabKey>("topup");

  const [visibleByTab, setVisibleByTab] = useState<Record<TabKey, number>>(() =>
    TABS.reduce(
      (acc, t) => ({ ...acc, [t.key]: PAGE_SIZE }),
      {} as Record<TabKey, number>
    )
  );

  const items: Item[] = DATA[active];
  const visible = visibleByTab[active];
  const data: Item[] = useMemo(() => items.slice(0, visible), [items, visible]);
  const canLoadMore = visible < items.length;

  const onChangeTab = (k: TabKey) => {
    setActive(k);
    setVisibleByTab((s) => ({ ...s, [k]: s[k] ?? PAGE_SIZE }));
  };

  const onLoadMore = () =>
    setVisibleByTab((s) => ({
      ...s,
      [active]: Math.min((s[active] ?? PAGE_SIZE) + PAGE_SIZE, items.length),
    }));

  return (
    <section className="w-full py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4">
        <Tabs active={active} onChange={onChangeTab} />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-5 lg:gap-6">
          {data.map((it: Item) => (
            <Link
              key={`${active}-${it.title}`}
              href={`/game/${toSlug(it.title)}`}
              prefetch
            >
              <GameCard {...it} />
            </Link>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          {canLoadMore ? (
            <button
              onClick={onLoadMore}
              className="rounded-full bg-[#3A393F] px-5 py-2 text-sm font-medium text-white/90 ring-1 ring-white/10 shadow-sm transition hover:bg-[#45444b]"
            >
              Tampilkan Lainnya…
            </button>
          ) : (
            <button
              disabled
              className="cursor-not-allowed rounded-full bg-[#3A393F] px-5 py-2 text-sm font-medium text-white/60 ring-1 ring-white/10"
            >
              Sudah semua
            </button>
          )}
        </div>
      </div>
    </section>
  );
}