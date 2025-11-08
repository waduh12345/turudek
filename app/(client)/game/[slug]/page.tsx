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
  ClipboardCopy,
  Check,
  ExternalLink,
  ThumbsUp,
  MessageSquare,
  Info,
  Timer,
  CheckCircle2,
} from "lucide-react";

import {
  publicProductCategoriesService,
  PublicProductCategory,
} from "@/services/api/public-product-categories";
import {
  publicProductsService,
  PublicProduct,
} from "@/services/api/public-products";
import {
  checkoutService,
  CheckoutRequest,
  CheckoutResponse,
  MidtransPaymentType,
  MidtransChannel,
} from "@/services/api/checkout";
import { useApiCall, useAuth } from "@/hooks";

const DUMMY_IMG =
  "https://sbclbzad8s.ufs.sh/f/vI07edVR8nimBHyqimTrX8OM2IxYqlGKDH6TeJ5faC7mvZAn";

const currency = (n: string | number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(typeof n === "string" ? parseFloat(n) : n);

// [DIUBAH] Teks testimoni disesuaikan dengan voice 'Turu Store'
const testimonials = [
  {
    id: 1,
    title: "Sambil turu, beneran instan.",
    name: "Reza Mahendra",
    rating: 5,
    thumbnail:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640&q=70&auto=format&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    text: "Pake QRIS, belum sempet melek udah masuk diamond-nya. Harga rebahan, mantap.",
  },
  {
    id: 2,
    title: "Adminnya melek terus, fast respon.",
    name: "Nadia Aulia",
    rating: 5,
    thumbnail:
      "https://images.unsplash.com/photo-1522125670776-3c7abb882bc2?w=640&q=70&auto=format&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    text: "Kemarin salah ID, dibantu refund. Adminnya nolep 24/7, recommended!",
  },
  {
    id: 3,
    title: "Banyak pilihan bayar, gak ribet.",
    name: "Bagus Pratama",
    rating: 4,
    thumbnail:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=640&q=70&auto=format&fit=crop",
    youtubeId: "dQw4w9WgXcQ",
    text: "Bisa pake VA apa aja. Proses gampang, tinggal lanjut turu.",
  },
];

const paymentMethods = [
  { name: "QRIS", logo: "📱" },
  { name: "BCA VA", logo: "🏦" },
  { name: "BNI VA", logo: "🏦" },
  { name: "BRI VA", logo: "🏦" },
  { name: "CIMB VA", logo: "🏦" },
];

const HOW_TO_TABS: MidtransChannel[] = ["qris", "bca", "bni", "bri", "cimb"];

// [DIUBAH] Teks tata cara disesuaikan
const HOW_TO_STEPS: Record<MidtransChannel, string[]> = {
  qris: [
    "Buka aplikasi e-wallet / m-banking lo (Dana, GoPay, OVO, ShopeePay, BCA, dll).",
    "Pilih menu Scan / QR Payment.",
    "Scan QR yang muncul di halaman bayar.",
    "Pastikan nominalnya udah pas sama tagihan.",
    "Konfirmasi & bayar. Selesai.",
  ],
  bca: [
    "Buka myBCA / KlikBCA / ATM BCA.",
    "Pilih menu Pembayaran > Virtual Account.",
    "Masukkan Nomor VA yang muncul di tagihan.",
    "Cek nama penerima (Turu Store) & nominal, lalu konfirmasi.",
    "Selesaikan pembayaran.",
  ],
  bni: [
    "Buka BNI Mobile / iBanking / ATM BNI.",
    "Pilih Pembayaran > Virtual Account Billing.",
    "Masukkan Nomor VA sesuai tagihan.",
    "Cek detail tagihan & konfirmasi.",
    "Selesaikan pembayaran.",
  ],
  bri: [
    "Buka BRImo / iBanking / ATM BRI.",
    "Pilih Pembayaran > BRIVA / Virtual Account.",
    "Masukkan Nomor VA yang diberikan.",
    "Konfirmasi detail & nominal.",
    "Selesaikan pembayaran.",
  ],
  cimb: [
    "Buka OCTO Mobile / OCTO Clicks / ATM CIMB Niaga.",
    "Pilih Pembayaran > Virtual Account.",
    "Masukkan Nomor VA tagihan.",
    "Periksa detail & konfirmasi.",
    "Selesaikan pembayaran.",
  ],
};

// [DIUBAH] Teks tips disesuaikan
const HOW_TO_TIPS: Record<MidtransChannel, string[]> = {
  qris: [
    "QR-nya nge-blur? Santai, tinggal klik 'Buka QR' terus screenshot/zoom.",
    "Bayarnya harus pas, jangan dicicil atau dilebihin.",
    "Lagi jam sibuk? Tunggu 1-3 menit, statusnya bakal update otomatis.",
  ],
  bca: [
    "VA ada jam kedaluwarsanya. Jangan sampai turu kebablasan.",
    "Nama penerima bukan Turu Store? Batalin & lapor admin.",
    "Simpan bukti bayar (screenshot/struk) buat jaga-jaga.",
  ],
  bni: [
    "Pastikan koneksi internet aman pas konfirmasi.",
    "Gagal tapi saldo kepotong? Tenang, biasanya auto-refund atau lapor bank.",
  ],
  bri: [
    "Pakai BRIVA biar lebih cepat.",
    "Kalau nominal salah, bikin pesanan baru aja biar VA-nya baru.",
  ],
  cimb: [
    "Kadang notifnya telat kalau bayar pas tengah malam. Santai, sistem auto-check.",
    "Cek limit harian lo, jangan sampai ditolak gara-gara mentok.",
  ],
};

const ratingSummary = {
  // ... (data dummy tidak berubah) ...
  average: 4.8,
  total: 1287,
  breakdown: {
    5: 74,
    4: 18,
    3: 6,
    2: 1,
    1: 1,
  },
};

export default function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  // ... (State (category, products, selectedPackage, customerNo, dll) tidak berubah) ...
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

  // pembayaran
  const [paymentType, setPaymentType] = useState<MidtransPaymentType>("qris");
  const [paymentChannel, setPaymentChannel] = useState<MidtransChannel>("qris");

  const [isFormValid, setIsFormValid] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // modal pembayaran
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState<CheckoutResponse | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // tab tata cara
  const [howToTab, setHowToTab] = useState<MidtransChannel>("qris");
  // ... (Logika API calls & useEffects tidak berubah) ...
  const {
    data: categoryData,
    loading: categoryLoading,
    error: categoryError,
    execute: fetchCategory,
  } = useApiCall(() =>
    publicProductCategoriesService.getProductCategory(resolvedParams.slug)
  );

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

  // sinkron channel saat type berubah
  useEffect(() => {
    if (paymentType === "qris") {
      setPaymentChannel("qris");
      setHowToTab("qris");
    } else if (paymentType === "bank_transfer") {
      if (!["bca", "bni", "bri", "cimb"].includes(paymentChannel)) {
        setPaymentChannel("bca");
        setHowToTab("bca");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentType]);

  useEffect(() => {
    const valid =
      Boolean(customerNo.trim()) &&
      selectedPackage !== null &&
      Boolean(customerPhone.trim()) &&
      !!paymentType &&
      !!paymentChannel;
    setIsFormValid(valid);
  }, [customerNo, selectedPackage, customerPhone, paymentType, paymentChannel]);

  const handleCheckout = async () => {
    if (!selectedPackage || !isFormValid) return;

    setIsCheckoutLoading(true);
    setCheckoutError(null);

    try {
      const payload: CheckoutRequest = {
        user_id: isAuthenticated && user?.id ? parseInt(user.id) : undefined,
        product_id: selectedPackage.id,
        customer_no: customerNo,
        customer_name: customerName.trim() || undefined,
        customer_email: customerEmail.trim() || undefined,
        customer_phone: customerPhone,
        midtrans_payment_type: paymentType,
        midtrans_channel: paymentChannel,
      };

      const resp = await checkoutService.checkout(payload);

      if (resp.data) {
        setPaymentData(resp.data);
        setShowPayment(true);

        // reset input
        setCustomerNo("");
        setCustomerName("");
        setCustomerEmail("");
        setCustomerPhone("");
        setSelectedPackage(null);
      }
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Terjadi kesalahan saat checkout.";
      setCheckoutError(message);
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const onWatch = (id: string) =>
    window.open(`https://www.youtube.com/watch?v=${id}`, "_blank");

  const copy = async (text: string, tag: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(tag);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // noop
    }
  };

  if (categoryLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-[#141316] flex items-center justify-center">
        <div className="text-center">
          {/* [DIUBAH] Warna spinner */}
          <Loader2 className="h-12 w-12 animate-spin text-yellow-400 mx-auto mb-4" />
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
          <div className="space-x-4">
            {/* [DIUBAH] Tombol "Coba Lagi" disesuaikan */}
            <button
              onClick={() => {
                fetchCategory();
                fetchProducts();
              }}
              className="bg-yellow-400 text-slate-900 font-semibold px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors"
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

  // helper rating bar
  const RatingBar = ({ label, pct }: { label: string; pct: number }) => (
    <div className="flex items-center gap-3">
      <span className="w-8 text-sm text-white/70">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
        {/* [DIUBAH] Gradien rating bar */}
        <div
          className="h-full bg-gradient-to-r from-yellow-400 to-amber-400"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-10 text-right text-sm text-white/70">{pct}%</span>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0F0E12] text-white">
      {/* Breadcrumb */}
      <div className="border-b border-white/10 bg-[#141316]">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm text-white/70">
            {/* [DIUBAH] Hover link */}
            <Link href="/" className="hover:text-yellow-400">
              Home
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
            {/* Hero */}
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
                    {/* [DIUBAH] Teks dan warna aksen */}
                    <div className="inline-flex items-center gap-2 text-yellow-400">
                      <Clock size={16} />
                      <span>Proses Sambil Turu</span>
                    </div>
                    <div className="inline-flex items-center gap-2 text-emerald-400">
                      <Shield size={16} />
                      <span>Admin Nolep 24/7</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods (display) */}
            <section className="rounded-2xl bg-[#141316] ring-1 ring-white/10 p-6">
              <h2 className="text-xl font-bold mb-4">Metode Pembayaran</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {paymentMethods.map((m, i) => (
                  <div
                    key={i}
                    // [DIUBAH] Hover ring
                    className="rounded-xl bg-[#0F0E12] ring-1 ring-white/10 p-4 text-center hover:ring-yellow-500/50 transition"
                  >
                    <div className="text-2xl mb-1">{m.logo}</div>
                    <div className="text-xs text-white/80">{m.name}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Tata Cara Pembayaran LENGKAP */}
            <section className="rounded-2xl bg-[#141316] ring-1 ring-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Cara Bayar (Anti Ribet)</h2>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Timer size={16} />
                  <span>Panduan biar sat-set</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2 mb-5">
                {HOW_TO_TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setHowToTab(t)}
                    // [DIUBAH] Style tab
                    className={[
                      "px-4 py-2 rounded-xl border transition font-semibold",
                      howToTab === t
                        ? "bg-yellow-400 border-yellow-500 text-slate-900"
                        : "bg-[#0F0E12] border-white/10 hover:border-yellow-500/50",
                    ].join(" ")}
                  >
                    {t === "qris" ? "QRIS" : t.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Steps & Tips */}
              <div className="grid md:grid-cols-5 gap-5">
                <div className="md:col-span-3">
                  <div className="rounded-xl bg-[#0F0E12] ring-1 ring-white/10 p-4">
                    <h3 className="font-semibold mb-3">
                      Langkah Pembayaran{" "}
                      {howToTab === "qris" ? "QRIS" : howToTab.toUpperCase()}
                    </h3>
                    <ol className="space-y-3">
                      {HOW_TO_STEPS[howToTab].map((s, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          {/* [DIUBAH] Warna nomor langkah */}
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-400 text-slate-900 text-sm font-bold grid place-items-center">
                            {idx + 1}
                          </span>
                          <span className="text-white/90">{s}</span>
                        </li>
                      ))}
                    </ol>
                    <div className="mt-4 rounded-lg bg-[#141316] ring-1 ring-white/10 p-3 text-sm text-white/80 flex items-start gap-2">
                      {/* [DIUBAH] Warna ikon info */}
                      <Info size={16} className="mt-0.5 text-yellow-400" />
                      <span>
                        Gunakan nomor VA/QR yang tampil di halaman pembayaran
                        atau pop-up setelah checkout. Nomornya unik per pesanan.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="rounded-xl bg-[#0F0E12] ring-1 ring-white/10 p-4">
                    {/* [DIUBAH] Teks tips */}
                    <h3 className="font-semibold mb-3">
                      Tips Biar Nggak Gagal
                    </h3>
                    <ul className="space-y-2">
                      {HOW_TO_TIPS[howToTab].map((tip, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-white/85"
                        >
                          <CheckCircle2
                            size={18}
                            className="text-emerald-400 mt-0.5"
                          />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 rounded-lg bg-[#141316] ring-1 ring-white/10 p-3 text-xs text-white/70">
                      <b>S&K:</b> Jangan kelamaan bayar, nanti VA/QR-nya
                      kadaluwarsa. Kalau saldo kepotong tapi status pending,
                      santai, sistem bakal cek otomatis.
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Reviews — KEREN */}
            <section className="rounded-2xl bg-[#141316] ring-1 ring-white/10 p-6">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                {/* left: summary */}
                <div className="md:col-span-1 rounded-2xl bg-[#0F0E12] ring-1 ring-white/10 p-5 text-center">
                  <div className="text-sm text-white/70">Rating Rata-rata</div>
                  {/* [DIUBAH] Warna rating */}
                  <div className="mt-1 text-5xl font-extrabold text-yellow-400">
                    {ratingSummary.average.toFixed(1)}
                  </div>
                  <div className="mt-1 text-white/60 text-xs">
                    dari {ratingSummary.total.toLocaleString("id-ID")} ulasan
                  </div>
                  {/* [TETAP] Bintang sudah kuning */}
                  <div className="mt-4 flex items-center justify-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        fill={
                          i < Math.round(ratingSummary.average)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* middle: breakdown */}
                <div className="md:col-span-1 space-y-2">
                  {/* Komponen RatingBar sudah diubah di atas */}
                  <RatingBar label="5★" pct={ratingSummary.breakdown[5]} />
                  <RatingBar label="4★" pct={ratingSummary.breakdown[4]} />
                  <RatingBar label="3★" pct={ratingSummary.breakdown[3]} />
                  <RatingBar label="2★" pct={ratingSummary.breakdown[2]} />
                  <RatingBar label="1★" pct={ratingSummary.breakdown[1]} />
                </div>

                {/* right: filter chips */}
                <div className="md:col-span-1">
                  <div className="text-sm text-white/70 mb-2">Filter cepat</div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Semua",
                      "Pembayaran cepat",
                      "CS ramah",
                      "Harga murah",
                      "Proses instan",
                    ].map((chip, idx) => (
                      <button
                        key={idx}
                        // [DIUBAH] Style filter chips
                        className={[
                          "px-3 py-1.5 rounded-full text-sm border font-semibold",
                          idx === 0
                            ? "bg-yellow-400 border-yellow-500 text-slate-900"
                            : "bg-[#0F0E12] border-white/10 hover:border-yellow-500/50",
                        ].join(" ")}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 text-xs text-white/60 flex items-center gap-2">
                    <ThumbsUp size={14} />
                    <span>Ulasan terverifikasi dari pembeli.</span>
                  </div>
                </div>
              </div>

              {/* cards */}
              <div className="grid md:grid-cols-3 gap-4">
                {testimonials.map((t) => (
                  <motion.div
                    key={t.id}
                    whileHover={{ y: -2, scale: 1.01 }}
                    className="overflow-hidden rounded-xl bg-[#0F0E12] ring-1 ring-white/10"
                  >
                    <div className="relative h-40">
                      <Image
                        src={t.thumbnail}
                        alt={t.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs bg-black/60 backdrop-blur">
                        <span className="inline-flex items-center gap-1 text-emerald-300">
                          <CheckCircle2 size={14} /> Verified Purchase
                        </span>
                      </div>
                      <button
                        onClick={() => onWatch(t.youtubeId)}
                        className="absolute inset-0 grid place-items-center bg-black/30 hover:bg-black/40 transition"
                        aria-label="Tonton di YouTube"
                      >
                        {/* [DIUBAH] Tombol play */}
                        <span className="w-12 h-12 rounded-full bg-yellow-400 grid place-items-center">
                          <Play
                            className="text-slate-900 ml-0.5"
                            size={22}
                          />
                        </span>
                      </button>
                    </div>
                    <div className="p-4">
                      {/* [TETAP] Bintang sudah kuning */}
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
                      <p className="text-sm text-white/80 mt-1 leading-relaxed">
                        {t.text}
                      </p>
                      <div className="mt-2 text-xs text-white/60 flex items-center gap-2">
                        <MessageSquare size={14} />
                        <span>oleh {t.name}</span>
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
                {/* [DIUBAH] Header form */}
                <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-6 text-slate-900">
                  <h2 className="text-xl font-bold mb-1">
                    Isi Form Sambil Turu
                  </h2>
                  <p className="text-slate-800/90 text-sm font-medium">
                    Harga Rebah • Instan • 100% Legal
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  {/* 1) Akun */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      1) Informasi Akun
                    </h3>
                    <input
                      type="text"
                      value={customerNo}
                      onChange={(e) => setCustomerNo(e.target.value)}
                      placeholder="Game ID / Customer Number *"
                      // [DIUBAH] Focus ring
                      className="w-full px-4 py-3 rounded-lg bg-[#0F0E12] text-white placeholder-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>

                  {/* 2) Kontak */}
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
                        // [DIUBAH] Focus ring
                        className="w-full px-4 py-3 rounded-lg bg-[#0F0E12] text-white placeholder-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="Email (opsional, buat bukti bayar)"
                        // [DIUBAH] Focus ring
                        className="w-full px-4 py-3 rounded-lg bg-[#0F0E12] text-white placeholder-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Nomor WA Aktif * (Buat notif)"
                        // [DIUBAH] Focus ring
                        className="w-full px-4 py-3 rounded-lg bg-[#0F0E12] text-white placeholder-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                  </div>

                  {/* 3) Paket */}
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
                            // [DIUBAH] Style paket
                            className={[
                              "p-4 rounded-lg text-left transition-all ring-1",
                              selectedPackage?.id === p.id
                                ? "bg-yellow-950/40 ring-yellow-500"
                                : "bg-[#0F0E12] ring-white/10 hover:ring-yellow-500/40",
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
                                {/* [DIUBAH] Warna harga */}
                                <div className="font-bold text-yellow-400">
                                  {currency(p.sell_price)}
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      // [DIUBAH] Teks empty state
                      <div className="text-center py-8 rounded-lg bg-[#0F0E12] ring-1 ring-white/10">
                        <AlertCircle
                          size={48}
                          className="mx-auto text-white/40 mb-3"
                        />
                        <p className="text-white/80 font-medium mb-1">
                          Paketnya lagi turu. zZz
                        </p>
                        <p className="text-white/60 text-sm">
                          Coba refresh atau cek lagi nanti.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 4) Metode Pembayaran */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      4) Metode Pembayaran
                    </h3>
                    <div className="flex gap-3 mb-3">
                      <button
                        type="button"
                        onClick={() => setPaymentType("qris")}
                        // [DIUBAH] Style tombol payment
                        className={[
                          "px-4 py-2 rounded-lg ring-1 transition font-semibold",
                          paymentType === "qris"
                            ? "bg-yellow-400 ring-yellow-500 text-slate-900"
                            : "bg-[#0F0E12] ring-white/10 text-white/80 hover:ring-yellow-500/40",
                        ].join(" ")}
                      >
                        QRIS
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentType("bank_transfer")}
                        // [DIUBAH] Style tombol payment
                        className={[
                          "px-4 py-2 rounded-lg ring-1 transition font-semibold",
                          paymentType === "bank_transfer"
                            ? "bg-yellow-400 ring-yellow-500 text-slate-900"
                            : "bg-[#0F0E12] ring-white/10 text-white/80 hover:ring-yellow-500/40",
                        ].join(" ")}
                      >
                        Bank Transfer (VA)
                      </button>
                    </div>
                    {paymentType === "qris" ? (
                      <div className="grid grid-cols-1">
                        <label className="inline-flex items-center gap-3 p-3 rounded-lg bg-[#0F0E12] ring-1 ring-white/10 cursor-pointer">
                          <input
                            type="radio"
                            checked={paymentChannel === "qris"}
                            onChange={() => setPaymentChannel("qris")}
                            // [DIUBAH] Radio button
                            className="text-yellow-400 focus:ring-yellow-500"
                          />
                          <span>QRIS (semua e-wallet & m-banking)</span>
                        </label>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {(
                          ["bca", "bni", "bri", "cimb"] as MidtransChannel[]
                        ).map((ch) => (
                          <label
                            key={ch}
                            // [DIUBAH] Style radio
                            className={[
                              "p-3 rounded-lg ring-1 cursor-pointer text-center",
                              paymentChannel === ch
                                ? "bg-yellow-950/40 ring-yellow-500"
                                : "bg-[#0F0E12] ring-white/10 hover:ring-yellow-500/40",
                            ].join(" ")}
                          >
                            <input
                              // [DIUBAH] Radio button
                              className="mr-2 text-yellow-400 focus:ring-yellow-500"
                              type="radio"
                              checked={paymentChannel === ch}
                              onChange={() => setPaymentChannel(ch)}
                            />
                            <span className="uppercase">{ch}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* [TETAP] Error state tetap merah */}
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
                    // [DIUBAH] Style tombol checkout
                    className={[
                      "w-full py-4 rounded-lg font-semibold text-lg transition-all",
                      isFormValid && !isCheckoutLoading
                        ? "bg-yellow-400 hover:bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-900/30"
                        : "bg-white/10 text-white/50 cursor-not-allowed",
                    ].join(" ")}
                  >
                    {isCheckoutLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 size={20} className="animate-spin" />
                        <span>Memproses…</span>
                      </div>
                    ) : (
                      "Bayar Sekarang"
                    )}
                  </motion.button>

                  <p className="text-xs text-white/60 text-center">
                    Dengan menekan tombol di atas, lo setuju dengan{" "}
                    <Link
                      href="/terms"
                      // [DIUBAH] Link terms
                      className="text-yellow-400 hover:underline"
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
      </div>

      {/* ===== MODAL PEMBAYARAN ===== */}
      {showPayment && paymentData && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowPayment(false)}
          />
          {/* [DIUBAH] Style header modal */}
          <div className="relative z-50 max-w-xl mx-auto mt-20 rounded-2xl overflow-hidden ring-1 ring-yellow-600/30 bg-[#141316]">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-5">
              <h3 className="text-lg font-bold text-slate-900">
                Pembayaran {paymentData.midtrans_payment_type?.toUpperCase()}
              </h3>
              <p className="text-slate-800/90 text-sm font-medium">
                Order: {paymentData.order_id} • Ref: {paymentData.reference}
              </p>
            </div>

            <div className="p-6 space-y-5">
              {/* Amount + Produk */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-[#0F0E12] ring-1 ring-white/10 p-4">
                  <div className="text-white/70 text-sm">Total Bayar</div>
                  {/* [DIUBAH] Warna amount */}
                  <div className="text-2xl font-extrabold text-yellow-400">
                    {currency(paymentData.amount)}
                  </div>
                </div>
                <div className="rounded-xl bg-[#0F0E12] ring-1 ring-white/10 p-4">
                  <div className="text-white/70 text-sm">Produk</div>
                  <div className="font-semibold">
                    {paymentData.product_details?.name}
                  </div>
                  <div className="text-white/60 text-xs mt-1">
                    Customer: {paymentData.customer_no}
                  </div>
                </div>
              </div>

              {/* Konten QR atau VA */}
              {paymentData.midtrans_payment_type === "qris" ? (
                <div className="rounded-2xl bg-[#0F0E12] ring-1 ring-white/10 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold">Scan QRIS</div>
                    <a
                      href={paymentData.midtrans_account_number || "#"}
                      target="_blank"
                      rel="noreferrer"
                      // [DIUBAH] Link buka QR
                      className="text-yellow-400 text-sm inline-flex items-center gap-1 hover:underline"
                    >
                      Buka QR <ExternalLink size={14} />
                    </a>
                  </div>
                  <div className="grid place-items-center">
                    {paymentData.midtrans_account_number ? (
                      <img
                        src={paymentData.midtrans_account_number}
                        alt="QRIS"
                        className="w-64 h-64 rounded-xl ring-1 ring-white/10 bg-white p-2 object-contain"
                      />
                    ) : (
                      <div className="text-white/70">QR tidak tersedia.</div>
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    {/* [DIUBAH] Tombol copy */}
                    <button
                      onClick={() =>
                        paymentData.midtrans_account_number &&
                        copy(paymentData.midtrans_account_number, "qr")
                      }
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-400 text-slate-900 font-semibold hover:bg-yellow-500"
                    >
                      <ClipboardCopy size={16} />
                      Salin Link QR
                    </button>
                    {copied === "qr" && (
                      <span className="text-emerald-400 inline-flex items-center gap-1 text-sm">
                        <Check size={14} /> Tersalin
                      </span>
                    )}
                  </div>
                  <p className="text-white/60 text-xs mt-3">
                    Bayar via e-wallet atau m-banking yang support QRIS. Pastikan
                    nominalnya pas.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl bg-[#0F0E12] ring-1 ring-white/10 p-5">
                  <div className="font-semibold mb-3">
                    Virtual Account (
                    {paymentData.midtrans_channel?.toUpperCase()})
                  </div>
                  <div className="rounded-lg bg-[#141316] ring-1 ring-white/10 p-4 flex items-center justify-between">
                    <div>
                      <div className="text-white/60 text-xs">Nomor VA</div>
                      <div className="text-xl font-mono">
                        {paymentData.midtrans_account_number ?? "-"}
                      </div>
                    </div>
                    {/* [DIUBAH] Tombol copy */}
                    <button
                      onClick={() =>
                        paymentData.midtrans_account_number &&
                        copy(paymentData.midtrans_account_number, "va")
                      }
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-400 text-slate-900 font-semibold hover:bg-yellow-500"
                    >
                      <ClipboardCopy size={16} />
                      Salin
                    </button>
                  </div>
                  {copied === "va" && (
                    <span className="text-emerald-400 inline-flex items-center gap-1 text-sm mt-2">
                      <Check size={14} /> Tersalin
                    </span>
                  )}
                  {paymentData.midtrans_account_code && (
                    <div className="mt-3 rounded-lg bg-[#141316] ring-1 ring-white/10 p-3">
                      <div className="text-white/60 text-xs">Kode</div>
                      <div className="font-mono">
                        {paymentData.midtrans_account_code}
                      </div>
                    </div>
                  )}
                  <ol className="mt-4 list-decimal list-inside text-white/70 text-sm space-y-1">
                    <li>
                      Buka aplikasi bank{" "}
                      {paymentData.midtrans_channel?.toUpperCase()}.
                    </li>
                    <li>Pilih Pembayaran &gt; Virtual Account.</li>
                    <li>Masukkan nomor VA di atas dan konfirmasi.</li>
                    <li>Selesaikan pembayaran sesuai instruksi.</li>
                  </ol>
                </div>
              )}

              {/* Footer modal */}
              <div className="flex items-center justify-between">
                <div className="text-white/60 text-xs">
                  {paymentData.expires_at
                    ? `Batas bayar: ${new Date(
                        paymentData.expires_at
                      ).toLocaleString("id-ID")}`
                    : "Segera selesaikan pembayaran."}
                </div>
                <div className="flex gap-3">
                  {paymentData.payment_link && (
                    <a
                      href={paymentData.payment_link}
                      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Buka Halaman Payment
                    </a>
                  )}
                  {/* [DIUBAH] Tombol Selesai */}
                  <button
                    onClick={() => setShowPayment(false)}
                    className="px-4 py-2 rounded-lg bg-yellow-400 text-slate-900 font-semibold hover:bg-yellow-500"
                  >
                    Selesai
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ===== /MODAL ===== */}
    </main>
  );
}