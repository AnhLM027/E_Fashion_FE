import axiosClient from "@/lib/axiosClient";
import { API_ENDPOINTS } from "@/config/api.config";

export interface ChangeOrderStatusHistory {
  newStatus: string;
  note: string;
}

export const adminOrderApi = {
  getAllOrders: () => axiosClient.get(API_ENDPOINTS.STAFF.ORDERS),

  getStatusHistory: (orderId: string) =>
    axiosClient.get(API_ENDPOINTS.STAFF.ORDER_HISTORY(orderId)),

  getOrderDetail: (id: string) =>
    axiosClient.get(API_ENDPOINTS.STAFF.ORDER_ID(id)).then(res => res),

  updateOrderStatus: (orderId: string, changeStatus: ChangeOrderStatusHistory) =>
    axiosClient.put(API_ENDPOINTS.STAFF.ORDER_STATUS(orderId), changeStatus),

  exportOrders: async (query: string) => {
    return axiosClient.get(
      `${API_ENDPOINTS.STAFF.EXPORT_ORDERS}?${query}`,
      { responseType: "blob" }
    );
  },
};