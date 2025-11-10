"use client";

import { useState, useEffect, useMemo, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Search,
  Eye,
  User,
  Package,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Download,
  Calendar,
  Filter,
} from "lucide-react";
import { extractErrorMessage } from "@/lib/http-error";
import { topupReviewsService } from "@/services/api/review";

// ==================== TIPE-DATA ====================
type TransactionProduct = {
  id: number;
  name: string;
  sku: string;
  description?: string | null;
  buy_price: string;
};

type Transaction = {
  id: number;
  reference: string;
  order_id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  customer_no: string;
  product: TransactionProduct;
  provider: string;
  amount: number;
  status: number;
  status_payment: number;
  payment_link?: string | null;
  sn?: string | null;
  created_at: string;
  paid_at?: string | null;
};

type ApiLink = {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
};

type ApiPagination<T> = {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: ApiLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
};

type ApiEnvelope<T> = {
  code: number;
  message: string;
  data: T;
};

// ==================== STATUS MAPPING (NUANSA KUNING) ====================
const getStatusInfo = (status: number, statusPayment: number) => {
  if (statusPayment === 2) {
    return {
      icon: CheckCircle,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10 ring-1 ring-amber-500/30",
      label: "Lunas",
    };
  }
  if (statusPayment === 1) {
    return {
      icon: Clock,
      color: "text-yellow-300",
      bgColor: "bg-yellow-500/10 ring-1 ring-yellow-500/30",
      label: "Menunggu Pembayaran",
    };
  }
  if (status === 1) {
    return {
      icon: AlertCircle,
      color: "text-sky-300",
      bgColor: "bg-sky-500/10 ring-1 ring-sky-500/30",
      label: "Diproses",
    };
  }
  if (status === 2) {
    return {
      icon: CheckCircle,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10 ring-1 ring-amber-500/30",
      label: "Selesai",
    };
  }
  return {
    icon: XCircle,
    color: "text-rose-400",
    bgColor: "bg-rose-500/10 ring-1 ring-rose-500/30",
    label: "Gagal",
  };
};

