import axiosClient from "@/lib/axiosClient";
import { API_ENDPOINTS } from "../../../config/api.config";

export interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  thumbnail: string;
  originalPrice: number;
  salePrice: number;
}

// 📂 CUSTOMER (Yêu cầu đăng nhập)
export const wishlistApi = {
  getMyWishlist: async (): Promise<WishlistItem[]> => {
    return axiosClient.get(API_ENDPOINTS.CUSTOMER.WISHLIST);
  },

  addToWishlist: async (productId: string): Promise<void> => {
    return axiosClient.post(API_ENDPOINTS.CUSTOMER.WISHLIST, { productId });
  },

  removeFromWishlist: async (productId: string): Promise<void> => {
    // API config has WISHLIST_ID for this
    return axiosClient.delete(API_ENDPOINTS.CUSTOMER.WISHLIST_ID(productId));
  },
};