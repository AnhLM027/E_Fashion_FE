import axiosClient from "@/lib/axiosClient";

export const adminVariantSizeApi = {
  create: (data: any) =>
    axiosClient.post(
      "/api/admin/product-variant-sizes",
      data
    ),

  getByVariant: (variantId: string) =>
    axiosClient.get(
      `/api/admin/product-variant-sizes/variant/${variantId}`
    ),

  getById: (id: string) =>
    axiosClient.get(
      `/api/admin/product-variant-sizes/${id}`
    ),

  update: (id: string, data: any) =>
    axiosClient.put(
      `/api/admin/product-variant-sizes/${id}`,
      data
    ),

  delete: (id: string) =>
    axiosClient.delete(
      `/api/admin/product-variant-sizes/${id}`
    ),
};