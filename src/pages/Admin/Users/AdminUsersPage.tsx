import { useEffect, useState, useMemo } from "react";
import {
  adminUserApi,
  type AdminUser,
} from "@/features/admin/api/adminUserApi";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { logout } from "@/features/auth/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { Search, Shield, User, MoreVertical } from "lucide-react";
import { formatDate } from "@/utils/format";

const AdminUsersPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminUserApi.getUsers({
        search: search || undefined,
        role: roleFilter || undefined,
        active: activeFilter === "" ? undefined : activeFilter === "true",
        page,
        size: 10,
      });
      setUsers(res.content);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter, activeFilter]);

  const toggleActive = async (user: AdminUser) => {
    try {
      if (user.isActive) {
        await adminUserApi.deactivate(user.id);
      } else {
        await adminUserApi.activate(user.id);
      }
      fetchUsers();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const updateRole = async (
    user: AdminUser,
    newRole: "ADMIN" | "STAFF" | "CUSTOMER",
  ) => {
    if (user.role === newRole) return;
    const confirmChange = window.confirm(
      `Are you sure you want to change ${user.email}'s role from ${user.role} → ${newRole}?`,
    );
    if (!confirmChange) {
      fetchUsers();
      return;
    }
    try {
      await adminUserApi.update(user.id, { role: newRole });
      if (currentUser?.email === user.email && newRole === "CUSTOMER") {
        dispatch(logout());
        navigate("/", { replace: true });
        return;
      }
      fetchUsers();
    } catch (error) {
      console.error("Failed to update role", error);
      fetchUsers();
    }
  };

  const columns = useMemo<Column<AdminUser>[]>(() => [
    {
      key: "email",
      header: "User Account",
      render: (u) => (
        <div className="flex flex-col">
          <span className="font-medium text-zinc-900">{u.fullName || "N/A"}</span>
          <span className="text-xs text-zinc-400">{u.email}</span>
        </div>
      )
    },
    {
      key: "phone",
      header: "Phone Number",
      render: (u) => <span className="text-zinc-500">{u.phone || "—"}</span>
    },
    {
      key: "role",
      header: "Role",
      render: (u) => (
        <div className="flex items-center gap-2">
          {u.role === "ADMIN" ? (
            <Shield size={14} className="text-indigo-500" />
          ) : u.role === "STAFF" ? (
            <Shield size={14} className="text-emerald-500" />
          ) : (
            <User size={14} className="text-zinc-400" />
          )}
          <select
            value={u.role}
            onChange={(e) =>
              updateRole(
                u,
                e.target.value as "ADMIN" | "STAFF" | "CUSTOMER",
              )
            }
            className="bg-transparent border-none text-xs font-medium focus:ring-0 cursor-pointer hover:underline p-0"
          >
            <option value="ADMIN">Administrator</option>
            <option value="STAFF">Staff Member</option>
            <option value="CUSTOMER">Customer</option>
          </select>
        </div>
      )
    },
    {
      key: "isActive",
      header: "Status",
      render: (u) => (
        <div 
          onClick={() => toggleActive(u)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium cursor-pointer transition-all ${
            u.isActive 
              ? "bg-green-50 text-green-700 hover:bg-green-100" 
              : "bg-rose-50 text-rose-600 hover:bg-rose-100"
          }`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${u.isActive ? "bg-green-500" : "bg-rose-500 animate-pulse"}`} />
          {u.isActive ? "Active" : "Locked"}
        </div>
      )
    },
    {
      key: "createdAt",
      header: "Join Date",
      render: (u) => <span className="text-[11px] text-zinc-400">{formatDate(u.createdAt)}</span>
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: () => (
        <button className="p-2 hover:bg-zinc-100 rounded-lg transition text-zinc-400 hover:text-zinc-900">
          <MoreVertical size={16} />
        </button>
      )
    }
  ], [currentUser, users]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Users</h1>
          <p className="text-sm text-zinc-500">Manage administrative and customer accounts</p>
        </div>
        
        {/* FILTERS */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
            <input
              placeholder="Search by email..."
              className="pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm w-64 focus:bg-white focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all"
              value={search}
              onChange={(e) => {
                setPage(0);
                setSearch(e.target.value);
              }}
            />
          </div>

          <div className="flex items-center gap-2 bg-zinc-50 p-1 rounded-lg border border-zinc-200">
            <select
              className="bg-transparent border-none text-xs font-semibold px-3 py-1.5 focus:ring-0 cursor-pointer"
               value={roleFilter}
              onChange={(e) => {
                setPage(0);
                setRoleFilter(e.target.value);
              }}
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Administrator</option>
              <option value="STAFF">Staff</option>
              <option value="CUSTOMER">Customer</option>
            </select>
            
            <div className="w-px h-4 bg-zinc-200" />

            <select
              className="bg-transparent border-none text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 focus:ring-0 cursor-pointer"
               value={activeFilter}
              onChange={(e) => {
                setPage(0);
                setActiveFilter(e.target.value);
              }}
            >
              <option value="">All Status</option>
              <option value="true">Active Only</option>
              <option value="false">Locked Only</option>
            </select>
          </div>
        </div>
      </div>

      <DataTable 
        data={users}
        columns={columns}
        loading={loading}
        emptyMessage="No users matching your criteria"
      />

      <Pagination 
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default AdminUsersPage;

