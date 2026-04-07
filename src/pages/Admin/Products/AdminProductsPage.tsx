import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, MoreVertical, Edit2, Trash2, RotateCcw, Eye } from "lucide-react";
import { adminProductApi } from "@/features/admin/api/adminProductApi";
import { adminBrandApi } from "@/features/admin/api/adminBrandApi";
import { useCategoryTree } from "@/hooks/useCategoryTree";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

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
  const { allCategoryOptions } = useCategoryTree();

  const [loading, setLoading] = useState(false);

  // Filters State
  const [search, setSearch] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<ProductRequest>({
    name: "",
    description: "",
    categoryId: "",
    brandId: "",
    isActive: true,
    thumbnailUrl: "",
  });

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // Fetch all products for local filtering
      const [productRes, brandRes] = await Promise.all([
        adminProductApi.getAll(),
        adminBrandApi.getAll()
      ]);
      setProducts(Array.isArray(productRes) ? productRes : []);
      setBrands(Array.isArray(brandRes) ? brandRes : []);
    } catch (error) {
      console.error("Failed to fetch initial data", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // FRONTEND ONLY FILTERING LOGIC
  // This ensures lightning fast updates and avoids backend parameter mismatches
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Search Keyword (Name or slug)
      const matchesSearch = !search.trim() || 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.slug?.toLowerCase().includes(search.toLowerCase());

      // 2. Brand
      const matchesBrand = !filterBrand || p.brandId === filterBrand;

      // 3. Category
      const matchesCategory = !filterCategory || p.categoryId === filterCategory;

      // 4. Status
      const statusValue = filterStatus === "active" ? true : filterStatus === "inactive" ? false : null;
      const matchesStatus = statusValue === null || p.isActive === statusValue;

      return matchesSearch && matchesBrand && matchesCategory && matchesStatus;
    });
  }, [products, search, filterBrand, filterCategory, filterStatus]);

  const handleToggleStatus = async (id: string, currentActive: boolean) => {
    try {
      // Optimistic update
      setProducts(prev => prev.map(p => p.id === id ? { ...p, isActive: !currentActive } : p));
      await adminProductApi.setStatus(id, !currentActive);
      toast.success("Status updated");
    } catch (error) {
      // Rollback on error
      setProducts(prev => prev.map(p => p.id === id ? { ...p, isActive: currentActive } : p));
      toast.error("Failed to update status");
    }
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

  const handleDelete = async (id: string) => {
    if (!window.confirm("Move to trash?")) return;
    try {
      await adminProductApi.softDelete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success("Product moved to trash");
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleHardDelete = async (id: string) => {
    if (!window.confirm("PERMANENT DELETE?")) return;
    try {
      await adminProductApi.hardDelete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success("Deleted permanently");
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    try {
      setCreating(true);
      if (editingId) {
        await adminProductApi.update(editingId, form);
        toast.success("Updated successfully");
      } else {
        await adminProductApi.create(form);
        toast.success("Created successfully");
      }
      setOpenModal(false);
      setEditingId(null);
      fetchInitialData(); // Refresh list after create/update
    } catch (error) {
      toast.error("Operation failed");
    } finally {
      setCreating(false);
    }
  };

  const columns = useMemo<Column<Product>[]>(() => [
    {
      key: "thumbnail",
      header: "Image",
      render: (p) => (
        <div className="relative group">
          <img
            src={p.thumbnail}
            alt={p.name}
            className="w-12 h-12 object-cover rounded-xl border border-zinc-100 group-hover:border-zinc-900 transition-all duration-300"
          />
        </div>
      )
    },
    {
      key: "name",
      header: "Product Detail",
      render: (p) => (
        <div className="flex flex-col max-w-[220px]">
          <span className="font-bold text-zinc-900 truncate text-[13px]">{p.name}</span>
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{p.categoryName}</span>
        </div>
      )
    },
    {
      key: "brandName",
      header: "Brand",
      render: (p) => <span className="px-2.5 py-1 bg-zinc-100 rounded-lg text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{p.brandName}</span>
    },
    {
      key: "isActive",
      header: "Status",
      render: (p) => (
        <div 
          onClick={(e) => {
            e.stopPropagation();
            handleToggleStatus(p.id, p.isActive);
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all ${
            p.isActive 
              ? "bg-green-50 text-green-700 hover:bg-green-100" 
              : "bg-rose-50 text-rose-600 hover:bg-rose-100"
          }`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${p.isActive ? "bg-green-500" : "bg-rose-500"}`} />
          {p.isActive ? "Active" : "Inactive"}
        </div>
      )
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (p) => (
        <div className="flex items-center justify-end gap-1">
          <button 
            onClick={(e) => { e.stopPropagation(); navigate(`/admin/products/${p.id}`); }}
            className="p-2 hover:bg-zinc-100 rounded-lg transition text-zinc-400 hover:text-zinc-900" 
          >
            <Eye size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleEdit(p); }}
            className="p-2 hover:bg-zinc-100 rounded-lg transition text-zinc-400 hover:text-zinc-900" 
          >
            <Edit2 size={16} />
          </button>
          
          <div className="group relative">
            <button className="p-2 hover:bg-zinc-100 rounded-lg transition text-zinc-400">
              <MoreVertical size={16} />
            </button>
            <div className="absolute right-0 top-full mt-1 w-44 bg-white shadow-2xl rounded-xl border border-zinc-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
               {p.deletedAt ? (
                 <button onClick={(e) => { e.stopPropagation(); }} className="w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-green-600 hover:bg-green-50 flex items-center gap-2">
                   <RotateCcw size={14} /> Restore
                 </button>
               ) : (
                 <button onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }} className="w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:bg-zinc-50 flex items-center gap-2">
                   <Trash2 size={14} /> Soft Delete
                 </button>
               )}
               <button onClick={(e) => { e.stopPropagation(); handleHardDelete(p.id); }} className="w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-rose-600 hover:bg-rose-50 border-t border-zinc-100 flex items-center gap-2">
                 <Trash2 size={14} /> Permanent Delete
               </button>
            </div>
          </div>
        </div>
      )
    }
  ], [navigate, handleToggleStatus]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Products Catalog</h1>
          <p className="text-sm text-zinc-500 font-medium">Manage and monitor all your collection items</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setEditingId(null);
            setForm({ name: "", description: "", categoryId: "", brandId: "", isActive: true, thumbnailUrl: "" });
            setOpenModal(true);
          }}
          className="px-6 py-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
        >
          <Plus size={16} /> Add Product
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="relative group flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={16} />
          <Input
            placeholder="Search by name or slug..."
            className="pl-10 pr-4 py-2.5 bg-zinc-50 border-zinc-100 focus:bg-white focus:border-zinc-300 transition-all rounded-lg text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 bg-zinc-50 p-1.5 rounded-xl border border-zinc-200">
          <select value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)} className="bg-transparent border-none text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 focus:ring-0 cursor-pointer">
            <option value="">All Brands</option>
            {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <div className="w-px h-4 bg-zinc-200" />
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-transparent border-none text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 focus:ring-0 cursor-pointer max-w-[140px]">
            <option value="">Categories</option>
            {allCategoryOptions.map((cat) => (
              <option key={cat.id} value={cat.id}>{"- ".repeat(cat.level)}{cat.name}</option>
            ))}
          </select>
          <div className="w-px h-4 bg-zinc-200" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-transparent border-none text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 focus:ring-0 cursor-pointer">
            <option value="">Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <DataTable 
        data={filteredProducts}
        columns={columns}
        loading={loading}
        onRowClick={(p) => navigate(`/admin/products/${p.id}`)}
        emptyMessage={
          <div className="py-10 flex flex-col items-center gap-3">
             <div className="text-zinc-300"><Search size={48} /></div>
             <p className="text-zinc-500 font-medium">No results found for your criteria</p>
             <Button variant="ghost" onClick={() => { setSearch(""); setFilterBrand(""); setFilterCategory(""); setFilterStatus(""); }} className="text-blue-600 text-[10px] font-bold uppercase tracking-widest underline">Clear all Filters</Button>
          </div>
        }
      />

      {openModal && (
        <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-8 relative overflow-y-auto max-h-[96vh] animate-in zoom-in-95 duration-200 border border-zinc-200 focus:outline-none">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-widest tracking-[0.15em]">
                {editingId ? "Update Product" : "New Collection Item"}
                </h2>
                <button onClick={() => setOpenModal(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                    <Trash2 size={20} className="rotate-45" />
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Product Title</label>
                  <Input name="name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="bg-zinc-50 border-zinc-100 rounded-xl py-6 font-medium" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Global Class</label>
                    <select value={form.categoryId} onChange={(e) => setForm({...form, categoryId: e.target.value})} className="w-full bg-zinc-50 border-none rounded-xl px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-zinc-900 cursor-pointer">
                      <option value="">Category</option>
                      {allCategoryOptions.map(cat => <option key={cat.id} value={cat.id}>{"- ".repeat(cat.level)}{cat.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">House Label</label>
                    <select value={form.brandId} onChange={(e) => setForm({...form, brandId: e.target.value})} className="w-full bg-zinc-50 border-none rounded-xl px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-zinc-900 cursor-pointer">
                      <option value="">Brand</option>
                      {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Asset Reference URL</label>
                    <Input value={form.thumbnailUrl} onChange={(e) => setForm({...form, thumbnailUrl: e.target.value})} className="bg-zinc-50 border-zinc-100 rounded-xl py-6 text-[11px]" />
                </div>
              </div>
              <div className="space-y-6">
                 <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1 text-center">Visual Prototype</div>
                 <div className="aspect-square bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200 flex items-center justify-center overflow-hidden">
                    {form.thumbnailUrl ? (
                      <img src={form.thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Plus size={32} className="text-zinc-200" />
                    )}
                 </div>
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Item Narrative</label>
                <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={4} className="w-full bg-zinc-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-zinc-900 min-h-[120px]" />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-10">
               <Button variant="outline" onClick={() => setOpenModal(false)} className="px-8 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Abort</Button>
               <Button variant="primary" onClick={handleSubmit} disabled={creating} className="px-10 text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-zinc-100">
                 {creating ? "Saving..." : editingId ? "Update Item" : "Publish Item"}
               </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
