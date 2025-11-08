// app/kontak/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

type IssueFor = "individu" | "reseller" | "bisnis";
type IssueType =
  | "kendala-transaksi"
  | "saldo-refund"
  | "kerja-sama"
  | "komplain"
  | "lainnya";

// [DIUBAH] Key disesuaikan dengan brand
const LS_KEY = "__turu_store_contact_draft__";

export default function ContactPage() {
  const [forWho, setForWho] = useState<IssueFor>("individu");
  const [issueType, setIssueType] = useState<IssueType>("kendala-transaksi");
  const [name, setName] = useState("");
  const [wa, setWa] = useState("");
  const [desc, setDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // ... (Logika useEffect (restore/save draft) tidak berubah) ...
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        setForWho(d.forWho ?? "individu");
        setIssueType(d.issueType ?? "kendala-transaksi");
        setName(d.name ?? "");
        setWa(d.wa ?? "");
        setDesc(d.desc ?? "");
      }
    } catch {}
  }, []);

  useEffect(() => {
    const draft = { forWho, issueType, name, wa, desc };
    localStorage.setItem(LS_KEY, JSON.stringify(draft));
  }, [forWho, issueType, name, wa, desc]);

  // ... (Logika onSubmit tidak berubah) ...
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // validasi sederhana
    if (!name.trim() || !wa.trim() || !desc.trim()) {
      alert("Nama, WhatsApp, dan Deskripsi wajib diisi.");
      return;
    }
    setSubmitting(true);
    // simulasi submit
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setDone(true);
    localStorage.removeItem(LS_KEY);
  };

  return (
    <main className="min-h-screen bg-[#1c1c20] text-white">
      {/* Hero Section */}
      {/* [DIUBAH] Gradient glow disesuaikan dari 'rose' ke 'yellow' */}
      <section className="border-b border-white/10 bg-gradient-to-b from-yellow-500/10 via-[#1c1c20] to-[#1c1c20]">
        <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              {/* [DIUBAH] Teks subtitle disesuaikan */}
              <p className="text-sm tracking-wide text-yellow-400/90">
                Turu Store • ADMIN MELEK 24/7
              </p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
                Hubungi Kami
              </h1>
              {/* [DIUBAH] Deskripsi disesuaikan */}
              <p className="mt-3 max-w-2xl text-white/70">
                Ada kendala transaksi? Mau jadi reseller atau partner bisnis? Tim{" "}
                <span className="text-yellow-400">Turu Store</span> yang lagi
                melek siap bantu kebutuhanmu.
              </p>
            </div>

            <div className="grid gap-3 text-sm">
              <InfoRow
                icon={<MapPin className="h-4 w-4" />}
                text="Bandung, Indonesia"
              />
              <InfoRow
                icon={<Mail className="h-4 w-4" />}
                text="support@turustore.com"
                href="mailto:support@turustore.com"
              />
              <InfoRow
                icon={<Phone className="h-4 w-4" />}
                text="+62 812-0000-0000"
                href="https://wa.me/6281200000000"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          {/* FORM */}
          <div className="rounded-2xl bg-[#232228] p-5 ring-1 ring-white/10 md:p-6">
            <div className="mb-5 flex items-center gap-2">
              {/* [DIUBAH] Ikon disesuaikan dengan aksen kuning */}
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-400 ring-1 ring-yellow-400/30">
                <MessageSquare className="h-5 w-5 text-slate-900" />
              </div>
              <div>
                {/* [DIUBAH] Judul form disesuaikan */}
                <h2 className="text-lg font-semibold">
                  Ada Kendala? Lapor Sini
                </h2>
                {/* [DIUBAH] Sub-judul form disesuaikan */}
                <p className="text-xs text-white/60">
                  Isi data di bawah, admin kami yang nolep bakal langsung cek.
                </p>
              </div>
            </div>

            {/* [TETAP] Tampilan 'done' (sukses) tetap hijau (emerald), ini universal */}
            {done ? (
              <div className="flex items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                <CheckCircle2 className="mt-[2px] h-5 w-5 text-emerald-400" />
                <div className="text-sm">
                  <p className="font-medium text-emerald-300">
                    Laporan terkirim!
                  </p>
                  <p className="mt-1 text-white/70">
                    Terima kasih. Tim kami akan menghubungimu melalui WhatsApp
                    atau email secepatnya.
                  </p>
                </div>
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="mt-5 space-y-5">
              {/* Untuk siapa */}
              <div className="grid gap-2">
                <label className="text-sm text-white/80">Untuk</label>
                <select
                  value={forWho}
                  onChange={(e) => setForWho(e.target.value as IssueFor)}
                  // [DIUBAH] Warna focus ring
                  className="rounded-lg bg-[#2c2b31] px-3 py-2.5 text-sm ring-1 ring-white/10 outline-none focus:ring-yellow-500/40"
                >
                  <option value="individu">Individu</option>
                  <option value="reseller">Reseller</option>
                  <option value="bisnis">Bisnis / Kemitraan</option>
                </select>
              </div>

              {/* Tipe */}
              <div className="grid gap-2">
                <label className="text-sm text-white/80">Tipe</label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value as IssueType)}
                  // [DIUBAH] Warna focus ring
                  className="rounded-lg bg-[#2c2b31] px-3 py-2.5 text-sm ring-1 ring-white/10 outline-none focus:ring-yellow-500/40"
                >
                  <option value="kendala-transaksi">Kendala Transaksi</option>
                  <option value="saldo-refund">Saldo / Refund</option>
                  <option value="kerja-sama">Kerja Sama / Partnership</option>
                  <option value="komplain">Komplain</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>

              {/* Nama */}
              <Field
                label="Nama Kamu"
                placeholder="Nama lengkap"
                value={name}
                onChange={setName}
              />

              {/* WhatsApp */}
              <div className="grid gap-2">
                <label className="text-sm text-white/80">Nomor WhatsApp</label>
                <div className="flex gap-2">
                  <span className="inline-flex items-center rounded-lg bg-[#2c2b31] px-3 py-2.5 text-sm ring-1 ring-white/10">
                    +62
                  </span>
                  <input
                    value={wa}
                    onChange={(e) => setWa(e.target.value)}
                    inputMode="numeric"
                    placeholder="8xxxxxxxxxx"
                    // [DIUBAH] Warna focus ring
                    className="flex-1 rounded-lg bg-[#2c2b31] px-3 py-2.5 text-sm ring-1 ring-white/10 outline-none placeholder:text-white/40 focus:ring-yellow-500/40"
                  />
                </div>
                {/* [DIUBAH] Teks bantuan disesuaikan */}
                <p className="text-xs text-white/45">
                  Pastikan aktif, admin kami akan menghubungimu dari CS resmi.
                </p>
              </div>

              {/* Deskripsi */}
              <div className="grid gap-2">
                <label className="text-sm text-white/80">Deskripsi</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Jelaskan kendala atau kebutuhanmu secara singkat dan jelas..."
                  // [DIUBAH] Warna focus ring
                  className="min-h-32 rounded-lg bg-[#2c2b31] px-3 py-2.5 text-sm ring-1 ring-white/10 outline-none placeholder:text-white/40 focus:ring-yellow-500/40"
                />
              </div>

              {/* [DIUBAH] Data aman disesuaikan dengan aksen kuning & voice */}
              <div className="flex items-center gap-2 rounded-lg bg-yellow-600/10 px-3 py-2 ring-1 ring-yellow-800/40">
                <ShieldCheck className="h-4 w-4 text-yellow-300" />
                <p className="text-xs text-white/70">
                  Data lo aman, cuma buat ngurusin laporan ini. Santai.
                </p>
              </div>

              <div className="pt-2">
                {/* [DIUBAH] Tombol submit disesuaikan dengan aksen kuning */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-lg ring-1 ring-yellow-400/30 transition hover:bg-yellow-500 disabled:opacity-60"
                >
                  {submitting ? "Mengirim..." : "Kirim Pesan"}
                </button>
              </div>
            </form>
          </div>

          {/* SIDE: Quick info */}
          <aside className="space-y-6">
            <Card
              title="Kenapa pilih Turu Store?"
              items={[
                "Transaksi instan (semudah turu)",
                "Diskon & promo kaum rebahan",
                "Payment lengkap & aman",
                "Admin Nolep 24/7", // [DIUBAH] Voice
              ]}
            />
            <Card
              title="Jam Operasional"
              items={[
                "Online 24 jam",
                "Fast respon (kecuali adminnya turu)", // [DIUBAH] Voice
                "Prioritas tiket komplain transaksi",
              ]}
            />
            <Card
              title="Channel Resmi"
              items={[
                "Email: support@turustore.com",
                "Instagram: @turustore_id", // [DIUBAH] Placeholder
                "WhatsApp: 0812-0000-0000",
              ]}
            />
          </aside>
        </div>
      </section>
    </main>
  );
}

