import axiosClient from "../../../lib/axiosClient";
import { API_ENDPOINTS } from "../../../config/api.config";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UpdateProfileRequest,
  UpdatePasswordRequest,
  ResetPasswordRequest,
} from "../types/auth.type";

export const authApi = {
  // 📂 DISCOVERY (Public/Auth)
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return axiosClient.post(API_ENDPOINTS.DISCOVERY.AUTH.LOGIN, data);
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return axiosClient.post(API_ENDPOINTS.DISCOVERY.AUTH.REGISTER, data);
  },

  acceptAccount: async (token: string): Promise<void> => {
    return axiosClient.post(API_ENDPOINTS.DISCOVERY.AUTH.ACCEPT_ACCOUNT, null, {
      params: { token },
    });
  },

  logout: async (): Promise<void> => {
    return axiosClient.post(API_ENDPOINTS.DISCOVERY.AUTH.LOGOUT);
  },

  refreshToken: async (): Promise<void> => {
    return axiosClient.post(API_ENDPOINTS.DISCOVERY.AUTH.REFRESH);
  },

  forgotPassword: async (email: string): Promise<void> => {
    return axiosClient.post(API_ENDPOINTS.DISCOVERY.AUTH.FORGOT_PASSWORD, null, {
      params: { email },
    });
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    return axiosClient.post(API_ENDPOINTS.DISCOVERY.AUTH.RESET_PASSWORD, data);
  },

  // 📂 CUSTOMER (Private Profile)
  profile: async (): Promise<LoginResponse["user"]> => {
    return axiosClient.get(API_ENDPOINTS.CUSTOMER.PROFILE);
  },

  updateProfile: async (
    data: UpdateProfileRequest
  ): Promise<LoginResponse["user"]> => {
    return axiosClient.put(API_ENDPOINTS.CUSTOMER.PROFILE, data);
  },

  changePassword: async (
    data: UpdatePasswordRequest
  ): Promise<void> => {
    return axiosClient.put(API_ENDPOINTS.CUSTOMER.CHANGE_PASSWORD, data);
  },
};
