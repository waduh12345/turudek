"use client";

import { useState, useEffect } from "react";
import PromotionBanner from "@/components/section/promotion-banner";
import {
  publicProductCategoriesService,
  PublicProductCategory,
} from "@/services/api/public-product-categories";
import { useApiCall } from "@/hooks";
import { HeroCarousel } from "@/components/carousel";
import PopularSection from "@/components/section/home/popular-section";

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
      <div className="pt-10 px-10 bg-[#37353E]">
        <HeroCarousel />
        <PopularSection/>
      </div>

      <PromotionBanner />
    </>
  );
};

export default Page;