/* ---------- Small helpers ---------- */

function InfoRow({
  icon,
  text,
  href,
}: {
  icon: React.ReactNode;
  text: string;
  href?: string;
}) {
  const Comp = href ? "a" : "div";
  return (
    <Comp
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      className="inline-flex items-center gap-2 text-white/80 hover:text-white"
    >
      {/* [DIUBAH] Ikon disesuaikan dengan aksen kuning */}
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-yellow-600/20 text-yellow-300 ring-1 ring-yellow-400/20">
        {icon}
      </span>
      <span className="text-sm">{text}</span>
    </Comp>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <label className="text-sm text-white/80">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        // [DIUBAH] Warna focus ring
        className="rounded-lg bg-[#2c2b31] px-3 py-2.5 text-sm ring-1 ring-white/10 outline-none placeholder:text-white/40 focus:ring-yellow-500/40"
      />
    </div>
  );
}

function Card({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl bg-[#232228] p-5 ring-1 ring-white/10">
      <h3 className="text-base font-semibold">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-white/75">
        {items.map((it) => (
          <li
            key={it}
            className="flex items-start gap-2 rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10"
          >
            {/* [DIUBAH] Bullet point disesuaikan dengan aksen kuning */}
            <span className="mt-0.5 inline-block h-1.5 w-1.5 rounded-full bg-yellow-400" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}