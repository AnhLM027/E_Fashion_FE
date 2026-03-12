import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { Product } from "../types/product.type";
import { ProductCard } from "./ProductCard";
import { wishlistApi } from "@/features/wishlist/api/wishlist.api";

interface Props {
  products: Product[];
  loading: boolean;
}

export function ProductsGrid({ products, loading }: Props) {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = !!user;

  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated) {
        setWishlistIds(new Set());
        return;
      }

      try {
        const data = await wishlistApi.getMyWishlist();
        setWishlistIds(new Set(data.map((item) => item.productId)));
      } catch (error) {
        console.error("Fetch wishlist failed:", error);
      }
    };

    fetchWishlist();
  }, [isAuthenticated]);

  const handleToggleWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để thêm vào wishlist ❤️");
      // navigate("/login");
      return;
    }

    const isCurrentlyWishlisted = wishlistIds.has(productId);

    // Optimistic update
    setWishlistIds((prev) => {
      const newSet = new Set(prev);
      if (isCurrentlyWishlisted) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });

    try {
      if (isCurrentlyWishlisted) {
        await wishlistApi.removeFromWishlist(productId);
        toast.success("Đã xoá khỏi wishlist");
      } else {
        await wishlistApi.addToWishlist(productId);
        toast.success("Đã thêm vào wishlist 🎉");
      }
    } catch (error) {
      // Rollback nếu lỗi
      setWishlistIds((prev) => {
        const rollbackSet = new Set(prev);
        if (isCurrentlyWishlisted) {
          rollbackSet.add(productId);
        } else {
          rollbackSet.delete(productId);
        }
        return rollbackSet;
      });

      toast.error("Không thể cập nhật wishlist");
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3 animate-pulse">
            <div className="aspect-[3/4] bg-gray-200 rounded-2xl" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-24 text-center text-gray-500">
        Không tìm thấy sản phẩm phù hợp
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isWishlisted={wishlistIds.has(product.id)}
          onToggleWishlist={() => handleToggleWishlist(product.id)}
        />
      ))}
    </div>
  );
}
