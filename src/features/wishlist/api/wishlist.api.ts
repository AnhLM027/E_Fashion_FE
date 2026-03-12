import axiosClient from "@/lib/axiosClient";

export interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  thumbnail: string;
  originalPrice: number;
  salePrice: number;
}

export const wishlistApi = {
  getMyWishlist: async (): Promise<WishlistItem[]> => {
    return axiosClient.get("/api/wishlist");
  },

  addToWishlist: async (productId: string): Promise<void> => {
    return axiosClient.post("/api/wishlist", { productId });
  },

  removeFromWishlist: async (productId: string): Promise<void> => {
    return axiosClient.delete(`/api/wishlist/${productId}`);
  },
};