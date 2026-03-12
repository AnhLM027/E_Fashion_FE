import axiosClient from "../../../lib/axiosClient";
import { API_ENDPOINTS } from "../../../config/api.config";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UpdateProfileRequest,
  UpdatePasswordRequest,
} from "../types/auth.type";

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return axiosClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return axiosClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
  },

  profile: async (): Promise<LoginResponse["user"]> => {
    return axiosClient.get(API_ENDPOINTS.USER.PROFILE);
  },

  updateProfile: async (
    data: UpdateProfileRequest
  ): Promise<LoginResponse["user"]> => {
    return axiosClient.put(API_ENDPOINTS.USER.PROFILE, data);
  },

  changePassword: async (
    data: UpdatePasswordRequest
  ): Promise<void> => {
    return axiosClient.put(
      `${API_ENDPOINTS.USER.PROFILE}/password`,
      data
    );
  },

  logout: async (): Promise<void> => {
    return axiosClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  refreshToken: async (): Promise<void> => {
    return axiosClient.post(API_ENDPOINTS.AUTH.REFRESH);
  },
};
