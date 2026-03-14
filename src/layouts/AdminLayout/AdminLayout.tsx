import { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const location = useLocation();

  const routeTitles: Record<string, string> = {
    "/admin": "Dashboard",
    "/admin/users": "Users",
    "/admin/categories": "Categories",
    "/admin/brands": "Brands",
    "/admin/products": "Products",
    "/admin/colors": "Colors",
    "/admin/orders": "Orders",
    "/admin/coupons": "Coupons",
    "/admin/chats": "Chat",
    "/admin/ratings": "Ratings",
  };

  const pageTitle = routeTitles[location.pathname] ?? "Admin Panel";

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center ${
      collapsed ? "justify-center" : "gap-3"
    } px-4 py-3 rounded-xl text-sm font-medium transition
     ${
       isActive
         ? "bg-black text-white shadow-md"
         : "text-gray-600 hover:bg-gray-100"
     }`;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const MenuItem = ({
    to,
    icon: Icon,
    label,
    end,
  }: {
    to: string;
    icon: any;
    label: string;
    end?: boolean;
  }) => (
    <NavLink to={to} end={end} className={linkClass}>
      <Icon size={18} />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">
      {/* SIDEBAR */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-white border-r shadow-sm flex flex-col transition-all duration-300`}
      >
        {/* Logo + Toggle */}
        <div className="relative px-6 py-6 border-b flex items-center justify-between">
          {!collapsed && (
            <div>
              <div className="text-xl font-bold">E-Fashion</div>
              <p className="text-xs text-gray-500">Admin Dashboard</p>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          <MenuItem to="/admin" icon={LayoutDashboard} label="Dashboard" end />
          <MenuItem to="/admin/users" icon={Users} label="Users" />
          <MenuItem
            to="/admin/categories"
            icon={FolderTree}
            label="Categories"
          />
          <MenuItem to="/admin/brands" icon={Tag} label="Brands" />
          <MenuItem to="/admin/products" icon={Package} label="Products" />
          <MenuItem to="/admin/colors" icon={Palette} label="Colors" />
          <MenuItem to="/admin/orders" icon={ShoppingCart} label="Orders" />
          <MenuItem to="/admin/coupons" icon={Ticket} label="Coupons" />
          <MenuItem to="/admin/chats" icon={MessageSquare} label="Chats" />
          <MenuItem to="/admin/ratings" icon={Star} label="Ratings" />
        </nav>

        {/* Bottom */}
        <div className="px-3 py-6 border-t space-y-2">
          <button
            onClick={() => navigate("/")}
            className={`flex items-center ${
              collapsed ? "justify-center" : "gap-3"
            } w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition`}
          >
            <Store size={18} />
            {!collapsed && "Back to Shop"}
          </button>

          <button
            onClick={handleLogout}
            className={`flex items-center ${
              collapsed ? "justify-center" : "gap-3"
            } w-full px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition`}
          >
            <LogOut size={18} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">{pageTitle}</h1>

          <div className="text-sm text-gray-500">Welcome back</div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto">
          <div className="bg-white shadow-sm p-6 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
