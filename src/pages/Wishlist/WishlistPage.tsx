import { useEffect, useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  wishlistApi,
  type WishlistItem,
} from "@/features/wishlist/api/wishlist.api";
import { ROUTES } from "@/config/routes";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function WishlistPage() {
  const { isAuthenticated } = useAuth();

  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await wishlistApi.getMyWishlist();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    fetchWishlist();
  }, [isAuthenticated]);

  const handleRemove = async (productId: string) => {
    if (!isAuthenticated) return;

    try {
      await wishlistApi.removeFromWishlist(productId);
      setItems((prev) => prev.filter((item) => item.productId !== productId));
    } catch (error) {
      console.error("Remove wishlist failed:", error);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  /* ==========================
     Nếu chưa đăng nhập
  ========================== */
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="bg-gray-50 border border-dashed rounded-3xl py-16 px-6">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-6" />

          <h2 className="text-2xl font-semibold mb-3">Vui lòng đăng nhập</h2>

          <p className="text-gray-500 mb-8">
            Bạn cần đăng nhập để xem danh sách yêu thích.
          </p>

          <Link
            to={ROUTES.LOGIN}
            className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition font-medium"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  /* ==========================
     Loading
  ========================== */
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="animate-pulse grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-square bg-gray-200 rounded-2xl" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ==========================
     Wishlist content
  ========================== */
  return (
    <div className="max-w-7xl mx-auto px-4 py-14">
      <div className="flex items-center gap-3 mb-12">
        <div className="p-3 rounded-full bg-red-50">
          <Heart className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Danh sách yêu thích
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Những sản phẩm bạn đã lưu lại
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border border-dashed rounded-3xl bg-gray-50 text-center">
          <Heart className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-gray-600 mb-6">
            Bạn chưa có sản phẩm yêu thích nào.
          </p>
          <Link
            to={ROUTES.PRODUCTS}
            className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition font-medium"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div
              key={item.productId}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <Link to={`/products/${item.productSlug}`}>
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={item.thumbnail}
                    alt={item.productName}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>
              </Link>

              <div className="p-5 space-y-3">
                <Link
                  to={`/products/${item.productSlug}`}
                  className="font-medium line-clamp-2 hover:text-black transition"
                >
                  {item.productName}
                </Link>

                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {formatPrice(item.salePrice)}
                  </span>
                </div>

                <button
                  onClick={() => handleRemove(item.productId)}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-gray-200 hover:border-red-500 hover:text-red-500 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
