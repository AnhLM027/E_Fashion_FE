import axiosClient from "@/lib/axiosClient";

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

export const orderApi = {
    createOrder: (data: CreateOrderRequest) => {
        console.log("Order: ", data.couponCode)
        return axiosClient.post("/api/orders", data);
    },

    getMyOrders: () => {
        return axiosClient.get("/api/orders/my");
    },

    getOrderById: (orderId: string) => {
        return axiosClient.get(`/api/orders/${orderId}`);
    }
};