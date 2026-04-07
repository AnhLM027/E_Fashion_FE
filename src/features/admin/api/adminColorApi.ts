import axiosClient from "@/lib/axiosClient";
import { API_ENDPOINTS } from "@/config/api.config";

export interface ColorRequestDTO {
  name: string;
  code: string;
  isActive: boolean;
}

export const adminColorApi = {
  // GET all active colors
  getAll: () => axiosClient.get(API_ENDPOINTS.STAFF.COLORS),

  // CREATE color
  create: (data: ColorRequestDTO) =>
    axiosClient.post(API_ENDPOINTS.STAFF.COLORS, data),

  // UPDATE color
  update: (id: string, data: ColorRequestDTO) =>
    axiosClient.put(API_ENDPOINTS.STAFF.COLOR_ID(id), data),

  // DELETE color
  delete: (id: string) =>
    axiosClient.delete(API_ENDPOINTS.STAFF.COLOR_ID(id)),
};