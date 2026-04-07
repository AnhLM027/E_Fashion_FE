import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminProductApi } from "@/features/admin/api/adminProductApi";
import { adminVariantApi } from "@/features/admin/api/adminVariantApi";
import { adminVariantSizeApi } from "@/features/admin/api/adminVariantSizeApi";
import { adminImageApi } from "@/features/admin/api/adminVariantImageApi";
import { adminColorApi } from "@/features/admin/api/adminColorApi";
import { ArrowLeft, Plus, Edit2, Trash2, Check, X, ImageIcon, Maximize2 } from "lucide-react";
import { formatNumber, parseFormattedNumber } from "@/utils/format";

/* ================= TYPES ================= */

export interface ColorResponseDTO {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  productName: string;
  colorId: string;
  colorName: string;
  colorCode: string;
  isActive: boolean;
}

export interface ProductVariantSize {
  id: string;
  productVariantId: string;
  sizeName: string;
  sku: string;
  originalPrice: number;
  salePrice: number;
  stock: number;
  reservedStock: number;
  isActive: boolean;
}

export interface VariantImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

/* ================= COMPONENT ================= */

const AdminProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [sizes, setSizes] = useState<ProductVariantSize[]>([]);
  const [images, setImages] = useState<Record<string, VariantImage[]>>({});
  const [colors, setColors] = useState<ColorResponseDTO[]>([]);

  const [loading, setLoading] = useState(true);

  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [selectedVariantForImage, setSelectedVariantForImage] = useState<string | null>(null);
  const [selectedVariantForSize, setSelectedVariantForSize] = useState<string | null>(null);

  const [editingSizeId, setEditingSizeId] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSizeOpen, setIsSizeOpen] = useState(false);

  const [newImageUrl, setNewImageUrl] = useState("");

  const [form, setForm] = useState({
    colorId: "",
    isActive: true,
  });

  const [sizeForm, setSizeForm] = useState({
    sizeName: "",
    sku: "",
    originalPrice: "",
    salePrice: "",
    stock: "",
  });

  const [productInfo, setProductInfo] = useState({
    name: "",
    description: "",
    thumbnail: "",
    brandName: "",
    categoryName: "",
  });

  /* ================= FETCH ================= */

  const fetchData = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const [productRes, variantRes, colorRes] = await Promise.all([
        adminProductApi.getById(id),
        adminVariantApi.getByProduct(id),
        adminColorApi.getAll(),
      ]);

      const product = productRes.data ?? productRes;

      setProductInfo({
        name: product.name,
        description: product.description || "",
        thumbnail: product.thumbnail || "",
        brandName: product.brandName || "",
        categoryName: product.categoryName || "",
      });

      const variantList = variantRes.data ?? variantRes;
      setVariants(variantList);

      setColors((colorRes.data ?? colorRes).filter((c: any) => c.isActive));

      const sizeList: ProductVariantSize[] = [];
      const imageMap: Record<string, VariantImage[]> = {};

      for (const v of variantList) {
        const sizeRes = await adminVariantSizeApi.getByVariant(v.id);
        sizeList.push(...(sizeRes.data ?? sizeRes));

        const imageRes = await adminImageApi.getByVariant(v.id);
        imageMap[v.id] = imageRes.data ?? imageRes;
      }

      setSizes(sizeList);
      setImages(imageMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  /* ================= VARIANT ================= */

  const handleSubmitVariant = async () => {
    if (!id) return;

    try {
      const payload = {
        productId: id,
        colorId: form.colorId,
        isActive: form.isActive,
      };

      if (editingVariantId) {
        await adminVariantApi.update(editingVariantId, payload);
      } else {
        await adminVariantApi.create(payload);
      }

      setIsOpen(false);
      setEditingVariantId(null);
      setForm({ colorId: "", isActive: true });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const openCreateModal = () => {
    setEditingVariantId(null);
    setForm({ colorId: "", isActive: true });
    setIsOpen(true);
  };

  const openEditModal = (variant: ProductVariant) => {
    setEditingVariantId(variant.id);
    setForm({
      colorId: variant.colorId,
      isActive: variant.isActive,
    });
    setIsOpen(true);
  };

  /* ================= SIZE ================= */

  const handleSubmitSize = async () => {
    if (!selectedVariantForSize) return;

    try {
      const payload = {
        productVariantId: selectedVariantForSize,
        sizeName: sizeForm.sizeName,
        sku: sizeForm.sku,
        originalPrice: parseFormattedNumber(sizeForm.originalPrice),
        salePrice: parseFormattedNumber(sizeForm.salePrice),
        stock: Number(sizeForm.stock),
      };

      if (editingSizeId) {
        await adminVariantSizeApi.update(editingSizeId, payload);
      } else {
        await adminVariantSizeApi.create(payload);

        const currentSizes = sizes.filter(
          (s) => s.productVariantId === selectedVariantForSize,
        );

        if (currentSizes.length === 0) {
          const variant = variants.find((v) => v.id === selectedVariantForSize);

          if (variant) {
            await adminVariantApi.update(variant.id, {
              productId: variant.productId,
              colorId: variant.colorId,
              isActive: true,
            });
          }
        }
      }

      setIsSizeOpen(false);
      setEditingSizeId(null);

      setSizeForm({
        sizeName: "",
        sku: "",
        originalPrice: "",
        salePrice: "",
        stock: "",
      });

      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditSizeModal = (size: ProductVariantSize) => {
    setEditingSizeId(size.id);
    setSelectedVariantForSize(size.productVariantId);

    setSizeForm({
      sizeName: size.sizeName,
      sku: size.sku,
      originalPrice: formatNumber(size.originalPrice),
      salePrice: formatNumber(size.salePrice),
      stock: String(size.stock),
    });

    setIsSizeOpen(true);
  };

  /* ================= IMAGE ================= */

  const handleCreateImage = async () => {
    if (!selectedVariantForImage || !newImageUrl) return;

    const currentImages = images[selectedVariantForImage] || [];

    await adminImageApi.create(selectedVariantForImage, {
      imageUrl: newImageUrl,
      sortOrder: currentImages.length + 1,
      isPrimary: false,
    });

    setIsImageOpen(false);
    setNewImageUrl("");
    fetchData();
  };

  const handleSetPrimary = async (variantId: string, imageId: string) => {
    await adminImageApi.setPrimary(variantId, imageId);
    fetchData();
  };

  const handleDeleteImage = async (variantId: string, imageId: string) => {
    if (!window.confirm("Delete this image?")) return;
    await adminImageApi.delete(variantId, imageId);
    fetchData();
  };

  const handleDeleteSize = async (sizeId: string, variantId: string) => {
    if (!window.confirm("Delete this size?")) return;

    try {
      await adminVariantSizeApi.delete(sizeId);
      const remainingRes = await adminVariantSizeApi.getByVariant(variantId);
      const remainingSizes = remainingRes.data ?? remainingRes;

      if (!remainingSizes || remainingSizes.length === 0) {
        const variant = variants.find((v) => v.id === variantId);
        if (variant) {
          await adminVariantApi.update(variantId, {
            productId: variant.productId,
            colorId: variant.colorId,
            isActive: false,
          });
        }
      }

      const variantRes = await adminVariantApi.getByProduct(id!);
      const allVariants = variantRes.data ?? variantRes;
      const anyActive = allVariants.some((v: any) => v.isActive);

      if (!anyActive) {
        await adminProductApi.update(id!, {
          isActive: false,
        });
      }

      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteVariant = async (variant: ProductVariant) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this variant? This will also delete all its sizes and images.")) return;

    try {
      const sizeRes = await adminVariantSizeApi.getByVariant(variant.id);
      const variantSizes: ProductVariantSize[] = sizeRes.data ?? sizeRes;
      for (const size of variantSizes) {
        await adminVariantSizeApi.delete(size.id);
      }

      const imageRes = await adminImageApi.getByVariant(variant.id);
      const variantImages: VariantImage[] = imageRes.data ?? imageRes;
      for (const img of variantImages) {
        await adminImageApi.delete(variant.id, img.id);
      }

      await adminVariantApi.hardDelete(variant.id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">{productInfo.name}</h1>
            <p className="text-sm text-zinc-500 font-medium">
              {productInfo.brandName} • {productInfo.categoryName}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-zinc-400 italic">Synchronizing product data...</div>
      ) : (
        <div className="space-y-8">
          {/* VARIANTS SECTION */}
          <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900 uppercase tracking-wider">Product Variants</h2>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-1.5 bg-zinc-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-zinc-800 transition-all uppercase tracking-widest"
              >
                <Plus size={14} />
                Add New Variant
              </button>
          </div>

          <div className="grid gap-8">
            {variants.map((variant) => {
              const variantSizes = sizes.filter((s) => s.productVariantId === variant.id);
              const variantImages = images[variant.id] || [];

              return (
                <div key={variant.id} className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* VARIANT HEADER */}
                  <div className="px-6 py-4 bg-zinc-50/50 border-b border-zinc-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-8 h-8 rounded-full border border-zinc-300 shadow-inner"
                        style={{ backgroundColor: variant.colorCode }}
                      />
                      <div>
                        <h3 className="font-bold text-zinc-900 leading-none">
                          {variant.colorName}
                        </h3>
                        <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-widest">
                          {variant.colorCode}
                        </p>
                      </div>
                      <div className={`ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        variant.isActive ? "bg-green-50 text-green-700" : "bg-rose-50 text-rose-700"
                      }`}>
                         <div className={`w-1 h-1 rounded-full ${variant.isActive ? "bg-green-500" : "bg-rose-500"}`} />
                         {variant.isActive ? "Active" : "Inactive"}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(variant)}
                        className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all"
                        title="Edit Variant"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteVariant(variant)}
                        className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete Variant"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 grid lg:grid-cols-2 gap-10">
                    {/* SIZES */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Inventory & Sizes</h4>
                        <button
                          onClick={() => { setSelectedVariantForSize(variant.id); setIsSizeOpen(true); }}
                          className="text-[10px] font-bold text-zinc-900 hover:underline uppercase tracking-widest"
                        >
                          + Add Size
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {variantSizes.map((size) => (
                          <div key={size.id} className="group relative border border-zinc-100 bg-zinc-50/50 p-3 rounded-lg hover:border-zinc-300 hover:bg-white transition-all">
                            <button
                              onClick={() => openEditSizeModal(size)}
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-zinc-900 transition-all"
                            >
                              <Edit2 size={12} />
                            </button>
                            <div className="text-sm font-bold text-zinc-900">{size.sizeName}</div>
                            <div className="text-[10px] text-zinc-500 font-medium mb-2">{size.sku}</div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-bold text-zinc-900">{size.salePrice.toLocaleString()}₫</span>
                                <span className="text-[10px] text-zinc-400 line-through">{size.originalPrice.toLocaleString()}₫</span>
                            </div>
                            <div className={`mt-2 text-[10px] font-bold uppercase tracking-widest ${size.stock > 10 ? "text-zinc-400" : "text-rose-600"}`}>
                                Stock: {size.stock}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* IMAGES */}
                    <div className="space-y-4">
                       <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Visual Assets</h4>
                        <button
                          onClick={() => { setSelectedVariantForImage(variant.id); setIsImageOpen(true); }}
                          className="text-[10px] font-bold text-zinc-900 hover:underline uppercase tracking-widest"
                        >
                          + Add Image
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {variantImages.map((img) => (
                          <div key={img.id} className="group relative aspect-square border border-zinc-100 rounded-lg overflow-hidden bg-zinc-50">
                            <img
                              src={img.imageUrl}
                              alt=""
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {img.isPrimary && (
                              <div className="absolute top-1.5 left-1.5 bg-zinc-900 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                                Primary
                              </div>
                            )}

                            <div className="absolute inset-0 bg-zinc-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                <button
                                    onClick={() => setPreviewImage(img.imageUrl)}
                                    className="p-1.5 bg-white text-zinc-900 rounded-full hover:bg-zinc-100"
                                >
                                    <Maximize2 size={12} />
                                </button>
                                <div className="flex gap-1.5">
                                    {!img.isPrimary && (
                                        <button
                                            onClick={() => handleSetPrimary(variant.id, img.id)}
                                            className="p-1.5 bg-white text-green-600 rounded-full hover:bg-zinc-100"
                                        >
                                            <Check size={12} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeleteImage(variant.id, img.id)}
                                        className="p-1.5 bg-white text-rose-600 rounded-full hover:bg-zinc-100"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {variants.length === 0 && (
                 <div className="py-20 text-center bg-white border border-dashed border-zinc-200 rounded-xl">
                    <ImageIcon size={40} className="mx-auto text-zinc-200 mb-4" />
                    <p className="text-sm text-zinc-400 font-medium">No variants defined for this product</p>
                 </div>
            )}
          </div>
        </div>
      )}

      {/* ================= MODALS ================= */}

       {/* VARIANT MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/50">
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">
                {editingVariantId ? "Update Variant" : "Create New Variant"}
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-zinc-900 p-1"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
                <div>
                     <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">Select Color</label>
                     <select
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all cursor-pointer"
                        value={form.colorId}
                        onChange={(e) => setForm((prev) => ({ ...prev, colorId: e.target.value }))}
                        >
                        <option value="">-- Choose Color --</option>
                        {colors.map((color) => (
                            <option key={color.id} value={color.id}>
                            {color.name} ({color.code})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center justify-between border border-zinc-200 rounded-lg px-4 py-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status Active</span>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, isActive: !form.isActive })}
                      className={`w-10 h-5 rounded-full relative transition-colors ${form.isActive ? "bg-green-500" : "bg-zinc-300"}`}
                    >
                      <span className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${form.isActive ? "translate-x-5" : ""}`} />
                    </button>
                  </div>
            </div>
            <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50/50 flex justify-end gap-3">
                  <button onClick={() => setIsOpen(false)} className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-4 py-2">Cancel</button>
                  <button onClick={handleSubmitVariant} className="bg-zinc-900 text-white px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800">Save Variant</button>
            </div>
          </div>
        </div>
      )}

      {/* SIZE MODAL */}
      {isSizeOpen && (
        <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
             <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/50">
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">
                {editingSizeId ? "Update Inventory Item" : "Add Inventory Item"}
              </h3>
              <button onClick={() => { setIsSizeOpen(false); setEditingSizeId(null); }} className="text-zinc-400 hover:text-zinc-900 p-1"><X size={18} /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
                <div className="col-span-1 text-[13px] font-medium">
                     <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">Size Tag</label>
                     <input className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 focus:bg-white focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all"
                            placeholder="M, L, XL..." value={sizeForm.sizeName} onChange={(e) => setSizeForm((prev) => ({ ...prev, sizeName: e.target.value }))} />
                </div>
                <div className="col-span-1">
                     <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">SKU Code</label>
                     <input className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 font-mono text-[11px] focus:bg-white focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all"
                            placeholder="SKU-XXX-..." value={sizeForm.sku} onChange={(e) => setSizeForm((prev) => ({ ...prev, sku: e.target.value }))} />
                </div>
                <div>
                     <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">Original Price</label>
                     <input className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all"
                            value={sizeForm.originalPrice} onChange={(e) => setSizeForm((prev) => ({ ...prev, originalPrice: formatNumber(parseFormattedNumber(e.target.value)) }))} />
                </div>
                <div>
                     <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">Sale Price</label>
                     <input className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all text-rose-600"
                            value={sizeForm.salePrice} onChange={(e) => setSizeForm((prev) => ({ ...prev, salePrice: formatNumber(parseFormattedNumber(e.target.value)) }))} />
                </div>
                 <div className="col-span-2">
                     <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">Stock Quantity</label>
                     <input className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all"
                            type="number" value={sizeForm.stock} onChange={(e) => setSizeForm((prev) => ({ ...prev, stock: e.target.value }))} />
                </div>
            </div>
            <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50/50 flex justify-end gap-3">
                  <button onClick={() => { setIsSizeOpen(false); setEditingSizeId(null); }} className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-4 py-2">Cancel</button>
                  <button onClick={handleSubmitSize} className="bg-zinc-900 text-white px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800">Confirm Size</button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE MODAL */}
      {isImageOpen && (
        <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
             <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/50">
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Add Asset URL</h3>
              <button onClick={() => setIsImageOpen(false)} className="text-zinc-400 hover:text-zinc-900 p-1"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
                 <input className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all"
                        placeholder="https://..." value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} />
                 {newImageUrl && <img src={newImageUrl} className="w-full h-48 object-cover rounded-lg border border-zinc-200 shadow-sm" />}
            </div>
             <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50/50 flex justify-end gap-3">
                  <button onClick={() => setIsImageOpen(false)} className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-4 py-2">Cancel</button>
                  <button onClick={handleCreateImage} className="bg-zinc-900 text-white px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800">Add Asset</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW IMAGE */}
      {previewImage && (
        <div className="fixed inset-0 bg-zinc-900/90 backdrop-blur-md flex items-center justify-center z-[100] p-4" onClick={() => setPreviewImage(null)}>
           <button className="absolute top-8 right-8 text-white hover:scale-110 transition-transform"><X size={32} /></button>
           <img src={previewImage} className="max-w-full max-h-full rounded-lg shadow-2xl animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

export default AdminProductDetailPage;
