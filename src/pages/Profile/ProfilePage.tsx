import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AuthContext } from "@/features/auth/context/AuthContext";
import { authApi } from "@/features/auth/api/auth.api";
import { addressApi } from "@/features/address/api/address.api";
import type { CustomerAddress, CreateAddressRequest } from "@/features/address/types/address.types";
import { AddressList } from "@/features/address/components/AddressList";
import { AddressForm } from "@/features/address/components/AddressForm";
import { toast } from "sonner";
import { MapPin, User as UserIcon, Lock, Plus } from "lucide-react";

type Gender = "MALE" | "FEMALE" | "OTHER";

const ProfilePage = () => {
  const auth = useContext(AuthContext);
  if (!auth) return <div>Auth context not found</div>;

  const { user, isLoading, updateUser } = auth;

  const [activeTab, setActiveTab] = useState<"info" | "password" | "address">("info");
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);

  /* ================= ADDRESS LOGIC ================= */
  const fetchAddresses = async () => {
    try {
      setAddressLoading(true);
      const data = await addressApi.getAddresses();
      setAddresses(data);
    } catch (error) {
      console.error("Failed to fetch addresses", error);
    } finally {
      setAddressLoading(false);
    }
  };

  useEffect(() => {
    if (user && activeTab === "address") {
      fetchAddresses();
    }
  }, [user, activeTab]);

  const handleCreateOrUpdateAddress = async (data: CreateAddressRequest) => {
    try {
      setAddressLoading(true);
      if (editingAddress) {
        await addressApi.patchAddress(editingAddress.id, data);
        toast.success("Cập nhật địa chỉ thành công");
      } else {
        await addressApi.createAddress(data);
        toast.success("Thêm địa chỉ mới thành công");
      }
      setIsAddingAddress(false);
      setEditingAddress(null);
      fetchAddresses();
    } catch (error) {
      toast.error("Thao tác thất bại");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;
    try {
      setAddressLoading(true);
      await addressApi.deleteAddress(id);
      toast.success("Xóa địa chỉ thành công");
      fetchAddresses();
    } catch (error) {
      toast.error("Xóa thất bại");
    } finally {
      setAddressLoading(false);
    }
  };

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "OTHER" as Gender,
    role: "",
    avatarUrl: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "OTHER",
        role: user.role || "",
        avatarUrl: user.avatarUrl || "",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const updatedUser = await authApi.updateProfile({
        fullName: form.fullName,
        phone: form.phone,
        gender: form.gender,
      });
      updateUser(updatedUser);
      alert("Cập nhật thành công!");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return alert("Mật khẩu xác nhận không khớp");
    }

    try {
      setLoading(true);
      await authApi.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      alert("Đổi mật khẩu thành công!");
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      alert(error?.response?.data?.message || "Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="max-w-6xl mx-auto py-24 text-center text-gray-500">
        Đang tải...
      </div>
    );

  if (!user)
    return (
      <div className="max-w-6xl mx-auto py-24 text-center text-gray-400">
        Bạn chưa đăng nhập
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
        {/* SIDEBAR */}
        <div className="bg-white rounded-3xl shadow-sm p-8 space-y-6">
          <div className="text-center space-y-3">
            <img
              src={
                form.avatarUrl ||
                // `https://ui-avatars.com/api/?name=${form.email}` ||
                form.fullName ? `https://ui-avatars.com/api/?name=${form.fullName}` : `https://ui-avatars.com/api/?name=${form.email}`
              }
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover border mx-auto"
            />
            <div>
              <h2 className="font-semibold">{form.fullName}</h2>
              <span className="text-xs text-gray-500">{form.role}</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setActiveTab("info")}
              className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center gap-3 ${
                activeTab === "info"
                  ? "bg-zinc-900 text-white shadow-xl shadow-zinc-200/50"
                  : "hover:bg-zinc-50 text-zinc-400 hover:text-zinc-900"
              }`}
            >
              <UserIcon size={16} strokeWidth={2.5} /> Thông tin cá nhân
            </button>

            <button
              onClick={() => setActiveTab("address")}
              className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center gap-3 ${
                activeTab === "address"
                  ? "bg-zinc-900 text-white shadow-xl shadow-zinc-200/50"
                  : "hover:bg-zinc-50 text-zinc-400 hover:text-zinc-900"
              }`}
            >
              <MapPin size={16} strokeWidth={2.5} /> Sổ địa chỉ
            </button>

            <button
              onClick={() => setActiveTab("password")}
              className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center gap-3 ${
                activeTab === "password"
                  ? "bg-zinc-900 text-white shadow-xl shadow-zinc-200/50"
                  : "hover:bg-zinc-50 text-zinc-400 hover:text-zinc-900"
              }`}
            >
              <Lock size={16} strokeWidth={2.5} /> Đổi mật khẩu
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="md:col-span-3 bg-white rounded-3xl shadow-sm p-10">
          {activeTab === "info" && (
            <div className="space-y-10">
              <h1 className="text-2xl font-semibold">Thông tin cá nhân</h1>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <Input name="email" value={form.email} disabled />
                </div>

                <div>
                  <label className="text-sm text-gray-500">Họ và tên</label>
                  <Input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-500">Số điện thoại</label>
                  <Input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-500">Giới tính</label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>
              </div>

              <Button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-900"
              >
                {loading ? "Đang cập nhật..." : "Lưu thay đổi"}
              </Button>
            </div>
          )}

          {activeTab === "address" && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex justify-between items-end border-b border-zinc-100 pb-8">
                <div className="space-y-1">
                  <h1 className="text-4xl font-bold tracking-tight text-zinc-900">Sổ địa chỉ</h1>
                  <p className="text-zinc-400 text-sm font-medium">Quản lý không gian giao nhận hàng của bạn</p>
                </div>
                {!isAddingAddress && !editingAddress && (
                  <Button
                    onClick={() => setIsAddingAddress(true)}
                    className="bg-zinc-900 text-white px-8 py-3.5 rounded-2xl hover:bg-zinc-800 transition-all flex items-center gap-3 font-bold text-xs uppercase tracking-widest shadow-2xl shadow-zinc-200/50"
                  >
                    <Plus size={16} strokeWidth={3} /> Thêm địa chỉ mới
                  </Button>
                )}
              </div>

              {(isAddingAddress || editingAddress) ? (
                <AddressForm 
                  initialData={editingAddress}
                  onSubmit={handleCreateOrUpdateAddress}
                  onCancel={() => {
                    setIsAddingAddress(false);
                    setEditingAddress(null);
                  }}
                  loading={addressLoading}
                />
              ) : (
                <AddressList 
                  addresses={addresses}
                  onEdit={setEditingAddress}
                  onDelete={handleDeleteAddress}
                  loading={addressLoading}
                />
              )}
            </div>
          )}

          {activeTab === "password" && (
            <div className="max-w-md space-y-6">
              <h1 className="text-2xl font-semibold">Đổi mật khẩu</h1>

              <Input
                type="password"
                placeholder="Mật khẩu cũ"
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    oldPassword: e.target.value,
                  }))
                }
              />

              <Input
                type="password"
                placeholder="Mật khẩu mới"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
              />

              <Input
                type="password"
                placeholder="Xác nhận mật khẩu mới"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
              />

              <Button
                onClick={handleChangePassword}
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-900"
              >
                {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
