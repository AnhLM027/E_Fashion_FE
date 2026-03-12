import { useEffect, useState, useMemo } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
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

export default function AdminCouponPage() {
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
      newErrors.code = "Vui lòng nhập mã coupon";
    }

    if (form.discountValue <= 0) {
      newErrors.discountValue = "Giá trị giảm phải lớn hơn 0";
    }

    if (form.discountType === "PERCENTAGE" && form.discountValue > 100) {
      newErrors.discountValue = "Giảm giá phần trăm không được vượt quá 100%";
    }

    if (form.minOrderValue < 0) {
      newErrors.minOrderValue = "Giá trị tối thiểu không hợp lệ";
    }

    if (form.usageLimit < 0) {
      newErrors.usageLimit = "Số lượt sử dụng không hợp lệ";
    }

    if (!form.startDate) {
      newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
    }

    if (!form.endDate) {
      newErrors.endDate = "Vui lòng chọn ngày kết thúc";
    }

    if (
      form.startDate &&
      form.endDate &&
      new Date(form.endDate) <= new Date(form.startDate)
    ) {
      newErrors.endDate = "Ngày kết thúc phải lớn hơn ngày bắt đầu";
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
    if (!confirm("Bạn chắc chắn muốn xóa coupon này?")) return;
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
    <div className="p-8 space-y-8 bg-neutral-50 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Coupon Management
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Quản lý mã giảm giá cho hệ thống
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-2xl hover:opacity-90 transition"
        >
          <Plus size={16} />
          Thêm coupon
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-md">
        <Search
          size={16}
          className="absolute left-4 top-3.5 text-neutral-400"
        />
        <input
          placeholder="Tìm theo mã coupon..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-black"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
        />
      </div>

      {/* LIST */}
      {loading && <p>Đang tải...</p>}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCoupons.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200 hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xl font-semibold">{c.code}</p>

                <span
                  className={`inline-block mt-2 text-xs px-3 py-1 rounded-full ${
                    c.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {c.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <button
                onClick={() => handleDelete(c.id)}
                className="text-neutral-400 hover:text-red-500 transition"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-1 text-sm text-neutral-600">
              <p>
                Giảm:{" "}
                <span className="font-medium text-black">
                  {c.discountType === "PERCENTAGE"
                    ? `${c.discountValue}%`
                    : formatCurrency(c.discountValue)}
                </span>
              </p>

              <p>Min order: {formatCurrency(c.minOrderValue)}</p>

              <p>
                Usage:{" "}
                {c.usageLimit === 0 ? "Hết lượt sử dụng" : `${c.usageLimit} lượt`}
              </p>

              {(() => {
                const { percent, status } = getTimeProgress(
                  c.startDate,
                  c.endDate,
                );

                return (
                  <div className="mt-4 space-y-2">
                    {/* Date text */}
                    <p className="text-xs text-neutral-400">
                      {formatFullDateTime(c.startDate)} <br />→{" "}
                      {formatFullDateTime(c.endDate)}
                    </p>

                    {/* Progress bar */}
                    <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          status === "expired"
                            ? "bg-red-500"
                            : status === "active"
                              ? "bg-black"
                              : "bg-blue-400"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    {/* Status text */}
                    <div className="text-xs font-medium">
                      {status === "upcoming" && (
                        <span className="text-blue-500">Chưa bắt đầu</span>
                      )}
                      {status === "active" && (
                        <span className="text-black">
                          Đang diễn ra • {percent.toFixed(0)}%
                        </span>
                      )}
                      {status === "expired" && (
                        <span className="text-red-500">Đã hết hạn</span>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}

      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-[700px] p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Tạo Coupon Mới</h3>

              <button
                onClick={() => setOpen(false)}
                className="text-neutral-400 hover:text-black"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* CODE */}
              <div>
                <label className="text-sm font-medium">Mã coupon</label>
                <input
                  className="w-full border border-neutral-200 rounded-xl px-3 py-2 mt-1 focus:ring-2 focus:ring-black"
                  value={form.code}
                  onChange={(e) =>
                    setForm({ ...form, code: e.target.value.toUpperCase() })
                  }
                />
                {errors.code && (
                  <p className="text-xs text-red-500 mt-1">{errors.code}</p>
                )}
              </div>

              {/* TYPE */}
              <div>
                <label className="text-sm font-medium">Loại giảm giá</label>
                <select
                  className="w-full border border-neutral-200 rounded-xl px-3 py-2 mt-1 focus:ring-2 focus:ring-black"
                  value={form.discountType}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      discountType: e.target.value as "PERCENTAGE" | "FIXED",
                    })
                  }
                >
                  <option value="PERCENTAGE">Phần trăm (%)</option>
                  <option value="FIXED">Số tiền cố định</option>
                </select>
              </div>

              {/* VALUE */}
              <div>
                <label className="text-sm font-medium">Giá trị giảm</label>

                <input
                  type="text"
                  className={`w-full border rounded-xl px-3 py-2 mt-1 transition
      ${
        errors.discountValue
          ? "border-red-500 focus:ring-red-500"
          : "border-neutral-200 focus:ring-black"
      }
    `}
                  value={formatNumber(form.discountValue, "vi-VN")}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      discountValue: parseFormattedNumber(e.target.value),
                    })
                  }
                />

                {/* HIỂN THỊ PREVIEW */}
                {form.discountValue > 0 && !errors.discountValue && (
                  <p className="text-xs text-neutral-500 mt-1">
                    {form.discountType === "FIXED"
                      ? formatCurrency(form.discountValue)
                      : `${form.discountValue}%`}
                  </p>
                )}

                {/* ERROR */}
                {errors.discountValue && (
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    {errors.discountValue}
                  </p>
                )}
              </div>

              {/* MIN ORDER */}
              <div>
                <label className="text-sm font-medium">Đơn tối thiểu</label>
                <input
                  type="text"
                  className="w-full border border-neutral-200 rounded-xl px-3 py-2 mt-1"
                  value={formatNumber(form.minOrderValue, "vi-VN")}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      minOrderValue: parseFormattedNumber(e.target.value),
                    })
                  }
                />
              </div>

              {/* USAGE */}
              <div>
                <label className="text-sm font-medium">Số lượt sử dụng</label>
                <input
                  type="number"
                  min={0}
                  className={`w-full border rounded-xl px-3 py-2 mt-1 transition
    ${
      errors.usageLimit
        ? "border-red-500 focus:ring-red-500"
        : "border-neutral-200 focus:ring-black"
    }
  `}
                  value={form.usageLimit}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    if (value < 0) return; // 🚀 chặn luôn không cho âm

                    setForm({
                      ...form,
                      usageLimit: value,
                    });
                  }}
                />

                {errors.usageLimit && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.usageLimit}
                  </p>
                )}
              </div>

              {/* ACTIVE */}
              <div className="flex items-center justify-between border border-neutral-200 rounded-xl px-4 py-3 mt-6">
                <span className="text-sm font-medium">Kích hoạt</span>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className={`w-12 h-6 rounded-full relative transition ${
                    form.isActive ? "bg-black" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
                      form.isActive ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* DATE */}
            <div className="grid grid-cols-2 gap-6">
              {/* START DATE */}
              <div>
                <label className="text-sm font-medium">Ngày bắt đầu</label>
                <input
                  type="datetime-local"
                  className={`w-full border rounded-xl px-3 py-2 mt-1 transition
      ${
        errors.startDate
          ? "border-red-500 focus:ring-red-500"
          : "border-neutral-200 focus:ring-black"
      }
    `}
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({ ...form, startDate: e.target.value })
                  }
                />
                {errors.startDate && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.startDate}
                  </p>
                )}
              </div>

              {/* END DATE */}
              <div>
                <label className="text-sm font-medium">Ngày kết thúc</label>
                <input
                  type="datetime-local"
                  min={form.startDate}
                  className={`w-full border rounded-xl px-3 py-2 mt-1 transition
      ${
        errors.endDate
          ? "border-red-500 focus:ring-red-500"
          : "border-neutral-200 focus:ring-black"
      }
    `}
                  value={form.endDate}
                  onChange={(e) =>
                    setForm({ ...form, endDate: e.target.value })
                  }
                />
                {errors.endDate && (
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    {errors.endDate}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => setOpen(false)}
                className="px-5 py-2 rounded-xl border border-neutral-300"
              >
                Hủy
              </button>

              <button
                onClick={handleCreate}
                disabled={!isValid}
                className="px-5 py-2 rounded-xl bg-black text-white disabled:opacity-40"
              >
                Tạo coupon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
