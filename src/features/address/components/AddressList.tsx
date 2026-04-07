import React from "react";
import { MapPin, Phone, Edit2, Trash2 } from "lucide-react";
import type { CustomerAddress } from "../types/address.types";

interface AddressListProps {
  addresses: CustomerAddress[];
  onEdit: (address: CustomerAddress) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export const AddressList: React.FC<AddressListProps> = ({
  addresses,
  onEdit,
  onDelete,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-32 bg-zinc-50 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="py-24 text-center bg-zinc-50/50 rounded-3xl border border-dashed border-zinc-200">
        <MapPin className="mx-auto text-zinc-300 mb-4" size={48} strokeWidth={1.5} />
        <h3 className="text-zinc-900 font-semibold mb-1">Sổ địa chỉ trống</h3>
        <p className="text-zinc-400 text-sm max-w-[240px] mx-auto">Thêm địa chỉ giao hàng để chúng tôi phục vụ bạn tốt hơn.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {addresses.map((addr) => (
        <div
          key={addr.id}
          className={`group relative p-8 rounded-2xl border transition-all duration-300 ${
            addr.isDefault 
              ? "border-zinc-900 ring-1 ring-zinc-900 bg-white" 
              : "border-zinc-100 bg-white hover:border-zinc-300 shadow-sm hover:shadow-md shadow-zinc-100/50"
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="space-y-6 flex-1">
              {/* Header with Name & Badge */}
              <div className="flex items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-zinc-900 tracking-tight">
                      {addr.receiverName}
                    </h3>
                    {addr.isDefault && (
                      <span className="px-2 py-0.5 bg-zinc-900 text-white text-[9px] font-bold uppercase tracking-widest rounded-full">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
                    <Phone size={14} className="text-zinc-300" />
                    {addr.receiverPhone}
                  </div>
                </div>
              </div>

              {/* Address Detail */}
              <div className="flex gap-3 items-start max-w-xl">
                <MapPin size={18} className="text-zinc-300 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm text-zinc-800 leading-relaxed font-medium">
                    {addr.detailAddress}
                  </p>
                  <p className="text-xs text-zinc-400 font-medium">
                    {addr.ward}, {addr.district}, {addr.province}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(addr)}
                className="p-2.5 bg-zinc-50 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-xl transition-all duration-300"
                title="Chỉnh sửa"
              >
                <Edit2 size={16} />
              </button>
              {!addr.isDefault && (
                <button
                  onClick={() => onDelete(addr.id)}
                  className="p-2.5 bg-zinc-50 hover:bg-rose-500 text-zinc-400 hover:text-white rounded-xl transition-all duration-300"
                  title="Xóa"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
