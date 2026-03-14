import { Link } from "react-router-dom";
import { Sparkles, Shirt, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white text-zinc-900">
      {/* HERO */}
      <section className="relative h-[480px] w-full overflow-hidden">
        <img
          src="https://wedo.vn/wp-content/uploads/2022/03/thiet-ke-shop-quan-ao-nam-2-1.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center">
          <div className="text-white max-w-xl space-y-6">
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
              Thời trang cho mọi phong cách
            </h1>

            <p className="text-sm md:text-base text-white/80">
              STYLE mang đến các thiết kế hiện đại dành cho nam, nữ, trẻ em và
              phong cách unisex.
            </p>

            <Link
              to="/products"
              className="inline-block bg-white text-black px-6 py-3 rounded-lg text-sm font-medium hover:bg-zinc-200 transition"
            >
              Khám phá bộ sưu tập
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center space-y-8">
        <h2 className="text-3xl font-semibold">Về STYLE</h2>

        <p className="text-zinc-600 leading-relaxed">
          STYLE là thương hiệu thời trang hiện đại mang đến những thiết kế tối
          giản, tinh tế và phù hợp với phong cách sống năng động.
        </p>

        <p className="text-zinc-600 leading-relaxed">
          Chúng tôi tạo ra các bộ sưu tập dành cho nam, nữ, trẻ em và phong cách
          unisex giúp mọi người thể hiện cá tính thông qua thời trang hàng ngày.
        </p>
      </section>

      {/* VALUES */}
      <section className="bg-neutral-50 py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <Sparkles className="mx-auto w-8 h-8 text-black" />

            <h3 className="text-lg font-medium">Thiết kế hiện đại</h3>

            <p className="text-zinc-600 text-sm leading-relaxed">
              Những thiết kế tối giản, dễ phối đồ và phù hợp với nhiều phong
              cách khác nhau.
            </p>
          </div>

          <div className="space-y-4">
            <Shirt className="mx-auto w-8 h-8 text-black" />

            <h3 className="text-lg font-medium">Chất lượng cao</h3>

            <p className="text-zinc-600 text-sm leading-relaxed">
              Chúng tôi lựa chọn chất liệu cao cấp và quy trình sản xuất nghiêm
              ngặt để đảm bảo độ bền và sự thoải mái.
            </p>
          </div>

          <div className="space-y-4">
            <Users className="mx-auto w-8 h-8 text-black" />

            <h3 className="text-lg font-medium">Dành cho mọi người</h3>

            <p className="text-zinc-600 text-sm leading-relaxed">
              Thời trang không có giới hạn. STYLE mang đến sản phẩm cho mọi lứa
              tuổi và phong cách cá nhân.
            </p>
          </div>
        </div>
      </section>

      {/* IMAGE + TEXT */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        <img
          src="https://media.routine.vn/1600x1200/prod/media/xu-huong-thoi-trang-xuan-he-2025-png-hu7w.webp"
          className="rounded-2xl object-cover w-full h-[420px]"
        />

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">
            Phong cách cho mọi khoảnh khắc
          </h2>

          <p className="text-zinc-600 leading-relaxed">
            Từ trang phục thường ngày đến các thiết kế nổi bật, STYLE mong muốn
            mang lại trải nghiệm thời trang đơn giản, tinh tế và dễ tiếp cận cho
            mọi khách hàng.
          </p>

          <Link
            to="/products"
            className="inline-block bg-black text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-zinc-800 transition"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-black text-white py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
          <div>
            <p className="text-4xl font-semibold">50K+</p>
            <p className="text-white/70 text-sm mt-2">Khách hàng tin tưởng</p>
          </div>

          <div>
            <p className="text-4xl font-semibold">200+</p>
            <p className="text-white/70 text-sm mt-2">Sản phẩm thời trang</p>
          </div>

          <div>
            <p className="text-4xl font-semibold">5+</p>
            <p className="text-white/70 text-sm mt-2">Năm phát triển</p>
          </div>
        </div>
      </section>
    </div>
  );
}
