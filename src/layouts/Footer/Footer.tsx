import { Link } from "react-router-dom";
import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { ROUTES } from "@/config/routes";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-400">
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {/* BRAND */}
          <div className="space-y-6">
            <h2 className="text-2xl font-light tracking-[0.4em] text-white">
              STYLE
            </h2>

            <p className="text-sm leading-relaxed text-neutral-500">
              Thời trang tối giản dành cho những người theo đuổi phong cách tinh
              tế và hiện đại. Chất lượng, bền vững và khác biệt.
            </p>

            <div className="flex gap-4 pt-2">
              {[Instagram, Facebook, Twitter].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-neutral-800 hover:border-white hover:text-white transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* SHOP */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-white">
              Mua sắm
            </h3>

            <ul className="mt-8 space-y-4 text-sm">
              <li>
                <Link to={ROUTES.PRODUCTS} className="hover:text-white transition">
                  Tất cả sản phẩm
                </Link>
              </li>
              <li>
                <Link to={ROUTES.productsByCategory("nam")} className="hover:text-white transition">
                  Nam
                </Link>
              </li>
              <li>
                <Link to={ROUTES.productsByCategory("nu")} className="hover:text-white transition">
                  Nữ
                </Link>
              </li>
              <li>
                <Link to={ROUTES.MY_COUPONS} className="hover:text-white transition">
                  Khuyến mãi
                </Link>
              </li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-white">
              Hỗ trợ
            </h3>

            <ul className="mt-8 space-y-4 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-white transition">
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-white transition">
                  Chính sách hoàn trả
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-white">
              Liên hệ
            </h3>

            <ul className="mt-8 space-y-5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-1 text-neutral-500" />
                <span>10 Nguyễn Trãi, Hà Nội</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-neutral-500" />
                <span>0123 456 789</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-neutral-500" />
                <span>support@style.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-20 border-t border-neutral-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-600">
          <p>© {new Date().getFullYear()} STYLE. All rights reserved.</p>

          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white transition">
              Chính sách bảo mật
            </Link>
            <Link to="/terms" className="hover:text-white transition">
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
