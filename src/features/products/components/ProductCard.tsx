import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";

import type { Product } from "../types/product.type";
import { ROUTES } from "@/config/routes";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Props {
  product: Product;
  isWishlisted?: boolean;
  className?: string;
  onToggleWishlist?: () => Promise<void>;
}

export function ProductCard({
  product,
  isWishlisted = false,
  className,
  onToggleWishlist,
}: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const isOnSale = product.originalPrice > product.salePrice;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const handleToggleWishlist = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!onToggleWishlist || loadingWishlist) return;

    try {
      setLoadingWishlist(true);
      await onToggleWishlist();
    } finally {
      setLoadingWishlist(false);
    }
  };

  return (
    <article
      className={cn(
        "group relative bg-white rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={ROUTES.productDetail(product.slug)} className="block">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl bg-gray-100">
          <img
            src={product.thumbnail}
            alt={product.name}
            className={cn(
              "h-full w-full object-cover transition-transform duration-700 ease-out",
              isHovered && "scale-110",
            )}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition" />

          {/* SALE badge */}
          {isOnSale && (
            <span className="absolute top-3 left-3 bg-black text-white text-[10px] tracking-widest px-3 py-1 rounded-full">
              SALE
            </span>
          )}

          {/* Wishlist */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            disabled={loadingWishlist || !onToggleWishlist}
            className={cn(
              "absolute top-3 right-3 z-10 rounded-full bg-white/90 backdrop-blur p-2 shadow-md transition-all duration-300",
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2",
              loadingWishlist && "opacity-60 cursor-not-allowed",
            )}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-all duration-300",
                isWishlisted
                  ? "fill-red-500 text-red-500 scale-110"
                  : "text-gray-700",
                loadingWishlist && "animate-pulse",
              )}
            />
          </button>

          {/* Quick add */}
          <div
            className={cn(
              "absolute bottom-4 left-4 right-4 transition-all duration-300",
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4",
            )}
          >
            <Button
              size="sm"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `${ROUTES.PRODUCTS}/${product.slug}`;
              }}
              className="w-full bg-white/90 text-black hover:bg-white rounded-full py-2"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Chọn size
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="px-5 py-5 space-y-1">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">
            {product.categoryName}
          </p>

          <h3 className="line-clamp-2 font-medium text-gray-900 group-hover:text-black transition">
            {product.name}
          </h3>

          <p className="text-xs text-gray-500">{product.brandName}</p>

          {/* Price */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-sm font-semibold text-black">
              {formatPrice(product.salePrice)}
            </span>

            {isOnSale && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="flex gap-2 pt-2">
              {product.colors.slice(0, 4).map((color) => (
                <span
                  key={color.id}
                  className="h-3 w-3 rounded-full border border-gray-300 transition hover:scale-110"
                  style={{
                    backgroundColor: color.code || color.slug || "#ccc",
                  }}
                  title={color.name}
                />
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
