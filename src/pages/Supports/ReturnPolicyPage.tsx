import { RefreshCcw, ShieldCheck, PackageSearch } from "lucide-react";

export default function ReturnPolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-semibold">
            Chính sách đổi trả
          </h1>

          <p className="mt-4 text-zinc-500 max-w-xl mx-auto text-sm">
            STYLE cam kết mang đến trải nghiệm mua sắm tốt nhất. Nếu sản phẩm
            gặp vấn đề, chúng tôi luôn sẵn sàng hỗ trợ đổi trả nhanh chóng.
          </p>
        </div>

        {/* CONTENT */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* RETURN TIME */}
          <div className="p-6 border border-zinc-100 rounded-2xl bg-zinc-50">
            <RefreshCcw className="w-8 h-8 text-black mb-4" />

            <h2 className="text-lg font-medium mb-2">Thời gian đổi trả</h2>

            <p className="text-sm text-zinc-600 leading-relaxed">
              Khách hàng có thể yêu cầu đổi hoặc trả sản phẩm trong vòng
              <span className="font-semibold text-black"> 7 ngày </span>
              kể từ ngày nhận hàng.
            </p>
          </div>

          {/* CONDITIONS */}
          <div className="p-6 border border-zinc-100 rounded-2xl bg-zinc-50">
            <ShieldCheck className="w-8 h-8 text-black mb-4" />

            <h2 className="text-lg font-medium mb-4">Điều kiện đổi trả</h2>

            <ul className="text-sm text-zinc-600 space-y-2">
              <li>Sản phẩm chưa qua sử dụng</li>
              <li>Còn đầy đủ tem mác và bao bì</li>
              <li>Có hóa đơn hoặc thông tin đơn hàng</li>
            </ul>
          </div>

          {/* PROCESS */}
          <div className="p-6 border border-zinc-100 rounded-2xl bg-zinc-50">
            <PackageSearch className="w-8 h-8 text-black mb-4" />

            <h2 className="text-lg font-medium mb-4">Quy trình đổi trả</h2>

            <ul className="text-sm text-zinc-600 space-y-2">
              <li>Liên hệ bộ phận hỗ trợ khách hàng</li>
              <li>Gửi sản phẩm về trung tâm xử lý</li>
              <li>Hoàn tiền hoặc đổi sản phẩm mới</li>
            </ul>
          </div>
        </div>

        {/* NOTE */}
        <div className="mt-16 bg-black text-white rounded-2xl p-8 text-center">
          <p className="text-sm md:text-base">
            Nếu bạn cần hỗ trợ về đổi trả sản phẩm, vui lòng liên hệ đội ngũ
            chăm sóc khách hàng của STYLE để được hỗ trợ nhanh nhất.
          </p>
        </div>
      </div>
    </div>
  );
}
