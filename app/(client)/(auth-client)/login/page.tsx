"use client";

import { useState, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Zap } from "lucide-react";
import AuthShell from "@/components/layout/auth-layout";
import Link from "next/link";

// === sinkron dengan header ===
const AUTH_BC = "auth-channel";
const AUTH_LS_KEY = "__auth_event__";

// helper kecil pengganti ErrorHandler
const getErrorMessage = (e: unknown): string =>
  e instanceof Error ? e.message : "Terjadi kesalahan tak terduga.";

const IMAGES = [
  "https://sbclbzad8s.ufs.sh/f/vI07edVR8nim9Ngqsm2QEcgVHXfOJ2jIWpBKYd8hD1lPq3io",
  "https://sbclbzad8s.ufs.sh/f/vI07edVR8nimlYqtfV3XrjwVi4PSLf6c0GQ2WEMvdhoeTKA3",
  "https://sbclbzad8s.ufs.sh/f/vI07edVR8nimEOuFH8oPsbtT2hoF87k1RpvmaNWLeiQZ9A4w",
];

function LoginContent() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const router = useRouter();
  const { update } = useSession(); // <-- penting: untuk realtime session

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false, // handle redirect manual
      });

      if (result?.error) {
        setError("Email atau password salah.");
        return;
      }

      // Paksa NextAuth refresh & broadcast session ke seluruh app
      await update(); // <--- kunci realtime header berubah ke avatar

      // (opsional) tetap kirim sinyal lokal untuk komponen lain yang listen ke BC/LS
      try {
        localStorage.setItem(AUTH_LS_KEY, `login:${Date.now()}`);
      } catch {
        /* noop */
      }
      try {
        if (typeof BroadcastChannel !== "undefined") {
          const bc = new BroadcastChannel(AUTH_BC);
          bc.postMessage("login");
          bc.close();
        }
      } catch {
        /* noop */
      }

      router.replace("/");
      router.refresh(); // kalau ada Server Components yang baca session server-side
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      images={IMAGES}
      title="Masuk"
      brand="Kios Tetta"
      slideIntervalMs={3000}
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm text-white/80">Email</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-rose-500/60"
            />
            <Mail className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/80">Password</label>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-3 pr-10 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-rose-500/60"
            />
            <button
              type="button"
              onClick={() => setShow((p) => !p)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-white/60 hover:bg-white/10"
              aria-label="Toggle password"
            >
              {show ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-red-500/40 bg-red-500/15 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
        >
          {loading ? (
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <Zap className="h-4 w-4" />
              <span>Masuk</span>
            </>
          )}
        </button>

        <p className="text-center text-xs text-white/60">
          Belum punya akun?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-rose-300 underline-offset-4 hover:underline"
          >
            Daftar sekarang
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
      <LoginContent />
    </Suspense>
  );
}