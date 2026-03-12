import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { orderApi } from "@/features/orders/api/order.api";
import { formatFullDateTime } from "@/utils/format";

const formatCurrency = (value?: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value || 0);

const statusLabel: Record<string, string> = {
  PENDING: "Chờ xử lý",
  PROCESSING: "Đang xử lý",
  SHIPPED: "Đang giao hàng",
  DELIVERED: "Đã giao hàng",
  CANCELLED: "Đã hủy",
  RETURNED: "Đã trả hàng",
};

const paymentStatusLabel: Record<string, string> = {
  UNPAID: "Chưa thanh toán",
  PAID: "Đã thanh toán",
  FAILED: "Thanh toán thất bại",
  REFUNDED: "Đã hoàn tiền",
};

const statusColor: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-600 border-yellow-200",
  PROCESSING: "bg-blue-50 text-blue-600 border-blue-200",
  SHIPPED: "bg-purple-50 text-purple-600 border-purple-200",
  DELIVERED: "bg-green-50 text-green-600 border-green-200",
  CANCELLED: "bg-red-50 text-red-600 border-red-200",
  RETURNED: "bg-gray-100 text-gray-600 border-gray-300",
};

const paymentStatusColor: Record<string, string> = {
  UNPAID: "bg-orange-50 text-orange-600 border-orange-200",
  PAID: "bg-green-50 text-green-600 border-green-200",
  FAILED: "bg-red-50 text-red-600 border-red-200",
  REFUNDED: "bg-gray-100 text-gray-600 border-gray-300",
};

const paymentMethodLabel: Record<string, string> = {
  COD: "Thanh toán khi nhận hàng",
  BANKING: "Chuyển khoản ngân hàng",
  MOMO: "Ví MoMo",
  VNPAY: "VNPay",
  CREDIT_CARD: "Thẻ tín dụng / ghi nợ",
};

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderApi.getOrderById(orderId!);
        setOrder(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading)
    return (
      <div className="max-w-6xl mx-auto px-6 py-24 text-center text-gray-500">
        Đang tải đơn hàng...
      </div>
    );

  if (!order)
    return (
      <div className="max-w-6xl mx-auto px-6 py-24 text-center text-gray-400">
        Không tìm thấy đơn hàng.
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 space-y-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Đơn hàng #{order.orderId.slice(0, 8)}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {formatFullDateTime(order.createdAt)}
          </p>

          {order.trackingNumber && (
            <p className="text-blue-600 text-sm mt-1">
              Mã vận đơn: {order.trackingNumber}
            </p>
          )}
        </div>

        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition text-sm"
        >
          ← Quay lại
        </button>
      </div>

      {/* STATUS */}
      <div className="flex flex-wrap gap-4">
        <span
          className={`px-4 py-1 text-xs font-semibold rounded-full border ${
            statusColor[order.status]
          }`}
        >
          {statusLabel[order.status]}
        </span>

        <span
          className={`px-4 py-1 text-xs font-semibold rounded-full border ${
            paymentStatusColor[order.paymentStatus]
          }`}
        >
          {paymentStatusLabel[order.paymentStatus]}
        </span>
      </div>

      {/* ORDER INFO */}
      <div className="bg-white rounded-3xl shadow-sm p-8 grid md:grid-cols-2 gap-6 text-sm">
        <div>
          <p className="text-gray-500">Người nhận</p>
          <p className="font-medium">
            {order.receiverName} – {order.receiverPhone}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Phương thức thanh toán</p>
          <p className="font-medium">
            {paymentMethodLabel[order.paymentMethod]}
          </p>
        </div>

        <div className="md:col-span-2">
          <p className="text-gray-500">Địa chỉ giao hàng</p>
          <p className="font-medium">
            {order.detailAddress}, {order.ward}, {order.district},{" "}
            {order.province}
          </p>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="bg-white rounded-3xl shadow-sm p-8 space-y-8">
        <h2 className="text-xl font-semibold">Sản phẩm trong đơn</h2>

        {order.items.map((item: any) => (
          <div
            key={item.variantSizeId}
            className="flex flex-col sm:flex-row gap-6 border-b pb-6 last:border-none"
          >
            <img
              src={item.imageUrl || "/placeholder.png"}
              alt={item.productName}
              className="w-28 h-32 object-cover rounded-xl border"
            />

            <div className="flex-1 space-y-2">
              <button
                onClick={() => navigate(`/products/${item.slug}`)}
                className="font-medium hover:underline text-left"
              >
                {item.productName}
              </button>

              <p className="text-sm text-gray-500">
                {item.colorName} • {item.sizeName}
              </p>

              <p className="text-sm text-gray-500">
                Số lượng: x{item.quantity}
              </p>
            </div>

            <div className="text-right space-y-1">
              <p className="text-sm text-gray-500">
                {formatCurrency(item.price)}
              </p>
              <p className="text-lg font-semibold">
                {formatCurrency(item.subtotal)}
              </p>
            </div>
          </div>
        ))}

        {/* PRICE BREAKDOWN */}
        <div className="pt-6 text-right space-y-2 text-sm">
          <p>Tạm tính: {formatCurrency(order.totalPrice)}</p>

          {order.discountAmount > 0 && (
            <p className="text-green-600">
              Giảm giá ({order.couponCode}): -
              {formatCurrency(order.discountAmount)}
            </p>
          )}

          <p>Phí vận chuyển: {formatCurrency(order.shippingFee)}</p>

          <p className="text-2xl font-bold pt-2">
            Tổng thanh toán: {formatCurrency(order.finalPrice)}
          </p>
        </div>
      </div>
    </div>
  );
}
