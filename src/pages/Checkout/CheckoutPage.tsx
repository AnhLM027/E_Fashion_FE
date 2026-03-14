import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import type { AppDispatch, RootState } from "@/store/store";
import { fetchCart } from "@/features/cart/slices/cartSlice";
import { createOrder } from "@/features/orders/slices/orderSlice";

import CouponInput from "@/features/coupon/components/CouponInput";
import type { CouponResponseDTO } from "@/features/coupon/types/coupon.type";
import { couponApi } from "@/features/coupon/api/coupon.api";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

type PaymentMethod = "COD" | "BANKING" | "MOMO" | "VNPAY" | "CREDIT_CARD";

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "COD", label: "Thanh toán khi nhận hàng (COD)" },
  { value: "BANKING", label: "Chuyển khoản ngân hàng" },
  { value: "MOMO", label: "Ví MoMo" },
  { value: "VNPAY", label: "VNPay" },
  { value: "CREDIT_CARD", label: "Thẻ tín dụng / ghi nợ" },
];

const SHIPPING_FEE = 30000;
const FREE_SHIPPING_THRESHOLD = 1500000;

interface CheckoutForm {
  receiverName: string;
  receiverPhone: string;
  province: string;
  district: string;
  ward: string;
  detailAddress: string;
  paymentMethod: PaymentMethod;
}

