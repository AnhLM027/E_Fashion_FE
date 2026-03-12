import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { type RootState, type AppDispatch } from "@/store/store";
import { fetchMyOrders } from "@/features/orders/slices/orderSlice";
import { Button } from "@/components/ui/Button";
import { Copy, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function PaymentInfoPage() {
  const { orderId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const [copied, setCopied] = useState(false);

  const { orders, loading } = useSelector((state: RootState) => state.orders);
  const order = orders.find((o) => o.orderId === orderId);

  useEffect(() => {
    if (!order) {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, order]);

  const BANK_CONFIG = {
    BANK_ID: "TCB",
    ACCOUNT_NO: "19039896078016",
    ACCOUNT_NAME: "LE MINH ANH",
    TEMPLATE: "compact2",
  };

  const amount = order?.finalPrice || 0;  
  const description = `THANH TOAN DON HANG ${orderId}`;

  const qrUrl = `https://img.vietqr.io/image/${BANK_CONFIG.BANK_ID}-${BANK_CONFIG.ACCOUNT_NO}-${BANK_CONFIG.TEMPLATE}.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(BANK_CONFIG.ACCOUNT_NAME)}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading)
    return (
      <div className="text-center py-24 text-gray-400">
        Đang tải thông tin...
      </div>
    );

  if (!order)
    return (
      <div className="text-center py-24 text-gray-400">
        Không tìm thấy đơn hàng #{orderId}
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="bg-white rounded-3xl shadow-xl p-10 space-y-10">
        {/* HEADER */}
        <div className="text-center space-y-3">
          <CheckCircle2 className="mx-auto text-green-500" size={56} />
          <h1 className="text-3xl font-semibold tracking-tight">
            Đặt hàng thành công
          </h1>
          <p className="text-gray-500">
            Vui lòng chuyển khoản để hoàn tất thanh toán.
          </p>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* QR */}
          <div className="bg-gray-50 p-6 rounded-2xl border shadow-inner text-center">
            <img src={qrUrl} alt="VietQR" className="rounded-xl mx-auto" />
            <p className="mt-4 text-xs uppercase tracking-wider text-gray-400">
              Quét mã bằng ứng dụng ngân hàng
            </p>
          </div>

          {/* BANK INFO */}
          <div className="space-y-6 text-sm">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Ngân hàng
              </p>
              <p className="font-semibold text-red-600">Techcombank (TCB)</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Chủ tài khoản
              </p>
              <p className="font-medium">{BANK_CONFIG.ACCOUNT_NAME}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Số tài khoản
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-2xl font-bold tracking-wide">
                  {BANK_CONFIG.ACCOUNT_NO}
                </span>
                <button
                  onClick={() => handleCopy(BANK_CONFIG.ACCOUNT_NO)}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>
            
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Số tiền
              </p>
              <p className="text-2xl font-bold text-black">
                {amount.toLocaleString()} ₫
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                Nội dung chuyển khoản
              </p>
              <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <span className="font-mono text-sm font-bold text-red-700">
                  {description}
                </span>
                <button
                  onClick={() => handleCopy(description)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION */}
        <div className="flex flex-col gap-4 pt-6">
          <Link to="/orders">
            <Button className="w-full bg-black text-white py-4 rounded-full hover:bg-neutral-800">
              Tôi đã chuyển khoản
            </Button>
          </Link>

          <Link
            to="/"
            className="text-center text-sm text-gray-400 hover:text-black transition"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>

      {/* TOAST */}
      {copied && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full text-sm shadow-lg">
          Đã sao chép
        </div>
      )}
    </div>
  );
}
