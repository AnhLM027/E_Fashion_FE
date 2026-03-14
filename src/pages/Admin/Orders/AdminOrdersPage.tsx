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

  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");

  const [sortField, setSortField] = useState<"createdAt" | "price">(
    "createdAt",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

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
    let data = [...orders];

    if (search.trim()) {
      const keyword = search.toLowerCase();

      data = data.filter(
        (o) =>
          o.orderId.toLowerCase().includes(keyword) ||
          o.userFullName.toLowerCase().includes(keyword) ||
          o.userEmail.toLowerCase().includes(keyword),
      );
    }

    if (statusFilter) {
      data = data.filter((o) => o.status === statusFilter);
    }

    if (paymentFilter) {
      data = data.filter((o) => o.paymentMethod === paymentFilter);
    }

    if (paymentStatusFilter) {
      data = data.filter((o) => o.paymentStatus === paymentStatusFilter);
    }

    if (minPrice) {
      data = data.filter((o) => o.finalPrice >= Number(minPrice));
    }

    if (maxPrice) {
      data = data.filter((o) => o.finalPrice <= Number(maxPrice));
    }

    if (fromDate) {
      const from = new Date(fromDate).getTime();
      data = data.filter((o) => new Date(o.createdAt).getTime() >= from);
    }

    if (toDate) {
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);

      data = data.filter(
        (o) => new Date(o.createdAt).getTime() <= to.getTime(),
      );
    }

    // SORT
    data.sort((a, b) => {
      let valueA;
      let valueB;

      if (sortField === "price") {
        valueA = a.finalPrice;
        valueB = b.finalPrice;
      } else {
        valueA = new Date(a.createdAt).getTime();
        valueB = new Date(b.createdAt).getTime();
      }

      if (sortOrder === "asc") {
        return valueA - valueB;
      }

      return valueB - valueA;
    });

    return data;
  }, [
    orders,
    search,
    statusFilter,
    paymentFilter,
    paymentStatusFilter,
    minPrice,
    maxPrice,
    fromDate,
    toDate,
    sortField,
    sortOrder,
  ]);

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
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders Management</h1>

        <button
          onClick={handleExport}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
        >
          Export CSV
        </button>
      </div>

      {/* SEARCH */}
      <div className="flex justify-between items-center">
        <div className="relative w-80">
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

      {/* FILTER CARD */}
      <div className="bg-white border rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {/* DATE */}
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm"
          />

          {/* STATUS */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="RETURNED">Returned</option>
          </select>

          {/* PAYMENT METHOD */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm"
          >
            <option value="">Payment</option>
            <option value="COD">COD</option>
            <option value="BANKING">Banking</option>
            <option value="MOMO">MoMo</option>
            <option value="VNPAY">VNPay</option>
          </select>

          {/* PAYMENT STATUS */}
          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm"
          >
            <option value="">Payment Status</option>
            <option value="PAID">Paid</option>
            <option value="UNPAID">Unpaid</option>
          </select>

          {/* SORT FIELD */}
          <select
            value={sortField}
            onChange={(e) =>
              setSortField(e.target.value as "createdAt" | "price")
            }
            className="border px-3 py-2 rounded-lg text-sm"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="price">Sort by Price</option>
          </select>

          {/* SORT ORDER */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="border px-3 py-2 rounded-lg text-sm"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>

          {/* PRICE */}
          <input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm"
          />

          <input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm"
          />
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
