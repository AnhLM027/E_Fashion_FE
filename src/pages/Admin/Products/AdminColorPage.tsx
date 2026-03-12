import { useEffect, useState } from "react";
import { adminColorApi } from "@/features/admin/api/adminColorApi";

import { Copy } from "lucide-react";

interface Color {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
}

const AdminColorsPage = () => {
  const [colors, setColors] = useState<Color[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    code: "#000000",
    isActive: true,
  });

  const fetchColors = async () => {
    const res = await adminColorApi.getAll();
    setColors(res.data ?? res);
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const handleSubmit = async () => {
    if (!form.name.trim()) return;

    if (editingId) {
      await adminColorApi.update(editingId, form);
    } else {
      await adminColorApi.create(form);
    }

    setOpenModal(false);
    setEditingId(null);
    setForm({ name: "", code: "#000000", isActive: true });
    fetchColors();
  };

  const handleEdit = (color: Color) => {
    setEditingId(color.id);
    setForm({
      name: color.name,
      code: color.code,
      isActive: color.isActive,
    });
    setOpenModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this color?")) return;
    await adminColorApi.delete(id);
    fetchColors();
  };

  const handleCopyId = async (id: string) => {
    await navigator.clipboard.writeText(id);
    alert("Copied category ID!");
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">Color Management</h1>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-black text-white px-5 py-2 rounded-lg"
        >
          + Create Color
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 text-left">Preview</th>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Code</th>
              <th className="px-6 py-4 text-left">ID</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {colors.map((color) => (
              <tr key={color.id} className="border-t">
                <td className="px-6 py-4">
                  <div
                    className="w-8 h-8 rounded-full border"
                    style={{ backgroundColor: color.code }}
                  />
                </td>

                <td className="px-6 py-4">{color.name}</td>
                <td className="px-6 py-4">{color.code}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-md w-fit">
                    <span className="text-xs text-gray-500 font-mono">
                      {color.id.slice(0, 8)}...
                    </span>

                    <button
                      onClick={() => handleCopyId(color.id)}
                      className="text-gray-500 hover:text-black transition"
                      title="Copy ID"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </td>

                <td className="px-6 py-4">
                  {color.isActive ? (
                    <span className="text-green-600 text-xs font-semibold">
                      Active
                    </span>
                  ) : (
                    <span className="text-red-600 text-xs font-semibold">
                      Inactive
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(color)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(color.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">
            <h3 className="text-lg font-semibold">
              {editingId ? "Update Color" : "Create Color"}
            </h3>

            <input
              className="w-full border p-2 rounded"
              placeholder="Color name"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
            />

            <input
              type="color"
              value={form.code}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, code: e.target.value }))
              }
              className="w-full h-10 border rounded"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-black text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminColorsPage;
