import axiosClient from "@/lib/axiosClient";

export const categoryApi = {
  // Lấy tất cả category
  getAll: () => axiosClient.get("/api/categories"),

  // Lấy theo id
  getById: (id: string) =>
    axiosClient.get(`/api/categories/${id}`),

  // Lấy category cha (root)
  getRoot: () =>
    axiosClient.get("/api/categories/root"),
  
  // Lấy cây category
  getTree: () =>
    axiosClient.get("/api/categories/tree"),

  // Lấy cây category theo id
  getTreeById: (id: string) =>
    axiosClient.get(`/api/categories/tree/${id}`),
};