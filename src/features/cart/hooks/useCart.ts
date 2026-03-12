// features/cart/useCart.ts
import { useEffect, useState } from "react";
import { cartApi } from "../api/cart.api";
import type { CartItem, CartResponse } from "../types/cart.type";

export function useCart() {
  const [cartId, setCartId] = useState<string | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    setLoading(true);
    const cart: CartResponse = await cartApi.getCart();
    console.log("Fetched cart:", cart);
    setCartId(cart.cartId);
    setItems(cart.items);
    setTotalPrice(cart.totalPrice);
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productVariantId: string, quantity: number) => {
    if (quantity < 1) return;

    // optimistic UI
    setItems(prev =>
      prev.map(i =>
        i.productVariantId === productVariantId
          ? { ...i, quantity }
          : i
      )
    );

    try {
      await cartApi.updateQuantity(productVariantId, quantity);
      // nếu BE trả lại cart mới → dùng dòng dưới
      // setItems(res.items); setTotalPrice(res.totalPrice);
      await fetchCart();
    } catch (err) {
      await fetchCart(); // rollback
    }
  };

  const removeItem = async (productVariantId: string) => {
    // optimistic
    const removed = items.find(i => i.productVariantId === productVariantId);
    setItems(prev => prev.filter(i => i.productVariantId !== productVariantId));

    try {
      await cartApi.removeItem(productVariantId);
      await fetchCart();
    } catch (err) {
      // rollback
      if (removed) {
        setItems(prev => [...prev, removed]);
      }
    }
  };

  return {
    cartId,
    items,
    totalPrice,
    loading,
    refetch: fetchCart,
    updateQuantity,
    removeItem,
  };
}
