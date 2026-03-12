import axiosClient from "@/lib/axiosClient";
import type {
    CouponResponseDTO,
    CouponRequestDTO,
    ApplyCouponRequestDTO,
    ApplyCouponResponseDTO,
} from "../types/coupon.type";
import { API_ENDPOINTS } from "@/config/api.config";

export const couponApi = {
    // ===== ADMIN =====

    getAll: async (): Promise<CouponResponseDTO[]> => {
        return axiosClient.get("/api/coupons");
    },

    create: async (
        data: CouponRequestDTO
    ): Promise<CouponResponseDTO> => {
        return axiosClient.post("/api/admin/coupons", data);
    },

    update: async (
        id: string,
        data: CouponRequestDTO
    ): Promise<CouponResponseDTO> => {
        return axiosClient.put(`/api/admin/coupons/${id}`, data);
    },

    delete: async (id: string): Promise<void> => {
        return axiosClient.delete(`/api/admin/coupons/${id}`);
    },

    // ===== CLIENT =====

    getMyCoupons: async (): Promise<CouponResponseDTO[]> => {
        return axiosClient.get("/api/coupons/my");
    },

    apply: async (
        data: ApplyCouponRequestDTO
    ): Promise<ApplyCouponResponseDTO> => {
        return axiosClient.post("/api/coupons/apply", data);
    },

    claim: async (code: string): Promise<void> => {
    return axiosClient.post(
      `${API_ENDPOINTS.COUPON.BASE}/claim/${code}`
    );
  },
};