export default function CheckoutPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { items, totalPrice } = useSelector((state: RootState) => state.cart);
  const { creating } = useSelector((state: RootState) => state.orders);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const [couponCode, setCouponCode] = useState<string | undefined>();
  const [discountPreview, setDiscountPreview] = useState(0);

  const [myCoupons, setMyCoupons] = useState<CouponResponseDTO[]>([]);

  const [form, setForm] = useState<CheckoutForm>({
    receiverName: "",
    receiverPhone: "",
    province: "",
    district: "",
    ward: "",
    detailAddress: "",
    paymentMethod: "COD",
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    dispatch(fetchCart());

    const fetchCoupons = async () => {
      try {
        const data = await couponApi.getMyCoupons();
        setMyCoupons(data);
      } catch (err) {
        console.error("Failed to fetch coupons", err);
      }
    };

    fetchCoupons();
  }, [dispatch, isLoggedIn, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectCoupon = async (code: string) => {
    try {
      const res = await couponApi.apply({
        couponCode: code,
        orderTotal: subtotal,
      });

      if (!res.applicable) {
        toast.error(res.message);
        return;
      }

      setCouponCode(code);
      setDiscountPreview(res.discountAmount);

      toast.success("Áp dụng mã thành công 🎉");
    } catch (error) {
      toast.error("Không thể áp dụng mã");
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const subtotal = Number(totalPrice);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  const finalPreview = Math.max(subtotal + shippingFee - discountPreview, 0);

  const calculateDiscountPreview = (c: CouponResponseDTO) => {
    if (subtotal < Number(c.minOrderValue)) return 0;

    if (c.discountType === "PERCENTAGE") {
      return Math.floor((subtotal * Number(c.discountValue)) / 100);
    }

    return Number(c.discountValue);
  };

  const handleSubmit = async () => {
    if (
      !form.receiverName ||
      !form.receiverPhone ||
      !form.province ||
      !form.district ||
      !form.ward ||
      !form.detailAddress
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin giao hàng");
      return;
    }

    if (!/^(0|\+84)[0-9]{9}$/.test(form.receiverPhone)) {
      toast.error("Số điện thoại không hợp lệ");
      return;
    }

    try {
      const result = await dispatch(
        createOrder({
          ...form,
          shippingFee,
          couponCode, // ✅ gửi couponCode, không gửi discountAmount
        }),
      ).unwrap();

      console.log(couponCode);

      toast.success("Đặt hàng thành công 🎉", {
        description: `Mã đơn hàng: #${result.orderId.slice(0, 8)}`,
      });

      if (form.paymentMethod === "BANKING") {
        navigate(`/payment-info/${result.orderId}`);
      } else {
        navigate("/orders");
      }
    } catch (err: any) {
      toast.error(err?.message || "Đặt hàng thất bại, vui lòng thử lại");
    }
  };

  if (!items.length) {
    return (
      <div className="max-w-5xl mx-auto py-28 text-center">Giỏ hàng trống.</div>
    );
  }

  const processedCoupons = myCoupons
    .map((c) => {
      const now = new Date();
      const isExpired = new Date(c.endDate) < now;
      const notEnoughCondition = subtotal < Number(c.minOrderValue);
      const isOutOfUsage = c.usageLimit === 0;

      const discountAmount = calculateDiscountPreview(c);

      const isActive = !isExpired && !notEnoughCondition && !isOutOfUsage;

      return {
        ...c,
        discountAmount,
        isExpired,
        notEnoughCondition,
        isOutOfUsage,
        isActive,
      };
    })
    .sort((a, b) => {
      if (a.isActive !== b.isActive) {
        return a.isActive ? -1 : 1;
      }

      // Sau đó mới sort theo số tiền giảm
      return b.discountAmount - a.discountAmount;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-20">
      {/* LEFT */}
      <div className="bg-white p-10 rounded-2xl shadow-sm space-y-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Thông tin giao hàng
        </h1>

        <div className="grid gap-5">
          {(
            [
              { name: "receiverName", placeholder: "Họ và tên" },
              { name: "receiverPhone", placeholder: "Số điện thoại" },
              { name: "province", placeholder: "Tỉnh / Thành phố" },
              { name: "district", placeholder: "Quận / Huyện" },
              { name: "ward", placeholder: "Phường / Xã" },
              { name: "detailAddress", placeholder: "Địa chỉ chi tiết" },
            ] as const
          ).map((field) => (
            <input
              key={field.name}
              name={field.name}
              placeholder={field.placeholder}
              value={form[field.name]}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition"
            />
          ))}
        </div>

        {/* PAYMENT */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Phương thức thanh toán</h2>

          <div className="space-y-3">
            {PAYMENT_METHODS.map((method) => (
              <label
                key={method.value}
                className={`flex items-center gap-4 border rounded-xl p-4 cursor-pointer transition ${
                  form.paymentMethod === method.value
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <input
                  type="radio"
                  value={method.value}
                  checked={form.paymentMethod === method.value}
                  onChange={() =>
                    setForm((prev) => ({
                      ...prev,
                      paymentMethod: method.value,
                    }))
                  }
                  className="hidden"
                />

                <span className="text-sm font-medium">{method.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="bg-white p-10 rounded-2xl shadow-md h-fit sticky top-24 space-y-6">
        <h2 className="text-xl font-semibold">Đơn hàng của bạn</h2>

        {items.map((item) => (
          <div
            key={item.productVariantSizeId}
            className="flex gap-4 border-b pb-5"
          >
            <Link to={`/products/${item.slug}`}>
              <img
                src={item.productImage}
                alt={item.productName}
                className="h-28 w-20 object-cover rounded-lg hover:opacity-80 transition"
              />
            </Link>

            <div className="flex flex-col flex-1 justify-between">
              <Link
                to={`/products/${item.slug}`}
                className="text-sm font-medium hover:underline"
              >
                {item.productName}
              </Link>

              <div className="text-xs text-gray-600 mt-2">
                Màu: {item.colorName} • Size: {item.sizeName}
              </div>

              <div className="flex justify-between text-sm mt-3">
                <span>{formatPrice(Number(item.price))}</span>
                <span className="font-semibold">
                  {formatPrice(Number(item.price) * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}

        {myCoupons.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Coupon của bạn</h3>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {processedCoupons.map((c) => {
                const isExpired = new Date(c.endDate) < new Date();
                const discountAmount = calculateDiscountPreview(c);
                const notEnoughCondition = subtotal < Number(c.minOrderValue);

                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      if (c.isActive) {
                        handleSelectCoupon(c.code);
                      }
                    }}
                    className={`border rounded-xl p-3 cursor-pointer transition text-xs ${
                      couponCode === c.code
                        ? "border-black bg-gray-100"
                        : "border-gray-200"
                    } ${
                      !c.isActive
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:border-black"
                    }`}
                  >
                    <div className="flex justify-between font-medium">
                      <span>{c.code}</span>
                      <span>
                        {c.discountType === "PERCENTAGE"
                          ? `${c.discountValue}%`
                          : formatPrice(Number(c.discountValue))}
                      </span>
                    </div>

                    <div className="text-gray-500 mt-1">
                      Đơn tối thiểu: {formatPrice(Number(c.minOrderValue))}
                    </div>

                    <div className="text-gray-500 mt-1">
                      Số lượt sử dụng còn lại:{" "}
                      {c.isOutOfUsage ? (
                        <span className="text-red-500 font-medium">
                          Hết lượt sử dụng
                        </span>
                      ) : (
                        c.usageLimit
                      )}
                    </div>

                    {/* 🔥 HIỂN THỊ SỐ TIỀN GIẢM THỰC TẾ */}
                    {discountAmount > 0 && (
                      <div className="text-green-600 mt-1 font-medium">
                        Giảm ngay: -{formatPrice(discountAmount)}
                      </div>
                    )}

                    {notEnoughCondition && (
                      <div className="text-orange-500 mt-1">
                        Chưa đạt giá trị tối thiểu
                      </div>
                    )}

                    {isExpired && (
                      <div className="text-red-500 mt-1">Đã hết hạn</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <CouponInput
          orderTotal={subtotal}
          onApplied={(res, code) => {
            setDiscountPreview(res.discountAmount);
            setCouponCode(code);
          }}
        />

        <hr />

        <div className="flex justify-between text-sm">
          <span>Tạm tính</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Phí vận chuyển</span>
          <span>
            {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
          </span>
        </div>

        {discountPreview > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Giảm giá</span>
            <span>-{formatPrice(discountPreview)}</span>
          </div>
        )}

        <hr />

        <div className="flex justify-between font-semibold text-lg">
          <span>Tổng cộng</span>
          <span>{formatPrice(finalPreview)}</span>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={creating}
          className="w-full bg-black text-white py-3 rounded-full hover:bg-neutral-800 flex items-center justify-center gap-2"
        >
          {creating && <Loader2 className="animate-spin" size={18} />}
          {creating ? "Đang xử lý..." : "Đặt hàng"}
        </Button>
      </div>
    </div>
  );
}
