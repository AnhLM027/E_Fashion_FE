import axiosClient from "@/lib/axiosClient";
import { API_ENDPOINTS } from "@/config/api.config";
import type { DashboardResponseDTO } from "../types/dashboard.type";

interface DateFilter {
  from?: string;
  to?: string;
}

export const adminDashboardApi = {
  getDashboard: async (
    params?: DateFilter
  ): Promise<DashboardResponseDTO> => {
    return axiosClient.get(API_ENDPOINTS.ADMIN.DASHBOARD, {
      params,
    });
  },

  exportRevenue: async (params?: DateFilter) => {
    return axiosClient.get(
      API_ENDPOINTS.ADMIN.EXPORT_DASHBOARD("revenue"),
      {
        params,
        responseType: "blob",
      }
    );
  },

  exportRecentOrders: async (params?: DateFilter) => {
    return axiosClient.get(
      API_ENDPOINTS.ADMIN.EXPORT_DASHBOARD("recent-orders"),
      {
        params,
        responseType: "blob",
      }
    );
  },

  exportTopProducts: async (params?: DateFilter) => {
    return axiosClient.get(
      API_ENDPOINTS.ADMIN.EXPORT_DASHBOARD("top-products"),
      {
        params,
        responseType: "blob",
      }
    );
  },

  exportLowStock: async () => {
    return axiosClient.get(
      API_ENDPOINTS.ADMIN.EXPORT_DASHBOARD("low-stock"),
      {
        responseType: "blob",
      }
    );
  },

  exportFullDashboard: async () => {
    return axiosClient.get(
      API_ENDPOINTS.ADMIN.EXPORT_DASHBOARD("full"),
      { responseType: "blob" }
    );
  },
};