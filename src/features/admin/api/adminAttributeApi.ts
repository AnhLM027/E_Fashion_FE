import axiosClient from "@/lib/axiosClient";

export const adminAttributeApi = {
  create: (productId: string, data: any) =>
    axiosClient.post(`/api/admin/products/${productId}/attributes`, data),

  getByProduct: (productId: string) =>
    axiosClient.get(`/api/admin/products/${productId}/attributes`),

  delete: (productId: string, id: string) =>
    axiosClient.delete(`/api/admin/products/${productId}/attributes/${id}`),
};
