"use client";

import { Suspense, useMemo, useState, useEffect, useRef } from "react";
import AuthShell from "@/components/layout/auth-layout";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  UserPlus,
  ChevronDown,
  RefreshCw,
} from "lucide-react";

const IMAGES = [
  "https://sbclbzad8s.ufs.sh/f/vI07edVR8nimtllao8hYidk98PawCcYsQeGWzDAZKoTE27Uj",
  "https://sbclbzad8s.ufs.sh/f/vI07edVR8nimDSp3XSfhL7C3cYxqIiQbSMGODFm6XR0TneJN",
  "https://sbclbzad8s.ufs.sh/f/vI07edVR8nimgQsYrseQOog5Zk3ISM2KXlYf9umeLx7F0A8q",
];

type Country = { code: string; dial: string; label: string; emoji: string };

const COUNTRIES: Country[] = [
  { code: "ID", dial: "+62", label: "Indonesia", emoji: "🇮🇩" },
  { code: "MY", dial: "+60", label: "Malaysia", emoji: "🇲🇾" },
  { code: "SG", dial: "+65", label: "Singapore", emoji: "🇸🇬" },
];

function RegisterContent() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const [wa, setWa] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [agree, setAgree] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const [openC, setOpenC] = useState(false);
  const ddRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ddRef.current) return;
      if (!ddRef.current.contains(e.target as Node)) setOpenC(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  const dialWidthClass = useMemo(
    () => (country.dial.length >= 3 ? "w-28" : "w-24"),
    [country]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOk("");

    if (!agree) {
      setError("Silakan setujui Syarat & Ketentuan serta Kebijakan Pribadi.");
      return;
    }
    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }
    if (password !== confirm) {
      setError("Konfirmasi kata sandi tidak sama.");
      return;
    }
    if (!/^[a-z0-9_\.]+$/i.test(username)) {
      setError("Username hanya boleh huruf, angka, titik, dan underscore.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: fullName,
        username,
        email,
        whatsapp: `${country.dial}${wa.trim()}`,
        password,
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(j?.message || "Registrasi gagal.");
      }

      setOk("Registrasi berhasil. Silakan login.");
      setFullName("");
      setUsername("");
      setEmail("");
      setWa("");
      setPassword("");
      setConfirm("");
      setAgree(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registrasi gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      images={IMAGES}
      title="Daftar"
      brand="Kios Tetta"
      slideIntervalMs={3000}
    >
      <p className="mb-6 text-white/80">
        Masukkan informasi pendaftaran yang valid.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row: nama & username */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-white/80">
              Nama lengkap
            </label>
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.currentTarget.value)}
                placeholder="Nama lengkap"
                required
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-rose-500/60"
              />
              <User className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/80">Username</label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
                placeholder="Username"
                required
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-rose-500/60"
              />
            </div>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block text-sm text-white/80">
            Alamat email
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              placeholder="Alamat email"
              required
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-rose-500/60"
            />
            <Mail className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
          </div>
        </div>

        {/* Nomor WhatsApp */}
        <div>
          <label className="mb-2 block text-sm text-white/80">
            Nomor whatsapp
          </label>
          <div className="flex gap-2">
            <div className={`relative ${dialWidthClass}`} ref={ddRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenC((p) => !p);
                }}
                className="flex h-[44px] w-full items-center justify-between rounded-lg border border-white/15 bg-white/5 px-3 text-sm text-white"
                aria-haspopup="listbox"
                aria-expanded={openC}
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg leading-none">{country.emoji}</span>
                  <span className="text-white/90">{country.dial}</span>
                </span>
                <ChevronDown className="h-4 w-4 text-white/60" />
              </button>

              {openC && (
                <ul
                  className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-white/10 bg-[#1c1c20] p-1 text-sm shadow-xl"
                  role="listbox"
                >
                  {COUNTRIES.map((c) => (
                    <li key={c.code}>
                      <button
                        type="button"
                        onClick={() => {
                          setCountry(c);
                          setOpenC(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-white/90 hover:bg-white/5"
                        role="option"
                        aria-selected={c.code === country.code}
                      >
                        <span className="text-lg leading-none">{c.emoji}</span>
                        <span className="flex-1">{c.label}</span>
                        <span className="opacity-70">{c.dial}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <input
              type="tel"
              inputMode="numeric"
              value={wa}
              onChange={(e) =>
                setWa(e.currentTarget.value.replace(/[^\d]/g, ""))
              }
              placeholder="8xxxxxxxxxx"
              required
              className="flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-rose-500/60"
            />
          </div>
        </div>

        {/* Passwords */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-white/80">
              Kata sandi
            </label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                placeholder="Kata sandi"
                required
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-3 pr-10 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-rose-500/60"
              />
              <button
                type="button"
                onClick={() => setShowPwd((p) => !p)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-white/60 hover:bg-white/10"
                aria-label="Toggle password"
              >
                {showPwd ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/80">
              Konfirmasi kata sandi
            </label>
            <div className="relative">
              <input
                type={showConf ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.currentTarget.value)}
                placeholder="Konfirmasi kata sandi"
                required
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-3 pr-10 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-rose-500/60"
              />
              <button
                type="button"
                onClick={() => setShowConf((p) => !p)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-white/60 hover:bg-white/10"
                aria-label="Toggle confirm password"
              >
                {showConf ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
            </div>
          </div>
        </div>

        {/* Agree */}
        <label className="mt-2 flex items-start gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.currentTarget.checked)}
            className="mt-0.5 h-4 w-4 rounded border-white/20 bg-transparent accent-rose-600"
          />
          <span>
            Saya setuju dengan{" "}
            <Link
              href="/terms"
              className="text-rose-300 underline-offset-4 hover:underline"
            >
              Syarat dan Ketentuan
            </Link>{" "}
            dan{" "}
            <Link
              href="/privacy"
              className="text-rose-300 underline-offset-4 hover:underline"
            >
              Kebijakan Pribadi
            </Link>
            .
          </span>
        </label>

        {/* Alerts */}
        {error && (
          <div className="rounded-md border border-red-500/40 bg-red-500/15 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}
        {ok && (
          <div className="rounded-md border border-emerald-500/40 bg-emerald-500/15 px-3 py-2 text-sm text-emerald-200">
            {ok}
          </div>
        )}

        {/* Submit — RED THEME */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
        >
          {loading ? (
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <UserPlus className="h-5 w-5" />
              <span>Daftar</span>
            </>
          )}
        </button>

        <p className="text-center text-sm text-white/70">
          Sudah memiliki akun?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-rose-300 underline-offset-4 hover:underline"
          >
            Masuk
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#141417] text-white">
          Loading…
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}