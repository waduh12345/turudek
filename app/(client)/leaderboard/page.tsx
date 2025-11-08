"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Crown,
  Medal,
  RefreshCw,
  AlertCircle,
  Trophy,
  ChevronRight,
} from "lucide-react";

// ==================== Types ====================
type Period = "day" | "week" | "month";

type LeaderEntry = {
  rank: number;
  name: string;
  total: number; // IDR
};

type LeaderboardResponse = {
  title?: string;
  items: LeaderEntry[];
};

// ==================== Dummy Data (Simulasi API) ====================
const DUMMY_DATA: Record<Period, LeaderboardResponse> = {
  day: {
    items: [
      { rank: 1, name: "Agustian", total: 2769804 },
      { rank: 2, name: "Maichel", total: 2440929 },
      { rank: 3, name: "Dede evin", total: 1171410 },
      { rank: 4, name: "Aldi jehezkiel", total: 894668 },
      { rank: 5, name: "Veskaa", total: 680096 },
      { rank: 6, name: "Abdullah Husein", total: 627743 },
      { rank: 7, name: "Vijay Indrajaya", total: 612385 },
      { rank: 8, name: "William C", total: 493478 },
      { rank: 9, name: "Andri", total: 469074 },
      { rank: 10, name: "Dunzlahh", total: 426304 },
    ],
  },
  week: {
    items: [
      { rank: 1, name: "hendra", total: 4509934 },
      { rank: 2, name: "Abdullah Husein", total: 4266612 },
      { rank: 3, name: "Andre Siregar", total: 4244887 },
      { rank: 4, name: "vincent cuaca", total: 3384019 },
      { rank: 5, name: "Rivaldo Tjung", total: 3160872 },
      { rank: 6, name: "Agustian", total: 2769804 },
      { rank: 7, name: "Mohammad reza", total: 2556014 },
      { rank: 8, name: "Maichel", total: 2440929 },
      { rank: 9, name: "buatkita", total: 2299407 },
      { rank: 10, name: "Rinno", total: 2230177 },
    ],
  },
  month: {
    items: [
      { rank: 1, name: "hendra", total: 4509934 },
      { rank: 2, name: "Abdullah Husein", total: 4266612 },
      { rank: 3, name: "Andre Siregar", total: 4244887 },
      { rank: 4, name: "vincent cuaca", total: 3384019 },
      { rank: 5, name: "Rivaldo Tjung", total: 3160872 },
      { rank: 6, name: "Andri", total: 3048967 },
      { rank: 7, name: "Agustian", total: 2769804 },
      { rank: 8, name: "Mohammad reza", total: 2556014 },
      { rank: 9, name: "Maichel", total: 2440929 },
      { rank: 10, name: "buatkita", total: 2299407 },
    ],
  },
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function fetchDummy(period: Period): Promise<LeaderboardResponse> {
  // simulasi network delay
  await sleep(500);
  // bisa lempar error untuk test:
  // if (period === "week") throw new Error("Simulasi gagal memuat.");
  return { title: undefined, items: DUMMY_DATA[period].items };
}

// ==================== Helpers ====================
const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);

const periodTabMeta: Record<
  Period,
  { label: string; subtitle: string; badge: string }
> = {
  day: {
    label: "Top 10 - Hari Ini",
    subtitle: "Realtime hari ini",
    badge: "🔥",
  },
  week: {
    label: "Top 10 - Minggu Ini",
    subtitle: "Akumulasi 7 hari",
    badge: "⚡",
  },
  month: {
    label: "Top 10 - Bulan Ini",
    subtitle: "Akumulasi 30 hari",
    badge: "🏆",
  },
};

const medalForRank = (rank: number) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return "";
};

const getErrorMessage = (e: unknown): string =>
  e instanceof Error ? e.message : "Gagal memuat data.";

