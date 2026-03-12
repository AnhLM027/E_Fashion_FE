// features/wishlist/hooks/useWishlist.ts
import { useState } from "react";

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<string[]>([]);

  const toggleWishlist = (id: string) => {
    setWishlist(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id],
    );
  };

  const isWishlisted = (id: string) => {
    return wishlist.includes(id);
  };

  return {
    toggleWishlist,
    isWishlisted, // ✅ PHẢI return
  };
};
