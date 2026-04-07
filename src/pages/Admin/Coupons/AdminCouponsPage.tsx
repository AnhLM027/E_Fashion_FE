import { useEffect, useState, useMemo } from "react";
import { Plus, Search, Trash2, X } from "lucide-react";
import { couponApi } from "@/features/coupon/api/coupon.api";
import type {
  CouponResponseDTO,
  CouponRequestDTO,
} from "@/features/coupon/types/coupon.type";

import {
  formatCurrency,
  formatNumber,
  parseFormattedNumber,
  formatFullDateTime,
} from "@/utils/format";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function AdminCouponPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [coupons, setCoupons] = useState<CouponResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);

  const [searchCode, setSearchCode] = useState("");
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState<CouponRequestDTO>({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: 0,
    minOrderValue: 0,
    usageLimit: 0,
    startDate: "",
    endDate: "",
    isActive: true,
  });

  /* ================= FETCH ================= */

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await couponApi.getAll();
      setCoupons(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= VALIDATION ================= */

  useEffect(() => {
    const newErrors: Record<string, string> = {};

    if (!form.code.trim()) {
      newErrors.code = "Please enter coupon code";
    }

    if (form.discountValue <= 0) {
      newErrors.discountValue = "Discount value must be greater than 0";
    }

    if (form.discountType === "PERCENTAGE" && form.discountValue > 100) {
      newErrors.discountValue = "Percentage discount cannot exceed 100%";
    }

    if (form.minOrderValue < 0) {
      newErrors.minOrderValue = "Invalid minimum order value";
    }

    if (form.usageLimit < 0) {
      newErrors.usageLimit = "Invalid usage limit";
    }

    if (!form.startDate) {
      newErrors.startDate = "Please select start date";
    }

    if (!form.endDate) {
      newErrors.endDate = "Please select end date";
    }

    if (
      form.startDate &&
      form.endDate &&
      new Date(form.endDate) <= new Date(form.startDate)
    ) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [form]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCoupons((prev) => [...prev]);
    }, 1000); // update mỗi 1 giây

    return () => clearInterval(interval);
  }, []);

  /* ================= ACTIONS ================= */

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    await couponApi.delete(id);
    fetchData();
  };

  const handleCreate = async () => {
    if (!isValid) return;

    await couponApi.create({
      ...form,
      startDate: form.startDate,
      endDate: form.endDate,
    });

    setOpen(false);
    setForm({
      code: "",
      discountType: "PERCENTAGE",
      discountValue: 0,
      minOrderValue: 0,
      usageLimit: 0,
      startDate: "",
      endDate: "",
      isActive: true,
    });

    fetchData();
  };

  /* ================= FILTER ================= */

  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) =>
      c.code.toLowerCase().includes(searchCode.toLowerCase()),
    );
  }, [coupons, searchCode]);

  const getTimeProgress = (start: string, end: string) => {
    const now = new Date().getTime();
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();

    if (now < startTime) {
      return { percent: 0, status: "upcoming" };
    }

    if (now > endTime) {
      return { percent: 100, status: "expired" };
    }

    const percent = ((now - startTime) / (endTime - startTime)) * 100;

    return { percent: Math.min(Math.max(percent, 0), 100), status: "active" };
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Coupons</h1>
          <p className="text-sm text-zinc-500">Manage promotional discount codes</p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-zinc-800 transition"
          >
            <Plus size={14} />
            Create New Coupon
          </button>
        )}
      </div>

      {/* SEARCH */}
      <div className="relative max-w-md">
        <Search
          size={14}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <input
          placeholder="Search by coupon code..."
          className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
        />
      </div>

      {/* LIST */}
      {loading && <p className="text-zinc-500 text-sm italic">Synchronizing coupons...</p>}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCoupons.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-xl p-5 shadow-sm border border-zinc-200 hover:shadow-md transition-shadow group"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-lg font-bold text-zinc-900 tracking-tight">{c.code}</p>

                <div
                  className={`inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    c.isActive
                      ? "bg-green-50 text-green-700"
                      : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  <div className={`w-1 h-1 rounded-full ${c.isActive ? "bg-green-500" : "bg-zinc-400"}`} />
                  {c.isActive ? "Active" : "Inactive"}
                </div>
              </div>

              {isAdmin && (
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-2 text-zinc-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex justify-between text-[13px]">
                <span className="text-zinc-500">Discount Value</span>
                <span className="font-bold text-zinc-900">
                  {c.discountType === "PERCENTAGE"
                    ? `${c.discountValue}%`
                    : formatCurrency(c.discountValue)}
                </span>
              </div>

              <div className="flex justify-between text-[13px]">
                <span className="text-zinc-500">Min Order Requirement</span>
                <span className="font-bold text-zinc-900">{formatCurrency(c.minOrderValue)}</span>
              </div>

              <div className="flex justify-between text-[13px]">
                <span className="text-zinc-500">Availability</span>
                <span className={`font-bold ${c.usageLimit === 0 ? "text-rose-600" : "text-zinc-900"}`}>
                  {c.usageLimit === 0 ? "Limit Reached" : `${c.usageLimit} Units Left`}
                </span>
              </div>

              {(() => {
                const { percent, status } = getTimeProgress(
                  c.startDate,
                  c.endDate,
                );

                return (
                  <div className="mt-5 space-y-2 pt-4 border-t border-zinc-100">
                    <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
                      <span>Timeline</span>
                    </div>

                    <div className="text-[11px] text-zinc-500">
                      {formatFullDateTime(c.startDate)} - {formatFullDateTime(c.endDate)}
                    </div>

                    <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
                      <div
                        className={`h-full transition-all duration-700 ${
                          status === "expired"
                            ? "bg-rose-500"
                            : status === "active"
                              ? "bg-zinc-900"
                              : "bg-blue-500"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="text-[10px] font-bold uppercase tracking-widest pt-1">
                      {status === "upcoming" && (
                        <span className="text-blue-600">Upcoming Campaign</span>
                      )}
                      {status === "active" && (
                        <span className="text-zinc-900">
                          Active Campaign • {percent.toFixed(0)}% Complete
                        </span>
                      )}
                      {status === "expired" && (
                        <span className="text-rose-600">Campaign Expired</span>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        ))}

        {filteredCoupons.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-400 italic bg-white rounded-xl border border-dashed border-zinc-200">
            No active coupons found matching your search criteria
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}

      {open && (
        <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/50">
              <h3 className="text-lg font-bold text-zinc-900">Create New Coupon</h3>

              <button
                onClick={() => setOpen(false)}
                className="p-1.5 hover:bg-zinc-200 rounded-lg transition-colors text-zinc-400 hover:text-zinc-900"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Coupon code</label>
                  <input
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all uppercase font-bold tracking-widest"
                    value={form.code}
                    onChange={(e) =>
                      setForm({ ...form, code: e.target.value.toUpperCase() })
                    }
                  />
                  {errors.code && (
                    <p className="text-[10px] text-rose-500 mt-1 font-bold">{errors.code}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Discount type</label>
                  <select
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all cursor-pointer"
                    value={form.discountType}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        discountType: e.target.value as "PERCENTAGE" | "FIXED",
                      })
                    }
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₫)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Discount value</label>
                  <input
                    type="text"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all"
                    value={formatNumber(form.discountValue, "vi-VN")}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        discountValue: parseFormattedNumber(e.target.value),
                      })
                    }
                  />
                  {errors.discountValue && (
                    <p className="text-[10px] text-rose-500 mt-1 font-bold">{errors.discountValue}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Min order value</label>
                  <input
                    type="text"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all"
                    value={formatNumber(form.minOrderValue, "vi-VN")}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        minOrderValue: parseFormattedNumber(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Usage limit</label>
                  <input
                    type="number"
                    min={0}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all"
                    value={form.usageLimit}
                    onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })}
                  />
                </div>

                <div className="flex items-center justify-between border border-zinc-200 rounded-lg px-4 py-2 mt-auto">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Status Active</span>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, isActive: !form.isActive })}
                      className={`w-10 h-5 rounded-full relative transition-colors ${
                        form.isActive ? "bg-green-500" : "bg-zinc-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${
                          form.isActive ? "translate-x-5" : ""
                        }`}
                      />
                    </button>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Start date</label>
                  <input
                    type="datetime-local"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  />
                  {errors.startDate && (
                    <p className="text-[10px] text-rose-500 mt-1 font-bold">{errors.startDate}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">End date</label>
                  <input
                    type="datetime-local"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  />
                  {errors.endDate && (
                    <p className="text-[10px] text-rose-500 mt-1 font-bold">{errors.endDate}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-zinc-200 flex justify-end gap-3 bg-zinc-50/50">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-zinc-600 hover:bg-zinc-200 transition-colors uppercase tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!isValid}
                className="px-6 py-2 rounded-lg bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 disabled:opacity-40 transition-all uppercase tracking-widest"
              >
                Create Coupon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
