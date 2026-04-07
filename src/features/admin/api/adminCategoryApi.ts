import axiosClient from "@/lib/axiosClient";
import { API_ENDPOINTS } from "@/config/api.config";

export const adminCategoryApi = {
  create: (data: any) =>
    axiosClient.post(API_ENDPOINTS.ADMIN.CATEGORIES, data),

  update: (id: string, data: any) =>
    axiosClient.put(API_ENDPOINTS.ADMIN.CATEGORY_ID(id), data),

  getAll: () =>
    axiosClient.get(API_ENDPOINTS.STAFF.CATEGORIES),

  getRoot: () =>
    axiosClient.get(`${API_ENDPOINTS.STAFF.CATEGORIES}/root`),

  getTree: () =>
    axiosClient.get(API_ENDPOINTS.STAFF.CATEGORIES_TREE),

  delete: (id: string) =>
    axiosClient.delete(API_ENDPOINTS.ADMIN.CATEGORY_ID(id)),
};
