import axiosClient from "@/lib/axiosClient";
import { API_ENDPOINTS } from "@/config/api.config";
import type { Rating, CreateRatingRequest } from "../types/rating.types";

interface RatingPage {
  content: Rating[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface RatingSummary {
  averageRating: number;
  totalRatings: number;
}

export const ratingApi = {
  // 📂 DISCOVERY (Public/Guest)
  async getProductRatings(
    productId: string,
    page = 0,
    size = 5
  ): Promise<RatingPage> {
    return axiosClient.get(
      API_ENDPOINTS.DISCOVERY.RATINGS_BY_PRODUCT(productId),
      {
        params: { page, size },
      }
    );
  },

  async getProductRatingSummary(
    productId: string
  ): Promise<RatingSummary> {
    return axiosClient.get(
      `${API_ENDPOINTS.DISCOVERY.RATINGS_BY_PRODUCT(productId)}/summary`
    );
  },

  // 📂 CUSTOMER (Yêu cầu đăng nhập)
  async getOrderRatings(orderId: string): Promise<Rating[]> {
    return axiosClient.get(API_ENDPOINTS.CUSTOMER.RATINGS_ORDER(orderId));
  },

  async createRating(data: CreateRatingRequest): Promise<Rating> {
    return axiosClient.post(API_ENDPOINTS.CUSTOMER.RATINGS, data);
  },

  async updateRating(id: string, data: CreateRatingRequest): Promise<Rating> {
    return axiosClient.put(API_ENDPOINTS.CUSTOMER.RATING_ID(id), data);
  },

  async deleteRating(id: string) {
    return axiosClient.delete(API_ENDPOINTS.CUSTOMER.RATING_ID(id));
  },
};

// Vẫn giữ export này để tránh lỗi compile nếu nơi khác đang dùng (nhưng khuyên dùng ratingApi)
export const discoveryRatingApi = ratingApi;