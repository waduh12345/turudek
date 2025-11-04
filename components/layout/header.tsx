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
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Oxanium } from "next/font/google";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { authService } from "@/services/api";

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
  { label: "Roblox", href: "/roblox" },
  { label: "Mobile Legends", href: "/mobile-legends" },
  { label: "Genshin Impact", href: "/genshin" },
  { label: "Voucher Google Play", href: "/voucher/google-play" },
];

const RECENTS_KEY = "__kios_tetta_search_recents__";

/* ===================== Profile Menu ===================== */
function ProfileMenu({
  name,
  email,
}: {
  name?: string | null;
  email?: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  const initial = (
    name?.trim()?.charAt(0) ||
    email?.trim()?.charAt(0) ||
    "U"
  )?.toUpperCase();

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleLogout = async () => {
    const ask = await Swal.fire({
      title: "Keluar dari akun?",
      text: "Anda akan keluar dari sesi saat ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, logout",
      cancelButtonText: "Batal",
      reverseButtons: true,
      confirmButtonColor: "#ef4444",
    });
    if (!ask.isConfirmed) return;

    Swal.fire({
      title: "Memproses...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      await authService.logout();
      Swal.close();
      // next-auth signOut ditrigger dari luar komponen ini (atau tambahkan di sini jika perlu)
      window.location.href = "/";
    } catch (err) {
      Swal.close();
      await Swal.fire({
        icon: "error",
        title: "Gagal logout",
        text: err instanceof Error ? err.message : "Terjadi kesalahan.",
      });
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((p) => !p);
        }}
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-2 py-1 pr-3 text-sm text-white hover:bg-white/10"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-xs font-bold ring-1 ring-white/20">
          {initial}
        </span>
        <span className="hidden sm:inline">{name || email || "Profile"}</span>
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-11 z-[90] w-48 overflow-hidden rounded-lg border border-white/10 bg-[#2b2a30] text-sm text-white shadow-xl"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              router.push("/profile");
            }}
            className="flex w-full items-center px-3 py-2 text-left hover:bg-white/5"
          >
            Profile
          </button>
          <div className="my-1 h-px bg-white/10" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              void handleLogout();
            }}
            className="flex w-full items-center px-3 py-2 text-left text-red-300 hover:bg-white/5"
          >
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}

