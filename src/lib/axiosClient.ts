import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

import { API_BASE_URL, API_TIMEOUT } from '@/config/api.config';

const instance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// interceptor
instance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    const is401 = error.response.status === 401;
    const isRefreshRequest = originalRequest.url?.includes("/api/auth/refresh");
    const hasLoggedIn = localStorage.getItem("hasLoggedIn");

    // 👉 Guest -> không refresh
    if (!hasLoggedIn) {
      return Promise.reject(error);
    }

    // 👉 Access token hết hạn -> thử refresh
    if (is401 && !originalRequest._retry && !isRefreshRequest) {
      originalRequest._retry = true;

      try {
        console.log("🔄 Calling refresh token...");
        await instance.post("/api/auth/refresh");

        console.log("✅ Refresh success, retry request");
        return instance(originalRequest);
      } catch (refreshError) {
        console.log("❌ Refresh failed -> session expired");
        window.dispatchEvent(new Event("SESSION_EXPIRED"));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// 👇 Custom typed client
const axiosClient = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    instance.get<T, T>(url, config),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    instance.post<T, T>(url, data, config),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    instance.put<T, T>(url, data, config),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    instance.patch<T, T>(url, data, config),

  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    instance.delete<T, T>(url, config),
};

export default axiosClient;
