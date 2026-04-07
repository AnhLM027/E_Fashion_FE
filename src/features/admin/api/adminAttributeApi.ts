import axiosClient from "@/lib/axiosClient";
import { API_ENDPOINTS } from "@/config/api.config";

export const adminAttributeApi = {
  create: (productId: string, data: any) =>
    axiosClient.post(API_ENDPOINTS.STAFF.PRODUCT_ATTRIBUTES(productId), data),

  getByProduct: (productId: string) =>
    axiosClient.get(API_ENDPOINTS.STAFF.PRODUCT_ATTRIBUTES(productId)),

  delete: (productId: string, id: string) =>
    axiosClient.delete(`${API_ENDPOINTS.STAFF.PRODUCT_ATTRIBUTES(productId)}/${id}`),
};
