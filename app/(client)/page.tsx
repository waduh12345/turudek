"use client";

import SectionWrapper from "@/components/ui/section-wrapper";
import HotNews from "./(home)/hot-news";
import FAQ from "@/components/section/faq";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import PromotionBanner from "@/components/section/promotion-banner";
import {
  publicProductCategoriesService,
  PublicProductCategory,
} from "@/services/api/public-product-categories";
import { useApiCall, useDebounce } from "@/hooks";
import { HeroCarousel } from "@/components/carousel";

type Item = {
  id: number;
  name: string;
  thumbnail: string;
};

const Page = () => {
  const [categories, setCategories] = useState<PublicProductCategory[]>([]);
  const [parentCategories, setParentCategories] = useState<
    PublicProductCategory[]
  >([]);
  const [groupedProducts, setGroupedProducts] = useState<
    Record<string, Item[]>
  >({});

  // State for loading and error (using the unified state for simplicity)
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Fetch all parent categories (for grouping titles)
  const {
    data: parentCategoriesData,
    loading: parentCategoriesLoading,
    error: parentCategoriesError,
    execute: fetchParentCategories,
  } = useApiCall(() =>
    publicProductCategoriesService.getProductCategories({
      is_parent: 1,
      paginate: 100,
      status: 1,
    })
  );

  // Fetch all subcategories (the products)
  const {
    data: subCategoriesData,
    loading: subCategoriesLoading,
    error: subCategoriesError,
    execute: fetchSubCategories,
  } = useApiCall(() =>
    publicProductCategoriesService.getProductCategories({
      paginate: 100,
      status: 1,
    })
  );

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        await Promise.all([fetchParentCategories(), fetchSubCategories()]);
      } catch (e) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []); // Only runs once on mount

  // Update categories and parent categories
  useEffect(() => {
    if (parentCategoriesData?.data?.data) {
      setParentCategories(parentCategoriesData.data.data);
    }
    if (subCategoriesData?.data?.data) {
      // Filter out parents to keep only products (subcategories)
      const subCategories = subCategoriesData.data.data.filter(
        (cat: PublicProductCategory) => cat.parent_id !== null
      );
      setCategories(subCategories);
    }

    // Handle overall loading/error state based on mocks
    setIsLoading(parentCategoriesLoading || subCategoriesLoading);
    setIsError(!!(parentCategoriesError || subCategoriesError));
  }, [
    parentCategoriesData,
    subCategoriesData,
    parentCategoriesLoading,
    subCategoriesLoading,
    parentCategoriesError,
    subCategoriesError,
  ]);

  // Group products when data is ready
  useEffect(() => {
    if (categories.length > 0 && parentCategories.length > 0) {
      const parentMap: Record<number, string> = {};
      parentCategories.forEach((p) => {
        parentMap[p.id] = p.title;
      });

      const grouped: Record<string, Item[]> = {};

      // Initialize groups with parent titles
      parentCategories.forEach((p) => {
        grouped[p.title] = [];
      });

      // Populate groups
      categories.forEach((cat) => {
        if (cat.parent_id !== null && parentMap[cat.parent_id]) {
          const parentTitle = parentMap[cat.parent_id];
          grouped[parentTitle].push({
            id: cat.id,
            name: cat.title,
            thumbnail:
              cat.image || "https://placehold.co/650/ccc/333?text=Product",
          });
        }
      });

      setGroupedProducts(grouped);
    }
  }, [categories, parentCategories]);

  // Determine which lists to display (limit to first 10 items)
  const gamesList = groupedProducts["Games"]
    ? groupedProducts["Games"].slice(0, 10)
    : [];
  const vouchersList = groupedProducts["Voucher"]
    ? groupedProducts["Voucher"].slice(0, 10)
    : [];
  const phonesCreditList = groupedProducts["Phone"]
    ? groupedProducts["Phone"].slice(0, 10)
    : [];
  const eMoneysList = groupedProducts["E-Money"]
    ? groupedProducts["E-Money"].slice(0, 10)
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#C02628] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center shadow-lg">
          <p className="text-red-600 font-semibold mb-2">
            Gagal memuat data produk.
          </p>
          <p className="text-red-500 text-sm">
            Silakan coba muat ulang halaman.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="pt-10 bg-[#37353E]">
        <HeroCarousel />

        <section className="mb-6">
          <Link className="max-w-xl mx-auto block" href="/produk">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari di Kios Tetta"
                className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C02628] focus:border-transparent text-sm"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </Link>
        </section>

        <SectionWrapper title="TOP UP GAME" seeAllUrl="/produk/?category=Games">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-x-3 sm:gap-x-4 gap-y-5">
            {gamesList.map((item) => (
              <Link
                href={`/produk/${item.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, "")}`}
                key={item.id}
              >
                <Image
                  className="w-full aspect-square mb-2 rounded-xl"
                  width={100}
                  height={100}
                  src={item.thumbnail}
                  alt={item.name}
                  unoptimized
                />
                <p className="text-center font-mono text-sm sm:text-base">
                  {item.name}
                </p>
              </Link>
            ))}
          </div>
        </SectionWrapper>

        <SectionWrapper title="VOUCHER" seeAllUrl="/produk/?category=Voucher">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-x-3 sm:gap-x-4 gap-y-5">
            {vouchersList.map((item) => (
              <Link
                href={`/produk/${item.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, "")}`}
                key={item.id}
              >
                <Image
                  className="w-full aspect-square mb-2 rounded-xl"
                  width={100}
                  height={100}
                  src={item.thumbnail}
                  alt={item.name}
                  unoptimized
                />
                <p className="text-center font-mono text-sm sm:text-base">
                  {item.name}
                </p>
              </Link>
            ))}
          </div>
        </SectionWrapper>

        <SectionWrapper title="PULSA" seeAllUrl="/produk/?category=Phone">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-x-3 sm:gap-x-4 gap-y-5">
            {phonesCreditList.map((item) => (
              <Link
                href={`/produk/${item.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, "")}`}
                key={item.id}
              >
                <Image
                  className="w-full aspect-square mb-2 rounded-xl"
                  width={100}
                  height={100}
                  src={item.thumbnail}
                  alt={item.name}
                  unoptimized
                />
                <p className="text-center font-mono text-sm sm:text-base">
                  {item.name}
                </p>
              </Link>
            ))}
          </div>
        </SectionWrapper>

        <SectionWrapper title="E-MONEY" seeAllUrl="/produk/?category=E-Money">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-x-3 sm:gap-x-4 gap-y-5">
            {eMoneysList.map((item) => (
              <Link
                href={`/produk/${item.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, "")}`}
                key={item.id}
              >
                <Image
                  className="w-full aspect-square mb-2 rounded-xl"
                  width={100}
                  height={100}
                  src={item.thumbnail}
                  alt={item.name}
                  unoptimized
                />
                <p className="text-center font-mono text-sm sm:text-base">
                  {item.name}
                </p>
              </Link>
            ))}
          </div>
        </SectionWrapper>
      </div>

      <PromotionBanner />
      <FAQ />
    </>
  );
};

export default Page;
