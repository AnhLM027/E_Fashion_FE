import { Link } from "react-router-dom";
import type { HomeProduct } from "../types/homeProduct.type";

interface Props {
  product: HomeProduct;
}

export function HomeProductCard({ product }: Props) {
  const formatPrice = (price: number) => price.toLocaleString("vi-VN") + "₫";

  const hasRange = product.minPrice !== product.maxPrice;

  return (
    <Link to={`/products/${product.slug}`} className="group block">
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={product.thumbnail}
            alt={product.name}
            className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />

          {/* Overlay hover */}
          <div className="absolute inset-0 bg-black/0 transition-all duration-500 group-hover:bg-black/10" />

          {/* SALE badge */}
          {product.isOnSale === 1 && (
            <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-md">
              - Sale
            </span>
          )}

          {/* CTA */}
          <div className="absolute bottom-4 left-1/2 w-[80%] -translate-x-1/2 opacity-0 transition-all duration-500 group-hover:opacity-100">
            <div className="rounded-full bg-white py-2 text-center text-sm font-medium text-black shadow-md">
              Xem chi tiết
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="line-clamp-2 text-sm font-medium text-neutral-800 transition-colors duration-300 group-hover:text-black">
            {product.name}
          </h3>

          <div className="mt-2 flex items-center gap-2">
            <p className="text-base font-semibold text-black">
              {formatPrice(product.minPrice)}
              {hasRange && (
                <span className="text-neutral-500 font-medium">
                  {" "}
                  - {formatPrice(product.maxPrice)}
                </span>
              )}
            </p>

            {/* {product.originalPrice && product.isOnSale === 1 && (
              <span className="text-sm text-neutral-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )} */}
          </div>
        </div>
      </div>
    </Link>
  );
}
