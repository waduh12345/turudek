"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronRight, Flame } from "lucide-react";

// [DIUBAH] Menyesuaikan FAQ agar lebih on-brand
const faqs = [
  {
    question: "Apakah Diamond/Chip/Voucher dari Turu Store Legal?",
    answer:
      "100% legal dan aman. Semua item, diamond, dan voucher di Turu Store resmi. Jadi, lo bisa top-up sambil turu dengan tenang. Anti-minus, anti-ban.",
  },
  {
    question: "Gimana Cara Top-Up di Sini?",
    answer:
      "Gampang banget, semudah turu: Pilih game, masukkan ID lo, pilih nominal, bayar. Item auto-masuk ke akun lo. Gak pake ribet.",
  },
  {
    question: "Bisa Bayar Pake Pulsa?",
    answer:
      "Bisa dong. Kami support pembayaran via pulsa untuk operator yang tersedia di sistem kami.",
  },
  {
    question: "Udah Bayar, Tapi Item Belum Masuk?",
    answer:
      "Santai. Tunggu dulu 15 menit, kadang lagi delay. Kalau masih belum masuk juga, langsung colek admin kami yang lagi melek 24/7. Cek tombol chat di kanan bawah.",
  },
  {
    question: "Kenapa Harus Top-Up di Turu Store?",
    answer:
      "Karena harga kami harga rebahan (murah), prosesnya secepat kilat (instan), bayarnya bisa pake apa aja, dan pastinya 100% legal.",
  },
];

const FAQ = () => {
  return (
    <section className="relative">
      {/* Backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-black" />
      {/* [DIUBAH] Glow merah diubah jadi kuning */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-56 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(250,204,21,0.25),rgba(250,204,21,0)_60%)]" />
      <div className="pointer-events-none absolute left-1/2 top-28 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-yellow-600/20 blur-[90px]" />

      <div className="container pt-14 pb-32">
        {/* Hero */}
        <header className="mb-8 flex items-center gap-3">
          {/* [DIUBAH] Ikon disesuaikan dengan aksen kuning */}
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-yellow-500/40 bg-yellow-600/10 text-yellow-300">
            <Flame className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-wide text-white">
              Pusat Bantuan (FAQ)
            </h1>
            {/* [DIUBAH] Subtitle disesuaikan dengan voice & palet */}
            <p className="text-sm text-yellow-200/80">
              Jawaban cepat biar lo nggak pusing (dan bisa lanjut turu).
            </p>
          </div>
        </header>

        {/* Accordion */}
        <Accordion.Root
          type="single"
          collapsible
          // [DIUBAH] Border disesuaikan dengan aksen kuning
          className="mx-auto w-full max-w-3xl rounded-2xl border border-yellow-500/30 bg-zinc-950/80 p-2 shadow-[0_15px_40px_-20px_rgba(0,0,0,.85)] backdrop-blur"
        >
          {faqs.map((faq, i) => (
            <Accordion.Item
              key={i}
              value={`item-${i}`}
              className="group rounded-xl border border-zinc-800/80 bg-black/40 p-2 + mb-3 last:mb-0"
            >
              <Accordion.Header>
                <Accordion.Trigger
                  className="
                    group/btn flex w-full items-center justify-between gap-3 rounded-lg
                    px-4 py-3 text-left outline-none transition
                    hover:bg-yellow-600/10
                    focus-visible:ring-2 focus-visible:ring-yellow-500
                    data-[state=open]:bg-yellow-600/15
                  "
                >
                  <span className="text-[15px] font-semibold leading-snug text-white">
                    {faq.question}
                  </span>

                  {/* Chevron */}
                  {/* [DIUBAH] Chevron disesuaikan dengan aksen kuning */}
                  <span
                    className="
                      inline-flex h-8 w-8 items-center justify-center rounded-full
                      border border-yellow-600/40 bg-yellow-600/10 text-yellow-200
                      transition-transform duration-300
                      group-data-[state=open]:rotate-90
                    "
                  >
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>

              {/* Content (sudah netral, tidak perlu diubah) */}
              <Accordion.Content
                className="
                  grid grid-rows-[0fr] overflow-hidden px-4 transition-[grid-template-rows] duration-300 ease-out
                  data-[state=open]:grid-rows-[1fr]
                "
              >
                <div className="min-h-0">
                  <div className="mt-3 rounded-lg border border-zinc-800 bg-black/50 p-4 text-sm leading-relaxed text-zinc-300">
                    {faq.answer}
                  </div>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>

        {/* CTA strip */}
        {/* [DIUBAH] CTA strip disesuaikan dengan aksen kuning & voice */}
        <div className="mx-auto mt-8 w-full max-w-3xl rounded-xl border border-yellow-600/30 bg-yellow-600/10 p-4 text-center text-sm text-yellow-100">
          Masih bingung?{" "}
          <a
            href="/contact"
            className="font-semibold text-white underline underline-offset-4 hover:text-yellow-200"
          >
            Tanya admin kami yang nolep 24/7
          </a>
          .
        </div>
      </div>
    </section>
  );
};

export default FAQ;