// ==================== COMPONENT ====================
export default function ProfilePage() {
  const { data: session, status } = useSession();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusPaymentFilter, setStatusPaymentFilter] = useState<
    "all" | "0" | "1" | "2"
  >("all");
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: "",
    endDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [transactionsData, setTransactionsData] = useState<ApiEnvelope<
    ApiPagination<Transaction>
  > | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // ====== STATE FORM REVIEW ======
  const [revName, setRevName] = useState<string>("");
  const [revText, setRevText] = useState<string>("");
  const [revRating, setRevRating] = useState<number>(5);
  const [revLoading, setRevLoading] = useState<boolean>(false);
  const [revError, setRevError] = useState<string | null>(null);
  const [revSuccess, setRevSuccess] = useState<string | null>(null);

  // ========== TOKEN & USER DARI SESSION ==========
  const accessToken =
    typeof session?.accessToken === "string" ? session.accessToken : null;
  const userId = (() => {
    const raw = session?.user?.id;
    if (typeof raw === "string") {
      const n = Number(raw);
      return Number.isFinite(n) ? n : undefined;
    }
    if (typeof raw === "number") return raw;
    return undefined;
  })();

  useEffect(() => {
    if (session?.user?.name && !revName) {
      setRevName(session.user.name);
    }
  }, [session?.user?.name, revName]);

  // ========== FETCH ==========
  const fetchTransactions = async () => {
    if (!accessToken || !userId) return;
    setLoading(true);
    setLoadError(null);

    const filters = new URLSearchParams();
    filters.append("page", String(currentPage));
    filters.append("paginate", "10");
    filters.append("user_id", String(userId));
    if (dateRange.startDate) filters.append("started_at", dateRange.startDate);
    if (dateRange.endDate) filters.append("ended_at", dateRange.endDate);
    if (statusPaymentFilter !== "all")
      filters.append("status_payment", statusPaymentFilter);

    const base = (
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1"
    ).replace(/\/+$/, "");
    const url = `${base}/transaction/topups${
      filters.toString() ? `?${filters.toString()}` : ""
    }`;

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        let parsed: unknown = null;
        try {
          parsed = await res.json();
          const msg = extractErrorMessage({
            response: {
              data: parsed as {
                message?: string;
                errors?: Record<string, string[]>;
              },
            },
            message:
              (parsed as { message?: string })?.message ?? res.statusText,
          });
          throw new Error(msg);
        } catch (e) {
          if (parsed === null)
            throw new Error(`HTTP ${res.status} ${res.statusText}`);
          throw e as Error;
        }
      }

      const json = (await res.json()) as ApiEnvelope<
        ApiPagination<Transaction>
      >;

      if (searchTerm.trim() && Array.isArray(json.data?.data)) {
        const q = searchTerm.trim().toLowerCase();
        json.data.data = json.data.data.filter((t) => {
          const ref = t.reference?.toLowerCase() ?? "";
          const name = t.customer_name?.toLowerCase() ?? "";
          const oid = t.order_id?.toLowerCase() ?? "";
          return ref.includes(q) || name.includes(q) || oid.includes(q);
        });
      }

      setTransactionsData(json);
    } catch (err: unknown) {
      setLoadError(extractErrorMessage(err));
      setTransactionsData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && accessToken && userId) {
      void fetchTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    status,
    accessToken,
    userId,
    currentPage,
    statusPaymentFilter,
    dateRange.startDate,
    dateRange.endDate,
    searchTerm,
  ]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const transactions = transactionsData?.data?.data ?? [];
  const pagination = transactionsData?.data;

  const totalRevenue = useMemo(
    () =>
      transactions
        .filter((t) => t.status_payment === 2)
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );
  const totalOrders = transactionsData?.data?.total ?? 0;
  const completedOrders = transactions.filter(
    (t) => t.status_payment === 2
  ).length;
  const pendingOrders = transactions.filter(
    (t) => t.status_payment === 0
  ).length;

  const exportCSV = () => {
    const rows = [
      [
        "Reference",
        "OrderID",
        "Produk",
        "SKU",
        "Provider",
        "Total",
        "Status",
        "Tanggal",
        "PaidAt",
      ],
      ...transactions.map((t) => [
        t.reference,
        t.order_id,
        t.product.name,
        t.product.sku,
        t.provider,
        t.amount,
        getStatusInfo(t.status, t.status_payment).label,
        new Date(t.created_at).toLocaleString("id-ID"),
        t.paid_at ? new Date(t.paid_at).toLocaleString("id-ID") : "",
      ]),
    ];
    const csv = rows
      .map((r) =>
        r.map((c) => `"${String(c).replaceAll(`"`, `""`)}"`).join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ====== SUBMIT REVIEW ======
  const onSubmitReview = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRevError(null);
    setRevSuccess(null);

    if (!selectedTransaction) {
      setRevError("Transaksi tidak ditemukan.");
      return;
    }
    const orderIdPath = selectedTransaction.order_id?.trim();
    if (!orderIdPath) {
      setRevError("Order ID tidak tersedia untuk transaksi ini.");
      return;
    }
    if (!revName.trim() || !revText.trim()) {
      setRevError("Nama dan ulasan wajib diisi.");
      return;
    }
    if (revRating < 0 || revRating > 5) {
      setRevError("Rating harus di antara 0 hingga 5.");
      return;
    }

    try {
      setRevLoading(true);

      // PENTING: endpoint POST yang benar adalah /transaction/topups/order/:orderId
      const resp = await topupReviewsService.createReviewByOrder(orderIdPath, {
        user_id: userId,
        name: revName.trim(),
        review: revText.trim(),
        rating: Number(revRating),
      });

      setRevSuccess("Terima kasih! Ulasan kamu sudah dikirim.");

      // Redirect ke /order/:orderid
      const orderIdFromApi = resp?.data?.order_id ?? null;
      const orderId = orderIdFromApi || orderIdPath || null;

      if (orderId) {
        window.location.href = `/order/${orderId}`;
      }
    } catch (err) {
      setRevError(extractErrorMessage(err));
    } finally {
      setRevLoading(false);
    }
  };

  // ========== UI STATES ==========
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-amber-400 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-amber-200">
            Memuat profil...
          </h1>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || !session) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-semibold text-amber-200 mb-2">
            Harus login dulu
          </h1>
          <p className="text-amber-300/70 mb-6">
            Masuk dulu supaya bisa lihat transaksi kamu.
          </p>
          <button
            onClick={() => (window.location.href = "/auth/login")}
            className="px-6 py-3 rounded-xl bg-amber-400 text-black font-semibold shadow-[0_0_0_2px_rgba(250,204,21,0.2)] hover:shadow-[0_0_0_4px_rgba(250,204,21,0.25)] hover:bg-amber-300 transition-all"
          >
            Ke halaman login
          </button>
        </div>
      </div>
    );
  }

  // ========== RENDER ==========
  return (
    <div className="min-h-screen bg-[#0B0B0B]">
      {/* Glow accents */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-amber-400/10 to-transparent blur-2xl" />

      <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center ring-2 ring-amber-300/30">
              <User className="h-6 w-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-amber-100 tracking-tight">
                Halo, {session.user?.name ?? "Pengguna"} 👋
              </h1>
              <p className="text-amber-300/70 text-sm">{session.user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => void fetchTransactions()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111111] text-amber-200 ring-1 ring-amber-400/20 hover:bg-amber-400 hover:text-black transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* MAIN LAYOUT: Sidebar kiri + Konten kanan */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* SIDEBAR */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Kartu Profile */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-[#111111] ring-1 ring-amber-400/20 p-6 shadow-[0_8px_30px_rgba(250,204,21,0.08)]"
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                  <User className="h-7 w-7 text-black" />
                </div>
                <div>
                  <p className="text-amber-100 font-semibold leading-tight">
                    {session.user?.name ?? "Pengguna"}
                  </p>
                  <p className="text-amber-300/70 text-sm truncate max-w-[16rem]">
                    {session.user?.email}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <MiniMetric label="Pesanan" value={String(totalOrders)} />
                <MiniMetric label="Lunas" value={String(completedOrders)} />
                <MiniMetric label="Belum" value={String(pendingOrders)} />
              </div>
            </motion.div>

            {/* Filter Cepat */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-[#111111] ring-1 ring-amber-400/20 p-6 shadow-[0_8px_30px_rgba(250,204,21,0.08)] space-y-4"
            >
              <div className="flex items-center gap-2 text-amber-200">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filter</span>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-300/60" />
                <input
                  type="text"
                  placeholder="Cari reference / order id…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#0E0E0E] text-amber-100 placeholder:text-amber-300/40 ring-1 ring-amber-400/20 focus:ring-2 focus:ring-amber-400/40 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-200 mb-2">
                  Status pembayaran
                </label>
                <select
                  value={statusPaymentFilter}
                  onChange={(e) =>
                    setStatusPaymentFilter(
                      e.target.value as "all" | "0" | "1" | "2"
                    )
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0E0E0E] text-amber-100 ring-1 ring-amber-400/20 focus:ring-2 focus:ring-amber-400/40 outline-none"
                >
                  <option className="bg-[#0E0E0E]" value="all">
                    Semua
                  </option>
                  <option className="bg-[#0E0E0E]" value="0">
                    Belum bayar
                  </option>
                  <option className="bg-[#0E0E0E]" value="1">
                    Menunggu
                  </option>
                  <option className="bg-[#0E0E0E]" value="2">
                    Lunas
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-amber-200 mb-2">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> Mulai
                    </span>
                  </label>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) =>
                      setDateRange((p) => ({ ...p, startDate: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0E0E0E] text-amber-100 ring-1 ring-amber-400/20 focus:ring-2 focus:ring-amber-400/40 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-200 mb-2">
                    Sampai
                  </label>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) =>
                      setDateRange((p) => ({ ...p, endDate: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0E0E0E] text-amber-100 ring-1 ring-amber-400/20 focus:ring-2 focus:ring-amber-400/40 outline-none text-sm"
                  />
                </div>
              </div>
            </motion.div>

            {/* Stats ringkas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <StatCard
                icon={<DollarSign className="h-6 w-6 text-black" />}
                title="Total dibayar"
                value={formatPrice(totalRevenue)}
                gradient="from-amber-400 to-yellow-500"
              />
              <StatCard
                icon={<Package className="h-6 w-6 text-black" />}
                title="Total pesanan"
                value={String(totalOrders)}
                gradient="from-yellow-300 to-amber-400"
              />
            </div>
          </aside>

          {/* KONTEN */}
          <section className="lg:col-span-8 space-y-6">
            {/* Tabel */}
            <div className="rounded-2xl overflow-hidden ring-1 ring-amber-400/20 bg-[#0E0E0E] shadow-[0_8px_30px_rgba(250,204,21,0.06)]">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-[#121212]/80 backdrop-blur">
                    <tr>
                      {[
                        "Ref / Order",
                        "Produk",
                        "Total",
                        "Status",
                        "Tanggal",
                        "Aksi",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-amber-300/70"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-400/10">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
                            <span className="ml-2 text-amber-200/80">
                              Memuat transaksi...
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : loadError ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="text-rose-300">
                            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                            <p>{loadError}</p>
                          </div>
                        </td>
                      </tr>
                    ) : transactions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="text-amber-300/70">
                            <Package className="h-8 w-8 mx-auto mb-2" />
                            <p>Belum ada transaksi.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      transactions.map((t, index) => {
                        const statusInfo = getStatusInfo(
                          t.status,
                          t.status_payment
                        );
                        const StatusIcon = statusInfo.icon;
                        return (
                          <motion.tr
                            key={t.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="hover:bg-amber-400/5"
                          >
                            <td className="px-6 py-4 align-top">
                              <div className="text-sm font-medium text-amber-100">
                                {t.reference}
                              </div>
                              <div className="text-sm text-amber-300/60">
                                {t.order_id}
                              </div>
                            </td>
                            <td className="px-6 py-4 align-top">
                              <div className="text-sm font-medium text-amber-100">
                                {t.product.name}
                              </div>
                              <div className="text-sm text-amber-300/60">
                                {t.product.sku} • {t.provider}
                              </div>
                            </td>
                            <td className="px-6 py-4 align-top">
                              <div className="text-sm font-semibold text-amber-200">
                                {formatPrice(t.amount)}
                              </div>
                            </td>
                            <td className="px-6 py-4 align-top">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}
                              >
                                <StatusIcon className="h-3.5 w-3.5 mr-1.5" />
                                {statusInfo.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 align-top">
                              <div className="text-sm text-amber-200">
                                {new Date(t.created_at).toLocaleDateString(
                                  "id-ID"
                                )}
                              </div>
                              {t.paid_at && (
                                <div className="text-xs text-amber-300/60">
                                  Lunas:{" "}
                                  {new Date(t.paid_at).toLocaleDateString(
                                    "id-ID"
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 align-top text-right">
                              <button
                                onClick={() => {
                                  setSelectedTransaction(t);
                                  // reset form review saat buka modal
                                  setRevText("");
                                  setRevRating(5);
                                  setRevError(null);
                                  setRevSuccess(null);
                                }}
                                className="p-2 rounded-lg text-amber-300 hover:text-black hover:bg-amber-400 transition-colors"
                                aria-label="Lihat detail"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </td>
                          </motion.tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PAGINATION */}
            {pagination && pagination.last_page > 1 && (
              <div className="rounded-2xl bg-[#111111] ring-1 ring-amber-400/20 p-4 flex items-center justify-between shadow-[0_8px_30px_rgba(250,204,21,0.08)]">
                <div className="text-sm text-amber-200/80">
                  Menampilkan {pagination.from} sampai {pagination.to} dari{" "}
                  {pagination.total} transaksi
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl ring-1 ring-amber-400/20 text-amber-200 hover:bg-amber-400/10 disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from(
                      { length: Math.min(5, pagination.last_page) },
                      (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 text-sm rounded-xl ring-1 ring-amber-400/20 ${
                              currentPage === page
                                ? "bg-amber-400 text-black"
                                : "text-amber-200 hover:bg-amber-400/10"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      }
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(pagination.last_page, p + 1)
                      )
                    }
                    disabled={currentPage === pagination.last_page}
                    className="p-2 rounded-xl ring-1 ring-amber-400/20 text-amber-200 hover:bg-amber-400/10 disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* MODAL DETAIL + FORM REVIEW */}
      {selectedTransaction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl bg-[#0F0F0F] ring-1 ring-amber-400/20 max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(250,204,21,0.10)]"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-amber-100">
                Detail Transaksi
              </h2>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="p-2 rounded-xl text-amber-300/70 hover:text-black hover:bg-amber-400 transition-colors"
                aria-label="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Info Transaksi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-amber-100 mb-4">
                    Informasi Transaksi
                  </h3>
                  <InfoRow
                    label="Reference"
                    value={selectedTransaction.reference}
                  />
                  <InfoRow
                    label="Order ID"
                    value={selectedTransaction.order_id}
                  />
                  <InfoRow
                    label="Tanggal Order"
                    value={new Date(
                      selectedTransaction.created_at
                    ).toLocaleString("id-ID")}
                  />
                  <InfoRow
                    label="Provider"
                    value={selectedTransaction.provider}
                  />
                  <InfoRow
                    label="Total"
                    value={formatPrice(selectedTransaction.amount)}
                    strong
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-amber-300/70">Status:</span>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        getStatusInfo(
                          selectedTransaction.status,
                          selectedTransaction.status_payment
                        ).bgColor
                      } ${
                        getStatusInfo(
                          selectedTransaction.status,
                          selectedTransaction.status_payment
                        ).color
                      }`}
                    >
                      {
                        getStatusInfo(
                          selectedTransaction.status,
                          selectedTransaction.status_payment
                        ).label
                      }
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-amber-100 mb-4">
                    Informasi Pelanggan
                  </h3>
                  <InfoRow
                    label="Nama"
                    value={selectedTransaction.customer_name}
                  />
                  <InfoRow
                    label="Email"
                    value={selectedTransaction.customer_email || "Tidak ada"}
                  />
                  <InfoRow
                    label="Telepon"
                    value={selectedTransaction.customer_phone}
                  />
                  <InfoRow
                    label="Game ID"
                    value={selectedTransaction.customer_no}
                  />
                </div>
              </div>

              {/* Produk */}
              <div>
                <h3 className="text-lg font-medium text-amber-100 mb-4">
                  Informasi Produk
                </h3>
                <div className="rounded-xl bg-[#101010] ring-1 ring-amber-400/10 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-amber-100">
                        {selectedTransaction.product.name}
                      </h4>
                      <p className="text-sm text-amber-300/70">
                        SKU: {selectedTransaction.product.sku}
                      </p>
                      <p className="text-sm text-amber-300/70">
                        Provider: {selectedTransaction.provider}
                      </p>
                      {selectedTransaction.product.description && (
                        <p className="text-sm text-amber-300/70">
                          Deskripsi: {selectedTransaction.product.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-amber-100">
                        {formatPrice(selectedTransaction.amount)}
                      </p>
                      <p className="text-sm text-amber-300/60">
                        Harga Beli:{" "}
                        {formatPrice(
                          parseFloat(selectedTransaction.product.buy_price)
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pembayaran */}
              {selectedTransaction.payment_link && (
                <div>
                  <h3 className="text-lg font-medium text-amber-100 mb-4">
                    Informasi Pembayaran
                  </h3>
                  <div className="rounded-xl bg-[#101010] ring-1 ring-amber-400/10 p-4 space-y-2">
                    <p className="text-sm text-amber-300/80">
                      <strong className="text-amber-200">
                        Link Pembayaran:
                      </strong>{" "}
                      <a
                        href={selectedTransaction.payment_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-300 underline-offset-4 hover:underline"
                      >
                        Buka
                      </a>
                    </p>
                    {selectedTransaction.paid_at && (
                      <p className="text-sm text-amber-300/80">
                        <strong className="text-amber-200">
                          Tanggal Lunas:
                        </strong>{" "}
                        {new Date(selectedTransaction.paid_at).toLocaleString(
                          "id-ID"
                        )}
                      </p>
                    )}
                    {selectedTransaction.sn && (
                      <p className="text-sm text-amber-300/80">
                        <strong className="text-amber-200">
                          Serial Number:
                        </strong>{" "}
                        {selectedTransaction.sn}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ====== FORM ULASAN ====== */}
              <div>
                <h3 className="text-lg font-medium text-amber-100 mb-4">
                  Beri Ulasan
                </h3>

                <form
                  onSubmit={onSubmitReview}
                  className="rounded-xl bg-[#101010] ring-1 ring-amber-400/10 p-4 space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-amber-300/80 mb-1">
                        Nama
                      </label>
                      <input
                        value={revName}
                        onChange={(e) => setRevName(e.target.value)}
                        className="w-full rounded-lg bg-[#0E0E0E] px-3 py-2 text-amber-100 ring-1 ring-amber-400/20 focus:ring-2 focus:ring-amber-400/40 outline-none"
                        placeholder="Namamu (opsional boleh samakan dengan akun)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-amber-300/80 mb-1">
                        Rating (0—5)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={5}
                        step={0.1}
                        value={revRating}
                        onChange={(e) => setRevRating(Number(e.target.value))}
                        className="w-full rounded-lg bg-[#0E0E0E] px-3 py-2 text-amber-100 ring-1 ring-amber-400/20 focus:ring-2 focus:ring-amber-400/40 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-amber-300/80 mb-1">
                      Ulasan
                    </label>
                    <textarea
                      value={revText}
                      onChange={(e) => setRevText(e.target.value)}
                      rows={3}
                      className="w-full rounded-lg bg-[#0E0E0E] px-3 py-2 text-amber-100 ring-1 ring-amber-400/20 focus:ring-2 focus:ring-amber-400/40 outline-none"
                      placeholder="Ceritakan pengalamanmu…"
                    />
                  </div>

                  {revError && (
                    <p className="text-sm text-rose-300">{revError}</p>
                  )}
                  {revSuccess && (
                    <p className="text-sm text-emerald-300">{revSuccess}</p>
                  )}

                  <div className="flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={revLoading}
                      className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 font-semibold text-black ring-1 ring-amber-500/40 transition hover:brightness-110 disabled:opacity-60"
                    >
                      {revLoading && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      Kirim Ulasan & Lanjut
                    </button>
                  </div>

                  <p className="mt-2 text-xs text-amber-300/60">
                    * Order ID bisa kamu lihat di WhatsApp. Setelah ulasan
                    terkirim, kamu akan diarahkan ke halaman pesananmu.
                  </p>
                </form>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

// ==================== SUB-COMPONENTS ====================
function StatCard({
  icon,
  title,
  value,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  gradient: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-[#111111] ring-1 ring-amber-400/20 p-6 shadow-[0_8px_30px_rgba(250,204,21,0.08)]"
    >
      <div className="flex items-center">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-[0_0_0_2px_rgba(0,0,0,0.4)]`}
        >
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-amber-300/80">{title}</p>
          <p className="text-2xl font-semibold text-amber-100">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#0E0E0E] ring-1 ring-amber-400/10 p-3">
      <p className="text-xs text-amber-300/70">{label}</p>
      <p className="text-lg font-semibold text-amber-100">{value}</p>
    </div>
  );
}

function InfoRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex justify-between mb-2">
      <span className="text-sm text-amber-300/70">{label}:</span>
      <span
        className={`text-sm ${
          strong ? "font-bold text-amber-100" : "font-medium text-amber-100"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
