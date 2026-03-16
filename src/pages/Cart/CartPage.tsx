import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import type { AppDispatch, RootState } from "@/store/store";
import type { CartItem } from "@/features/cart/types/cart.type";

import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  changeCartVariant,
} from "@/features/cart/slices/cartSlice";

import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [selected, setSelected] = useState<string[]>([]);

  const { items, totalPrice, loading } = useSelector(
    (state: RootState) => state.cart,
  );

  const SHIPPING_FEE = 30000;
  const FREE_SHIPPING_THRESHOLD = 10000000;

  const shippingFee =
    Number(totalPrice) >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  const selectedItems = items.filter((i) =>
    selected.includes(i.productVariantSizeId),
  );

  const selectedTotal = selectedItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );

  const finalTotal = selectedTotal + shippingFee;

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

  const findVariantId = (item: CartItem, color: string, size: string) => {
    const variant = item.variantSizes?.find(
      (v) => v.colorName === color && v.sizeName === size,
    );

    return variant?.id;
  };

  const toggleSelectAll = () => {
    if (selected.length === items.length) {
      setSelected([]);
    } else {
      setSelected(items.map((i) => i.productVariantSizeId));
    }
  };

  const toggleSelectItem = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((i) => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

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
      {/* LEFT */}
      <div className="lg:col-span-2 space-y-8">
        <h1 className="text-3xl font-semibold tracking-tight">Giỏ hàng</h1>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={selected.length === items.length}
            onChange={toggleSelectAll}
          />
          <span>Chọn tất cả</span>
        </div>

        {items.map((item) => {
          const sizesByColor =
            item.variantSizes?.filter((v) => v.colorName === item.colorName) ||
            [];

          return (
            <div
              key={item.productVariantSizeId}
              className={`flex flex-col sm:flex-row justify-between gap-6 rounded-2xl p-6 border transition ${
                item.outOfStock || item.quantity > item.availableStock
                  ? "bg-red-50 border-red-200"
                  : "bg-white hover:shadow-md border-gray-200"
              }`}
            >
              {/* LEFT */}
              <div className="flex gap-6">
                <input
                  type="checkbox"
                  checked={selected.includes(item.productVariantSizeId)}
                  onChange={() => toggleSelectItem(item.productVariantSizeId)}
                  className="mt-2"
                />
                <Link to={`/products/${item.slug}`}>
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-28 h-36 object-cover rounded-xl border"
                  />
                </Link>

                <div className="space-y-2">
                  <Link to={`/products/${item.slug}`}>
                    <h3 className="font-medium text-gray-900 hover:underline">
                      {item.productName}
                    </h3>
                  </Link>

                  {/* COLOR + SIZE */}
                  <div className="flex gap-3 text-sm">
                    {/* COLOR */}
                    <select
                      value={item.colorName}
                      onChange={(e) => {
                        const newColor = e.target.value;

                        const newVariantId = findVariantId(
                          item,
                          newColor,
                          item.sizeName,
                        );

                        if (!newVariantId) return;

                        dispatch(
                          changeCartVariant({
                            oldVariantSizeId: item.productVariantSizeId,
                            newVariantSizeId: newVariantId,
                          }),
                        );
                      }}
                      className="border rounded-md px-2 py-1 bg-white text-gray-700"
                    >
                      {item.colors?.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>

                    {/* SIZE */}
                    <select
                      value={item.sizeName}
                      onChange={(e) => {
                        const newSize = e.target.value;

                        const newVariantId = findVariantId(
                          item,
                          item.colorName,
                          newSize,
                        );

                        if (!newVariantId) return;

                        dispatch(
                          changeCartVariant({
                            oldVariantSizeId: item.productVariantSizeId,
                            newVariantSizeId: newVariantId,
                          }),
                        );
                      }}
                      className="border rounded-md px-2 py-1 bg-white text-gray-700"
                    >
                      {sizesByColor.map((variant) => (
                        <option
                          key={variant.id}
                          value={variant.sizeName}
                          disabled={variant.stock === 0}
                        >
                          {variant.sizeName}
                          {variant.stock === 0 ? " (Hết hàng)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* PRICE */}
                  <p className="text-sm font-semibold text-gray-800">
                    {formatPrice(item.price)}
                  </p>

                  {/* STOCK */}
                  <div className="text-xs">
                    {item.outOfStock && (
                      <span className="text-red-600 font-medium">Hết hàng</span>
                    )}

                    {!item.outOfStock && item.availableStock <= 5 && (
                      <span className="text-orange-600 font-medium">
                        Còn {item.availableStock} sản phẩm
                      </span>
                    )}

                    {!item.outOfStock && item.availableStock > 5 && (
                      <span className="text-green-600">
                        Còn {item.availableStock} trong kho
                      </span>
                    )}
                  </div>

                  {/* QUANTITY */}
                  <div className="flex items-center mt-2 border rounded-full overflow-hidden w-fit">
                    <button
                      onClick={() =>
                        dispatch(
                          updateCartItem({
                            productVariantSizeId: item.productVariantSizeId,
                            quantity: Math.max(1, item.quantity - 1),
                          }),
                        )
                      }
                      className="px-4 py-2 hover:bg-gray-100"
                    >
                      -
                    </button>

                    <input
                      type="number"
                      min={1}
                      max={item.availableStock}
                      value={item.quantity}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (!value) return;

                        dispatch(
                          updateCartItem({
                            productVariantSizeId: item.productVariantSizeId,
                            quantity: Math.min(
                              item.availableStock,
                              Math.max(1, value),
                            ),
                          }),
                        );
                      }}
                      className="w-14 text-center text-sm outline-none"
                    />

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
                      className={`px-4 py-2 ${
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
                <p className="font-semibold text-lg text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </p>

                <button
                  onClick={() =>
                    dispatch(removeCartItem(item.productVariantSizeId))
                  }
                  className="mt-4 sm:mt-6 p-2 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SUMMARY */}
      <div className="bg-white rounded-2xl p-8 shadow-md h-fit sticky top-24 space-y-6">
        <h2 className="text-xl font-semibold">Tóm tắt đơn hàng</h2>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Tạm tính</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Phí vận chuyển</span>
          <span>
            {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
          </span>
        </div>

        <hr />

        <div className="flex justify-between font-semibold text-lg">
          <span>Tổng</span>
          <span>{formatPrice(finalTotal)}</span>
        </div>

        <Button
          disabled={hasStockIssue || selected.length === 0}
          onClick={() =>
            navigate("/checkout", {
              state: { items: selectedItems },
            })
          }
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