// ==================== Component ====================
export default function LeaderboardPage() {
  const [active, setActive] = useState<Period>("day");
  const [data, setData] = useState<Record<Period, LeaderboardResponse | null>>({
    day: null,
    week: null,
    month: null,
  });
  const [loading, setLoading] = useState<Record<Period, boolean>>({
    day: true,
    week: true,
    month: true,
  });
  const [error, setError] = useState<Record<Period, string | null>>({
    day: null,
    week: null,
    month: null,
  });

  const loadPeriod = async (p: Period) => {
    setLoading((s) => ({ ...s, [p]: true }));
    setError((er) => ({ ...er, [p]: null }));
    try {
      const json = await fetchDummy(p);
      setData((d) => ({
        ...d,
        [p]: { title: periodTabMeta[p].label, ...json },
      }));
    } catch (e: unknown) {
      setError((er) => ({ ...er, [p]: getErrorMessage(e) }));
    } finally {
      setLoading((s) => ({ ...s, [p]: false }));
    }
  };

  useEffect(() => {
    void Promise.all([
      loadPeriod("day"),
      loadPeriod("week"),
      loadPeriod("month"),
    ]);
  }, []);

  const activeData = data[active];
  const activeLoading = loading[active];
  const activeError = error[active];

  const top3 = useMemo(
    () => activeData?.items?.slice(0, 3) ?? [],
    [activeData?.items]
  );
  const rest = useMemo(
    () => activeData?.items?.slice(3, 10) ?? [],
    [activeData?.items]
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-amber-400/10 to-transparent blur-2xl" />
      <div className="mx-auto max-w-7xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="text-amber-300/70 font-semibold tracking-wide">
            Leaderboard
          </div>
          <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-amber-100">
            Top 10 Pembelian Terbanyak di{" "}
            <span className="text-amber-400">TURU STORE</span>
          </h1>
          <p className="mt-3 text-amber-300/70 max-w-2xl mx-auto">
            Daftar ini diambil dari sistem kami dan diperbarui secara berkala.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {(["day", "week", "month"] as Period[]).map((p) => {
            const meta = periodTabMeta[p];
            const isActive = active === p;
            return (
              <button
                key={p}
                onClick={() => setActive(p)}
                className={[
                  "group relative overflow-hidden rounded-xl px-4 py-2 text-sm font-medium",
                  "ring-1 ring-amber-400/20 transition-all",
                  isActive
                    ? "bg-amber-400 text-black shadow-[0_10px_30px_rgba(251,191,36,0.25)]"
                    : "bg-[#111111] text-amber-200 hover:bg-amber-400/10",
                ].join(" ")}
                aria-pressed={isActive}
              >
                <span className="mr-1">{meta.badge}</span>
                {meta.label}
              </button>
            );
          })}
          <button
            onClick={() => void loadPeriod(active)}
            className="rounded-xl px-3 py-2 text-sm bg-[#111111] text-amber-200 hover:bg-amber-400/10 ring-1 ring-amber-400/20 inline-flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            key={`podium-${active}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 rounded-2xl bg-[#0E0E0E] ring-1 ring-amber-400/20 p-6 shadow-[0_8px_30px_rgba(250,204,21,0.06)]"
          >
            <div className="flex items-center gap-2 text-amber-200 mb-4">
              <Crown className="h-5 w-5" />
              <span className="font-semibold">
                {periodTabMeta[active].label}
              </span>
            </div>

            {activeLoading && <PodiumSkeleton />}

            {!activeLoading && activeError && (
              <ErrorBlock
                message={activeError}
                onRetry={() => loadPeriod(active)}
              />
            )}

            {!activeLoading && !activeError && top3.length === 0 && (
              <EmptyBlock />
            )}

            {!activeLoading && !activeError && top3.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {top3.map((e, i) => (
                  <PodiumCard
                    key={e.rank}
                    entry={e}
                    highlight={i === 0}
                    className={i === 0 ? "col-span-2" : ""}
                  />
                ))}
              </div>
            )}

            <p className="mt-4 text-xs text-amber-300/60">
              {periodTabMeta[active].subtitle}
            </p>
          </motion.div>

          <motion.div
            key={`list-${active}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 rounded-2xl bg-[#0E0E0E] ring-1 ring-amber-400/20 p-6 shadow-[0_8px_30px_rgba(250,204,21,0.06)]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-amber-200">
                <Trophy className="h-5 w-5" />
                <span className="font-semibold">Peringkat 4 - 10</span>
              </div>
              {!!activeData?.items?.length && (
                <div className="text-xs text-amber-300/60">
                  Total entri: {activeData.items.length}
                </div>
              )}
            </div>

            {activeLoading && <ListSkeleton />}

            {!activeLoading && activeError && (
              <ErrorBlock
                message={activeError}
                onRetry={() => loadPeriod(active)}
              />
            )}

            {!activeLoading && !activeError && rest.length === 0 && (
              <EmptyBlock />
            )}

            {!activeLoading && !activeError && rest.length > 0 && (
              <ul className="divide-y divide-amber-400/10">
                {rest.map((e, idx) => (
                  <motion.li
                    key={e.rank}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="py-3 flex items-center justify-between hover:bg-amber-400/5 rounded-lg px-2"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 text-right text-amber-300/80">
                        {e.rank}.
                      </span>
                      <span className="shrink-0">{medalForRank(e.rank)}</span>
                      <span className="truncate text-amber-100">{e.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-amber-100">
                        {formatIDR(e.total)}
                      </span>
                      <ChevronRight className="h-4 w-4 text-amber-300/60" />
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ==================== Subcomponents ====================
function PodiumCard({
  entry,
  highlight,
  className = "",
}: {
  entry: LeaderEntry;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl p-4 text-center ring-1 ring-amber-400/20",
        "bg-gradient-to-br from-[#111111] to-[#0b0b0b]",
        highlight
          ? "shadow-[0_20px_60px_rgba(250,204,21,0.10)] md:p-6"
          : "shadow-[0_8px_30px_rgba(250,204,21,0.06)]",
        className, // <= grid span masuk dari sini
      ].join(" ")}
    >
      <div className={highlight ? "text-3xl" : "text-2xl"}>
        {medalForRank(entry.rank)}
      </div>
      <div className="mt-2 text-sm text-amber-300/70">#{entry.rank}</div>
      <div
        className={[
          "mt-1 font-semibold text-amber-100 truncate",
          highlight ? "text-lg" : "",
        ].join(" ")}
      >
        {entry.name}
      </div>
      <div
        className={[
          "mt-1 text-amber-200",
          highlight ? "text-base font-semibold" : "",
        ].join(" ")}
      >
        {formatIDR(entry.total)}
      </div>
    </div>
  );
}

function ErrorBlock({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-xl bg-[#121212] ring-1 ring-amber-400/10 p-4 text-center text-amber-200">
      <div className="flex items-center justify-center gap-2">
        <AlertCircle className="h-5 w-5 text-amber-300" />
        <span>Gagal memuat data</span>
      </div>
      <p className="mt-1 text-sm text-amber-300/70">{message}</p>
      <button
        onClick={onRetry}
        className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-400 text-black text-sm font-medium hover:bg-amber-300"
      >
        <RefreshCw className="h-4 w-4" />
        Coba lagi
      </button>
    </div>
  );
}

function EmptyBlock() {
  return (
    <div className="rounded-xl bg-[#121212] ring-1 ring-amber-400/10 p-6 text-center text-amber-300/70">
      Belum ada data untuk periode ini.
    </div>
  );
}

function PodiumSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-2xl p-4 ring-1 ring-amber-400/10 bg-[#101010] animate-pulse"
        >
          <div className="mx-auto h-6 w-10 bg-amber-400/20 rounded"></div>
          <div className="mt-3 h-3 w-10 mx-auto bg-amber-400/20 rounded" />
          <div className="mt-2 h-4 w-24 mx-auto bg-amber-400/20 rounded" />
          <div className="mt-2 h-3 w-20 mx-auto bg-amber-400/20 rounded" />
        </div>
      ))}
    </div>
  );
}

function ListSkeleton() {
  return (
    <ul className="divide-y divide-amber-400/10">
      {Array.from({ length: 7 }).map((_, i) => (
        <li key={i} className="py-3 px-2 flex items-center justify-between">
          <div className="flex items-center gap-3 w-2/3">
            <div className="h-3 w-6 bg-amber-400/20 rounded" />
            <div className="h-3 w-6 bg-amber-400/20 rounded" />
            <div className="h-4 w-40 bg-amber-400/20 rounded" />
          </div>
          <div className="h-4 w-24 bg-amber-400/20 rounded" />
        </li>
      ))}
    </ul>
  );
}
