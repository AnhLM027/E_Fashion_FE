import { useEffect, useState } from "react";
import { adminCategoryApi } from "@/features/admin/api/adminCategoryApi";
import { ChevronDown, ChevronRight, Plus, Copy } from "lucide-react";
import { type Category, useCategoryTree } from "@/hooks/useCategoryTree";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function AdminCategoriesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const { categories, allCategoryOptions, refresh } = useCategoryTree();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    parentId: "",
    imageUrl: "",
    isActive: true,
  });

  /* ================= SEARCH ================= */

  const filterTree = (nodes: Category[]): Category[] => {
    return nodes
      .map((node) => {
        const matched = node.name.toLowerCase().includes(search.toLowerCase());

        const filteredChildren = filterTree(node.children || []);

        if (matched || filteredChildren.length > 0) {
          return { ...node, children: filteredChildren };
        }

        return null;
      })
      .filter(Boolean) as Category[];
  };

  useEffect(() => {
    if (!search) setFilteredCategories(categories);
    else setFilteredCategories(filterTree(categories));
  }, [search, categories]);

  /* ================= CRUD ================= */

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      parentId: category.parentId || "",
      imageUrl: category.imageUrl || "",
      isActive: category.isActive,
    });
    // console.log("Editing category:", category);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await adminCategoryApi.delete(id);
    refresh();
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      name: "",
      parentId: "",
      imageUrl: "",
      isActive: true,
    });
    setIsOpen(true);
  };

  const openCreateChildModal = (parent: Category) => {
    setEditingId(null);
    setForm({
      name: "",
      parentId: parent.id,
      imageUrl: "",
      isActive: true,
    });

    setExpanded((prev) => ({
      ...prev,
      [parent.id]: true,
    }));

    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingId(null);
    setForm({
      name: "",
      parentId: "",
      imageUrl: "",
      isActive: true,
    });
  };

  const handleCopyId = async (id: string) => {
    await navigator.clipboard.writeText(id);
    alert("Copied category ID!");
  };

  /* ================= EXPAND ================= */

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  /* ================= RENDER TREE ================= */

  const renderTree = (nodes: Category[], level = 0) => {
    return nodes.map((category) => {
      const hasChildren = category.children?.length > 0;
      const isExpanded = expanded[category.id];

      return (
        <div key={category.id}>
          <div
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition group"
            style={{ paddingLeft: `${level * 32 + 24}px` }}
          >
            <div className="flex items-center gap-4">
              {hasChildren && (
                <button onClick={() => toggleExpand(category.id)}>
                  {isExpanded ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </button>
              )}

              {!hasChildren && <div className="w-4.5" />}

              <img
                src={
                  category.imageUrl ||
                  "http://localhost:5173/src/assets/images/favicon.png"
                }
                alt={category.name}
                className="w-12 h-12 rounded-lg object-cover"
              />

              <div>
                <div className="font-semibold text-gray-800">
                  {category.name}
                </div>

                <div className="text-xs text-gray-400">{category.slug}</div>

                {/* CATEGORY ID */}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400 font-mono">
                    {category.id}
                  </span>

                  <button
                    onClick={() => handleCopyId(category.id)}
                    className="p-1 rounded hover:bg-gray-200 transition"
                    title="Copy ID"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>

              <span
                className={`ml-3 text-xs px-2 py-1 rounded-full ${
                  category.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {category.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {isAdmin && (
              <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => openCreateChildModal(category)}
                  className="p-2 rounded-lg bg-green-50 text-green-800 hover:bg-green-100 transition"
                >
                  <Plus size={16} />
                </button>

                <button
                  onClick={() => handleEdit(category)}
                  className="px-3 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-medium"
                >
                  Update
                </button>

                <button
                  onClick={() => handleDelete(category.id)}
                  className="px-3 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {hasChildren &&
            isExpanded &&
            renderTree(category.children, level + 1)}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-500 text-sm mt-1">
              Organize your product catalog structure
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition shadow"
            >
              <Plus size={18} />
              Add Category
            </button>
          )}
        </div>

        {/* SEARCH */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>

        {/* TREE */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredCategories.length > 0 ? (
            renderTree(filteredCategories)
          ) : (
            <div className="p-10 text-center text-gray-400">
              No categories found
            </div>
          )}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-125 rounded-2xl shadow-2xl p-8">
            <h2 className="text-xl font-bold mb-6">
              {editingId ? "Update Category" : "Create New Category"}
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Category name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black"
              />
              
              <select
                value={form.parentId}
                onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black"
              >
                <option value="">No Parent (Root)</option>

                {allCategoryOptions.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {"_ ".repeat(cat.level)}
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Image URL"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black"
              />

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                />
                <label className="text-gray-700 font-medium">Active</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={closeModal}
                className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  if (!form.name.trim()) return;

                  if (editingId) {
                    await adminCategoryApi.update(editingId, {
                      name: form.name,
                      imageUrl: form.imageUrl || null,
                      parentId: form.parentId || null,
                      isActive: form.isActive,
                    });
                  } else {
                    await adminCategoryApi.create({
                      name: form.name,
                      imageUrl: form.imageUrl || null,
                      parentId: form.parentId || null,
                      isActive: form.isActive,
                    });
                  }

                  closeModal();
                  refresh();
                }}
                className="px-6 py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition shadow"
              >
                {editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
