import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminOrderApi } from "@/features/admin/api/adminOrderApi";

/* ================= CONSTANT ================= */

const statusColor: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  RETURNED: "bg-gray-200 text-gray-700",
};

const paymentColor: Record<string, string> = {
  PAID: "bg-green-100 text-green-700",
  UNPAID: "bg-red-100 text-red-600",
};

const STATUS_OPTIONS = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
];

/* ================= COMPONENT ================= */

const AdminOrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const detail = await adminOrderApi.getOrderDetail(orderId!);
      const his = await adminOrderApi.getStatusHistory(orderId!);

      setOrder(detail);
      setHistory(his);
      setNewStatus(detail.status);
      setLoading(false);
    };
    fetch();
  }, [orderId]);

  const handleUpdateStatus = async () => {
    if (!order) return;

    try {
      setUpdating(true);
      await adminOrderApi.updateOrderStatus(order.orderId, {
        newStatus,
        note: "",
      });

      const updated = await adminOrderApi.getOrderDetail(orderId!);
      const his = await adminOrderApi.getStatusHistory(orderId!);

      setOrder(updated);
      setHistory(his);
    } finally {
      setUpdating(false);
    }
  };

  const latestStatusUpdate =
    history.length > 0
      ? history[history.length - 1] // nếu BE sort mới nhất trước
      : null;

  if (loading || !order) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">
            Order #{order.orderId.slice(0, 8)}
          </h1>

          <div className="text-sm text-gray-500 mt-1 space-y-1">
            <div>Created: {new Date(order.createdAt).toLocaleString()}</div>
            {latestStatusUpdate && (
              <div>
                Status updated:{" "}
                {new Date(latestStatusUpdate.createdAt).toLocaleString()}
              </div>
            )}
            <div>Payment Method: {order.paymentMethod}</div>
            {order.trackingNumber && (
              <div className="text-blue-600">
                Tracking: {order.trackingNumber}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition text-sm"
        >
          ← Back
        </button>
      </div>

      {/* STATUS ROW */}
      <div className="flex gap-3">
        <span
          className={`px-4 py-1 rounded-full text-sm font-medium ${statusColor[order.status]}`}
        >
          {order.status}
        </span>

        <span
          className={`px-4 py-1 rounded-full text-sm font-medium ${paymentColor[order.paymentStatus]}`}
        >
          {order.paymentStatus}
        </span>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          {/* CUSTOMER */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-semibold mb-4">Customer</h2>

            <div className="flex items-center gap-4">
              <img
                src={
                  order.userAvatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    order.userFullName,
                  )}`
                }
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <div className="font-medium">{order.userFullName}</div>
                <div className="text-sm text-gray-500">{order.userEmail}</div>
                <div className="text-sm text-gray-500">{order.userPhone}</div>
              </div>
            </div>
          </div>

          {/* SHIPPING */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-semibold mb-4">Shipping Address</h2>
            <div className="text-sm">
              <div className="font-medium">
                {order.receiverName} - {order.receiverPhone}
              </div>
              <div className="text-gray-500 mt-1">
                {order.detailAddress}, {order.ward}, {order.district},{" "}
                {order.province}
              </div>
            </div>
          </div>

          {/* ITEMS */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-semibold mb-4">Items</h2>

            <div className="space-y-5">
              {order.items.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-4 border-b pb-4 last:border-none"
                >
                  <img
                    src={item.imageUrl}
                    className="w-16 h-16 rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <div className="font-medium">{item.productName}</div>
                    <div className="text-sm text-gray-500">
                      {item.colorName} / {item.sizeName}
                    </div>
                    <div className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {item.price.toLocaleString()}₫
                    </div>
                    <div className="font-semibold">
                      {item.subtotal.toLocaleString()}₫
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-sm text-gray-500">
              Total items:{" "}
              {order.items.reduce(
                (sum: number, item: any) => sum + item.quantity,
                0,
              )}
            </div>

            {/* TOTAL */}
            <div className="mt-6 border-t pt-4 text-right space-y-2 text-sm">
              <div>Subtotal: {order.totalPrice.toLocaleString()}₫</div>

              {order.discountAmount > 0 && (
                <div className="text-green-600">
                  Discount
                  {order.couponCode && ` (${order.couponCode})`}: -
                  {order.discountAmount.toLocaleString()}₫
                </div>
              )}

              <div>Shipping: {order.shippingFee.toLocaleString()}₫</div>

              <div className="text-xl font-semibold pt-2">
                Final: {order.finalPrice.toLocaleString()}₫
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* UPDATE STATUS */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-semibold mb-4">Update Status</h2>

            <div className="space-y-3">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              <button
                onClick={handleUpdateStatus}
                disabled={updating}
                className="w-full bg-black text-white py-2 rounded-lg text-sm hover:opacity-90 disabled:opacity-50"
              >
                {updating ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>

          {/* HISTORY */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-semibold mb-4">Status History</h2>

            <div className="space-y-4">
              {history.map((h: any, i: number) => (
                <div key={i} className="relative pl-6">
                  <div className="absolute left-0 top-1.5 w-2 h-2 bg-black rounded-full" />
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span
                      className={`px-2 py-0.5 rounded ${statusColor[h.previousStatus]}`}
                    >
                      {h.previousStatus}
                    </span>

                    <span className="text-gray-400">→</span>

                    <span
                      className={`px-2 py-0.5 rounded ${statusColor[h.newStatus]}`}
                    >
                      {h.newStatus}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(h.createdAt).toLocaleString()}
                  </div>
                  {h.note && (
                    <div className="text-xs text-gray-400">{h.note}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;
