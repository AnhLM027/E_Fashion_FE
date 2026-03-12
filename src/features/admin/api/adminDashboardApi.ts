import axiosClient from "@/lib/axiosClient";
import type { DashboardResponseDTO } from "../types/dashboard.type";

interface DateFilter {
  from?: string;
  to?: string;
}

export const adminDashboardApi = {
  getDashboard: async (
    params?: DateFilter
  ): Promise<DashboardResponseDTO> => {
    return axiosClient.get("/api/admin/dashboard", {
      params,
    });
  },

  exportRevenue: async (params?: DateFilter) => {
    return axiosClient.get(
      "/api/admin/dashboard/export/revenue",
      {
        params,
        responseType: "blob",
      }
    );
  },

  exportRecentOrders: async (params?: DateFilter) => {
    return axiosClient.get(
      "/api/admin/dashboard/export/recent-orders",
      {
        params,
        responseType: "blob",
      }
    );
  },

  exportTopProducts: async (params?: DateFilter) => {
    return axiosClient.get(
      "/api/admin/dashboard/export/top-products",
      {
        params,
        responseType: "blob",
      }
    );
  },

  exportLowStock: async () => {
    return axiosClient.get(
      "/api/admin/dashboard/export/low-stock",
      {
        responseType: "blob",
      }
    );
  },

  exportFullDashboard: async () => {
    return axiosClient.get(
      "/api/admin/dashboard/export/full",
      { responseType: "blob" }
    );
  },
};