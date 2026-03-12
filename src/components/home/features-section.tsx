import { Truck, Shield, RefreshCcw, Headphones } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Miễn phí vận chuyển",
    description: "Miễn phí giao hàng cho đơn hàng trên 2.000.000₫",
  },
  {
    icon: Shield,
    title: "Thanh toán an toàn",
    description: "Xử lý thanh toán an toàn 100%",
  },
  {
    icon: RefreshCcw,
    title: "Đổi trả dễ dàng",
    description: "Chính sách đổi trả trong 30 ngày",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ 24/7",
    description: "Luôn sẵn sàng hỗ trợ bạn mọi lúc",
  },
];

export function FeaturesSection() {
  return (
    <section className="border-y border-neutral-200 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 divide-y divide-neutral-200 sm:grid-cols-2 sm:divide-y-0 md:grid-cols-4 md:divide-x">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group px-8 py-10 text-center transition-all duration-300"
            >
              {/* Icon */}
              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 transition-all duration-300 group-hover:bg-black">
                <feature.icon className="h-5 w-5 text-neutral-700 transition-colors duration-300 group-hover:text-white" />
              </div>

              {/* Title */}
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">
                {feature.title}
              </h3>

              {/* Divider line */}
              <div className="mx-auto my-4 h-px w-8 bg-neutral-300 transition-all duration-300 group-hover:w-12 group-hover:bg-black" />

              {/* Description */}
              <p className="mx-auto max-w-55 text-sm leading-relaxed text-neutral-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
