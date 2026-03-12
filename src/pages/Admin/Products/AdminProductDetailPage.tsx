import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { adminProductApi } from "@/features/admin/api/adminProductApi";
import { adminVariantApi } from "@/features/admin/api/adminVariantApi";
import { adminVariantSizeApi } from "@/features/admin/api/adminVariantSizeApi";
import { adminImageApi } from "@/features/admin/api/adminVariantImageApi";
import { adminColorApi } from "@/features/admin/api/adminColorApi";

import RichTextEditor from "@/components/layout/RichTextEditor/RichTextEditor";

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

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [sizes, setSizes] = useState<ProductVariantSize[]>([]);
  const [images, setImages] = useState<Record<string, VariantImage[]>>({});
  const [colors, setColors] = useState<ColorResponseDTO[]>([]);

  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);

  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [selectedVariantForImage, setSelectedVariantForImage] = useState<
    string | null
  >(null);
  const [selectedVariantForSize, setSelectedVariantForSize] = useState<
    string | null
  >(null);

  const [editingSizeId, setEditingSizeId] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSizeOpen, setIsSizeOpen] = useState(false);

  const [newImageUrl, setNewImageUrl] = useState("");

  const [form, setForm] = useState({
    colorId: "",
    isActive: false,
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

      setDescription(product.description || "");

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
      setForm({ colorId: "", isActive: false });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const openImageViewer = (url: string) => {
    setPreviewImage(url);
  };

  const openCreateModal = () => {
    setEditingVariantId(null);
    setForm({ colorId: "", isActive: false });
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

  // const handleCreateSize = async () => {
  //   if (!selectedVariantForSize) return;

  //   try {
  //     await adminVariantSizeApi.create({
  //       productVariantId: selectedVariantForSize,
  //       sizeName: sizeForm.sizeName,
  //       sku: sizeForm.sku,
  //       originalPrice: parseFormattedNumber(sizeForm.originalPrice),
  //       salePrice: parseFormattedNumber(sizeForm.salePrice),
  //       stock: Number(sizeForm.stock),
  //     });

  //     setIsSizeOpen(false);
  //     setSizeForm({
  //       sizeName: "",
  //       sku: "",
  //       originalPrice: "",
  //       salePrice: "",
  //       stock: "",
  //     });

  //     fetchData();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

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
      // 1️⃣ Xoá size
      await adminVariantSizeApi.delete(sizeId);

      // 2️⃣ Kiểm tra còn size nào của variant này không
      const remainingRes = await adminVariantSizeApi.getByVariant(variantId);

      const remainingSizes = remainingRes.data ?? remainingRes;

      let variantStillActive = true;

      if (!remainingSizes || remainingSizes.length === 0) {
        // 3️⃣ Inactivate variant
        const variant = variants.find((v) => v.id === variantId);

        if (variant) {
          await adminVariantApi.update(variantId, {
            productId: variant.productId,
            colorId: variant.colorId,
            isActive: false,
          });
        }

        variantStillActive = false;
      }

      // 4️⃣ Kiểm tra tất cả variant của product
      const variantRes = await adminVariantApi.getByProduct(id!);

      const allVariants = variantRes.data ?? variantRes;

      const anyActive = allVariants.some((v: any) => v.isActive);

      if (!anyActive) {
        // 5️⃣ Inactivate product
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
    if (
      !window.confirm(
        "Bạn có chắc muốn xóa variant này không?",
      )
    )
      return;

    try {
      // 1. Xoá toàn bộ size của variant
      const sizeRes = await adminVariantSizeApi.getByVariant(variant.id);
      const variantSizes: ProductVariantSize[] = sizeRes.data ?? sizeRes;

      console.log("Size")

      for (const size of variantSizes) {
        await adminVariantSizeApi.delete(size.id);
      }

      // 2. Xoá toàn bộ image của variant
      const imageRes = await adminImageApi.getByVariant(variant.id);
      const variantImages: VariantImage[] = imageRes.data ?? imageRes;

      for (const img of variantImages) {
        await adminImageApi.delete(variant.id, img.id);
      }

      // 3. Xoá variant
      await adminVariantApi.hardDelete(variant.id);
      console.log(variant.id)

      // 4. Kiểm tra nếu không còn variant active → inactive product
      const variantRes = await adminVariantApi.getByProduct(id);
      const allVariants: ProductVariant[] = variantRes.data ?? variantRes;

      const anyActive = allVariants.some((v) => v.isActive);

      if (!anyActive) {
        // await adminProductApi.update(id, { isActive: false });
      }

      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{productInfo.name}</h1>
          <p className="text-sm text-gray-500">
            {productInfo.brandName} • {productInfo.categoryName}
          </p>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between mb-6">
            <h2 className="text-xl font-semibold">Product Variants</h2>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-black text-white rounded"
            >
              + Add Variant
            </button>
          </div>

          {variants.map((variant) => {
            const variantSizes = sizes.filter(
              (s) => s.productVariantId === variant.id,
            );

            return (
              <div key={variant.id} className="border rounded-xl p-6 mb-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-3">
                      {/* Ô màu */}
                      <span
                        className="w-5 h-5 rounded-full border shadow-sm"
                        style={{ backgroundColor: variant.colorCode }}
                      />

                      {/* Tên màu */}
                      <span>
                        {variant.colorName}
                        <span className="text-sm text-gray-400 ml-2">
                          ({variant.colorCode})
                        </span>
                      </span>
                    </h3>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        variant.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {variant.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(variant)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteVariant(variant)}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Sizes */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-medium">Sizes</h4>
                    <button
                      onClick={() => {
                        setSelectedVariantForSize(variant.id);
                        setIsSizeOpen(true);
                      }}
                      className="px-3 py-1 bg-black text-white rounded text-xs"
                    >
                      + Add Size
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {variantSizes.map((size) => (
                      <div
                        key={size.id}
                        className="border p-4 rounded-xl bg-gray-50 relative group hover:shadow-sm transition"
                      >
                        {/* Actions */}
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => openEditSizeModal(size)}
                            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteSize(size.id, size.productVariantId)
                            }
                            className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>

                        <p className="font-semibold">{size.sizeName}</p>
                        <p className="text-xs text-gray-500">SKU: {size.sku}</p>
                        <p className="text-sm">
                          {formatNumber(size.salePrice)} ₫
                        </p>
                        <p className="text-xs text-gray-500">
                          Stock: {size.stock}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Images */}
                <div>
                  <div className="flex justify-between mb-3">
                    <h4 className="font-medium">Images</h4>
                    <button
                      onClick={() => {
                        setSelectedVariantForImage(variant.id);
                        setIsImageOpen(true);
                      }}
                      className="px-3 py-1 bg-black text-white rounded text-xs"
                    >
                      + Add Image
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {(images[variant.id] || []).map((img) => (
                      <div
                        key={img.id}
                        className="relative border rounded-2xl overflow-hidden bg-white"
                      >
                        <img
                          src={img.imageUrl}
                          alt=""
                          onClick={() => openImageViewer(img.imageUrl)}
                          className="w-full h-40 object-cover cursor-zoom-in"
                        />

                        {img.isPrimary && (
                          <span className="absolute top-3 left-3 bg-black text-white text-xs px-3 py-1 rounded-full">
                            Primary
                          </span>
                        )}

                        <div className="flex justify-between p-3 border-t bg-gray-50">
                          {!img.isPrimary && (
                            <button
                              onClick={() =>
                                handleSetPrimary(variant.id, img.id)
                              }
                              className="text-xs text-black font-medium"
                            >
                              Set Primary
                            </button>
                          )}

                          <button
                            onClick={() =>
                              handleDeleteImage(variant.id, img.id)
                            }
                            className="text-xs text-red-500 font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= VARIANT MODAL ================= */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">
            <h3 className="text-lg font-semibold">
              {editingVariantId ? "Update Variant" : "Create Variant"}
            </h3>

            <select
              className="w-full border p-2 rounded"
              value={form.colorId}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  colorId: e.target.value,
                }))
              }
            >
              <option value="">Select Color</option>
              {colors.map((color) => (
                <option key={color.id} value={color.id}>
                  {color.name} ({color.code})
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmitVariant}
                className="px-4 py-2 bg-black text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SIZE MODAL ================= */}
      {isSizeOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">
            <h3 className="text-lg font-semibold">
              {editingSizeId ? "Update Size" : "Add Size"}
            </h3>

            <input
              className="w-full border p-2 rounded"
              placeholder="Size Name (M, L, XL...)"
              value={sizeForm.sizeName}
              onChange={(e) =>
                setSizeForm((prev) => ({
                  ...prev,
                  sizeName: e.target.value,
                }))
              }
            />

            <input
              className="w-full border p-2 rounded"
              placeholder="SKU"
              value={sizeForm.sku}
              onChange={(e) =>
                setSizeForm((prev) => ({
                  ...prev,
                  sku: e.target.value,
                }))
              }
            />

            <input
              className="w-full border p-2 rounded"
              placeholder="Original Price"
              value={sizeForm.originalPrice}
              onChange={(e) =>
                setSizeForm((prev) => ({
                  ...prev,
                  originalPrice: formatNumber(
                    parseFormattedNumber(e.target.value),
                  ),
                }))
              }
            />

            <input
              className="w-full border p-2 rounded"
              placeholder="Sale Price"
              value={sizeForm.salePrice}
              onChange={(e) =>
                setSizeForm((prev) => ({
                  ...prev,
                  salePrice: formatNumber(parseFormattedNumber(e.target.value)),
                }))
              }
            />

            <input
              className="w-full border p-2 rounded"
              placeholder="Stock"
              type="number"
              value={sizeForm.stock}
              onChange={(e) =>
                setSizeForm((prev) => ({
                  ...prev,
                  stock: e.target.value,
                }))
              }
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsSizeOpen(false);
                  setEditingSizeId(null);
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmitSize}
                className="px-4 py-2 bg-black text-white rounded"
              >
                {editingSizeId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= IMAGE MODAL ================= */}
      {isImageOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">
            <h3 className="text-lg font-semibold">Add Variant Image</h3>

            <input
              className="w-full border p-2 rounded"
              placeholder="Image URL"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
            />

            {newImageUrl && (
              <img
                src={newImageUrl}
                className="w-full h-40 object-cover rounded"
              />
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsImageOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateImage}
                className="px-4 py-2 bg-black text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-5xl w-full px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-6 text-white text-2xl"
            >
              ✕
            </button>

            <img
              src={previewImage}
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductDetailPage;
