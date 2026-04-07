import axiosClient from "@/lib/axiosClient";
import { API_ENDPOINTS } from "@/config/api.config";

export const adminProductApi = {
  getAll: (params?: any) => axiosClient.get(API_ENDPOINTS.STAFF.PRODUCTS, { params }),

  getById: (id: string) =>
    axiosClient.get(API_ENDPOINTS.STAFF.PRODUCT_ID(id)),

  create: (data: any) =>
    axiosClient.post(API_ENDPOINTS.STAFF.PRODUCTS, data),

  update: (id: string, data: any) =>
    axiosClient.put(API_ENDPOINTS.STAFF.PRODUCT_ID(id), data),

  setStatus: (id: string, active: boolean) =>
    axiosClient.patch(`${API_ENDPOINTS.STAFF.PRODUCT_STATUS(id)}?active=${active}`),

  softDelete: (id: string) =>
    axiosClient.delete(API_ENDPOINTS.STAFF.PRODUCT_ID(id)),

  hardDelete: (id: string) =>
    axiosClient.delete(API_ENDPOINTS.ADMIN.PRODUCT_HARD_DELETE(id)),

  search: (keyword: string) =>
    axiosClient.get(API_ENDPOINTS.STAFF.PRODUCTS_SEARCH, { params: { keyword } }),

  restore: (id: string) =>
    axiosClient.patch(API_ENDPOINTS.ADMIN.PRODUCT_RESTORE(id)),
};
