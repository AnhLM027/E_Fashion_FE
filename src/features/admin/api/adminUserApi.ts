import axiosClient from "@/lib/axiosClient";

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  avatarUrl?: string;
  role: "ADMIN" | "CUSTOMER";
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
  role?: "ADMIN" | "CUSTOMER";
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
    return axiosClient.get("/api/admin/users", { params });
  },

  // GET DETAIL
  getDetail: async (id: string): Promise<AdminUser> => {
    return axiosClient.get(`/api/admin/users/${id}`);
  },

  // UPDATE
  update: async (
    id: string,
    data: AdminUserUpdateRequest,
  ): Promise<AdminUser> => {
    return axiosClient.put(`/api/admin/users/${id}`, data);
  },

  // ACTIVATE
  activate: async (id: string): Promise<void> => {
    return axiosClient.put(`/api/admin/users/${id}/activate`);
  },

  // DEACTIVATE
  deactivate: async (id: string): Promise<void> => {
    return axiosClient.put(`/api/admin/users/${id}/deactivate`);
  },
};