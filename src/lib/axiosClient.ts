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

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

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
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return instance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(function (resolve, reject) {
        console.log("🔄 Calling refresh token...");
        instance
          .post("/api/auth/refresh")
          .then(() => {
            console.log("✅ Refresh success, retrying pending requests...");
            processQueue(null);
            resolve(instance(originalRequest));
          })
          .catch((refreshError) => {
            console.log("❌ Refresh failed -> session expired");
            processQueue(refreshError, null);
            window.dispatchEvent(new Event("SESSION_EXPIRED"));
            reject(refreshError);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
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
