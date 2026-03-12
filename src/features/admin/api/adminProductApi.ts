import axiosClient from "@/lib/axiosClient";

export const adminProductApi = {
  getAll: () => axiosClient.get("/api/admin/products"),

  getById: (id: string) =>
    axiosClient.get(`/api/admin/products/${id}`),

  create: (data: any) =>
    axiosClient.post("/api/admin/products", data),

  update: (id: string, data: any) =>
    axiosClient.put(`/api/admin/products/${id}`, data),

  setStatus: (id: string, active: boolean) =>
    axiosClient.patch(`/api/admin/products/${id}/status?active=${active}`),

  softDelete: (id: string) =>
    axiosClient.delete(`/api/admin/products/${id}`),

  hardDelete: (id: string) =>
    axiosClient.delete(`/api/admin/products/${id}/hard`),

  restore: (id: string) =>
    axiosClient.patch(`/api/admin/products/${id}/restore`),
};
