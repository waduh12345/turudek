"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  LogIn,
  UserPlus,
  Menu,
  X,
  Clock,
  Flame,
  Gamepad2,
  Gift,
  TicketPercent,
  ArrowRight,
  Keyboard,
  Globe2,
  User2,
  LogOut,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Oxanium } from "next/font/google";
import { useSession, signOut } from "next-auth/react";

const oxanium = Oxanium({ subsets: ["latin"], weight: ["500", "600", "700"] });

type Item = {
  id: number;
  title: string;
  subtitle?: string;
  icon: "game" | "voucher" | "promo";
  href: string;
  tag?: string;
};

const SAMPLE_ITEMS: Item[] = [
  // ... (data sampel tidak berubah) ...
  {
    id: 1,
    title: "Roblox",
    subtitle: "Top up Robux instan",
    icon: "game",
    href: "/roblox",
    tag: "Trending",
  },
  {
    id: 2,
    title: "Mobile Legends",
    subtitle: "Diamonds 86 • 172 • 257",
    icon: "game",
    href: "/mobile-legends",
  },
  {
    id: 3,
    title: "Voucher Google Play",
    subtitle: "Kode digital resmi",
    icon: "voucher",
    href: "/voucher/google-play",
  },
  {
    id: 4,
    title: "Promo Harian",
    subtitle: "Diskon 5K tiap 12.00 WIB",
    icon: "promo",
    href: "/promo",
    tag: "Baru",
  },
];

const POPULAR: Array<{ label: string; href: string }> = [
  // ... (data sampel tidak berubah) ...
  { label: "Roblox", href: "/roblox" },
  { label: "Mobile Legends", href: "/mobile-legends" },
  { label: "Genshin Impact", href: "/genshin" },
  { label: "Voucher Google Play", href: "/voucher/google-play" },
];

const RECENTS_KEY = "__kios_tetta_search_recents__";

