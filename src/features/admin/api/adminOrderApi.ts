import axiosClient from "@/lib/axiosClient";

export interface ChangeOrderStatusHistory {
  newStatus: string;
  note: string;
}

export const adminOrderApi = {
  getAllOrders: () => axiosClient.get("/api/admin/orders"),

  getStatusHistory: (orderId: string) =>
    axiosClient.get(`/api/admin/orders/${orderId}/status-history`),

  getOrderDetail: (id: string) =>
    axiosClient.get(`/api/admin/orders/${id}`).then(res => res),

  updateOrderStatus: (orderId: string, changeStatus: ChangeOrderStatusHistory) =>
    axiosClient.put(`/api/admin/orders/${orderId}/status`, changeStatus),

  exportOrders: async (query: string) => {
    return axiosClient.get(
      `/api/admin/orders/export?${query}`,
      { responseType: "blob" }
    );
  },
};