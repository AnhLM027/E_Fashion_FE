import axiosClient from "@/lib/axiosClient";
import { API_ENDPOINTS } from "@/config/api.config";

export const adminBrandApi = {
  getAll: () => axiosClient.get(API_ENDPOINTS.STAFF.BRANDS),

  create: (data: any) =>
    axiosClient.post(API_ENDPOINTS.ADMIN.BRANDS, data),
  
  update: (id: string, data: any) =>
    axiosClient.put(API_ENDPOINTS.ADMIN.BRAND_ID(id), data),
  
  delete: (id: string) =>
    axiosClient.delete(API_ENDPOINTS.ADMIN.BRAND_ID(id)),
};