export default function GameHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const [openSearch, setOpenSearch] = React.useState(false);
  const [openLocale, setOpenLocale] = React.useState(false);
  const [openProfile, setOpenProfile] = React.useState(false);
  const [locale, setLocale] = React.useState<"id-IDR" | "en-USD">("id-IDR");

  // ... (useEffect untuk Ctrl+K tidak berubah) ...
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isK = (e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey);
      const isSlash = e.key === "/";
      if (isK || isSlash) {
        e.preventDefault();
        setOpenSearch(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ... (helper active nav tidak berubah) ...
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  // ... (avatar initial tidak berubah) ...
  const initial = (
    session?.user?.name?.trim()?.charAt(0) ||
    session?.user?.email?.trim()?.charAt(0) ||
    "U"
  )?.toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-50 flex h-20 w-full items-center gap-4 border-b border-white/10 bg-[#37353E]/95 px-4 text-white backdrop-blur md:px-8">
        {/* LEFT: logo */}
        <Link href="/">
          <div className="flex items-center gap-3">
              {/* [DIUBAH] Menghilangkan background gradien merah */}
              <div className="flex h-12 w-12 items-center justify-center">
                <Image
                  src="/images/turu-store.webp" // Pastikan ini path ke logo baru Anda
                  alt="Logo Turu Store - Maskot Hantu Gaming"
                  width={48} // Sedikit dibesarkan agar pas
                  height={48}
                  className="rounded-full" // Asumsi logo Anda sudah circular
                />
              </div>

              <div className="leading-none">
                <span
                  className={`${oxanium.className} text-[1.5rem] md:text-[1.7rem] font-semibold tracking-[0.02em] text-white drop-shadow`}
                >
                  Turu{" "}
                  {/* [DIUBAH] Gradien "Store" disesuaikan dengan palet baru */}
                  <span className="bg-gradient-to-r from-yellow-300 via-cyan-400 to-yellow-300 bg-clip-text text-transparent">
                    Store
                  </span>
                </span>
                {/* [DIUBAH] Subtitle diubah ke slogan brand */}
                <p className="mt-1 text-[0.65rem] uppercase tracking-[0.3em] text-white/40">
                  top-up semudah turu
                </p>
              </div>
          </div>
        </Link>

        {/* SEARCH trigger */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setOpenSearch(true)}
          onKeyDown={(e) => {
            // ... (logika onKeyDown tidak berubah) ...
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpenSearch(true);
            }
          }}
          // [DIUBAH] Warna ring focus disesuaikan
          className="group hidden flex-1 items-center gap-2 rounded-md bg-[#5a6067] px-4 py-2 text-left text-sm text-white/90 transition hover:bg-[#6a7077] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 md:flex"
        >
          <Search className="h-4 w-4 opacity-80" />
          {/* [DIUBAH] Teks placeholder disesuaikan dengan tone */}
          <span className="flex-1 truncate">
            Cari game... (sambil merem jg bisa)
          </span>

          {/* Locale pill */}
          {/* <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenLocale((p) => !p);
            }}
            className="relative flex items-center gap-2 rounded-md bg-[#101114] px-3 py-1 text-xs font-medium text-white/90"
            aria-haspopup="menu"
            aria-expanded={openLocale}
          >
            <span className="h-4 w-6 overflow-hidden rounded-sm bg-red-600">
              {locale === "id-IDR" ? (
                <>
                  <span className="block h-2 w-full bg-red-600" />
                  <span className="block h-2 w-full bg-white" />
                </>
              ) : (
                <span className="block h-4 w-full bg-blue-600" />
              )}
            </span>
            {locale === "id-IDR" ? "ID / IDR" : "EN / USD"}
            <Globe2 className="h-3.5 w-3.5 opacity-70" />

            {openLocale ? (
              <div
                role="menu"
                className="absolute right-0 top-9 z-[80] w-32 rounded-md border border-white/10 bg-[#2b2a30] text-xs shadow-lg"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setLocale("id-IDR");
                    setOpenLocale(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 hover:bg-white/5"
                >
                  <span className="h-4 w-6 overflow-hidden rounded-sm bg-red-600">
                    <span className="block h-2 w-full bg-red-600" />
                    <span className="block h-2 w-full bg-white" />
                  </span>
                  ID / IDR
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setLocale("en-USD");
                    setOpenLocale(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 hover:bg-white/5"
                >
                  <span className="h-4 w-6 rounded-sm bg-blue-600" />
                  EN / USD
                </button>
              </div>
            ) : null}
          </button> */}

          {/* <kbd className="pointer-events-none hidden select-none items-center gap-1 rounded bg-[#101114] px-2 py-1 text-[10px] text-white/70 md:inline-flex">
            <Keyboard className="mr-1 h-3 w-3 opacity-70" /> Ctrl K
          </kbd> */}
        </div>

        {/* RIGHT NAV */}
        <nav className="hidden items-center gap-5 text-sm md:flex">
          <Link
            href="/"
            className={`relative pb-1 transition ${
              isActive("/") ? "text-white" : "text-white/90 hover:text-white"
            }`}
          >
            Topup
            {/* [DIUBAH] Warna underline aktif */}
            {isActive("/") && (
              <span className="absolute -bottom-[14px] left-0 right-0 mx-auto h-[2px] w-8 rounded-full bg-yellow-400" />
            )}
          </Link>

          <Link
            href="/leaderboard"
            className={`relative pb-1 transition ${
              isActive("/leaderboard") ? "text-white" : "text-white/90 hover:text-white"
            }`}
          >
            Leaderboard
            {/* [DIUBAH] Warna underline aktif */}
            {isActive("/leaderboard") && (
              <span className="absolute -bottom-[14px] left-0 right-0 mx-auto h-[2px] w-8 rounded-full bg-yellow-400" />
            )}
          </Link>

          <Link
            href="/riwayat"
            className={`relative pb-1 transition ${
              isActive("/riwayat")
                ? "text-white"
                : "text-white/70 hover:text-white"
            }`}
          >
            Cek Transaksi
            {/* [DIUBAH] Warna underline aktif */}
            {isActive("/riwayat") && (
              <span className="absolute -bottom-[14px] left-0 right-0 mx-auto h-[2px] w-8 rounded-full bg-yellow-400" />
            )}
          </Link>
        </nav>

        {/* AUTH / PROFILE */}
        <div className="ml-auto flex items-center gap-2">
          {/* jika belum login: tampilkan Masuk/Daftar */}
          {status !== "authenticated" ? (
            <>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/login")}
                className="hidden items-center gap-1 text-white/80 hover:bg-transparent hover:text-white md:inline-flex"
              >
                <LogIn className="h-4 w-4" />
                Masuk
              </Button>
              {/* [DIUBAH] Tombol "Daftar" disesuaikan dengan warna aksen */}
              <Button
                type="button"
                onClick={() => router.push("/register")}
                className="hidden gap-1 bg-yellow-400 font-semibold text-slate-900 hover:bg-yellow-500 md:inline-flex"
              >
                <UserPlus className="h-4 w-4" />
                Daftar
              </Button>
            </>
          ) : (
            // jika sudah login: avatar + dropdown
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenProfile((v) => !v)}
                className="inline-flex items-center gap-2 rounded-full bg-white/5 px-2 py-1 pr-3 text-sm text-white hover:bg-white/10"
                aria-haspopup="menu"
                aria-expanded={openProfile}
              >
                {/* [DIUBAH] Warna fallback avatar disesuaikan */}
                <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-yellow-400 to-cyan-400 text-sm font-bold text-slate-900">
                  {session?.user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.image}
                      alt="avatar"
                      className="h-8 w-8 object-cover"
                    />
                  ) : (
                    <span>{initial}</span>
                  )}
                </span>
                <span className="hidden max-w-[120px] truncate md:inline">
                  {session?.user?.name || session?.user?.email || "User"}
                </span>
              </button>

              {openProfile && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#2b2a30] p-1 text-sm text-white shadow-2xl"
                >
                  <Link
                    href="/profile"
                    onClick={() => setOpenProfile(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/5"
                  >
                    <User2 className="h-4 w-4 text-white/70" />
                    Profile
                  </Link>
                  {/* Biarkan logout tetap merah, karena ini aksi "destruktif" */}
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-red-300 hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ... (Tombol mobile tidak berubah) ... */}
          <button
            type="button"
            onClick={() => setOpenSearch(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/5 text-white hover:bg-white/10 md:hidden"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/5 text-white hover:bg-white/10 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* SEARCH MODAL */}
      <SearchDialog
        open={openSearch}
        onOpenChange={setOpenSearch}
        onSelect={(href) => {
          setOpenSearch(false);
          router.push(href);
        }}
      />
    </>
  );
}

/* ===================== Search Dialog ===================== */

function SearchDialog({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect: (href: string) => void;
}) {
  const [q, setQ] = React.useState("");
  const [cursor, setCursor] = React.useState(0);
  const [recents, setRecents] = React.useState<string[]>([]);

  // ... (logika React.useEffect tidak berubah) ...
  React.useEffect(() => {
    const raw = localStorage.getItem(RECENTS_KEY);
    if (raw) setRecents(JSON.parse(raw));
  }, []);

  const saveRecent = React.useCallback(
    (term: string) => {
      if (!term.trim()) return;
      const next = [term, ...recents.filter((r) => r !== term)].slice(0, 6);
      setRecents(next);
      localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
    },
    [recents]
  );

  const results = React.useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return SAMPLE_ITEMS;
    return SAMPLE_ITEMS.filter(
      (i) =>
        i.title.toLowerCase().includes(term) ||
        i.subtitle?.toLowerCase().includes(term)
    );
  }, [q]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((c) => Math.min(c + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((c) => Math.max(c - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const target = results[cursor];
        if (target) {
          saveRecent(q);
          onSelect(target.href);
        } else if (q.trim()) {
          saveRecent(q);
          onSelect(`/search?q=${encodeURIComponent(q)}`);
        }
      } else if (e.key === "Escape") {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, cursor, q, onSelect, onOpenChange, saveRecent]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl border-0 bg-transparent p-0 shadow-none">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1b1c20]/90 backdrop-blur-xl ring-1 ring-white/10">
          {/* input */}
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <Search className="h-4 w-4 text-white/70" />
            <input
              autoFocus
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setCursor(0);
              }}
              // [DIUBAH] Placeholder modal search
              placeholder="Cari game, voucher... zZz..."
              className="flex-1 bg-transparent text-sm text-white/90 outline-none placeholder:text-white/45"
            />
            {/* ... (sisa modal tidak berubah) ... */}
            <kbd className="hidden select-none rounded bg:white/10 px-2 py-1 text-[10px] text-white/70 md:block">
              Esc
            </kbd>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white/70 transition hover:bg-white/10 hover:text:white"
              aria-label="Tutup"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4 p-4 md:grid-cols-[2fr_1fr]">
            {/* left */}
            <div className="space-y-2">
              {results.length === 0 ? (
                // [DIUBAH] Passing props ke EmptyState
                <EmptyState query={q} />
              ) : (
                <ul className="max-h-[50vh] overflow-y-auto pr-1">
                  {results.map((it, i) => (
                    <li key={it.id}>
                      <button
                        type="button"
                        onMouseEnter={() => setCursor(i)}
                        onClick={() => {
                          saveRecent(q);
                          onSelect(it.href);
                        }}
                        className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition ${
                          i === cursor
                            ? "bg-white/10" // Sorotan tetap netral
                            : "hover:bg-white/5 active:bg-white/10"
                        }`}
                      >
                        <ItemIcon type={it.icon} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white">
                            {it.title}
                          </p>
                          {it.subtitle ? (
                            <p className="truncate text-xs text-white/60">
                              {it.subtitle}
                            </p>
                          ) : null}
                        </div>
                        {it.tag ? (
                          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/80">
                            {it.tag}
                          </span>
                        ) : null}
                        <ArrowRight className="ml-1 h-4 w-4 text-white/40 opacity-0 transition group-hover:opacity-100" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* right */}
            <aside className="space-y-4">
              <Recents
                recents={recents}
                onPick={(r) => {
                  setQ(r);
                  setCursor(0);
                }}
              />

              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/50">
                  {/* [DIUBAH] Ikon disesuaikan dengan aksen */}
                  <Flame className="h-3.5 w-3.5 text-yellow-300" /> Sedang ramai
                </div>
                <div className="space-y-1">
                  {POPULAR.map((p) => (
                    <Link
                      href={p.href}
                      key={p.label}
                      onClick={() => onOpenChange(false)}
                      className="block rounded-md px-2 py-1.5 text-sm text-white/85 transition hover:bg-white/5 hover:text-white"
                    >
                      {p.label}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 text-[11px] text-white/50">
            {/* ... (footer modal tidak berubah) ... */}
            <span>Tekan ↑ ↓ untuk navigasi • Enter untuk pilih</span>
            <span className="hidden md:inline">
              Pintasan: <kbd className="rounded bg-white/10 px-1">Ctrl</kbd>+
              <kbd className="rounded bg-white/10 px-1">K</kbd> atau{" "}
              <kbd className="rounded bg-white/10 px-1">/</kbd>
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ... (Komponen Recents tidak berubah) ...
function Recents({
  recents,
  onPick,
}: {
  recents: string[];
  onPick: (r: string) => void;
}) {
  if (recents.length === 0) return null;
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/50">
        <Clock className="h-3.5 w-3.5" /> Terakhir dicari
      </div>
      <div className="flex flex-wrap gap-2">
        {recents.map((r) => (
          <button
            type="button"
            key={r}
            onClick={() => onPick(r)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 hover:bg-white/10"
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}

// ... (Komponen ItemIcon tidak berubah) ...
function ItemIcon({ type }: { type: Item["icon"] }) {
  const base =
    "h-5 w-5 shrink-0 rounded-md bg-white/10 p-1.5 text-white/80 ring-1 ring-white/10";
  if (type === "game") return <Gamepad2 className={base} />;
  if (type === "voucher") return <Gift className={base} />;
  return <TicketPercent className={base} />;
}

// [DIUBAH] Komponen EmptyState disesuaikan
function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex h-[32vh] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/10 bg-white/[0.02] text-center">
      <Search className="h-6 w-6 text-white/40" />
      <p className="text-sm text-white/70">
        {query
          ? `Nggak nemu apa-apa untuk “${query}”.`
          : "Mulai ketik... jangan sampai turu beneran."}
      </p>
      {!query && (
        <p className="text-xs text-white/40">
          {`Coba: “MLBB”, “Robux”, atau “Voucher... zZz”`}
        </p>
      )}
    </div>
  );
}