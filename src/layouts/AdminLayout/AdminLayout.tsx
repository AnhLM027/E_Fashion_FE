import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderTree,
  Tag,
  Package,
  ShoppingCart,
  Ticket,
  MessageSquare,
  Star,
  Store,
  LogOut,
  Palette,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition relative
     ${
       isActive
         ? "bg-black text-white shadow-md"
         : "text-gray-600 hover:bg-gray-100"
     }`;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r shadow-sm flex flex-col">
        {/* Logo */}
        <div className="px-8 py-8 border-b">
          <div className="text-2xl font-bold tracking-tight">E-Fashion</div>
          <p className="text-xs text-gray-500 mt-1">Admin Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <NavLink to="/admin" end className={linkClass}>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink to="/admin/users" className={linkClass}>
            <Users size={18} />
            Users
          </NavLink>

          <NavLink to="/admin/categories" className={linkClass}>
            <FolderTree size={18} />
            Categories
          </NavLink>

          <NavLink to="/admin/brands" className={linkClass}>
            <Tag size={18} />
            Brands
          </NavLink>

          <NavLink to="/admin/products" className={linkClass}>
            <Package size={18} />
            Products
          </NavLink>

          <NavLink to="/admin/colors" className={linkClass}>
            <Palette size={18} />
            Colors
          </NavLink>

          <NavLink to="/admin/orders" className={linkClass}>
            <ShoppingCart size={18} />
            Orders
          </NavLink>

          <NavLink to="/admin/coupons" className={linkClass}>
            <Ticket size={18} />
            Coupons
          </NavLink>

          <NavLink to="/admin/chats" className={linkClass}>
            <MessageSquare size={18} />
            Chat
          </NavLink>

          <NavLink to="/admin/ratings" className={linkClass}>
            <Star size={18} />
            Ratings
          </NavLink>
        </nav>

        {/* Bottom section */}
        <div className="px-4 py-6 border-t space-y-2">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
          >
            <Store size={18} />
            Back to Shop
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>

          <div className="text-sm text-gray-500">Welcome back</div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-10 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-sm p-8 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
