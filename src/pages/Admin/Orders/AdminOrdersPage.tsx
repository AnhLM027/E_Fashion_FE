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
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const res = await adminOrderApi.getAllOrders();
      setOrders(res);
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



    if (paymentStatusFilter) {
      data = data.filter((o) => o.paymentStatus === paymentStatusFilter);
    }

    if (fromDate) {
      const from = new Date(fromDate).getTime();
      data = data.filter((o) => new Date(o.createdAt).getTime() >= from);
    }

    if (toDate) {
      const to = new Date(toDate).getTime();
      data = data.filter((o) => new Date(o.createdAt).getTime() <= to);
    }

    return data;
  }, [orders, search, statusFilter, paymentStatusFilter, fromDate, toDate]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Order Management</h1>
          <p className="text-sm text-zinc-500">Manage customer orders and fulfillment</p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative col-span-1 md:col-span-2 lg:col-span-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order ID, Name..."
            className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-zinc-900 transition-all font-medium"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:bg-white transition-all font-medium cursor-pointer"
        >
          <option value="">All Statuses</option>
          {Object.keys(statusColor).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={paymentStatusFilter}
          onChange={(e) => setPaymentStatusFilter(e.target.value)}
          className="bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:bg-white transition-all font-medium cursor-pointer"
        >
          <option value="">Payment Status</option>
          <option value="PAID">PAID</option>
          <option value="UNPAID">UNPAID</option>
        </select>

        <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1">
           <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date Range</span>
           <div className="flex items-center gap-1">
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="bg-transparent text-[11px] border-none p-0 focus:ring-0" />
              <span className="text-zinc-300">-</span>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="bg-transparent text-[11px] border-none p-0 focus:ring-0" />
           </div>
           {(fromDate || toDate) && <button onClick={() => { setFromDate(""); setToDate(""); }} className="text-zinc-400 hover:text-zinc-900"><X size={14}/></button>}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Payment</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredOrders.map((o) => (
                <tr
                  key={o.orderId}
                  onClick={() => navigate(`/admin/orders/${o.orderId}`)}
                  className="hover:bg-zinc-50 cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-zinc-900 group-hover:text-zinc-600 transition-colors">#{o.orderId.substring(0, 8)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-zinc-900">{o.userFullName}</span>
                      <span className="text-[11px] text-zinc-500 font-medium">{o.userEmail}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-zinc-900 font-mono">{o.finalPrice.toLocaleString()}₫</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${statusColor[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${paymentColor[o.paymentStatus]}`}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-[11px] font-bold text-zinc-400">
                      {new Date(o.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                      })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="py-20 text-center text-zinc-400 italic">No orders found matching your filters</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
