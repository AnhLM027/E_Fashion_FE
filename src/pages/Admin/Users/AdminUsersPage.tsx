import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminUserApi,
  type AdminUser,
} from "@/features/admin/api/adminUserApi";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { logout } from "@/features/auth/slices/authSlice";

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

  /* ================= FETCH ================= */

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

  /* ================= ACTION ================= */

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

  const updateRole = async (user: AdminUser, newRole: "ADMIN" | "CUSTOMER") => {
    if (user.role === newRole) return;

    const confirmChange = window.confirm(
      `Bạn có chắc muốn đổi role của ${user.email} từ ${user.role} → ${newRole}?`,
    );

    if (!confirmChange) {
      fetchUsers();
      return;
    }

    try {
      await adminUserApi.update(user.id, {
        role: newRole,
      });

      console.log("BUG", currentUser, newRole)

      // 🔥 Nếu admin tự hạ role của chính mình
      if (currentUser?.email === user.email && newRole === "CUSTOMER") {
        // Logout hoàn toàn
        dispatch(logout());

        console.log(newRole)
        navigate("/", { replace: true });
        return;
      }

      fetchUsers();
    } catch (error) {
      console.error("Failed to update role", error);
      fetchUsers();
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-8 space-y-6 bg-neutral-50 min-h-screen">
      <h1 className="text-2xl font-bold">Users</h1>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4">
        <input
          placeholder="Search by email..."
          className="border px-3 py-2 rounded-lg"
          value={search}
          onChange={(e) => {
            setPage(0);
            setSearch(e.target.value);
          }}
        />

        <select
          className="border px-3 py-2 rounded-lg"
          value={roleFilter}
          onChange={(e) => {
            setPage(0);
            setRoleFilter(e.target.value);
          }}
        >
          <option value="">All Roles</option>
          <option value="ADMIN">ADMIN</option>
          <option value="CUSTOMER">CUSTOMER</option>
        </select>

        <select
          className="border px-3 py-2 rounded-lg"
          value={activeFilter}
          onChange={(e) => {
            setPage(0);
            setActiveFilter(e.target.value);
          }}
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center text-neutral-500">No users found</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-neutral-100 text-left">
              <tr>
                <th className="p-4">Email</th>
                <th className="p-4">Name</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Gender</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-t hover:bg-neutral-50 transition"
                >
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">{u.fullName || "-"}</td>
                  <td className="p-4">{u.phone || "-"}</td>
                  <td className="p-4">{u.gender || "-"}</td>

                  {/* UPDATE ROLE DROPDOWN */}
                  <td className="p-4">
                    <select
                      value={u.role}
                      onChange={(e) =>
                        updateRole(u, e.target.value as "ADMIN" | "CUSTOMER")
                      }
                      className="border rounded px-2 py-1 text-xs"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="CUSTOMER">CUSTOMER</option>
                    </select>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        u.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="p-4">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-4 text-right space-x-3">
                    <button
                      onClick={() => toggleActive(u)}
                      className="text-sm underline"
                    >
                      {u.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-30"
        >
          Previous
        </button>

        <span>
          Page {page + 1} / {totalPages}
        </span>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-30"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminUsersPage;
