// import { createContext, useContext, useState } from "react";
// import type { CartItem } from "../types/cart.type";
// import type { ProductVariant } from "@/features/products/types/productVariant.type";

// interface CartContextValue {
//   items: CartItem[];
//   addToCart: (variant: ProductVariant, qty?: number) => void;
// }

// const CartContext = createContext<CartContextValue | null>(null);

// export function CartProvider({ children }: { children: React.ReactNode }) {
//   const [items, setItems] = useState<CartItem[]>([]);

//   const addToCart = (variant: ProductVariant, qty = 1) => {
//     setItems(prev => {
//       const existing = prev.find(i => i.variant.id === variant.id);
//       if (existing) {
//         return prev.map(i =>
//           i.variant.id === variant.id
//             ? { ...i, quantity: i.quantity + qty }
//             : i
//         );
//       }
//       return [...prev, { variant, quantity: qty }];
//     });
//   };

//   return (
//     <CartContext.Provider value={{ items, addToCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// }

// export const useCart = () => {
//   const ctx = useContext(CartContext);
//   if (!ctx) throw new Error("useCart must be used inside CartProvider");
//   return ctx;
// };
