import axiosClient from "@/lib/axiosClient";

export const adminBrandApi = {
  getAll: () => axiosClient.get("/api/admin/brands"),

  create: (data: any) =>
    axiosClient.post("/api/admin/brands", data),
  
  update: (id: string, data: any) =>
    axiosClient.put(`/api/admin/brands/${id}`, data),
  
  delete: (id: string) =>
    axiosClient.delete(`/api/admin/brands/${id}`),
};
