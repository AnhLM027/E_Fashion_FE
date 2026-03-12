import axiosClient from "@/lib/axiosClient";

export interface ColorRequestDTO {
  name: string;
  code: string;
  isActive: boolean;
}

export const adminColorApi = {
  // GET all active colors
  getAll: () => axiosClient.get("/api/admin/colors"),

  // CREATE color
  create: (data: ColorRequestDTO) =>
    axiosClient.post("/api/admin/colors", data),

  // UPDATE color
  update: (id: string, data: ColorRequestDTO) =>
    axiosClient.put(`/api/admin/colors/${id}`, data),

  // DELETE color
  delete: (id: string) =>
    axiosClient.delete(`/api/admin/colors/${id}`),
};