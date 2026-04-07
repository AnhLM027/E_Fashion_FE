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
  Bell,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ROUTES } from "@/config/routes";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isAdmin = user?.role === "ADMIN";

  const routeTitles: Record<string, string> = {
    [ROUTES.ADMIN_DASHBOARD]: "Dashboard",
    [ROUTES.ADMIN_USERS]: "Users",
    [ROUTES.ADMIN_CATEGORIES]: "Categories",
    [ROUTES.ADMIN_BRANDS]: "Brands",
    [ROUTES.ADMIN_PRODUCTS]: "Products",
    [ROUTES.ADMIN_COLORS]: "Colors",
    [ROUTES.ADMIN_ORDERS]: "Orders",
    [ROUTES.ADMIN_COUPONS]: "Coupons",
    [ROUTES.ADMIN_CHATS]: "Chat",
    [ROUTES.ADMIN_REVIEWS]: "Ratings",
  };

  const pageTitle =
    routeTitles[location.pathname] ??
    (isAdmin ? "Admin Panel" : "Store Management");

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
    navigate(ROUTES.HOME);
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

        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {isAdmin && (
            <div className="mb-6">
              {!collapsed && (
                <p className="px-4 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Management
                </p>
              )}
              <MenuItem
                to={ROUTES.ADMIN_DASHBOARD}
                icon={LayoutDashboard}
                label="Dashboard"
                end
              />
              <MenuItem to={ROUTES.ADMIN_USERS} icon={Users} label="Users" />
            </div>
          )}

          <div className="space-y-1">
            {!collapsed && (
              <p className="px-4 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Operations
              </p>
            )}
            <MenuItem
              to={ROUTES.ADMIN_PRODUCTS}
              icon={Package}
              label="Products"
            />
            <MenuItem
              to={ROUTES.ADMIN_ORDERS}
              icon={ShoppingCart}
              label="Orders"
            />
            <MenuItem
              to={ROUTES.ADMIN_CATEGORIES}
              icon={FolderTree}
              label="Categories"
            />
            <MenuItem to={ROUTES.ADMIN_BRANDS} icon={Tag} label="Brands" />
            <MenuItem to={ROUTES.ADMIN_COLORS} icon={Palette} label="Colors" />
            <MenuItem to={ROUTES.ADMIN_COUPONS} icon={Ticket} label="Coupons" />
            <MenuItem
              to={ROUTES.ADMIN_CHATS}
              icon={MessageSquare}
              label="Chats"
            />
            <MenuItem to={ROUTES.ADMIN_REVIEWS} icon={Star} label="Ratings" />
          </div>
        </nav>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">{pageTitle}</h1>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(ROUTES.HOME)}
                className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                title="Back to Store"
              >
                <Store size={18} />
                <span className="hidden sm:inline">Store</span>
              </button>

              <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all relative">
                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white" />
                <Bell size={18} />
              </button>
            </div>

            <div className="w-px h-6 bg-gray-200" />

            <div className="flex items-center gap-3 border-l pl-6">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-gray-900 leading-tight">
                  {user?.fullName}
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                  {user?.role}
                </span>
              </div>
              <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold border-2 border-gray-100 shadow-sm mr-2">
                {user?.fullName?.charAt(0)}
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
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
