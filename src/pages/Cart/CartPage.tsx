import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import type { AppDispatch, RootState } from "@/store/store";
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
} from "@/features/cart/slices/cartSlice";

import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { items, totalPrice, loading } = useSelector(
    (state: RootState) => state.cart,
  );

  const SHIPPING_FEE = 30000;
  const FREE_SHIPPING_THRESHOLD = 10000000;

  const shippingFee =
    Number(totalPrice) >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  const finalTotal = Number(totalPrice) + shippingFee;

  const hasStockIssue = items.some(
    (item) => item.outOfStock || item.quantity > item.availableStock,
  );

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCart());
    }
  }, [dispatch, isLoggedIn]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center text-gray-500">
        Đang tải giỏ hàng...
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-28 text-center">
        <h2 className="text-3xl font-semibold mb-4">Giỏ hàng trống</h2>
        <p className="text-gray-500 mb-8">
          Hãy thêm sản phẩm vào giỏ hàng của bạn.
        </p>

        <Link to="/">
          <Button className="bg-black text-white px-8 py-3 rounded-full hover:bg-neutral-800">
            Tiếp tục mua sắm
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 grid lg:grid-cols-3 gap-16">
      {/* LEFT - CART ITEMS */}
      <div className="lg:col-span-2 space-y-8">
        <h1 className="text-3xl font-semibold tracking-tight">Giỏ hàng</h1>

        {items.map((item) => (
          <div
            key={item.productVariantSizeId}
            className={`flex flex-col sm:flex-row justify-between gap-6 rounded-2xl p-6 shadow-sm transition ${
              item.outOfStock || item.quantity > item.availableStock
                ? "bg-red-50 border border-red-200"
                : "bg-white hover:shadow-md"
            }`}
          >
            {/* LEFT CONTENT */}
            <div className="flex gap-6">
              <Link to={`/products/${item.slug}`}>
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-28 h-36 object-cover rounded-xl"
                />
              </Link>

              <div className="space-y-2">
                <Link to={`/products/${item.slug}`}>
                  <h3 className="font-medium hover:underline">
                    {item.productName}
                  </h3>
                </Link>

                <p className="text-sm text-gray-500">
                  {item.colorName} / {item.sizeName}
                </p>

                <p className="text-sm font-medium">
                  {formatPrice(Number(item.price))}
                </p>

                {/* STOCK STATUS */}
                {item.outOfStock && (
                  <div className="text-red-600 text-sm mt-1">
                    Sản phẩm đã hết hàng
                  </div>
                )}

                {!item.outOfStock && item.availableStock <= 5 && (
                  <div className="text-orange-600 text-sm mt-1">
                    Chỉ còn {item.availableStock} sản phẩm
                  </div>
                )}

                {item.quantity > item.availableStock && (
                  <div className="text-red-600 text-sm mt-1">
                    Vượt quá số lượng tồn kho (còn {item.availableStock})
                  </div>
                )}

                {/* Quantity */}
                <div className="flex items-center mt-3 border rounded-full overflow-hidden w-fit">
                  <button
                    onClick={() =>
                      dispatch(
                        updateCartItem({
                          productVariantSizeId: item.productVariantSizeId,
                          quantity: Math.max(1, item.quantity - 1),
                        }),
                      )
                    }
                    className="px-4 py-2 hover:bg-gray-100 transition"
                  >
                    -
                  </button>

                  <span className="px-6 text-sm font-medium">
                    {item.quantity}
                  </span>

                  <button
                    disabled={item.quantity >= item.availableStock}
                    onClick={() =>
                      dispatch(
                        updateCartItem({
                          productVariantSizeId: item.productVariantSizeId,
                          quantity: Math.min(
                            item.availableStock,
                            item.quantity + 1,
                          ),
                        }),
                      )
                    }
                    className={`px-4 py-2 transition ${
                      item.quantity >= item.availableStock
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex sm:flex-col justify-between items-end">
              <p className="font-semibold text-lg">
                {formatPrice(Number(item.price) * item.quantity)}
              </p>

              <button
                onClick={() =>
                  dispatch(removeCartItem(item.productVariantSizeId))
                }
                className="mt-4 sm:mt-6 p-2 rounded-full hover:bg-red-50 transition text-gray-500 hover:text-red-600"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT - SUMMARY */}
      <div className="bg-white rounded-2xl p-8 shadow-md h-fit sticky top-24 space-y-6">
        <h2 className="text-xl font-semibold">Tóm tắt đơn hàng</h2>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Tạm tính</span>
          <span>{formatPrice(Number(totalPrice))}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Phí vận chuyển (ước tính)</span>
          <span>
            {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
          </span>
        </div>

        <hr />

        <div className="flex justify-between font-semibold text-lg">
          <span>Tổng tạm tính</span>
          <span>{formatPrice(finalTotal)}</span>
        </div>

        <p className="text-xs text-gray-400">
          Phí vận chuyển chính xác sẽ được tính ở bước thanh toán.
        </p>

        <Button
          disabled={hasStockIssue}
          onClick={() => navigate("/checkout")}
          className={`w-full py-3 rounded-full ${
            hasStockIssue
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black text-white hover:bg-neutral-800"
          }`}
        >
          {hasStockIssue ? "Vui lòng kiểm tra lại giỏ hàng" : "Thanh toán"}
        </Button>
      </div>
    </div>
  );
}
