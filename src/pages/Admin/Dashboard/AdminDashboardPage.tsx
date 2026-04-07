import { useEffect, useState, useMemo } from "react";
import {
  ShoppingCart,
  Users,
  DollarSign,
  Clock,
  Download,
  ChevronDown,
} from "lucide-react";
import { adminDashboardApi } from "@/features/admin/api/adminDashboardApi";

import type { DashboardResponseDTO } from "@/features/admin/types/dashboard.type";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { downloadCSV } from "@/helper/reusable";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusColor: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const AdminDashboardPage = () => {
  const [data, setData] = useState<DashboardResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [openExport, setOpenExport] = useState(false);

  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await adminDashboardApi.getDashboard({
        from: from || undefined,
        to: to || undefined,
      });
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [from, to]);

  const chartData = useMemo(() => {
    if (!data) return [];
    return data.revenueByDay.map((d) => ({
      date: d.date,
      revenue: d.revenue,
    }));
  }, [data]);

  const sortedLowStock = useMemo(() => {
    if (!data) return [];
    return [...data.lowStockItems].sort((a, b) => a.stock - b.stock);
  }, [data]);

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  const revenueGrowth = useMemo(() => {
    if (!data || data.revenueByDay.length === 0) return 0;

    const days = data.revenueByDay.length;
    const half = Math.floor(days / 2);

    const currentPeriod = data.revenueByDay
      .slice(half)
      .reduce((sum, d) => sum + Number(d.revenue), 0);

    const previousPeriod = data.revenueByDay
      .slice(0, half)
      .reduce((sum, d) => sum + Number(d.revenue), 0);

    return calculateGrowth(currentPeriod, previousPeriod);
  }, [data]);

  if (loading)
    return <div className="p-10 text-center">Loading dashboard...</div>;

  if (!data) return <div className="p-10 text-center text-red-500">Error</div>;

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        {/* HEADER */}
        <div className="flex justify-between items-center flex-wrap gap-4 border-b border-zinc-200 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
            <p className="text-sm text-zinc-500">Key performance metrics and overview</p>
          </div>

          {/* FILTER + EXPORT */}
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm bg-white"
            />
            <span className="text-gray-400">—</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm bg-white"
            />

            <button
              onClick={() => {
                setFrom("");
                setTo("");
              }}
              className="text-xs font-semibold px-3 py-2 border rounded-lg hover:bg-white transition"
            >
              Reset
            </button>

            <div className="relative">
              <button
                onClick={() => setOpenExport(!openExport)}
                className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-zinc-800 transition"
              >
                <Download size={14} />
                Export Data
                <ChevronDown size={14} />
              </button>

              {openExport && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-2xl shadow-lg z-50 overflow-hidden text-sm">
                  {[
                    {
                      label: "Export Revenue",
                      action: adminDashboardApi.exportRevenue,
                      file: "revenue",
                    },
                    {
                      label: "Export Recent Orders",
                      action: adminDashboardApi.exportRecentOrders,
                      file: "recent_orders",
                    },
                    {
                      label: "Export Top Products",
                      action: adminDashboardApi.exportTopProducts,
                      file: "top_products",
                    },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={async () => {
                        const res = await item.action({
                          from: from || undefined,
                          to: to || undefined,
                        });
                        downloadCSV(res, item.file);
                        setOpenExport(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50"
                    >
                      {item.label}
                    </button>
                  ))}

                  <div className="border-t" />

                  <button
                    onClick={async () => {
                      const res = await adminDashboardApi.exportLowStock();
                      downloadCSV(res, "low_stock");
                      setOpenExport(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50"
                  >
                    Export Low Stock
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total Orders"
            value={data.totalOrders.toString()}
            icon={<ShoppingCart size={20} />}
          />
          <StatCard
            title="Pending Orders"
            value={data.pendingOrders.toString()}
            icon={<Clock size={20} />}
          />
          <StatCard
            title="Users"
            value={data.totalUsers.toString()}
            icon={<Users size={20} />}
          />
          <StatCard
            title="Revenue"
            value={formatCurrency(data.totalRevenue)}
            icon={<DollarSign size={20} />}
            growth={revenueGrowth}
          />
        </div>

        {/* REVENUE CHART */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
          <div className="mb-6">
              <h3 className="text-lg font-bold">Revenue Analytics</h3>
              <p className="text-sm text-zinc-500">
                Trends for the selected period
              </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [
                    typeof value === "number" ? formatCurrency(value) : value,
                    "Revenue",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

        {/* TOP PRODUCTS + RECENT ORDERS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Top Products */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
            <h3 className="text-md font-bold mb-6">Top Selling Products</h3>

            {data.topProducts.map((p) => (
              <div
                key={p.productId}
                className="mb-4 p-3 rounded-lg hover:bg-zinc-50 transition"
              >
                <div className="flex justify-between text-sm">
                  <span>{p.productName}</span>
                  <span className="font-medium">{p.totalSold} sold</span>
                </div>

                <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(p.totalSold * 10, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
            <h3 className="text-md font-bold mb-6">Recent Activity</h3>

            {data.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex justify-between items-center py-3 px-3 rounded-lg hover:bg-zinc-50 transition"
              >
                <div>
                  <div className="font-medium">#{order.id.slice(0, 8)}</div>
                  <div className="text-gray-500 text-sm">
                    {order.receiverName}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {formatDateTime(order.createdAt)}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-medium">
                    {formatCurrency(order.finalPrice)}
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] rounded font-bold uppercase tracking-wider ${
                      statusColor[order.status] || "bg-zinc-200"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LOW STOCK */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200">
          <h3 className="text-md font-bold mb-6 text-rose-600">Stock Alerts</h3>

          {sortedLowStock.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-3 px-3 rounded-lg hover:bg-rose-50 transition"
            >
              <div className="text-gray-700">
                {item.productName} - {item.colorName} - {item.sizeName}
              </div>

              <div className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-[10px] font-bold uppercase tracking-wider">
                {item.stock} LEFT
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

const StatCard = ({
  title,
  value,
  icon,
  growth,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  growth?: number;
}) => (
  <div className="bg-white rounded-xl p-5 shadow-sm border border-zinc-200 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-3">
          {title}
        </p>

        <h2 className="text-2xl font-bold text-zinc-900 leading-none">
          {value}
        </h2>

        {growth !== undefined && (
          <div
            className={`inline-flex items-center gap-1 mt-4 px-2 py-0.5 rounded text-[10px] font-bold ${
              growth >= 0
                ? "bg-green-50 text-green-700"
                : "bg-rose-50 text-rose-600"
            }`}
          >
            {growth >= 0 ? "▲" : "▼"}
            {Math.abs(growth).toFixed(1)}%
          </div>
        )}
      </div>

      <div className="p-2.5 rounded-lg bg-zinc-50 text-zinc-500 border border-zinc-100">
        {icon}
      </div>
    </div>
  </div>
);
