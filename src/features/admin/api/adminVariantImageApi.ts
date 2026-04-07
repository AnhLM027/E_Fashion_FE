import axiosClient from "@/lib/axiosClient";
import { API_ENDPOINTS } from "@/config/api.config";

export const adminImageApi = {
  create: (variantId: string, data: any) =>
    axiosClient.post(
      API_ENDPOINTS.STAFF.VARIANT_IMAGES_BY_VARIANT(variantId),
      data
    ),

  getByVariant: (variantId: string) =>
    axiosClient.get(
      API_ENDPOINTS.STAFF.VARIANT_IMAGES_BY_VARIANT(variantId)
    ),

  setPrimary: (variantId: string, id: string) =>
    axiosClient.patch(
      `${API_ENDPOINTS.STAFF.VARIANT_IMAGES_BY_VARIANT(variantId)}/${id}/primary`
    ),

  delete: (variantId: string, id: string) =>
    axiosClient.delete(
      `${API_ENDPOINTS.STAFF.VARIANT_IMAGES_BY_VARIANT(variantId)}/${id}`
    ),
};
