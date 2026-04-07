import { useMemo, useState, useCallback } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { ChevronRight, SlidersHorizontal, X } from "lucide-react";

import { ROUTES } from "@/config/routes";
import { ProductsFilter } from "@/features/products/components/ProductsFilter";
import { ProductsGrid } from "@/features/products/components/ProductsGrid";
import { ProductsSort } from "@/features/products/components/ProductsSort";
import { useProducts } from "@/features/products/hooks/useProducts";
import { type SortKey, sortProducts } from "@/utils/sortProducts";
import { useCategoryTree } from "@/hooks/useCategoryTree";
import { Pagination } from "@/components/ui/Pagination";

export default function ProductsPage() {
  const { "*": fullSlug } = useParams();
  const [searchParams] = useSearchParams();
  const [sortKey, setSortKey] = useState<SortKey>("name-asc");
  const [page, setPage] = useState(0);

  // ================= LOGIC FILTERS =================
  const keyword = searchParams.get("q") || "";
  const selectedCategories = useMemo(
    () => searchParams.get("category")?.split(",").filter(Boolean) || [],
    [searchParams],
  );
  const selectedBrands = useMemo(
    () => searchParams.get("brand")?.split(",").filter(Boolean) || [],
    [searchParams],
  );
  const selectedColors = useMemo(
    () => searchParams.get("color")?.split(",").filter(Boolean) || [],
    [searchParams],
  );

  const minPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : undefined;
  const maxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : undefined;

  const filters = useMemo(
    () => ({
      keyword: keyword || undefined,
      categorySlugs: fullSlug
        ? [fullSlug]
        : selectedCategories.length
          ? selectedCategories
          : undefined,
      brandSlugs: selectedBrands.length ? selectedBrands : undefined,
      colorSlugs: selectedColors.length ? selectedColors : undefined,
      minPrice,
      maxPrice,
    }),
    [
      keyword,
      fullSlug,
      selectedCategories,
      selectedBrands,
      selectedColors,
      minPrice,
      maxPrice,
    ],
  );

  const { products, loading, totalElements, totalPages } = useProducts(filters, page);
  const sortedProducts = useMemo(
    () => sortProducts(products, sortKey),
    [products, sortKey],
  );

  // ================= DISPLAY LOGIC (VIETNAMESE) =================
  const { categories, slugNameMap } = useCategoryTree();

  const formatVietnameseName = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toLocaleUpperCase("vi-VN") + word.slice(1))
      .join(" ");
  };

  const getDisplayName = useCallback(
    (slug: string) => {
      if (!slugNameMap || slugNameMap.size === 0) return "";
      const rawName = slugNameMap.get(slug);
      if (!rawName) return "";

      return formatVietnameseName(rawName);
    },
    [slugNameMap],
  );

  const categoryTitle = useMemo(() => {
    if (keyword) return `Kết quả cho "${keyword}"`;
    if (fullSlug) {
      const name = getDisplayName(fullSlug);
      return `Danh mục "${name}"`
    }
    if (selectedCategories.length > 0) {
      const name = getDisplayName(selectedCategories[0]);
      return `Danh mục "${name}"`
    }
    return "Tất cả sản phẩm";
  }, [fullSlug, keyword, getDisplayName]);

  return (
    <div className="bg-white min-h-screen text-zinc-900">
      {/* BREADCRUMBS */}
      <nav className="border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-2 text-[11px] font-medium tracking-widest text-zinc-400">
          <Link to={ROUTES.HOME} className="hover:text-black transition">
            Trang chủ
          </Link>
          <ChevronRight size={10} strokeWidth={3} className="text-zinc-300" />
          <Link
            to={ROUTES.PRODUCTS}
            className="hover:text-black transition"
          >
            Cửa hàng
          </Link>

          {fullSlug?.split("/").map((_, index, arr) => {
            const accumulatedSlug = arr.slice(0, index + 1).join("/");
            const path = ROUTES.productsByCategory(accumulatedSlug);
            const isLast = index === arr.length - 1;
            const displayName = getDisplayName(accumulatedSlug);

            return (
              <div key={path} className="flex items-center gap-2">
                <ChevronRight
                  size={10}
                  strokeWidth={3}
                  className="text-zinc-300"
                />

                {displayName === "" ? (
                  <div className="w-12 h-3 bg-zinc-100 animate-pulse rounded" />
                ) : isLast ? (
                  <span className="text-zinc-900 font-bold">
                    {displayName}
                  </span>
                ) : (
                  <Link
                    to={path}
                    className="hover:text-black transition"
                  >
                    {displayName}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col gap-12">
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-light tracking-tight text-zinc-900">
                {categoryTitle}
              </h1>
              <p className="text-[12px] text-zinc-400 font-medium uppercase tracking-widest">
                {totalElements} sản phẩm
              </p>
            </div>
            <div className="pt-4 md:pt-0">
              <ProductsSort value={sortKey} onChange={setSortKey} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* SIDEBAR */}
            <aside className="lg:col-span-3">
              <div className="sticky top-28 space-y-12">
                <div className="flex items-center gap-3 pb-3 border-b border-zinc-900 w-full">
                  <SlidersHorizontal size={14} />
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.3em]">
                    Lọc sản phẩm
                  </h2>
                </div>
                <ProductsFilter />

                {(fullSlug ||
                  selectedCategories.length > 0 ||
                  selectedBrands.length > 0) && (
                  <button
                    onClick={() => (window.location.href = ROUTES.PRODUCTS)}
                    className="group flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-400 hover:text-black transition-colors"
                  >
                    <X
                      size={12}
                      className="group-hover:rotate-90 transition-transform"
                    />
                    Xóa tất cả bộ lọc
                  </button>
                )}
              </div>
            </aside>

            {/* PRODUCT GRID */}
            <section className="lg:col-span-9">
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-4">
                      <div className="aspect-[3/4] bg-zinc-50 animate-pulse" />
                      <div className="h-3 bg-zinc-50 animate-pulse w-2/3" />
                      <div className="h-3 bg-zinc-50 animate-pulse w-1/3" />
                    </div>
                  ))}
                </div>
              ) : sortedProducts.length > 0 ? (
                <>
                  <ProductsGrid products={sortedProducts} loading={loading} />
                  
                  <Pagination 
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(p) => {
                      setPage(p);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="mt-12 border-t border-zinc-100"
                  />
                </>
              ) : (
                <div className="py-32 text-center border border-zinc-100 rounded-sm">
                  <p className="text-zinc-400 text-[11px] uppercase tracking-[0.2em]">
                    Không tìm thấy sản phẩm phù hợp
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
