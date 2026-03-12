import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function PromoBanner() {
  return (
    <section className="border-b border-neutral-200 bg-white py-20 md:py-15">
      <div className="container mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl bg-neutral-100">
          <div className="grid items-center lg:grid-cols-2">
            {/* Content */}
            <div className="relative z-10 p-10 md:p-16">
              <span className="inline-block text-sm uppercase tracking-widest text-neutral-500">
                Ưu đãi có thời hạn
              </span>

              <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                Giảm giá lên đến 40% <br />
                Bộ sưu tập mùa đông giành cho nam giới
              </h2>

              <p className="mt-6 max-w-md text-neutral-600">
                Chào đón mùa đông với những thiết kế tinh giản, chất liệu cao
                cấp và phong cách vượt thời gian dành cho bạn.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-none bg-black px-10 py-6 text-sm uppercase tracking-widest text-white transition hover:bg-neutral-800"
                >
                  <Link to="/products/category/nam">Mua ngay</Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  className="rounded-none border border-black bg-transparent px-10 py-6 text-sm uppercase tracking-widest transition hover:bg-black hover:text-white"
                >
                  <Link to="/products">Xem tất cả</Link>
                </Button>
              </div>
            </div>

            {/* Image */}
            <div className="relative aspect-4/3 lg:aspect-auto lg:h-130">
              <img
                src="https://theme.hstatic.net/200000690725/1001078549/14/a1.png"
                alt="Bộ sưu tập mùa đông"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-r from-white/50 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
