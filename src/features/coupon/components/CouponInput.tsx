import { useState } from "react";
import { couponApi } from "../api/coupon.api";
import type { ApplyCouponResponseDTO } from "../types/coupon.type";
import { toast } from "sonner";
import { Loader2, Tag, X } from "lucide-react";

interface Props {
  orderTotal: number;
  onApplied: (data: ApplyCouponResponseDTO, code: string) => void;
  className?: string; 
}

export default function CouponInput({ orderTotal, onApplied, className }: Props) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    const trimmedCode = code.trim();

    if (!trimmedCode) {
      toast.error("Vui lòng nhập mã giảm giá");
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
      onApplied(res, trimmedCode);
    } catch (error) {
      toast.error("Mã giảm giá không hợp lệ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative flex items-center h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 hover:bg-white hover:border-zinc-900 transition-all group overflow-hidden ${className}`}>
      <div className="absolute left-4 pointer-events-none">
        <Tag className="text-zinc-300 group-hover:text-zinc-900 transition-colors" size={16} />
      </div>

      <input
        className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-zinc-300 h-full pl-11 pr-24 outline-none transition-all"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="MÃ GIẢM GIÁ"
      />

      {code && !loading && (
        <button 
          onClick={() => setCode("")}
          className="absolute right-[88px] p-1 rounded-full text-zinc-300 hover:text-zinc-900 transition-colors"
        >
          <X size={14} />
        </button>
      )}

      <button
        onClick={handleApply}
        disabled={loading || !code}
        className="absolute right-1 h-[40px] px-5 bg-zinc-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center min-w-[70px]"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={14} />
        ) : (
          "ÁP DỤNG"
        )}
      </button>
    </div>
  );
}
