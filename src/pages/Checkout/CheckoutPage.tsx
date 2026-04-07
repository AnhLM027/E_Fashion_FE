import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2, MapPin } from "lucide-react";

import type { AppDispatch, RootState } from "@/store/store";
import { fetchCart } from "@/features/cart/slices/cartSlice";
import { createOrder } from "@/features/orders/slices/orderSlice";

import CouponInput from "@/features/coupon/components/CouponInput";
import { couponApi } from "@/features/coupon/api/coupon.api";
import type { CouponResponseDTO } from "@/features/coupon/types/coupon.type";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { type CartItem } from "@/features/cart/types/cart.type";

import { addressApi } from "@/features/address/api/address.api";
import type { CustomerAddress } from "@/features/address/types/address.types";

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

  const location = useLocation();
  const selectedItemsFromCart = location.state?.items;

  const { items: cartItems } = useSelector(
    (state: RootState) => state.cart,
  );

  const items = selectedItemsFromCart ?? cartItems;
  const { creating } = useSelector((state: RootState) => state.orders);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const [couponCode, setCouponCode] = useState<string | undefined>();
  const [discountPreview, setDiscountPreview] = useState(0);

  const [myCoupons, setMyCoupons] = useState<CouponResponseDTO[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<CustomerAddress[]>([]);
  const [showAddressBook, setShowAddressBook] = useState(false);

  const [form, setForm] = useState<CheckoutForm>({
    receiverName: "",
    receiverPhone: "",
    province: "",
    district: "",
    ward: "",
    detailAddress: "",
    paymentMethod: "COD",
  });

  const handleSelectSavedAddress = (addr: CustomerAddress) => {
    setForm(prev => ({
      ...prev,
      receiverName: addr.receiverName,
      receiverPhone: addr.receiverPhone,
      province: addr.province,
      district: addr.district,
      ward: addr.ward,
      detailAddress: addr.detailAddress,
    }));
    setShowAddressBook(false);
    toast.success("Đã cập nhật thông tin giao hàng");
  };

  const fetchAddresses = async () => {
    try {
      const data = await addressApi.getAddresses();
      setSavedAddresses(data);

      const defaultAddr = data.find(a => a.isDefault);
      if (defaultAddr && !form.receiverName) {
        handleSelectSavedAddress(defaultAddr);
      }
    } catch (err) {
      console.error("Failed to fetch addresses", err);
    }
  };

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
    fetchAddresses();
  }, [dispatch, isLoggedIn, navigate]);

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

  const calculateDiscountPreview = (c: CouponResponseDTO) => {
    if (subtotal < Number(c.minOrderValue)) return 0;

    if (c.discountType === "PERCENTAGE") {
      return Math.floor((subtotal * Number(c.discountValue)) / 100);
    }

    return Number(c.discountValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const subtotal = items.reduce(
    (sum: number, i: CartItem) => sum + i.price * i.quantity,
    0,
  );
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  const finalPreview = Math.max(subtotal + shippingFee - discountPreview, 0);

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
    <div className="bg-white min-h-screen pt-20 pb-40 font-sans">
      <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-5 gap-12">
        
        {/* LEFT COLUMN - Information */}
        <div className="lg:col-span-3 space-y-12">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Thanh toán</h1>
            <p className="text-sm text-zinc-500">Hoàn tất thông tin để đặt hàng</p>
          </div>

          {/* Address selection toggle */}
          {savedAddresses.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Địa chỉ của bạn</h2>
                <button 
                  onClick={() => setShowAddressBook(!showAddressBook)}
                  className="text-xs font-bold text-zinc-900 hover:underline"
                >
                  {showAddressBook ? "Đóng sổ địa chỉ" : "Chọn từ sổ địa chỉ"}
                </button>
              </div>

              {showAddressBook && (
                <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => handleSelectSavedAddress(addr)}
                      className="p-4 rounded-xl border border-zinc-200 hover:border-zinc-900 cursor-pointer transition-all flex items-start gap-4 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center shrink-0">
                        <MapPin size={14} className="text-zinc-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-zinc-900">{addr.receiverName}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Mặc định</span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 truncate">
                          {addr.detailAddress}, {addr.ward}, {addr.district}, {addr.province}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Delivery Form */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-100 pb-2">Thông tin giao hàng</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-zinc-500 ml-1">Người nhận</label>
                  <Input
                    name="receiverName"
                    value={form.receiverName}
                    onChange={handleChange}
                    placeholder="Họ và tên"
                    className="h-12 border-zinc-200 focus:ring-0 focus:border-zinc-900 rounded-xl px-4 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-zinc-500 ml-1">Số điện thoại</label>
                  <Input
                    name="receiverPhone"
                    value={form.receiverPhone}
                    onChange={handleChange}
                    placeholder="Số điện thoại"
                    className="h-12 border-zinc-200 focus:ring-0 focus:border-zinc-900 rounded-xl px-4 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-zinc-500 ml-1">Tỉnh / Thành</label>
                  <Input
                    name="province"
                    value={form.province}
                    onChange={handleChange}
                    className="h-12 border-zinc-200 focus:ring-0 focus:border-zinc-900 rounded-xl px-4 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-zinc-500 ml-1">Quận / Huyện</label>
                  <Input
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    className="h-12 border-zinc-200 focus:ring-0 focus:border-zinc-900 rounded-xl px-4 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-zinc-500 ml-1">Phường / Xã</label>
                  <Input
                    name="ward"
                    value={form.ward}
                    onChange={handleChange}
                    className="h-12 border-zinc-200 focus:ring-0 focus:border-zinc-900 rounded-xl px-4 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-zinc-500 ml-1">Địa chỉ cụ thể</label>
                <Input
                  name="detailAddress"
                  value={form.detailAddress}
                  onChange={handleChange}
                  placeholder="Số nhà, tên đường..."
                  className="h-12 border-zinc-200 focus:ring-0 focus:border-zinc-900 rounded-xl px-4 text-sm"
                />
              </div>
            </div>

            {/* Payment */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-100 pb-2">Phương thức thanh toán</h3>
              <div className="grid grid-cols-1 gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                      form.paymentMethod === method.value
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <input
                      type="radio"
                      value={method.value}
                      checked={form.paymentMethod === method.value}
                      onChange={() => setForm(p => ({ ...p, paymentMethod: method.value }))}
                      className="hidden"
                    />
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        form.paymentMethod === method.value ? "border-white" : "border-zinc-300"
                      }`}>
                        {form.paymentMethod === method.value && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="text-sm font-medium">{method.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Summary */}
        <div className="lg:col-span-2 space-y-6 h-fit sticky top-24">
          <div className="border border-zinc-200 rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold">Đơn hàng</h2>
            
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item: CartItem) => (
                <div key={item.productVariantSizeId} className="flex gap-4">
                  <div className="w-16 h-20 bg-zinc-50 rounded-lg overflow-hidden border border-zinc-100 shrink-0">
                    <img src={item.productImage} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-between py-0.5 min-w-0">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 truncate">{item.productName}</h4>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">
                        {item.colorName} / {item.sizeName} × {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-bold">{formatPrice(Number(item.price))}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-zinc-100">
              {myCoupons.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Mã giảm giá của bạn</h3>
                  <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar snap-x">
                    {processedCoupons.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => c.isActive && handleSelectCoupon(c.code)}
                        className={`relative min-w-[160px] p-4 rounded-xl border transition-all cursor-pointer snap-start ${
                          couponCode === c.code
                            ? "border-zinc-900 bg-zinc-900 text-white"
                            : "border-zinc-100 bg-zinc-50 hover:border-zinc-300"
                        } ${!c.isActive && "opacity-40 cursor-not-allowed"}`}
                      >
                        <div className="flex flex-col gap-1">
                          <span className={`text-xs font-bold ${couponCode === c.code ? 'text-white' : 'text-zinc-900'}`}>{c.code}</span>
                          <span className={`text-[10px] ${couponCode === c.code ? 'text-white/70' : 'text-zinc-500'}`}>
                            Giảm {c.discountType === "PERCENTAGE" ? `${c.discountValue}%` : formatPrice(Number(c.discountValue))}
                          </span>
                        </div>
                      </div>
                    ))}
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

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Tạm tính</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Vận chuyển</span>
                  <span>{shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}</span>
                </div>
                {discountPreview > 0 && (
                  <div className="flex justify-between text-xs text-green-600 font-medium">
                    <span>Giảm giá</span>
                    <span>-{formatPrice(discountPreview)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold pt-2 border-t border-zinc-100">
                  <span>Tổng tiền</span>
                  <span>{formatPrice(finalPreview)}</span>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={creating}
                className="w-full bg-zinc-900 text-white h-12 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
              >
                {creating ? <Loader2 className="animate-spin" size={18} /> : "Xác nhận đặt hàng"}
              </Button>
            </div>
          </div>

          <p className="text-[10px] text-center text-zinc-400 leading-relaxed">
            Bằng việc nhấn đặt hàng, bạn đồng ý với các điều khoản dịch vụ của E-Fashion.
          </p>
        </div>
      </div>
    </div>
  );
}
