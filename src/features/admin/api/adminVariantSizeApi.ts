import axiosClient from "@/lib/axiosClient";
import { API_ENDPOINTS } from "@/config/api.config";

export const adminVariantSizeApi = {
  create: (data: any) =>
    axiosClient.post(
      API_ENDPOINTS.STAFF.VARIANT_SIZES,
      data
    ),

  getByVariant: (variantId: string) =>
    axiosClient.get(
      `${API_ENDPOINTS.STAFF.VARIANT_SIZES}/variant/${variantId}`
    ),

  getById: (id: string) =>
    axiosClient.get(
      API_ENDPOINTS.STAFF.VARIANT_SIZE_ID(id)
    ),

  update: (id: string, data: any) =>
    axiosClient.put(
      API_ENDPOINTS.STAFF.VARIANT_SIZE_ID(id),
      data
    ),

  delete: (id: string) =>
    axiosClient.delete(
      API_ENDPOINTS.STAFF.VARIANT_SIZE_ID(id)
    ),
};