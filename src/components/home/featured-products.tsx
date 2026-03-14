import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { HomeProductCard } from "@/features/products/components/HomeProductCard";
import { useProducts } from "@/features/products/hooks/useProducts";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "new", label: "Hàng mới về" },
  { id: "bestsellers", label: "Bán chạy nhất" },
  { id: "sale", label: "Đang giảm giá" },
];

export function FeaturedProducts({ embedded = false }: { embedded?: boolean }) {
  const [activeTab, setActiveTab] = useState("new");

  const { bestSellers, newArrivals, featured, loading } = useProducts();

  const filteredProducts = useMemo(() => {
    switch (activeTab) {
      case "new":
        return newArrivals?.slice(0, 5) ?? [];

      case "bestsellers":
        return bestSellers?.slice(0, 5) ?? [];

      case "sale":
        // vì HomeProduct không có discountPercent
        // chỉ check isOnSale === 1
        return featured?.filter((p) => p.isOnSale === 1).slice(0, 5) ?? [];

      default:
        return [];
    }
  }, [activeTab, bestSellers, newArrivals, featured]);

  if (loading) {
    return (
      <section className="py-20 text-center">Đang tải sản phẩm...</section>
    );
  }

  return (
    <section
      className={cn(
        "py-16",
        embedded
          ? "bg-transparent border-none"
          : "border-y border-neutral-200 bg-white",
      )}
    >
      <div className={cn(embedded ? "" : "container mx-auto max-w-7xl px-6")}>
        {/* Header */}
        <div className="mb-14 flex flex-col items-center justify-between gap-8 md:flex-row">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Sản phẩm nổi bật
            </h2>
            <p className="mt-4 max-w-xl text-neutral-500">
              Những lựa chọn được tuyển chọn từ các bộ sưu tập mới nhất của
              chúng tôi.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "text-sm font-medium tracking-wide transition-all duration-300",
                  activeTab === tab.id
                    ? "border-b-2 border-black pb-1 text-black"
                    : "text-neutral-400 hover:text-black",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 md:gap-5">
          {filteredProducts.map((product) => (
            <div className="min-w-[180px] lg:min-w-0" key={product.productId}>
              <HomeProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="mt-20 text-center">
          <Button
            asChild
            size="lg"
            className="rounded-none border border-black bg-transparent px-12 py-3 text-sm uppercase tracking-widest transition-all hover:bg-black hover:text-white"
          >
            <Link to="/products">Xem tất cả sản phẩm</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