/* ===================== Header ===================== */
export default function GameHeader() {
  const router = useRouter();
  const pathname = usePathname(); // ⬅️ untuk deteksi route aktif
  const [openSearch, setOpenSearch] = React.useState(false);
  const [openLocale, setOpenLocale] = React.useState(false);
  const [locale, setLocale] = React.useState<"id-IDR" | "en-USD">("id-IDR");

  const { data: session, status } = useSession();
  const isAuthed = status === "authenticated";

  // Rule aktif:
  // - Bila berada di /riwayat (atau turunannya) ⇒ "Cek Transaksi" aktif
  // - Selain itu ⇒ "Topup" aktif
  const isRiwayatActive = pathname?.startsWith("/riwayat") ?? false;
  const isTopupActive = !isRiwayatActive;

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

  return (
    <>
      <header className="sticky top-0 z-50 flex h-20 w-full items-center gap-4 border-b border-white/70 bg-[#37353E]/95 px-4 text-white backdrop-blur md:px-8">
        {/* LEFT: logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-700 ring-2 ring-red-500/40 shadow-md">
            <Image
              src="/images/LOGO.png"
              alt="logo"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>

          <div className="leading-none">
            <span
              className={`${oxanium.className} text-[1.5rem] md:text-[1.7rem] font-semibold tracking-[0.02em] text-white drop-shadow`}
            >
              Kios{" "}
              <span className="bg-gradient-to-r from-red-400 via-red-200 to-amber-200 bg-clip-text text-transparent">
                Tetta
              </span>
            </span>
            <p className="mt-1 text-[0.65rem] uppercase tracking-[0.3em] text-white/35">
              premium gaming store
            </p>
          </div>
        </div>

        {/* SEARCH trigger */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setOpenSearch(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpenSearch(true);
            }
          }}
          className="group hidden flex-1 items-center gap-2 rounded-md bg-[#5a6067] px-4 py-2 text-left text-sm text-white/90 transition hover:bg-[#6a7077] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 md:flex"
        >
          <Search className="h-4 w-4 opacity-80" />
          <span className="flex-1 truncate">Cari Game atau Voucher</span>

          {/* Badge bahasa */}
          <button
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
          </button>

          <kbd className="pointer-events-none hidden select-none items-center gap-1 rounded bg-[#101114] px-2 py-1 text-[10px] text-white/70 md:inline-flex">
            <Keyboard className="mr-1 h-3 w-3 opacity-70" /> Ctrl K
          </kbd>
        </div>

        {/* NAV kanan — aktif berdasarkan pathname */}
        <nav className="hidden items-center gap-5 text-sm md:flex">
          <Link
            href="/"
            aria-current={isTopupActive ? "page" : undefined}
            className={`relative pb-1 transition ${
              isTopupActive ? "text-white" : "text-white/70 hover:text-white"
            }`}
          >
            Topup
            {isTopupActive && (
              <span className="absolute -bottom-[14px] left-0 right-0 mx-auto h-[2px] w-8 rounded-full bg-red-500" />
            )}
          </Link>

          <Link
            href="/riwayat"
            aria-current={isRiwayatActive ? "page" : undefined}
            className={`relative pb-1 transition ${
              isRiwayatActive ? "text-white" : "text-white/70 hover:text-white"
            }`}
          >
            Cek Transaksi
            {isRiwayatActive && (
              <span className="absolute -bottom-[14px] left-0 right-0 mx-auto h-[2px] w-8 rounded-full bg-red-500" />
            )}
          </Link>
        </nav>

        {/* Auth & mobile btns */}
        <div className="ml-auto flex items-center gap-2">
          {isAuthed ? (
            <ProfileMenu
              name={session?.user?.name}
              email={session?.user?.email}
            />
          ) : (
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
              <Button
                type="button"
                onClick={() => router.push("/register")}
                className="hidden gap-1 bg-red-600 text-white hover:bg-red-700 md:inline-flex"
              >
                <UserPlus className="h-4 w-4" />
                Daftar
              </Button>
            </>
          )}

          {/* mobile search */}
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

      {/* MODAL SEARCH */}
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
              placeholder="Cari game, voucher, atau promo…"
              className="flex-1 bg-transparent text-sm text-white/90 outline-none placeholder:text-white/45"
            />
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
              <ul className="max-h-[50vh] overflow-y-auto pr-1">
                {results.length === 0 ? (
                  <EmptyState query={q} />
                ) : (
                  results.map((it, i) => (
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
                            ? "bg-white/10"
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
                  ))
                )}
              </ul>
            </div>

            {/* right */}
            <aside className="space-y-4">
              {recents.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/50">
                    <Clock className="h-3.5 w-3.5" /> Terakhir dicari
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recents.map((r) => (
                      <button
                        type="button"
                        key={r}
                        onClick={() => {
                          setQ(r);
                          setCursor(0);
                        }}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 hover:bg-white/10"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/50">
                  <Flame className="h-3.5 w-3.5 text-amber-300" /> Sedang ramai
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

/* kecil-kecil */
function ItemIcon({ type }: { type: Item["icon"] }) {
  const base =
    "h-5 w-5 shrink-0 rounded-md bg-white/10 p-1.5 text-white/80 ring-1 ring-white/10";
  if (type === "game") return <Gamepad2 className={base} />;
  if (type === "voucher") return <Gift className={base} />;
  return <TicketPercent className={base} />;
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex h-[32vh] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/10 bg-white/[0.02] text-center">
      <Search className="h-6 w-6 text-white/40" />
      <p className="text-sm text-white/70">
        {query
          ? `Tidak ada hasil untuk “${query}”.`
          : "Mulai ketik untuk mencari."}
      </p>
      {!query && (
        <p className="text-xs text-white/40">{`Coba: “Roblox”, “ML 86”, atau “Google Play”.`}</p>
      )}
    </div>
  );
}