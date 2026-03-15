import axiosClient from "@/lib/axiosClient";
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
  async getProductRatings(
    productId: string,
    page = 0,
    size = 5
  ): Promise<RatingPage> {
    const res = await axiosClient.get(
      `/api/ratings/product/${productId}`,
      {
        params: { page, size },
      }
    );

    return res;
  },

  async getOrderRatings(orderId: string): Promise<Rating[]> {
    const res = await axiosClient.get(
      `/api/ratings/order/${orderId}`
    );

    return res;
  },

  async getProductRatingSummary(
    productId: string
  ): Promise<RatingSummary> {
    const res = await axiosClient.get(
      `/api/ratings/product/${productId}/summary`
    );

    return res;
  },

  async createRating(data: CreateRatingRequest): Promise<Rating> {
    const res = await axiosClient.post(`/api/ratings`, data);
    return res;
  },

  async updateRating(id: string, data: CreateRatingRequest): Promise<Rating> {
    const res = await axiosClient.put(`/api/ratings/${id}`, data);
    return res;
  },

  async deleteRating(id: string) {
    return axiosClient.delete(`/api/admin/ratings/${id}`);
  },
};