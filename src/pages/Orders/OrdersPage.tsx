import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useOrders } from "@/features/orders/hooks/useOrders";
import { formatFullDateTime } from "@/utils/format";
import { Package, Truck, CheckCircle, XCircle, RotateCcw } from "lucide-react";

const formatCurrency = (value?: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value || 0);

/* ================= STATUS CONFIG ================= */

const statusConfig: Record<
  string,
  {
    label: string;
    icon: any;
    color: string;
    step: number;
  }
> = {
  PENDING: {
    label: "Chờ xử lý",
    icon: Package,
    color: "bg-yellow-100 text-yellow-700",
    step: 1,
  },
  PROCESSING: {
    label: "Đang xử lý",
    icon: Package,
    color: "bg-blue-100 text-blue-700",
    step: 2,
  },
  SHIPPED: {
    label: "Đang giao",
    icon: Truck,
    color: "bg-purple-100 text-purple-700",
    step: 3,
  },
  DELIVERED: {
    label: "Đã giao",
    icon: CheckCircle,
    color: "bg-green-100 text-green-700",
    step: 4,
  },
  CANCELLED: {
    label: "Đã hủy",
    icon: XCircle,
    color: "bg-red-100 text-red-700",
    step: 0,
  },
  RETURNED: {
    label: "Đã trả hàng",
    icon: RotateCcw,
    color: "bg-gray-200 text-gray-700",
    step: 0,
  },
};

const statusTabs = [
  "ALL",
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
];

export default function OrdersPage() {
  const { orders, loading } = useOrders();
  const [activeTab, setActiveTab] = useState("ALL");

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    if (activeTab === "ALL") return orders;
    return orders.filter((o: any) => o.status === activeTab);
  }, [orders, activeTab]);

  const countByStatus = useMemo(() => {
    const map: Record<string, number> = {};

    orders?.forEach((o: any) => {
      map[o.status] = (map[o.status] || 0) + 1;
    });

    return map;
  }, [orders]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-400 text-sm">
        Đang tải đơn hàng...
      </div>
    );

  if (!orders || orders.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <div className="text-xl font-medium">Chưa có đơn hàng nào</div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-semibold tracking-tight">
          Đơn hàng của tôi
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Theo dõi và quản lý đơn hàng của bạn
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b mb-10 overflow-x-auto">
        {statusTabs.map((status) => {
          const count =
            status === "ALL" ? orders?.length || 0 : countByStatus[status] || 0;

          return (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`relative pb-3 text-sm font-medium transition flex items-center gap-2 ${
                activeTab === status
                  ? "text-black"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {status === "ALL" ? "Tất cả" : statusConfig[status]?.label}

              {/* Badge */}
              {count > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === status
                      ? "bg-black text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {count}
                </span>
              )}

              {activeTab === status && (
                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-black rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Orders */}
      <div className="space-y-8">
        {filteredOrders.map((order: any) => {
          const config = statusConfig[order.status];
          const StatusIcon = config?.icon;

          // 👉 Tổng số lượng thật sự
          const totalQuantity =
            order.items?.reduce(
              (sum: number, item: any) => sum + item.quantity,
              0,
            ) ?? 0;

          return (
            <div
              key={order.orderId}
              className="group bg-white border border-gray-100 rounded-3xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                {/* Left */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-semibold">
                      #{order.orderId.slice(0, 8)}
                    </div>

                    {config && (
                      <span
                        className={`flex items-center gap-2 text-xs px-3 py-1 rounded-full font-medium ${config.color}`}
                      >
                        <StatusIcon size={14} />
                        {config.label}
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-gray-500">
                    {formatFullDateTime(order.createdAt)}
                  </div>

                  <div className="text-sm text-gray-400">
                    {totalQuantity} sản phẩm
                  </div>

                  {/* MINI TIMELINE */}
                  {config?.step > 0 && (
                    <div className="mt-3 flex items-center gap-2">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-1 flex-1 rounded-full ${
                            step <= config.step ? "bg-black" : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Right */}
                <div className="flex flex-col items-start md:items-end gap-4">
                  <div className="text-2xl font-bold tracking-tight">
                    {formatCurrency(order.finalPrice)}
                  </div>

                  <Link
                    to={`/orders/${order.orderId}`}
                    className="text-sm font-medium relative inline-block"
                  >
                    <span className="relative z-10">Xem chi tiết →</span>
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
