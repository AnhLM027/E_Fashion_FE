import axiosClient from "@/lib/axiosClient";

export const adminImageApi = {
  create: (variantId: string, data: any) =>
    axiosClient.post(
      `/api/admin/product-variants/${variantId}/images`,
      data
    ),

  getByVariant: (variantId: string) =>
    axiosClient.get(
      `/api/admin/product-variants/${variantId}/images`
    ),

  setPrimary: (variantId: string, id: string) =>
    axiosClient.patch(
      `/api/admin/product-variants/${variantId}/images/${id}/primary`
    ),

  delete: (variantId: string, id: string) =>
    axiosClient.delete(
      `/api/admin/product-variants/${variantId}/images/${id}`
    ),
};
