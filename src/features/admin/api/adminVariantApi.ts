import axiosClient from "@/lib/axiosClient";

export const adminVariantApi = {
  create: (data: any) =>
    axiosClient.post("/api/admin/product-variants", data),

  update: (id: string, data: any) =>
    axiosClient.put(`/api/admin/product-variants/${id}`, data),
  
  getByProduct: (productId: string) =>
    axiosClient.get(`/api/admin/product-variants/product/${productId}`),

  softDelete: (id: string) =>
    axiosClient.delete(`/api/admin/product-variants/${id}`),

  hardDelete: (id: string) =>
    axiosClient.delete(`/api/admin/product-variants/${id}/hard`),
};
