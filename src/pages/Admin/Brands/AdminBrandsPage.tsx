import { useEffect, useState } from "react";
import { adminBrandApi } from "@/features/admin/api/adminBrandApi";
import { Plus, Trash2, Search, Pencil, Copy } from "lucide-react";

interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);

  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    logoUrl: "",
  });

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await adminBrandApi.getAll();
      setBrands(res);
      setFilteredBrands(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    const result = brands.filter((b) =>
      b.name.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredBrands(result);
  }, [search, brands]);

  const handleSubmit = async () => {
    if (!form.name.trim()) return;

    if (editingBrand) {
      // UPDATE
      await adminBrandApi.update(editingBrand.id, {
        name: form.name,
        logoUrl: form.logoUrl || null,
      });
    } else {
      // CREATE
      await adminBrandApi.create({
        name: form.name,
        logoUrl: form.logoUrl || null,
      });
    }

    setForm({ name: "", logoUrl: "" });
    setEditingBrand(null);
    setIsOpen(false);
    fetchBrands();
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setForm({
      name: brand.name,
      logoUrl: brand.logoUrl || "",
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this brand?")) return;
    await adminBrandApi.delete(id);
    fetchBrands();
  };

  const handleCopyId = async (id: string) => {
    await navigator.clipboard.writeText(id);
    alert("Copied category ID!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Brands</h1>
            <p className="text-gray-500 mt-2 text-sm">
              Manage and organize your product brands
            </p>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition shadow"
          >
            <Plus size={18} />
            Add Brand
          </button>
        </div>

        {/* SEARCH */}
        <div className="mb-8 relative">
          <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search brands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-10 py-3 shadow-sm focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>

        {/* GRID */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-white rounded-2xl animate-pulse border border-gray-200"
              />
            ))}
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-400">
            No brands found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBrands.map((brand) => (
              <div
                key={brand.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition group"
              >
                <div className="h-24 flex items-center justify-center bg-gray-50 rounded-xl mb-5">
                  <img
                    src={
                      brand.logoUrl ||
                      "https://via.placeholder.com/120x80?text=No+Logo"
                    }
                    alt={brand.name}
                    className="max-h-16 object-contain"
                  />
                </div>

                <div className="text-center">
                  <div className="font-semibold text-gray-800">
                    {brand.name}
                  </div>

                  <div className="text-xs text-gray-400 mt-1">{brand.slug}</div>

                  {/* BRAND ID */}
                  <div className="flex items-center justify-center gap-2 mt-2 bg-gray-50 px-2 py-1 rounded-md w-fit mx-auto">
                    <span className="text-xs text-gray-500 font-mono">
                      {brand.id.slice(0, 8)}...
                    </span>

                    <button
                      onClick={() => handleCopyId(brand.id)}
                      className="text-gray-500 hover:text-black transition"
                      title="Copy ID"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                </div>

                <div className="mt-5 flex justify-center gap-4">
                  <button
                    onClick={() => handleEdit(brand)}
                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-blue-500 transition opacity-0 group-hover:opacity-100"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(brand.id)}
                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-120 rounded-2xl shadow-2xl p-8 animate-fadeIn">
            <h2 className="text-xl font-bold mb-6">
              {editingBrand ? "Update Brand" : "Create New Brand"}
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Brand name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black"
              />

              <input
                type="text"
                placeholder="Logo URL"
                value={form.logoUrl}
                onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black"
              />

              {form.logoUrl && (
                <div className="flex justify-center pt-2">
                  <img
                    src={form.logoUrl}
                    alt="preview"
                    className="h-20 object-contain"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setEditingBrand(null);
                  setForm({ name: "", logoUrl: "" });
                }}
                className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition shadow"
              >
                {editingBrand ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
