import { RefreshCcw, PackageCheck, Ban, Receipt } from "lucide-react";

export function ProductPolicy() {
  const policies = [
    {
      icon: RefreshCcw,
      title: "Đổi trả trong 7 ngày",
      desc: "Khách hàng có thể yêu cầu đổi hoặc trả sản phẩm trong vòng 7 ngày kể từ khi nhận hàng.",
    },
    {
      icon: PackageCheck,
      title: "Sản phẩm còn nguyên trạng",
      desc: "Sản phẩm phải còn nguyên tem mác, chưa qua sử dụng và giữ nguyên bao bì ban đầu.",
    },
    {
      icon: Ban,
      title: "Không áp dụng với sản phẩm khuyến mãi",
      desc: "Các sản phẩm thuộc chương trình giảm giá đặc biệt có thể không áp dụng chính sách đổi trả.",
    },
    {
      icon: Receipt,
      title: "Cung cấp thông tin đơn hàng",
      desc: "Vui lòng giữ hóa đơn hoặc mã đơn hàng để quá trình đổi trả được xử lý nhanh chóng.",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-neutral-900">
          Chính sách đổi & hoàn trả
        </h3>
        <p className="text-sm text-neutral-500 mt-1">
          Vui lòng tham khảo các điều kiện dưới đây trước khi yêu cầu đổi hoặc
          trả sản phẩm.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {policies.map((item, i) => {
          const Icon = item.icon;

          return (
            <div
              key={i}
              className="flex gap-4 p-5 border border-neutral-200 rounded-xl bg-white hover:shadow-sm transition"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                <Icon className="h-5 w-5 text-neutral-700" />
              </div>

              <div>
                <p className="font-medium text-neutral-900">{item.title}</p>
                <p className="text-sm text-neutral-600 leading-relaxed mt-1">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
