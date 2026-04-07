import React, { useState, useEffect } from "react";
import { X, Save, MapPin, Phone, User, CheckCircle2 } from "lucide-react";
import type { CreateAddressRequest, CustomerAddress } from "../types/address.types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface AddressFormProps {
  initialData?: CustomerAddress | null;
  onSubmit: (data: CreateAddressRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [form, setForm] = useState<CreateAddressRequest>({
    receiverName: "",
    receiverPhone: "",
    province: "",
    district: "",
    ward: "",
    detailAddress: "",
    isDefault: false,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        receiverName: initialData.receiverName,
        receiverPhone: initialData.receiverPhone,
        province: initialData.province,
        district: initialData.district,
        ward: initialData.ward,
        detailAddress: initialData.detailAddress,
        isDefault: initialData.isDefault,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-zinc-200/50 border border-zinc-100 relative animate-in fade-in zoom-in-95 duration-500">
      <button 
        onClick={onCancel}
        className="absolute top-6 right-6 md:top-10 md:right-10 p-2 hover:bg-zinc-100 rounded-full transition-all duration-300"
      >
        <X size={20} className="text-zinc-400 hover:text-zinc-900" />
      </button>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">
            {initialData ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
          </h2>
          <p className="text-sm text-zinc-500 font-medium">Chúng tôi sẽ giao hàng đến địa chỉ này của bạn.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tên & SĐT */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Người nhận</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
              <Input
                name="receiverName"
                value={form.receiverName}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                className="pl-12 py-7 bg-zinc-50 border-none focus:ring-2 focus:ring-zinc-900/10 focus:bg-white transition-all rounded-2xl text-sm font-semibold"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Số điện thoại</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
              <Input
                name="receiverPhone"
                value={form.receiverPhone}
                onChange={handleChange}
                placeholder="Số điện thoại liên lạc"
                className="pl-12 py-7 bg-zinc-50 border-none focus:ring-2 focus:ring-zinc-900/10 focus:bg-white transition-all rounded-2xl text-sm font-semibold"
                required
              />
            </div>
          </div>

          {/* Tỉnh/Quận/Phường */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Tỉnh / Thành</label>
              <Input
                name="province"
                value={form.province}
                onChange={handleChange}
                placeholder="Ví dụ: Hà Nội"
                className="py-7 bg-zinc-50 border-none focus:ring-2 focus:ring-zinc-900/10 focus:bg-white transition-all rounded-2xl text-sm font-semibold"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Quận / Huyện</label>
              <Input
                name="district"
                value={form.district}
                onChange={handleChange}
                placeholder="Ví dụ: Hoàn Kiếm"
                className="py-7 bg-zinc-50 border-none focus:ring-2 focus:ring-zinc-900/10 focus:bg-white transition-all rounded-2xl text-sm font-semibold"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Phường / Xã</label>
              <Input
                name="ward"
                value={form.ward}
                onChange={handleChange}
                placeholder="Ví dụ: Hàng Bài"
                className="py-7 bg-zinc-50 border-none focus:ring-2 focus:ring-zinc-900/10 focus:bg-white transition-all rounded-2xl text-sm font-semibold"
                required
              />
            </div>
          </div>

          {/* Địa chỉ chi tiết */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Địa chỉ cụ thể</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
              <Input
                name="detailAddress"
                value={form.detailAddress}
                onChange={handleChange}
                placeholder="Số nhà, tên đường, tòa nhà..."
                className="pl-12 py-7 bg-zinc-50 border-none focus:ring-2 focus:ring-zinc-900/10 focus:bg-white transition-all rounded-2xl text-sm font-semibold"
                required
              />
            </div>
          </div>
        </div>

        {/* Mặc định */}
        <div className="flex items-center gap-3 w-fit cursor-pointer group" onClick={() => handleChange({ target: { name: 'isDefault', type: 'checkbox', checked: !form.isDefault } } as any)}>
          <div className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${form.isDefault ? "bg-zinc-900 border-zinc-900" : "border-zinc-200 group-hover:border-zinc-400"}`}>
            {form.isDefault && <CheckCircle2 size={12} className="text-white" strokeWidth={3} />}
          </div>
          <span className="text-sm font-bold text-zinc-700 select-none">Đặt làm địa chỉ mặc định</span>
        </div>

        {/* Nút bấm */}
        <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4 border-t border-zinc-50 md:pt-8">
          <Button
            type="button"
            onClick={onCancel}
            className="flex-1 px-8 py-7 border border-zinc-200 text-zinc-500 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-zinc-50 hover:text-zinc-900 transition-all"
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-[2] bg-zinc-900 text-white py-7 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-zinc-200 hover:bg-zinc-800 transition-all flex items-center justify-center gap-3"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
            {initialData ? "Lưu cập nhật" : "Thêm mới ngay"}
          </Button>
        </div>
      </form>
    </div>
  );
};
