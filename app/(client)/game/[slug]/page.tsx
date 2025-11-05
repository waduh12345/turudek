"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Shield,
  Clock,
  AlertCircle,
  Loader2,
  Star,
  Play,
  Youtube,
} from "lucide-react";

import {
  publicProductCategoriesService,
  PublicProductCategory,
} from "@/services/api/public-product-categories";
import {
  publicProductsService,
  PublicProduct,
} from "@/services/api/public-products";
import { checkoutService, CheckoutRequest } from "@/services/api/checkout";
import { useApiCall, useAuth } from "@/hooks";

const DUMMY_IMG =
  "https://sbclbzad8s.ufs.sh/f/vI07edVR8nimBHyqimTrX8OM2IxYqlGKDH6TeJ5faC7mvZAn";

/* ====== UI helpers ====== */
const currency = (n: string | number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(typeof n === "string" ? parseFloat(n) : n);

/* ====== Dummy review & payment list (UI only) ====== */
const testimonials = [
  {
    id: 1,
    title: "Top up instan, aman, mantap!",
    name: "Reza",
    rating: 5,
    thumbnail:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640&q=70&auto=format&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: 2,
    title: "Harga bersaing, CS responsif",
    name: "Nadia",
    rating: 5,
    thumbnail:
      "https://images.unsplash.com/photo-1522125670776-3c7abb882bc2?w=640&q=70&auto=format&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: 3,
    title: "Pembayaran banyak pilihan",
    name: "Bagus",
    rating: 4,
    thumbnail:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=640&q=70&auto=format&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
  },
];

const paymentMethods = [
  { name: "QRIS", logo: "📱" },
  { name: "DANA", logo: "💜" },
  { name: "OVO", logo: "💙" },
  { name: "GoPay", logo: "💚" },
  { name: "ShopeePay", logo: "🛍️" },
  { name: "BCA VA", logo: "🏦" },
  { name: "BNI VA", logo: "🏦" },
  { name: "BRI VA", logo: "🏦" },
  { name: "Mandiri", logo: "🏦" },
  { name: "Indomaret", logo: "🏪" },
  { name: "Alfamart", logo: "🏪" },
  { name: "VISA/MC", logo: "💳" },
];

export default function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const { user, isAuthenticated } = useAuth();

  const [category, setCategory] = useState<PublicProductCategory | null>(null);
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PublicProduct | null>(
    null
  );

  const [customerNo, setCustomerNo] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [isFormValid, setIsFormValid] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // fetch category
  const {
    data: categoryData,
    loading: categoryLoading,
    error: categoryError,
    execute: fetchCategory,
  } = useApiCall(() =>
    publicProductCategoriesService.getProductCategory(resolvedParams.slug)
  );

  // fetch products for category
  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
    execute: fetchProducts,
  } = useApiCall(() => {
    if (categoryData?.data?.id) {
      return publicProductsService.getProducts({
        page: 1,
        paginate: 100,
        status: 1,
        product_category_id: categoryData.data.id,
      });
    }
    return Promise.resolve(null);
  });

  useEffect(() => {
    fetchCategory();
  }, [resolvedParams.slug, fetchCategory]);

  useEffect(() => {
    if (categoryData?.data) {
      setCategory(categoryData.data);
      fetchProducts();
    }
  }, [categoryData, fetchProducts]);

  useEffect(() => {
    if (productsData?.data?.data) setProducts(productsData.data.data);
  }, [productsData]);

  useEffect(() => {
    const valid =
      customerNo.trim() !== "" &&
      selectedPackage !== null &&
      customerPhone.trim() !== "";
    setIsFormValid(valid);
  }, [customerNo, selectedPackage, customerPhone]);

  const handleCheckout = async () => {
    if (!selectedPackage || !isFormValid) return;

    setIsCheckoutLoading(true);
    setCheckoutError(null);
    setCheckoutSuccess(false);

    try {
      const payload: CheckoutRequest = {
        user_id: isAuthenticated && user?.id ? parseInt(user.id) : undefined,
        product_id: selectedPackage.id,
        customer_no: customerNo,
        customer_name: customerName.trim() || undefined,
        customer_email: customerEmail.trim() || undefined,
        customer_phone: customerPhone,
      };

      const resp = await checkoutService.checkout(payload);

      if (resp.data) {
        // reset form
        setCustomerNo("");
        setCustomerName("");
        setCustomerEmail("");
        setCustomerPhone("");
        setSelectedPackage(null);

        setCheckoutSuccess(true);

        if (resp.data.payment_link) {
          setTimeout(() => {
            setIsRedirecting(true);
            try {
              window.location.href = resp.data.payment_link;
            } catch {
              window.open(resp.data.payment_link, "_blank");
            }
          }, 1500);
        }
      }
    } catch (e: unknown) {
      setCheckoutError(
        e instanceof Error
          ? e.message
          : "Terjadi kesalahan saat memproses checkout"
      );
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const onWatch = (id: string) =>
    window.open(`https://www.youtube.com/watch?v=${id}`, "_blank");

  /* ====== loading / error ====== */
  if (categoryLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-[#141316] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-rose-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-1">Memuat produk…</h1>
          <p className="text-white/70">
            Mohon tunggu, kami mengambil data kategori & paket.
          </p>
        </div>
      </div>
    );
  }

  if (categoryError || productsError || !category) {
    return (
      <div className="min-h-screen bg-[#141316] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Gagal memuat produk
          </h1>
          <p className="text-white/70 mb-6">
            Ada masalah saat memuat detail produk.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => {
                fetchCategory();
                fetchProducts();
              }}
              className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors"
            >
              Coba Lagi
            </button>
            <Link
              href="/produk"
              className="bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              Kembali ke Katalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ====== page ====== */
  return (
    <main className="min-h-screen bg-[#0F0E12] text-white">
      {/* Breadcrumb */}
      <div className="border-b border-white/10 bg-[#141316]">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm text-white/70">
            <Link href="/" className="hover:text-rose-400">
              Home
            </Link>
            <ChevronRight size={16} className="text-white/30" />
            <Link href="/produk" className="hover:text-rose-400">
              Search
            </Link>
            <ChevronRight size={16} className="text-white/30" />
            <span className="text-white">{category.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Card */}
            <div className="overflow-hidden rounded-2xl ring-1 ring-white/10 bg-gradient-to-br from-[#17151A] to-[#0F0E12]">
              <div className="relative w-full aspect-[16/7]">
                <Image
                  src={category.image || DUMMY_IMG}
                  alt={category.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h1 className="text-3xl md:text-4xl font-extrabold">
                    {category.title}
                  </h1>
                  {category.sub_title && (
                    <p className="mt-1 text-white/80">{category.sub_title}</p>
                  )}
                  <div className="mt-3 flex items-center gap-4 text-sm">
                    <div className="inline-flex items-center gap-2 text-rose-400">
                      <Clock size={16} />
                      <span>Proses Instan</span>
                    </div>
                    <div className="inline-flex items-center gap-2 text-emerald-400">
                      <Shield size={16} />
                      <span>Support 24/7</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {(category.description || true) && (
              <section className="rounded-2xl bg-[#141316] ring-1 ring-white/10 p-6">
                <h2 className="text-xl font-bold mb-3">Deskripsi</h2>
                {category.description ? (
                  <div
                    className="prose prose-invert max-w-none prose-p:leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: category.description }}
                  />
                ) : (
                  <p className="text-white/80">
                    Nikmati kemudahan top up dengan metode pembayaran lengkap,
                    proses cepat, dan layanan pelanggan yang siap membantu
                    kapanpun.
                  </p>
                )}
              </section>
            )}

            {/* Payment Methods */}
            <section className="rounded-2xl bg-[#141316] ring-1 ring-white/10 p-6">
              <h2 className="text-xl font-bold mb-4">Metode Pembayaran</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {paymentMethods.map((m, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-[#0F0E12] ring-1 ring-white/10 p-4 text-center hover:ring-rose-500/50 transition"
                  >
                    <div className="text-2xl mb-1">{m.logo}</div>
                    <div className="text-xs text-white/80">{m.name}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* How to Pay */}
            <section className="rounded-2xl bg-[#141316] ring-1 ring-white/10 p-6">
              <h2 className="text-xl font-bold mb-4">Tata Cara Pembayaran</h2>
              <ol className="space-y-3 text-white/85">
                {[
                  "Masukkan Game ID / Customer Number dengan benar.",
                  "Pilih paket yang diinginkan.",
                  "Isi kontak (WA wajib, email opsional).",
                  "Tekan “Buat Pesanan” untuk membuat invoice.",
                  "Pilih metode pembayaran (QRIS/VA/e-wallet/minimarket).",
                  "Selesaikan pembayaran sesuai instruksi pada halaman payment.",
                  "Order diproses otomatis setelah pembayaran terkonfirmasi.",
                ].map((txt, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-600 text-white text-sm font-bold grid place-items-center">
                      {idx + 1}
                    </span>
                    <span>{txt}</span>
                  </li>
                ))}
              </ol>
            </section>

            {/* Reviews */}
            <section className="rounded-2xl bg-[#141316] ring-1 ring-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Review & Testimoni</h2>
                <div className="text-sm text-white/70">
                  Rating rata-rata:{" "}
                  <span className="text-rose-400 font-semibold">4.8/5</span>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {testimonials.map((t) => (
                  <motion.div
                    key={t.id}
                    whileHover={{ scale: 1.02 }}
                    className="overflow-hidden rounded-xl bg-[#0F0E12] ring-1 ring-white/10"
                  >
                    <div className="relative h-40">
                      <Image
                        src={t.thumbnail}
                        alt={t.title}
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() => onWatch(t.youtubeId)}
                        className="absolute inset-0 grid place-items-center bg-black/40 hover:bg-black/50 transition"
                        aria-label="Tonton di YouTube"
                      >
                        <span className="w-12 h-12 rounded-full bg-rose-600 grid place-items-center">
                          <Play className="text-white ml-0.5" size={22} />
                        </span>
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-1 text-amber-400 mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill={i < t.rating ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                      <div className="font-semibold">{t.title}</div>
                      <div className="text-sm text-white/70 mt-1">
                        oleh {t.name}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT – Order Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="overflow-hidden rounded-2xl ring-1 ring-white/10 bg-[#141316]">
                <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-rose-500 p-6 text-white">
                  <h2 className="text-xl font-bold mb-1">Pesan Sekarang</h2>
                  <p className="text-white/90 text-sm">
                    Proses cepat • Aman • Resmi
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  {/* 1. Akun */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      1) Informasi Akun
                    </h3>
                    <input
                      type="text"
                      value={customerNo}
                      onChange={(e) => setCustomerNo(e.target.value)}
                      placeholder="Game ID / Customer Number *"
                      className="w-full px-4 py-3 rounded-lg bg-[#0F0E12] text-white placeholder-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-rose-600"
                    />
                  </div>

                  {/* 2. Kontak */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      2) Informasi Kontak
                    </h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Nama (opsional)"
                        className="w-full px-4 py-3 rounded-lg bg-[#0F0E12] text-white placeholder-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-rose-600"
                      />
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="Email (opsional)"
                        className="w-full px-4 py-3 rounded-lg bg-[#0F0E12] text-white placeholder-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-rose-600"
                      />
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Nomor WhatsApp *"
                        className="w-full px-4 py-3 rounded-lg bg-[#0F0E12] text-white placeholder-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-rose-600"
                      />
                    </div>
                  </div>

                  {/* 3. Paket */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      3) Pilih Paket
                    </h3>

                    {products.length ? (
                      <div className="grid grid-cols-1 gap-2">
                        {products.map((p) => (
                          <motion.button
                            key={p.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedPackage(p)}
                            className={[
                              "p-4 rounded-lg text-left transition-all",
                              "ring-1",
                              selectedPackage?.id === p.id
                                ? "bg-rose-950/40 ring-rose-600"
                                : "bg-[#0F0E12] ring-white/10 hover:ring-rose-500/40",
                            ].join(" ")}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <div className="font-medium">{p.name}</div>
                                {p.description && (
                                  <div className="text-sm text-white/70">
                                    {p.description}
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-rose-400">
                                  {currency(p.sell_price)}
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 rounded-lg bg-[#0F0E12] ring-1 ring-white/10">
                        <AlertCircle
                          size={48}
                          className="mx-auto text-white/40 mb-3"
                        />
                        <p className="text-white/80 font-medium mb-1">
                          Paket belum tersedia.
                        </p>
                        <p className="text-white/60 text-sm">
                          Coba lagi nanti ya 😅🙏
                        </p>
                      </div>
                    )}
                  </div>

                  {/* success / error */}
                  {checkoutSuccess && (
                    <div className="rounded-lg p-4 bg-rose-950/30 ring-1 ring-rose-600/40">
                      <div className="flex items-center gap-2 text-rose-300">
                        <div className="w-5 h-5 bg-rose-600 rounded-full grid place-items-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="font-semibold">
                          Checkout berhasil!
                        </span>
                      </div>
                      <p className="text-rose-200/90 text-sm mt-1">
                        {isRedirecting
                          ? "Mengarahkan ke halaman pembayaran…"
                          : "Anda akan diarahkan ke halaman pembayaran dalam beberapa detik…"}
                      </p>
                      {isRedirecting && (
                        <div className="flex items-center gap-2 mt-2">
                          <Loader2
                            size={16}
                            className="animate-spin text-rose-400"
                          />
                          <span className="text-rose-300 text-sm">
                            Sedang mengalihkan…
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {checkoutError && (
                    <div className="rounded-lg p-4 bg-rose-950/30 ring-1 ring-rose-600/40">
                      <div className="flex items-center gap-2 text-rose-300">
                        <AlertCircle size={16} />
                        <span className="font-semibold">Error</span>
                      </div>
                      <p className="text-rose-200/90 text-sm mt-1">
                        {checkoutError}
                      </p>
                    </div>
                  )}

                  {/* Order Button */}
                  <motion.button
                    whileHover={{
                      scale: isFormValid && !isCheckoutLoading ? 1.02 : 1,
                    }}
                    whileTap={{
                      scale: isFormValid && !isCheckoutLoading ? 0.98 : 1,
                    }}
                    onClick={handleCheckout}
                    disabled={!isFormValid || isCheckoutLoading}
                    className={[
                      "w-full py-4 rounded-lg font-semibold text-lg transition-all",
                      isFormValid && !isCheckoutLoading
                        ? "bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-900/30"
                        : "bg-white/10 text-white/50 cursor-not-allowed",
                    ].join(" ")}
                  >
                    {isCheckoutLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 size={20} className="animate-spin" />
                        <span>Memproses…</span>
                      </div>
                    ) : isFormValid ? (
                      "Buat Pesanan"
                    ) : (
                      "Mohon Lengkapi Form"
                    )}
                  </motion.button>

                  <p className="text-xs text-white/60 text-center">
                    Dengan menekan tombol di atas, Anda setuju dengan{" "}
                    <Link
                      href="/syarat-ketentuan"
                      className="text-rose-400 hover:underline"
                    >
                      Syarat &amp; Ketentuan
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* /RIGHT */}
        </div>

        {/* Review videos CTA (opsional) */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Tonton Review Pengguna</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <motion.div
                key={t.id}
                whileHover={{ scale: 1.02 }}
                className="bg-[#141316] rounded-2xl overflow-hidden ring-1 ring-white/10"
              >
                <div className="relative h-44">
                  <Image
                    src={t.thumbnail}
                    alt={t.title}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => onWatch(t.youtubeId)}
                    className="absolute inset-0 grid place-items-center bg-black/30 hover:bg-black/40 transition"
                  >
                    <span className="w-12 h-12 rounded-full bg-rose-600 grid place-items-center">
                      <Play className="text-white ml-0.5" size={22} />
                    </span>
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 text-amber-400 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < t.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <div className="font-semibold">{t.title}</div>
                  <div className="text-sm text-white/70 mt-1">
                    oleh {t.name}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}