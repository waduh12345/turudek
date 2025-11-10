"use client";

import { useMemo, useState, useEffect, useRef, ChangeEvent } from "react";
import {
  Star,
  Filter,
  ChevronDown,
  X,
  Search as SearchIcon,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { topupReviewsService, type TopupReview } from "@/services/api/review";

type SortKey = "latest" | "rating";
type RatingGate = "all" | "gte4" | "eq5";

type PaginationMeta = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
};

const fmt = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function StarRow({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Rating ${rating} bintang`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < filled ? "text-yellow-400 fill-yellow-400" : "text-white/25"
          }`}
        />
      ))}
    </div>
  );
}

function Segmented({
  value,
  onChange,
}: {
  value: RatingGate;
  onChange: (v: RatingGate) => void;
}) {
  const opts: { key: RatingGate; label: string }[] = [
    { key: "all", label: "Semua" },
    { key: "gte4", label: "≥ 4★" },
    { key: "eq5", label: "5★" },
  ];
  return (
    <div
      role="tablist"
      aria-label="Filter rating"
      className="inline-flex overflow-hidden rounded-xl bg-[#2b2a30] ring-1 ring-white/10"
    >
      {opts.map((o) => {
        const active = value === o.key;
        return (
          <button
            key={o.key}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.key)}
            className={[
              "px-3 py-1.5 text-xs font-semibold transition",
              active
                ? "bg-yellow-400 text-slate-900"
                : "text-white/80 hover:bg-[#34333a]",
            ].join(" ")}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-[#26252b] p-4 ring-1 ring-white/10 animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="h-3.5 w-24 rounded bg-white/10" />
          <div className="mt-2 h-3 w-48 rounded bg-white/10" />
          <div className="mt-1 h-3 w-36 rounded bg-white/10" />
        </div>
        <div className="h-4 w-24 rounded bg-white/10" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="h-5 w-32 rounded bg-white/10" />
        <div className="h-5 w-24 rounded bg-white/10" />
      </div>
    </div>
  );
}

export default function ReviewsPage() {
  // ====== Query & Filters ======
  const [query, setQuery] = useState<string>("");
  const [sort, setSort] = useState<SortKey>("latest");
  const [ratingGate, setRatingGate] = useState<RatingGate>("all");
  const [startDate, setStartDate] = useState<string>(""); // YYYY-MM-DD
  const [endDate, setEndDate] = useState<string>(""); // YYYY-MM-DD
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ====== Pagination ======
  const [page, setPage] = useState<number>(1);
  const [perPage] = useState<number>(9);

  // ====== Data ======
  const [items, setItems] = useState<TopupReview[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ====== Fetch ======
  const fetchReviews = async (p?: {
    q?: string;
    pg?: number;
    s?: string;
    e?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await topupReviewsService.getReviews({
        paginate: perPage,
        page: p?.pg ?? page,
        search: p?.q ?? query,
        started_at: p?.s ?? (startDate || undefined),
        ended_at: p?.e ?? (endDate || undefined),
      });
      const payload = res.data; // { data, meta }
      setItems(payload.data);
      setMeta(payload.meta);
    } catch (e) {
      const msg =
        (e as { message?: string })?.message ??
        "Gagal memuat ulasan. Coba lagi.";
      setError(msg);
      setItems([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  };

  // fetch on page/perPage/start/end
  useEffect(() => {
    void fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, startDate, endDate]);

  // debounce search + ratingGate + sort
  useEffect(() => {
    setPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void fetchReviews({ q: query, pg: 1 });
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // ====== Client-side filter & sort pada hasil halaman ======
  const filtered = useMemo<TopupReview[]>(() => {
    let list = [...items];

    if (ratingGate === "gte4") {
      list = list.filter((r) => (r.rating ?? 0) >= 4);
    } else if (ratingGate === "eq5") {
      list = list.filter((r) => Math.round(r.rating ?? 0) === 5);
    }

    if (sort === "latest") {
      list.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else {
      list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }

    return list;
  }, [items, ratingGate, sort]);

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const totalOnPage = filtered.length;
  const totalAll = meta?.total ?? filtered.length;

  // ====== Stats (avg & distribution) ======
  const stats = useMemo(() => {
    if (items.length === 0)
      return { avg: 0, dist: [0, 0, 0, 0, 0] as number[] };
    const avg =
      items.reduce((s, r) => s + (Number(r.rating) || 0), 0) / items.length;
    const dist = [1, 2, 3, 4, 5].map(
      (n) => items.filter((i) => Math.round(i.rating ?? 0) === n).length
    );
    return { avg, dist };
  }, [items]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1c1c21] to-[#1a1a1f] text-white">
      {/* Hero / Header */}
      <section className="relative border-b border-white/10">
        {/* subtle glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(250,204,21,0.12),transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-10">
          <p className="text-center text-xs font-semibold tracking-[0.25em] text-yellow-400">
            LIHAT KATA MEREKA
          </p>
          <h1 className="mx-auto mt-2 max-w-3xl text-center text-3xl font-extrabold md:text-4xl">
            Ulasan Pelanggan <span className="text-yellow-400">Turu Store</span>
          </h1>

          {/* Stats ring */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur">
              <p className="text-sm text-white/70">Rata-rata rating</p>
              <div className="mt-2 flex items-end gap-3">
                <span className="text-4xl font-bold">
                  {stats.avg.toFixed(1)}
                </span>
                <StarRow rating={stats.avg} />
              </div>
              <p className="mt-2 text-xs text-white/50">
                Dari {items.length} ulasan pada halaman ini
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur md:col-span-2">
              <p className="text-sm text-white/70">Distribusi bintang</p>
              <div className="mt-3 space-y-2">
                {[5, 4, 3, 2, 1].map((n, idx) => {
                  const total = items.length || 1;
                  const count = stats.dist[n - 1] ?? 0;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={n} className="flex items-center gap-3">
                      <span className="w-8 text-xs text-white/70">{n}★</span>
                      <div className="relative h-2 flex-1 overflow-hidden rounded bg-white/10">
                        <div
                          className="absolute inset-y-0 left-0 rounded bg-yellow-400"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-xs text-white/60">
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Filter bar */}
          <div className="mx-auto mt-6 flex max-w-7xl flex-col gap-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              {/* Search */}
              <div className="relative flex-1">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                <input
                  value={query}
                  onChange={onSearchChange}
                  placeholder="Cari di nama atau komentar…"
                  className="w-full rounded-xl border-0 bg-[#2b2a30]/90 pl-9 pr-9 py-2 text-sm text-white outline-none ring-1 ring-white/15 placeholder:text-white/50 focus:ring-2 focus:ring-yellow-500/50"
                />
                {query && (
                  <button
                    aria-label="Bersihkan pencarian"
                    onClick={() => setQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/70 hover:bg-white/10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Rating segmented */}
              <div className="flex flex-wrap items-center gap-3">
                <Segmented
                  value={ratingGate}
                  onChange={(v) => setRatingGate(v)}
                />

                {/* Sort (dropdown readable) */}
                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-xl bg-[#2b2a30]/90 px-2 py-1.5 text-xs ring-1 ring-white/10">
                    <span className="hidden text-white/70 sm:inline">
                      Urutkan
                    </span>
                    <Filter className="h-4 w-4 text-white/60 sm:hidden" />
                    <div className="relative">
                      <select
                        aria-label="Urutkan"
                        value={sort}
                        onChange={(e) => setSort(e.target.value as SortKey)}
                        className="appearance-none bg-transparent pr-7 text-white outline-none"
                        style={{ colorScheme: "dark" }}
                      >
                        <option
                          className="bg-[#1f1f24] text-white"
                          value="latest"
                        >
                          Terbaru
                        </option>
                        <option
                          className="bg-[#1f1f24] text-white"
                          value="rating"
                        >
                          Rating Tertinggi
                        </option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-1 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                    </div>
                  </div>
                </div>

                {/* Date range (dropdown readable) */}
                <div className="flex items-center gap-2">
                  <div className="relative inline-flex items-center gap-2 rounded-xl bg-[#2b2a30]/90 px-2 py-1.5 text-xs ring-1 ring-white/10">
                    <Calendar className="h-4 w-4 text-white/60" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-transparent text-white outline-none"
                      style={{ colorScheme: "dark" }}
                    />
                  </div>
                  <div className="relative inline-flex items-center gap-2 rounded-xl bg-[#2b2a30]/90 px-2 py-1.5 text-xs ring-1 ring-white/10">
                    <Calendar className="h-4 w-4 text-white/60" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-transparent text-white outline-none"
                      style={{ colorScheme: "dark" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Active badges + Reset */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {ratingGate !== "all" && (
                <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/10">
                  Rating:{" "}
                  <strong className="ml-1">
                    {ratingGate === "gte4" ? "≥ 4★" : "5★"}
                  </strong>
                </span>
              )}
              {(startDate || endDate) && (
                <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/10">
                  Tanggal:{" "}
                  <strong className="ml-1">
                    {startDate || "…"} s/d {endDate || "…"}
                  </strong>
                </span>
              )}
              {(ratingGate !== "all" || query || startDate || endDate) && (
                <button
                  onClick={() => {
                    setQuery("");
                    setRatingGate("all");
                    setStartDate("");
                    setEndDate("");
                    setPage(1);
                    void fetchReviews({ q: "", pg: 1, s: "", e: "" });
                  }}
                  className="ml-auto inline-flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-1 font-semibold text-slate-900 ring-1 ring-yellow-500/60 hover:brightness-110"
                >
                  Reset
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Grid reviews */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-center text-sm text-rose-200">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-white/10" />
            <p className="text-sm text-white/70">
              Nggak nemu ulasan. Coba ganti filter.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-xs text-white/60">
              Menampilkan{" "}
              <span className="font-semibold text-white/90">{totalOnPage}</span>{" "}
              dari{" "}
              <span className="font-semibold text-white/90">{totalAll}</span>{" "}
              ulasan
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((r) => (
                <article
                  key={r.id}
                  className="group rounded-2xl bg-[#26252b]/90 p-4 ring-1 ring-white/10 backdrop-blur transition hover:-translate-y-0.5 hover:ring-yellow-500/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-[13px] font-semibold text-white truncate">
                        {r.name}
                      </h3>
                      <p className="mt-1 line-clamp-3 text-[12px] italic text-white/75">
                        “{r.review}”
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <StarRow rating={r.rating ?? 0} />
                      <div className="mt-1 text-[11px] text-white/60">
                        {(r.rating ?? 0).toFixed(1)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="shrink-0 rounded-md bg-white/5 px-2 py-1 text-[11px] text-white/70 ring-1 ring-white/10">
                      {fmt.format(new Date(r.created_at))}
                    </span>
                    {r.order_id && (
                      <span className="text-[11px] text-white/60">
                        Order:{" "}
                        <span className="text-white/85">{r.order_id}</span>
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 rounded-xl bg-[#2b2a30]/90 px-3 py-2 text-sm ring-1 ring-white/10 transition hover:bg-[#34333a] disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Sebelumnya
            </button>

            <div className="hidden md:flex items-center gap-1">
              {Array.from(
                { length: Math.min(5, meta.last_page) },
                (_, i) =>
                  i + Math.max(1, Math.min(page - 2, meta.last_page - 4))
              ).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-2 text-sm rounded-xl ring-1 ring-white/10 ${
                    page === p
                      ? "bg-yellow-400 text-black"
                      : "bg-[#2b2a30]/90 text-white hover:bg-[#34333a]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
              disabled={page === meta.last_page}
              className="inline-flex items-center gap-1 rounded-xl bg-[#2b2a30]/90 px-3 py-2 text-sm ring-1 ring-white/10 transition hover:bg-[#34333a] disabled:opacity-40"
            >
              Berikutnya
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </section>
    </main>
  );
}