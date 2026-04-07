import axiosClient from "@/lib/axiosClient";
import { API_ENDPOINTS } from "@/config/api.config";
import type { 
  CustomerAddress, 
  CreateAddressRequest, 
  UpdateAddressRequest 
} from "../types/address.types";

export const addressApi = {
  // 📂 CUSTOMER (Yêu cầu đăng nhập)
  
  // Lấy danh sách địa chỉ
  getAddresses: async (): Promise<CustomerAddress[]> => {
    return axiosClient.get(API_ENDPOINTS.CUSTOMER.ADDRESSES);
  },

  // Tạo địa chỉ mới
  createAddress: async (data: CreateAddressRequest): Promise<CustomerAddress> => {
    return axiosClient.post(API_ENDPOINTS.CUSTOMER.ADDRESSES, data);
  },

  // Cập nhật địa chỉ
  patchAddress: async (id: string, data: UpdateAddressRequest): Promise<CustomerAddress> => {
    return axiosClient.patch(API_ENDPOINTS.CUSTOMER.ADDRESS_ID(id), data);
  },

  // Xóa địa chỉ
  deleteAddress: async (id: string): Promise<void> => {
    return axiosClient.delete(API_ENDPOINTS.CUSTOMER.ADDRESS_ID(id));
  },
};
