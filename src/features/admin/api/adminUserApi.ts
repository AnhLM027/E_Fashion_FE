import axiosClient from "@/lib/axiosClient";
import { API_ENDPOINTS } from "@/config/api.config";

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  avatarUrl?: string;
  role: "ADMIN" | "STAFF" | "CUSTOMER";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserPageResponse {
  content: AdminUser[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export interface AdminUserUpdateRequest {
  fullName?: string;
  phone?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  role?: "ADMIN" | "STAFF" | "CUSTOMER";
  isActive?: boolean;
}

export const adminUserApi = {
  // GET LIST (paging + filter)
  getUsers: async (params: {
    search?: string;
    role?: string;
    active?: boolean;
    page?: number;
    size?: number;
  }): Promise<AdminUserPageResponse> => {
    return axiosClient.get(API_ENDPOINTS.ADMIN.USERS, { params });
  },

  // GET DETAIL
  getDetail: async (id: string): Promise<AdminUser> => {
    return axiosClient.get(API_ENDPOINTS.ADMIN.USER_ID(id));
  },

  // UPDATE
  update: async (
    id: string,
    data: AdminUserUpdateRequest,
  ): Promise<AdminUser> => {
    return axiosClient.put(API_ENDPOINTS.ADMIN.USER_ID(id), data);
  },

  // ACTIVATE
  activate: async (id: string): Promise<void> => {
    return axiosClient.put(API_ENDPOINTS.ADMIN.ACTIVATE_USER(id));
  },

  // DEACTIVATE
  deactivate: async (id: string): Promise<void> => {
    return axiosClient.put(API_ENDPOINTS.ADMIN.DEACTIVATE_USER(id));
  },
};