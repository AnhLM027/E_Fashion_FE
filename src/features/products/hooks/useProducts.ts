import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  type ProductFilterParams,
  fetchProducts,
  fetchBestSellers,
  fetchFeatured,
  fetchNewArrivals,
} from "../slices/productSlice";

export function useProducts(filters?: ProductFilterParams, page = 0) {
  const dispatch = useAppDispatch();

  const {
    items,
    bestSellers,
    featured,
    newArrivals,
    loading,
    totalPages,
    totalElements,
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

    if (isCategoryPage && (!stableFilters?.categorySlugs || !stableFilters.categorySlugs[0])) return;
    if (isSearchPage && (!stableFilters?.keyword || !stableFilters.keyword.trim())) return;

    // 🔥 Có filter hoặc ít nhất có phân trang
    dispatch(fetchProducts({ ...stableFilters, page }));

    if (!stableFilters) {
      dispatch(fetchBestSellers());
      dispatch(fetchFeatured());
      dispatch(fetchNewArrivals());
    }
  }, [dispatch, stableFilters, page]);

  return {
    products: items,
    bestSellers,
    featured,
    newArrivals,
    loading,
    totalPages,
    totalElements,
  };
}