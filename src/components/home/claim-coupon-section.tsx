import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { couponApi } from "@/features/coupon/api/coupon.api";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";

interface Coupon {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderValue: number;
  endDate?: string;
  isActive: boolean;
  usageLimit?: number;
}

export const ClaimCouponSection: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = !!user;
  const navigate = useNavigate();

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [myCoupons, setMyCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCode, setLoadingCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const allCoupons = await couponApi.getAll();
        setCoupons(allCoupons);

        // ✅ Chỉ gọi khi đã login
        if (isAuthenticated) {
          const mine = await couponApi.getMyCoupons();
          setMyCoupons(mine);
        } else {
          setMyCoupons([]); // guest không có coupon cá nhân
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  // ✅ Filter active + chưa hết hạn
  const validCoupons = useMemo(() => {
    const now = new Date();

    return coupons.filter((c) => {
      if (!c.isActive) return false;
      if (!c.endDate) return true;
      return new Date(c.endDate) > now;
    });
  }, [coupons]);

  const isClaimed = (code: string) => myCoupons.some((c) => c.code === code);

  const isExpiringSoon = (endDate?: string) => {
    if (!endDate) return false;

    const now = Date.now();
    const end = new Date(endDate).getTime();

    const diffMs = end - now;

    return diffMs > 0 && diffMs <= 60 * 60 * 1000;
  };

  const handleClaim = async (code: string) => {
    // 🚨 Nếu chưa đăng nhập → chuyển sang login
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để nhận mã");
      navigate("/login");
      return;
    }

    try {
      setLoadingCode(code);

      await couponApi.claim(code);

      const updated = await couponApi.getMyCoupons();
      setMyCoupons(updated);

      await navigator.clipboard.writeText(code);
      toast.success("Đã nhận mã 🎉");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Không thể nhận mã");
    } finally {
      setLoadingCode(null);
    }
  };

  if (loading) {
    return (
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-48 bg-neutral-800 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!validCoupons.length) return null;

  return (
    <section className="border-y border-neutral-200 bg-white py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Ưu đãi dành cho bạn
        </h2>

        <div className="relative">
          <div
            className="
      flex gap-6 overflow-x-auto pb-4
      scroll-smooth snap-x snap-mandatory
      scrollbar-hide
    "
          >
            {validCoupons.map((coupon) => {
              const claimed = isClaimed(coupon.code);
              const expiringSoon = isExpiringSoon(coupon.endDate);

              return (
                <div
                  key={coupon.id}
                  className="
            min-w-[280px] md:min-w-[320px]
            snap-start
            relative bg-black text-white rounded-2xl p-6
            flex-shrink-0
          "
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                  {expiringSoon && (
                    <div className="absolute top-4 right-4 bg-red-500 text-xs px-3 py-1 rounded-full font-medium">
                      Sắp hết hạn
                    </div>
                  )}

                  <h3 className="text-xl font-semibold mb-2">
                    {coupon.discountType === "PERCENTAGE"
                      ? `Giảm ${coupon.discountValue}%`
                      : `Giảm ${coupon.discountValue.toLocaleString()}đ`}
                  </h3>

                  <p className="text-sm text-neutral-400 mb-2">
                    Đơn tối thiểu {coupon.minOrderValue.toLocaleString()}đ
                  </p>

                  {coupon.endDate && (
                    <p className="text-sm text-neutral-400 mb-2">
                      Hết hạn:{" "}
                      {new Date(coupon.endDate).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}

                  {coupon.usageLimit !== undefined && (
                    <p className="text-sm text-neutral-400 mb-4">
                      Còn lại: {coupon.usageLimit}
                    </p>
                  )}

                  <div className="mb-4">
                    <span className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold tracking-widest">
                      {coupon.code}
                    </span>
                  </div>

                  {claimed ? (
                    <button
                      disabled
                      className="w-full bg-neutral-700 text-neutral-400 py-2 rounded-full"
                    >
                      Đã nhận
                    </button>
                  ) : (
                    <button
                      onClick={() => handleClaim(coupon.code)}
                      disabled={loadingCode === coupon.code}
                      className="w-full bg-white text-black py-2 rounded-full hover:opacity-90 transition disabled:opacity-50"
                    >
                      {loadingCode === coupon.code
                        ? "Đang xử lý..."
                        : "Nhận mã"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
