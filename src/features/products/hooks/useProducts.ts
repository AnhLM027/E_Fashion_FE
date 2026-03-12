import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  type ProductFilterParams,
  fetchProducts,
  fetchBestSellers,
  fetchFeatured,
  fetchNewArrivals,
} from "../slices/productSlice";

export function useProducts(filters?: ProductFilterParams) {
  const dispatch = useAppDispatch();

  const {
    items,
    bestSellers,
    featured,
    newArrivals,
    loading,
  } = useAppSelector((state) => state.products);

  // tránh infinite re-render do object reference
  const stableFilters = useMemo(
    () => filters,
    [JSON.stringify(filters)]
  );

  useEffect(() => {
    const pathname = window.location.pathname;
    const search = window.location.search;

    const isCategoryPage = pathname.includes("/category/");
    const isSearchPage = search.includes("q=");

    // 🔥 Nếu là category page mà categorySlugs chưa sẵn sàng → đợi
    if (
      isCategoryPage &&
      (!stableFilters?.categorySlugs ||
        stableFilters.categorySlugs[0] === undefined)
    ) {
      return;
    }

    // 🔥 Nếu là search page mà keyword chưa có → đợi
    if (
      isSearchPage &&
      (!stableFilters?.keyword ||
        stableFilters.keyword.trim() === "")
    ) {
      return;
    }

    // 🔥 Có filter thật sự
    if (
      stableFilters &&
      Object.values(stableFilters).some(
        (v) =>
          v !== undefined &&
          v !== null &&
          !(Array.isArray(v) && v.length === 0)
      )
    ) {
      dispatch(fetchProducts(stableFilters));
    } else {
      dispatch(fetchProducts(undefined));
      dispatch(fetchBestSellers());
      dispatch(fetchFeatured());
      dispatch(fetchNewArrivals());
    }
  }, [dispatch, stableFilters]);

  return {
    products: items,
    bestSellers,
    featured,
    newArrivals,
    loading,
  };
}