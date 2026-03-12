import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";

import { adminProductApi } from "@/features/admin/api/adminProductApi";
import { adminBrandApi } from "@/features/admin/api/adminBrandApi";

import { useCategoryTree } from "@/hooks/useCategoryTree";

interface ProductRequest {
  name: string;
  description: string;
  categoryId: string;
  brandId: string;
  isActive: boolean;
  thumbnailUrl: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  brandId: string;
  brandName: string;
  categoryId: string;
  categoryName: string;
  isActive: boolean;
  deletedAt?: string | null;
}

interface Brand {
  id: string;
  name: string;
}

const AdminProductsPage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const { leafCategoryOptions } = useCategoryTree();

  const [editingId, setEditingId] = useState<string | null>(null);

  const [filterBrand, setFilterBrand] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const [openModal, setOpenModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState<ProductRequest>({
    name: "",
    description: "",
    categoryId: "",
    brandId: "",
    isActive: false,
    thumbnailUrl: "",
  });

  /* ================= FETCH ================= */

  const fetchProducts = async () => {
    setLoading(true);
    const data = await adminProductApi.getAll();
    setProducts(data);
    setLoading(false);
  };

  const fetchBrands = async () => {
    const data = await adminBrandApi.getAll();
    setBrands(data);
  };

  const handleRestore = async (id: string) => {
    await adminProductApi.restore(id);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
    fetchBrands();
  }, []);

  /* ================= FORM ================= */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);

    setForm({
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      brandId: product.brandId,
      isActive: product.isActive,
      thumbnailUrl: product.thumbnail || "",
    });

    setOpenModal(true);
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      categoryId: "",
      brandId: "",
      isActive: false,
      thumbnailUrl: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return;

    try {
      setCreating(true);

      if (editingId) {
        await adminProductApi.update(editingId, form);
      } else {
        await adminProductApi.create(form);
      }

      resetForm();
      setEditingId(null);
      setOpenModal(false);
      fetchProducts();
    } finally {
      setCreating(false);
    }
  };

  /* ================= ACTIONS ================= */

  const handleDelete = async (id: string) => {
    await adminProductApi.softDelete(id);
    fetchProducts();
  };

  const handleHardDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "This will permanently delete this product. Continue?",
    );

    if (!confirmDelete) return;

    await adminProductApi.hardDelete(id);
    fetchProducts();
  };

  const handleToggleStatus = async (id: string, active: boolean) => {
    await adminProductApi.setStatus(id, !active);
    fetchProducts();
  };

  /* ================= FILTER ================= */

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());

    const matchBrand = filterBrand ? p.brandId === filterBrand : true;

    const matchCategory = filterCategory
      ? p.categoryId === filterCategory
      : true;

    const matchStatus =
      filterStatus === ""
        ? true
        : filterStatus === "active"
          ? p.isActive
          : !p.isActive;

    return matchSearch && matchBrand && matchCategory && matchStatus;
  });

  /* ================= ESC CLOSE ================= */

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenModal(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdownId(null);
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Product Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and control your product catalog
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Total: {products.length}
          </span>

          <button
            onClick={() => setOpenModal(true)}
            className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            + Create Product
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 flex flex-wrap gap-4 items-end">
        {/* Search */}
        <div>
          <label className="block text-xs mb-1 text-gray-500">Search</label>
          <input
            className="border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none px-4 py-2 rounded-lg w-56 transition"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block text-xs mb-1 text-gray-500">Brand</label>
          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="border px-4 py-2 rounded-lg w-48"
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs mb-1 text-gray-500">Category</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border px-4 py-2 rounded-lg w-56"
          >
            <option value="">All Categories</option>
            {leafCategoryOptions.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {"_ ".repeat(cat.level)}
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs mb-1 text-gray-500">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border px-4 py-2 rounded-lg w-40"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-2xl shadow-sm overflow-visible">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
            <tr>
              <th className="text-left px-6 py-4">Image</th>
              <th className="text-left px-6 py-4">Product</th>
              <th className="text-left px-6 py-4">Brand</th>
              <th className="text-left px-6 py-4">Category</th>
              <th className="text-left px-6 py-4">Status</th>
              <th className="text-left px-6 py-4">Edit</th>
              <th className="text-right px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400">
                  Loading products...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400">
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/admin/products/${p.id}`)}
                  className="border-t hover:bg-gray-50 transition cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <img
                      src={p.thumbnail}
                      alt={p.name}
                      className="w-14 h-14 object-cover rounded-lg border"
                    />
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{p.name}</div>
                    <div className="text-xs text-gray-400">{p.slug}</div>
                  </td>

                  <td className="px-6 py-4 text-gray-600">{p.brandName}</td>

                  <td className="px-6 py-4 text-gray-600">{p.categoryName}</td>

                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(p.id, p.isActive);
                      }}
                      className={`px-3 py-1 text-xs font-semibold rounded-full transition ${
                        p.isActive
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(p);
                      }}
                      className="w-full text-left px-4 py-2 bg-amber-200 hover:bg-yellow-100 text-sm border border-amber-300 rounded-lg"
                    >
                      Edit
                    </button>
                  </td>

                  <td className="px-6 py-4 relative">
                    <div className="flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId((prev) =>
                            prev === p.id ? null : p.id,
                          );
                        }}
                        className="px-3 py-1 rounded-lg hover:bg-gray-100 text-lg"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>

                    {openDropdownId === p.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-6 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden"
                      >
                        {/* Edit */}
                        {/* <button
                          onClick={() => {
                            handleEdit(p);
                            setOpenDropdownId(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                        >
                          Edit
                        </button> */}

                        {/* Soft delete / Restore */}
                        {p.deletedAt ? (
                          <button
                            onClick={() => {
                              handleRestore(p.id);
                              setOpenDropdownId(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-green-600"
                          >
                            Restore
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              handleDelete(p.id);
                              setOpenDropdownId(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                          >
                            Soft Delete
                          </button>
                        )}

                        {/* Hard delete */}
                        <button
                          onClick={() => {
                            handleHardDelete(p.id);
                            setOpenDropdownId(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-700 bg-red-100"
                        >
                          Hard Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {openModal && (
        <div
          onClick={() => setOpenModal(false)}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative animate-[fadeIn_.2s_ease-out]"
          >
            <h2 className="text-xl font-semibold mb-6">
              {editingId ? "Update Product" : "Create Product"}
            </h2>

            <div className="space-y-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product name"
                className="w-full border px-4 py-2 rounded-lg"
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                rows={3}
                className="w-full border px-4 py-2 rounded-lg"
              />

              <select
                name="brandId"
                value={form.brandId}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg"
              >
                <option value="">Select brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>

              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg"
              >
                <option value="">Select category</option>
                {leafCategoryOptions.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {"_ ".repeat(cat.level)}
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                type="url"
                name="thumbnailUrl"
                value={form.thumbnailUrl}
                onChange={handleChange}
                placeholder="Thumbnail URL"
                className="w-full border px-4 py-2 rounded-lg"
              />

              {form.thumbnailUrl && (
                <div className="mt-2">
                  <img
                    src={form.thumbnailUrl}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}

              {/* <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                />
                Active
              </label> */}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={creating}
                className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {creating
                  ? editingId
                    ? "Updating..."
                    : "Creating..."
                  : editingId
                    ? "Update"
                    : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
