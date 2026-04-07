import axiosClient from "@/lib/axiosClient";
import { API_ENDPOINTS } from "../../../config/api.config";

export type PaymentMethod =
  | "COD"
  | "BANKING"
  | "MOMO"
  | "VNPAY"
  | "CREDIT_CARD";

export interface CreateOrderRequest {
  receiverName: string;
  receiverPhone: string;
  province: string;
  district: string;
  ward: string;
  detailAddress: string;

  shippingFee: number;
  discountAmount?: number;   // optional nếu không có coupon
  paymentMethod: PaymentMethod;

  couponCode?: string;       // nếu có áp dụng mã giảm giá
}

// 📂 CUSTOMER (Mặc định cho người dùng đặt hàng)
export const orderApi = {
    createOrder: (data: CreateOrderRequest) => {
        return axiosClient.post(API_ENDPOINTS.CUSTOMER.ORDERS, data);
    },

    getMyOrders: () => {
        return axiosClient.get(API_ENDPOINTS.CUSTOMER.MY_ORDERS);
    },

    getOrderById: (orderId: string) => {
        // Doc says /api/customer/orders/my is for listing, usually /api/customer/orders/{id} is for detail
        return axiosClient.get(`${API_ENDPOINTS.CUSTOMER.ORDERS}/${orderId}`);
    }
};

// 📂 STAFF (Cho nhân viên quản lý đơn hàng)
export const staffOrderApi = {
  getAll: (params?: any) => {
    return axiosClient.get(API_ENDPOINTS.STAFF.ORDERS, { params });
  },

  export: (params?: any) => {
    return axiosClient.get(API_ENDPOINTS.STAFF.EXPORT_ORDERS, { params, responseType: 'blob' });
  },
};