// app/game/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getGameBySlug, GAMES } from "@/lib/games";
import GameTopupDetail from "@/components/section/game-topup-detail";
import FaqList, { FaqItem } from "@/components/faq-list";

export default function GamePage({ params }: { params: { slug: string } }) {
  const game = getGameBySlug(params.slug);
  if (!game) return notFound();

  // FAQ dummy — kalau punya API/DB tinggal ganti map-nya per game.slug
  const faqs: FaqItem[] = [
    {
      q: `Bagaimana cara top up ${game.title}?`,
      a: "Masukkan ID, pilih nominal, pilih pembayaran, isi kontak, lalu bayar. Order diproses otomatis.",
    },
    {
      q: "Metode pembayaran apa saja yang tersedia?",
      a: "QRIS, e-wallet populer, Virtual Account bank, minimarket, dan transfer bank.",
    },
    {
      q: "Berapa lama prosesnya?",
      a: "Umumnya 1–3 detik setelah pembayaran terkonfirmasi.",
    },
    {
      q: "Apakah aman?",
      a: "Kami gunakan payment gateway resmi, data terenkripsi, dan support 24/7.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#222227]">
      <GameTopupDetail game={game} />
      {/* Deskripsi singkat (opsional) */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="rounded-2xl bg-[#2c2b31] p-4 ring-1 ring-white/10">
          <div className="text-sm font-semibold text-white/90">
            Deskripsi {game.title}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            Top up {game.title} harga promo tiap hari. Masukkan data yang benar
            agar order otomatis masuk. Jika ada kendala, gunakan tombol Chat CS.
          </p>
        </div>
      </section>

      {/* FAQ dari file terpisah */}
      <FaqList items={faqs} />
    </main>
  );
}

// (Opsional) generateStaticParams kalau pakai SSG
export function generateStaticParams() {
  return GAMES.map((g) => ({ slug: g.slug }));
}