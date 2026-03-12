import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Package,
  User,
  LogOut,
  Heart,
  LayoutDashboard,
  ChevronDown,
  TicketPercent,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

import { ROUTES } from "@/config/routes";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { fetchCart } from "@/features/cart/slices/cartSlice";
import { useCategoryTree, type Category } from "@/hooks/useCategoryTree";
import type { RootState, AppDispatch } from "@/store/store";

export function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);

  const { user, isAuthenticated, logout } = useAuth();
  const { items } = useSelector((state: RootState) => state.cart);
  const { categories } = useCategoryTree();

  const isAdmin = user?.role === "ADMIN";
  const totalQuantity = items.reduce((t, i) => t + i.quantity, 0);

  // ================= LOGIC CŨ GIỮ NGUYÊN =================
  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCart());
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (!keyword.trim()) {
      setSuggestions([]);
      return;
    }
    const delay = setTimeout(async () => {
      try {
        setLoadingSearch(true);
        const res = await fetch(
          `http://localhost:8080/api/products/search?keyword=${encodeURIComponent(keyword)}`,
        );
        const data = await res.json();
        setSuggestions(data);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSearch(false);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [keyword]);

  useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(false);
      setIsUserMenuOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    navigate(ROUTES.LOGIN);
  };

  // ================= RECURSIVE CATEGORY RENDER (LOGIC CŨ) =================
  const CategoryNode = ({
    node,
    level = 0,
  }: {
    node: Category;
    level?: number;
  }) => {
    return (
      <div
        className={`${level > 0 ? "ml-4 mt-2 border-l border-zinc-100 pl-4" : ""}`}
      >
        <Link
          to={`/products/category/${node.slug}`}
          onClick={() => setActiveMega(null)}
          className={`
            block transition-all duration-200
            ${level === 0 ? "font-bold uppercase text-[13px] tracking-wider mb-4 pb-2 border-b border-zinc-100 text-zinc-900" : ""}
            ${level === 1 ? "font-semibold text-zinc-700 hover:text-indigo-600 text-[14px]" : ""}
            ${level >= 2 ? "text-[13px] text-zinc-500 hover:text-zinc-900 hover:translate-x-1" : ""}
          `}
        >
          {node.name}
        </Link>

        {node.children?.length > 0 && (
          <div className="space-y-1.5 mt-2">
            {node.children.map((child) => (
              <CategoryNode key={child.id} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* TOP BAR */}
      <div className="bg-zinc-900 text-white text-[10px] uppercase tracking-[0.2em] py-2.5 overflow-hidden">
        <div className="flex w-max marquee whitespace-nowrap gap-12">
          {[1, 2, 3].map((i) => (
            <span key={i} className="flex gap-12">
              <span>🔥 SALE UP TO 50% – Số lượng có hạn</span>
              <span>🚚 Miễn phí vận chuyển từ 1.500.000₫</span>
              <span>🎁 Tặng voucher 100k cho khách mới</span>
            </span>
          ))}
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <div className="bg-white/90 backdrop-blur-md border-b border-zinc-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center gap-8">
          {/* LOGO */}
          <Link
            to={ROUTES.HOME}
            className="font-serif text-2xl font-black tracking-tighter"
          >
            STYLE<span className="text-indigo-600">.</span>
          </Link>

          {/* NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-8 h-full">
            <Link
              to="/products"
              className="text-[12px] font-bold uppercase tracking-widest text-zinc-600 hover:text-black"
            >
              Tất cả
            </Link>

            {categories.map((root) => (
              <div
                key={root.id}
                className="h-full flex items-center relative group"
                onMouseEnter={() => setActiveMega(root.id)}
                onMouseLeave={() => setActiveMega(null)}
              >
                <Link
                  to={`/products/category/${root.slug}`}
                  className="text-[12px] font-bold uppercase tracking-widest text-zinc-600 group-hover:text-black flex items-center gap-1"
                >
                  {root.name}
                  <ChevronDown className="h-3 w-3" />
                </Link>

                {/* MEGA MENU ĐÃ FIX ĐỆ QUY */}
                <AnimatePresence>
                  {activeMega === root.id && root.children.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-[80px] left-[-100px] w-[900px] bg-white border shadow-2xl rounded-2xl p-10 z-[60]"
                    >
                      <div className="grid grid-cols-4 gap-8 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                        {root.children.map((child) => (
                          <CategoryNode key={child.id} node={child} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* ACTIONS (SEARCH, USER, CART) */}
          <div className="ml-auto flex items-center gap-4">
            {/* SEARCH ĐÃ FIX CLICK */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!keyword.trim()) return;
                  navigate(`/products?q=${keyword}`);
                  setShowDropdown(false);
                }}
                className="h-10 flex items-center gap-2 rounded-full border border-zinc-200 px-4 bg-zinc-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-zinc-100 transition-all"
              >
                <Search className="h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onFocus={() => suggestions.length && setShowDropdown(true)}
                  className="bg-transparent text-sm outline-none w-40 lg:w-56"
                />
              </form>

              {/* SEARCH DROPDOWN FIX */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-3 z-99 right-0 w-96 bg-white border border-zinc-100 shadow-2xl rounded-2xl overflow-hidden z-50"
                  >
                    {loadingSearch ? (
                      <div className="p-4 text-sm text-zinc-400">
                        Đang tìm kiếm...
                      </div>
                    ) : suggestions.length === 0 ? (
                      <div className="p-4 text-sm text-zinc-400">
                        Không tìm thấy sản phẩm
                      </div>
                    ) : (
                      <div className="max-h-[400px] overflow-y-auto">
                        {suggestions.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              navigate(`/products/${item.slug}`);
                              setShowDropdown(false);
                              setKeyword("");
                            }}
                            className="flex items-center gap-3 p-3 hover:bg-zinc-50 cursor-pointer transition-colors border-b border-zinc-50 last:border-none"
                          >
                            <img
                              src={item.thumbnail}
                              alt={item.name}
                              className="w-12 h-16 object-cover rounded-md"
                            />
                            <div>
                              <div className="text-[13px] font-bold text-zinc-800 line-clamp-1">
                                {item.name}
                              </div>
                              <div className="text-[12px] text-red-600 font-bold">
                                {item.salePrice?.toLocaleString()}₫
                              </div>
                            </div>
                          </div>
                        ))}
                        <div
                          onClick={() => {
                            navigate(`/products?q=${keyword}`);
                            setShowDropdown(false);
                          }}
                          className="p-3 text-xs font-bold text-center text-indigo-600 hover:bg-zinc-50 cursor-pointer uppercase tracking-widest border-t"
                        >
                          Xem tất cả kết quả
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* USER MENU */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
              >
                <User className="h-5 w-5 text-zinc-700" />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-0 mt-3 w-56 bg-white border border-zinc-100 shadow-xl rounded-xl overflow-hidden"
                  >
                    {isAuthenticated ? (
                      <div className="py-1 text-sm">
                        <div className="px-4 py-3 bg-zinc-50 border-b border-zinc-100 mb-1">
                          <p className="font-bold">{user?.fullName}</p>
                          <p className="text-[11px] text-zinc-500 truncate">
                            {user?.email}
                          </p>
                        </div>
                        {isAdmin && (
                          <MenuLink
                            to={ROUTES.ADMIN_DASHBOARD}
                            icon={<LayoutDashboard size={16} />}
                            text="Quản trị"
                          />
                        )}
                        <MenuLink
                          to={ROUTES.ACCOUNT_PROFILE}
                          icon={<User size={16} />}
                          text="Tài khoản"
                        />
                        <MenuLink
                          to={ROUTES.ORDERS}
                          icon={<Package size={16} />}
                          text="Đơn hàng"
                        />
                        <MenuLink
                          to={ROUTES.MY_COUPONS}
                          icon={<TicketPercent size={16} />}
                          text="Mã giảm giá"
                        />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} /> Đăng xuất
                        </button>
                      </div>
                    ) : (
                      <div className="p-3">
                        <Link
                          to={ROUTES.LOGIN}
                          className="block w-full text-center py-2 bg-zinc-900 text-white rounded-lg text-sm font-bold"
                        >
                          Đăng nhập
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* WISHLIST & CART */}
            <Link
              to={ROUTES.WISHLIST}
              className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <Heart className="h-5 w-5 text-zinc-700" />
            </Link>

            <Link
              to={ROUTES.CART}
              className="p-2 hover:bg-zinc-100 rounded-full transition-colors relative"
            >
              <ShoppingCart className="h-5 w-5 text-zinc-700" />
              {totalQuantity > 0 && (
                <span className="absolute top-0 right-0 h-4 min-w-[16px] px-1 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {totalQuantity}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

// Sub-component cho gọn
const MenuLink = ({
  to,
  icon,
  text,
}: {
  to: string;
  icon: any;
  text: string;
}) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-50 text-zinc-700 transition-colors"
  >
    {icon} {text}
  </Link>
);

export default Header;
