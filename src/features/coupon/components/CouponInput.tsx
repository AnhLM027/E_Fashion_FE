import { useState } from "react";
import { couponApi } from "../api/coupon.api";
import type { ApplyCouponResponseDTO } from "../types/coupon.type";
import { toast } from "sonner";

interface Props {
  orderTotal: number;
  onApplied: (data: ApplyCouponResponseDTO, code: string) => void;
}

export default function CouponInput({ orderTotal, onApplied }: Props) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    const trimmedCode = code.trim();

    if (!trimmedCode) {
      toast.error("Nhập mã giảm giá");
      return;
    }

    try {
      setLoading(true);

      const res = await couponApi.apply({
        couponCode: trimmedCode,
        orderTotal,
      });

      if (!res.applicable) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);

      // ✅ Trả cả response và couponCode
      onApplied(res, trimmedCode);
    } catch (error) {
      toast.error("Không thể áp dụng mã");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <input
        className="border px-4 py-2 rounded-xl flex-1"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Nhập mã giảm giá"
      />
      <button
        onClick={handleApply}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded-xl"
      >
        {loading ? "Đang áp dụng..." : "Áp dụng"}
      </button>
    </div>
  );
}
