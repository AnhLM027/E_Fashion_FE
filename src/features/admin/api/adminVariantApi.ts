import axiosClient from "@/lib/axiosClient";
import { API_ENDPOINTS } from "@/config/api.config";

export const adminVariantApi = {
  create: (data: any) =>
    axiosClient.post(API_ENDPOINTS.STAFF.VARIANTS, data),

  update: (id: string, data: any) =>
    axiosClient.put(API_ENDPOINTS.STAFF.VARIANT_ID(id), data),
  
  getByProduct: (productId: string) =>
    axiosClient.get(`${API_ENDPOINTS.STAFF.VARIANTS}/product/${productId}`),

  softDelete: (id: string) =>
    axiosClient.delete(API_ENDPOINTS.STAFF.VARIANT_ID(id)),

  hardDelete: (id: string) =>
    axiosClient.delete(`${API_ENDPOINTS.STAFF.VARIANT_ID(id)}/hard`),
};
