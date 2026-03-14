import { Truck, Clock, PackageCheck } from "lucide-react";

export default function ShippingPolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-semibold">
            Chính sách vận chuyển
          </h1>
          <p className="mt-4 text-zinc-500 max-w-xl mx-auto text-sm">
            STYLE hỗ trợ giao hàng toàn quốc thông qua các đối tác vận chuyển uy
            tín để đảm bảo đơn hàng đến tay bạn nhanh chóng và an toàn.
          </p>
        </div>

        {/* CONTENT */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* SHIPPING AREA */}
          <div className="p-6 border border-zinc-100 rounded-2xl bg-zinc-50">
            <Truck className="w-8 h-8 text-black mb-4" />

            <h2 className="text-lg font-medium mb-2">Phạm vi giao hàng</h2>

            <p className="text-sm text-zinc-600 leading-relaxed">
              STYLE hỗ trợ giao hàng trên toàn quốc thông qua các đối tác vận
              chuyển đáng tin cậy.
            </p>
          </div>

          {/* DELIVERY TIME */}
          <div className="p-6 border border-zinc-100 rounded-2xl bg-zinc-50">
            <Clock className="w-8 h-8 text-black mb-4" />

            <h2 className="text-lg font-medium mb-4">Thời gian giao hàng</h2>

            <ul className="text-sm text-zinc-600 space-y-2">
              <li>Hà Nội / TP.HCM: 1 – 2 ngày</li>
              <li>Các tỉnh thành khác: 2 – 4 ngày</li>
              <li>
                Đơn hàng đặt cuối tuần có thể xử lý vào ngày làm việc tiếp theo
              </li>
            </ul>
          </div>

          {/* SHIPPING COST */}
          <div className="p-6 border border-zinc-100 rounded-2xl bg-zinc-50">
            <PackageCheck className="w-8 h-8 text-black mb-4" />

            <h2 className="text-lg font-medium mb-4">Phí vận chuyển</h2>

            <ul className="text-sm text-zinc-600 space-y-2">
              <li className="font-medium text-black">
                Miễn phí cho đơn từ 1.500.000₫
              </li>

              <li>Đơn hàng dưới 1.500.000₫: phí 30.000₫</li>

              <li>Phí vận chuyển có thể thay đổi tùy theo khu vực.</li>
            </ul>
          </div>
        </div>

        {/* NOTE */}
        <div className="mt-16 bg-black text-white rounded-2xl p-8 text-center">
          <p className="text-sm md:text-base">
            Nếu bạn có bất kỳ câu hỏi nào về vận chuyển, vui lòng liên hệ bộ
            phận hỗ trợ khách hàng của STYLE để được hỗ trợ nhanh nhất.
          </p>
        </div>
      </div>
    </div>
  );
}
