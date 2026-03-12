import axiosClient from "@/lib/axiosClient";

export const adminCategoryApi = {
  create: (data: any) =>
    axiosClient.post("/api/admin/categories", data),

  update: (id: string, data: any) =>
    axiosClient.put(`/api/admin/categories/${id}`, data),

  getAll: () =>
    axiosClient.get("/api/admin/categories"),

  getRoot: () =>
    axiosClient.get("/api/admin/categories/root"),

  getTree: () =>
    axiosClient.get("/api/admin/categories/tree"),

  delete: (id: string) =>
    axiosClient.delete(`/api/admin/categories/${id}`),
};
