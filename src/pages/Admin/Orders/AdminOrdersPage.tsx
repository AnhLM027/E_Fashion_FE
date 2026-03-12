import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { adminOrderApi } from "@/features/admin/api/adminOrderApi";

type Order = {
  orderId: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  userFullName: string;
  userEmail: string;
  receiverName: string;
  finalPrice: number;
  createdAt: string;
};

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

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const res = await adminOrderApi.getAllOrders();
      setOrders(res);
      setLoading(false);
    };
    fetch();
  }, []);

  const filteredOrders = useMemo(() => {
    if (!search.trim()) return orders;
    const keyword = search.toLowerCase();

    return orders.filter(
      (o) =>
        o.orderId.toLowerCase().includes(keyword) ||
        o.userFullName.toLowerCase().includes(keyword) ||
        o.userEmail.toLowerCase().includes(keyword),
    );
  }, [orders, search]);

  const handleExport = async () => {
    const params = new URLSearchParams();

    if (fromDate) params.append("from", fromDate);
    if (toDate) params.append("to", toDate);

    const response = await adminOrderApi.exportOrders(params.toString());

    const blob = new Blob([response], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

    // 🔥 TỰ ĐỘNG ĐẶT TÊN FILE
    const today = new Date().toISOString().split("T")[0];

    let fileName = "orders";

    if (fromDate && toDate) {
      fileName = `orders_${fromDate}_to_${toDate}`;
    } else if (fromDate) {
      fileName = `orders_from_${fromDate}`;
    } else if (toDate) {
      fileName = `orders_to_${toDate}`;
    } else {
      fileName = `orders_${today}`;
    }

    link.download = `${fileName}.csv`;

    link.click();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders Management</h1>

        <div className="flex items-center gap-3">
          {/* Date Filter */}
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border px-2 py-1 rounded text-sm"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border px-2 py-1 rounded text-sm"
          />

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
          >
            Export CSV
          </button>

          {/* Search */}
          <div className="relative w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order / customer..."
              className="w-full pl-9 pr-9 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-black"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left">Order</th>
              <th className="px-6 py-3 text-left">Customer</th>
              <th className="px-6 py-3 text-left">Receiver</th>
              <th className="px-6 py-3 text-left">Total</th>
              <th className="px-6 py-3 text-left">Payment</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left"></th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order.orderId}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium">
                  #{order.orderId.slice(0, 8)}
                  <div className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="font-medium">{order.userFullName}</div>
                  <div className="text-xs text-gray-400">{order.userEmail}</div>
                </td>

                <td className="px-6 py-4">{order.receiverName}</td>

                <td className="px-6 py-4 font-semibold">
                  {order.finalPrice?.toLocaleString()}₫
                </td>

                <td className="px-6 py-4">
                  <div className="text-xs">{order.paymentMethod}</div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${paymentColor[order.paymentStatus]}`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[order.status]}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => navigate(`/admin/orders/${order.orderId}`)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    View Detail
                  </button>
                </td>
              </tr>
            ))}

            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400">
                  Không tìm thấy đơn hàng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
