import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { couponApi } from "@/features/coupon/api/coupon.api";
import { type CouponResponseDTO } from "@/features/coupon/types/coupon.type";
import { ROUTES } from "@/config/routes";

/* ================= TIME BAR COMPONENT ================= */

interface TimeBarProps {
  startDate: string;
  endDate: string;
}

function CouponTimeBar({ startDate, endDate }: TimeBarProps) {
  const [now, setNow] = useState(Date.now());

  // ✅ update mỗi giây
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  const total = end - start;
  const passed = now - start;
  const percent = Math.min(100, Math.max(0, (passed / total) * 100));

  const remaining = end - now;
  const isExpired = remaining <= 0;
  const isLessThan1Hour = remaining > 0 && remaining <= 60 * 60 * 1000;

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remaining / (1000 * 60)) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);

  return (
    <div className="mt-4 bg-neutral-50 rounded-lg p-3 border border-neutral-200">
      {/* TOP ROW */}
      <div className="flex justify-between items-center mb-2 gap-4">
        <div className="text-xs text-neutral-500 flex-1 truncate">
          {new Date(startDate).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
          {"  →  "}
          {new Date(endDate).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        {!isExpired ? (
          <div
            className={`text-xs font-medium px-2 py-1 rounded 
              ${
                isLessThan1Hour
                  ? "bg-red-100 text-red-600 animate-pulse"
                  : "bg-[#FFF1ED] text-[#EE4D2D]"
              }`}
          >
            {days > 0
              ? `${days}d ${hours}h ${minutes}m ${seconds}s`
              : `${hours}h ${minutes}m ${seconds}s`}
          </div>
        ) : (
          <div className="text-xs font-medium px-2 py-1 rounded bg-neutral-200 text-neutral-600">
            Đã hết hạn
          </div>
        )}
      </div>

      {/* PROGRESS */}
      <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300
            ${
              isExpired
                ? "bg-neutral-400"
                : isLessThan1Hour
                  ? "bg-red-500 animate-pulse"
                  : "bg-[#EE4D2D]"
            }
          `}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

/* ================= PAGE ================= */

export default function MyCouponsPage() {
  const [coupons, setCoupons] = useState<CouponResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const data = await couponApi.getMyCoupons();
        setCoupons(data);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-36 bg-neutral-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-neutral-100 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-8">Mã giảm giá của tôi</h1>

        {coupons.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center text-neutral-500">
            Bạn chưa có mã giảm giá nào.
          </div>
        )}

        <div className="space-y-6">
          {coupons.map((c) => {
            const now = new Date();
            const isExpired = c.endDate && new Date(c.endDate) < now;

            const isOutOfUsage = c.usageLimit === 0;

            const status = c.isUsed
              ? "used"
              : isExpired
                ? "expired"
                : isOutOfUsage
                  ? "out"
                  : "active";

            return (
              <div
                key={c.id}
                className="flex bg-white rounded-lg overflow-hidden border border-neutral-200"
              >
                {/* LEFT BLOCK */}
                <div className="bg-[#EE4D2D] text-white w-44 flex flex-col items-center justify-center p-4 relative">
                  <p className="text-3xl font-bold leading-none">
                    {c.discountType === "PERCENTAGE"
                      ? `${c.discountValue}%`
                      : `${c.discountValue.toLocaleString()}đ`}
                  </p>
                  <p className="text-xs mt-1 uppercase tracking-wider">
                    Discount
                  </p>
                  <div className="absolute right-0 top-0 h-full border-r-2 border-dashed border-white/60" />
                </div>

                {/* RIGHT BLOCK */}
                <div className="flex-1 p-6 flex justify-between">
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold text-base">Code: {c.code}</p>

                    <p>
                      Loại:{" "}
                      {c.discountType === "PERCENTAGE"
                        ? "Phần trăm"
                        : "Giảm cố định"}
                    </p>

                    <p>Đơn tối thiểu: {c.minOrderValue.toLocaleString()}đ</p>

                    {c.startDate && c.endDate && (
                      <CouponTimeBar
                        startDate={c.startDate}
                        endDate={c.endDate}
                      />
                    )}

                    {c.usageLimit !== undefined && (
                      <p>
                        Còn lại:{" "}
                        {c.usageLimit === 0 ? (
                          <span className="text-red-600 font-medium">
                            Hết lượt sử dụng
                          </span>
                        ) : (
                          c.usageLimit
                        )}
                      </p>
                    )}
                  </div>

                  {/* STATUS + ACTION */}
                  <div className="flex flex-col items-end justify-between">
                    {status === "active" && (
                      <span className="text-xs px-3 py-1 bg-[#FFF1ED] text-[#EE4D2D] rounded">
                        Có thể dùng
                      </span>
                    )}
                    {status === "used" && (
                      <span className="text-xs px-3 py-1 bg-neutral-200 text-neutral-600 rounded">
                        Đã dùng
                      </span>
                    )}
                    {status === "expired" && (
                      <span className="text-xs px-3 py-1 bg-neutral-200 text-neutral-600 rounded">
                        Hết hạn
                      </span>
                    )}
                    {status === "out" && (
                      <span className="text-xs px-3 py-1 bg-neutral-200 text-neutral-600 rounded">
                        Hết lượt sử dụng
                      </span>
                    )}

                    <button
                      disabled={status !== "active"}
                      onClick={() =>
                        navigate(`${ROUTES.PRODUCTS}?coupon=${c.code}`)
                      }
                      className="mt-4 px-4 py-2 text-sm rounded bg-[#EE4D2D] text-white disabled:bg-neutral-300"
                    >
                      Dùng ngay
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
