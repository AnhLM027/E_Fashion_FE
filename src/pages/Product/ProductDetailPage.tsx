import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ShoppingBag, Heart } from "lucide-react";

import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useCategoryTree } from "@/hooks/useCategoryTree";

import { useProductDetail } from "@/features/products/hooks/useProductDetail";
import { useProducts } from "@/features/products/hooks/useProducts";
import { ProductCard } from "@/features/products/components/ProductCard";
import { FeaturedProducts } from "@/components/home/featured-products";
import { addCartItem } from "@/features/cart/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
  fetchWishlist,
} from "@/features/wishlist/slices/wishlistSlice";

import { Button } from "@/components/ui/Button";

import { toast } from "sonner";

import type { AppDispatch, RootState } from "@/store/store";

const sizeMap = [
  {
    height: [160, 164],
    weight: [54, 62],
    size: "S",
  },
  {
    height: [164, 172],
    weight: [62, 68],
    size: "M",
  },
  {
    height: [170, 176],
    weight: [68, 76],
    size: "L",
  },
  {
    height: [174, 178],
    weight: [76, 84],
    size: "XL",
  },
  {
    height: [176, 180],
    weight: [84, 90],
    size: "XXL",
  },
];

export default function ProductDetailPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = !!user;

  const { productSlug } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const imageRef = useRef<HTMLImageElement>(null);

  const { product, variants, loading, fetchDetail } = useProductDetail();
  const { products } = useProducts();

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());

  const [selectedVariant, setSelectedVariant] = useState<
    (typeof variants)[0] | null
  >(null);

  const [selectedSize, setSelectedSize] = useState<
    (typeof variants)[0]["sizes"][0] | null
  >(null);

  const [activeImage, setActiveImage] = useState<string>();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [zoom, setZoom] = useState(1);

  const [quantity, setQuantity] = useState(1);

  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const [height, setHeight] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [suggestedSize, setSuggestedSize] = useState<string | null>(null);

  const suggestSize = (height: number, weight: number) => {
    const found = sizeMap.find(
      (item) =>
        height >= item.height[0] &&
        height <= item.height[1] &&
        weight >= item.weight[0] &&
        weight <= item.weight[1],
    );

    return found?.size || "Không xác định";
  };

  const [activeSizeTab, setActiveSizeTab] = useState<"guide" | "table">(
    "guide",
  );

  useEffect(() => {
    if (height && weight) {
      setSuggestedSize(suggestSize(height, weight));
    }
  }, [height, weight]);

  useEffect(() => {
    if (!suggestedSize || !selectedVariant) return;

    const match = selectedVariant.sizes.find(
      (s) => s.sizeName === suggestedSize,
    );

    if (match) {
      setSelectedSize(match);
    }
  }, [suggestedSize]);

  /* ============================= */
  /* SORTED IMAGES (THE ONLY PLACE SORT HAPPENS) */
  /* ============================= */

  const sortedImages = useMemo(() => {
    if (!selectedVariant?.images) return [];

    return [...selectedVariant.images].sort(
      (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
    );
  }, [selectedVariant]);

  /* ============================= */
  /* FETCH PRODUCT                 */
  /* ============================= */

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (!product) return;

    const exists = wishlistItems.some((item) => item.productId === product.id);

    setIsWishlisted(exists);
  }, [wishlistItems, product]);

  useEffect(() => {
    if (productSlug) {
      fetchDetail(productSlug);
    }
  }, [productSlug, fetchDetail]);

  useEffect(() => {
    const ids = new Set(wishlistItems.map((item) => item.productId));
    setWishlistIds(ids);
  }, [wishlistItems]);

  /* ============================= */
  /* INIT DEFAULT VARIANT          */
  /* ============================= */

  useEffect(() => {
    if (!variants?.length) return;

    // ưu tiên variant có hàng
    const firstAvailableVariant =
      variants.find((v) => v.sizes?.some((s) => s.availableStock > 0)) ||
      variants[0];

    setSelectedVariant(firstAvailableVariant);
    setQuantity(1);
  }, [variants]);

  /* ============================= */
  /* SET DEFAULT IMAGE WHEN VARIANT CHANGES */
  /* ============================= */

  useEffect(() => {
    if (!sortedImages.length) return;

    setActiveImage(sortedImages[0].imageUrl);
  }, [sortedImages]);

  /* ============================= */
  /* SET DEFAULT SIZE WHEN VARIANT CHANGES */
  /* ============================= */

  useEffect(() => {
    if (!selectedVariant) return;

    /* ===== 1. Set ảnh primary ===== */
    if (selectedVariant.images?.length) {
      const primaryImage = selectedVariant.images.find((img) => img.isPrimary);

      if (primaryImage) {
        setActiveImage(primaryImage.imageUrl);
      } else {
        const sorted = [...selectedVariant.images].sort(
          (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
        );
        setActiveImage(sorted[0]?.imageUrl);
      }
    }

    /* ===== 2. Auto chọn size còn hàng ===== */
    if (selectedVariant.sizes?.length) {
      const firstAvailableSize =
        selectedVariant.sizes.find((size) => size.availableStock > 0) ||
        selectedVariant.sizes[0];

      setSelectedSize(firstAvailableSize);
    }

    setQuantity(1);
  }, [selectedVariant]);

  useEffect(() => {
    if (!previewImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setPreviewIndex((prev) =>
          prev === sortedImages.length - 1 ? 0 : prev + 1,
        );
        setZoom(1);
      }

      if (e.key === "ArrowLeft") {
        setPreviewIndex((prev) =>
          prev === 0 ? sortedImages.length - 1 : prev - 1,
        );
        setZoom(1);
      }

      if (e.key === "Escape") {
        setPreviewImage(null);
        setZoom(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewImage, sortedImages.length]);

  useEffect(() => {
    if (!sortedImages.length) return;
    if (previewImage) {
      setPreviewImage(sortedImages[previewIndex]?.imageUrl);
    }
  }, [previewIndex]);

  useEffect(() => {
    if (!selectedSize) return;

    if (quantity > selectedSize.availableStock) {
      setQuantity(Math.max(1, selectedSize.availableStock));
    }
  }, [selectedSize?.availableStock]);

  useEffect(() => {
    const preventScroll = (e: Event) => e.preventDefault();

    if (previewImage) {
      document.body.style.overflow = "hidden";
      document.addEventListener("wheel", preventScroll, { passive: false });
      document.addEventListener("touchmove", preventScroll, { passive: false });
    }

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("wheel", preventScroll);
      document.removeEventListener("touchmove", preventScroll);
    };
  }, [previewImage]);

  const { slugNameMap } = useCategoryTree();

  const formatVietnameseName = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toLocaleUpperCase("vi-VN") + word.slice(1))
      .join(" ");
  };

  const categoryDisplayName = useMemo(() => {
    if (!product?.categorySlug) return "";

    const raw = slugNameMap.get(product.categorySlug);
    if (!raw) return "";

    return formatVietnameseName(raw);
  }, [product, slugNameMap]);

  /* ============================= */
  /* HANDLERS                      */
  /* ============================= */

  const handleWheelZoom = (e: React.WheelEvent<HTMLImageElement>) => {
    e.preventDefault();

    const delta = e.deltaY > 0 ? -0.1 : 0.1;

    setZoom((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > 3) return 3;
      return next;
    });
  };

  const handleSelectVariant = (variant: (typeof variants)[0]) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const handleSelectSize = (size: (typeof variants)[0]["sizes"][0]) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  const getPrimaryImage = (variant: (typeof variants)[0]) => {
    if (!variant.images?.length) return "";

    const primary = variant.images.find((img) => img.isPrimary);
    if (primary) return primary.imageUrl;

    const sorted = [...variant.images].sort(
      (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
    );

    return sorted[0]?.imageUrl;
  };

  const animateToCart = () => {
    const img = imageRef.current;
    const cartIcon = document.getElementById("cart-icon");

    if (!img || !cartIcon) return;

    const imgRect = img.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    const flyingImg = img.cloneNode(true) as HTMLImageElement;

    flyingImg.style.position = "fixed";
    flyingImg.style.left = imgRect.left + "px";
    flyingImg.style.top = imgRect.top + "px";
    flyingImg.style.width = imgRect.width + "px";
    flyingImg.style.height = imgRect.height + "px";
    flyingImg.style.objectFit = "cover";
    flyingImg.style.borderRadius = "16px";
    flyingImg.style.transition = "all 800ms cubic-bezier(.65,-0.01,.26,1)";
    flyingImg.style.zIndex = "9999";
    flyingImg.style.pointerEvents = "none";

    document.body.appendChild(flyingImg);

    requestAnimationFrame(() => {
      flyingImg.style.left = cartRect.left + cartRect.width / 2 - 20 + "px";
      flyingImg.style.top = cartRect.top + cartRect.height / 2 - 20 + "px";
      flyingImg.style.width = "40px";
      flyingImg.style.height = "40px";
      flyingImg.style.opacity = "0.3";
      flyingImg.style.transform = "scale(0.5)";
    });

    setTimeout(() => flyingImg.remove(), 800);
  };

  /* ============================= */
  /* RELATED PRODUCTS              */
  /* ============================= */

  // const relatedProducts = useMemo(() => {
  //   if (!product) return [];

  //   return products
  //     .filter(
  //       (p) => p.categoryName === product.categoryName && p.id !== product.id,
  //     )
  //     .slice(0, 4);
  // }, [products, product]);

  const relatedByCategory = useMemo(() => {
    if (!product) return [];

    return products
      .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
      .slice(0, 5);
  }, [products, product]);

  const relatedByBrand = useMemo(() => {
    if (!product) return [];

    return products
      .filter(
        (p) =>
          p.brandId === product.brandId &&
          p.categoryId !== product.categoryId && // tránh trùng
          p.id !== product.id,
      )
      .slice(0, 5);
  }, [products, product]);

  const handleToggleWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để thêm vào wishlist ❤️");
      return;
    }

    try {
      setWishlistLoading(true);

      const exists = wishlistIds.has(productId);

      // optimistic update
      setWishlistIds((prev) => {
        const next = new Set(prev);
        if (exists) next.delete(productId);
        else next.add(productId);
        return next;
      });

      if (exists) {
        await dispatch(removeFromWishlist(productId)).unwrap();
        toast.success("Đã xóa khỏi wishlist");
      } else {
        await dispatch(addToWishlist(productId)).unwrap();
        toast.success("Đã thêm vào wishlist ❤️");
      }
    } catch (err) {
      toast.error("Không thể cập nhật wishlist");

      // rollback
      setWishlistIds((prev) => {
        const next = new Set(prev);
        if (next.has(productId)) next.delete(productId);
        else next.add(productId);
        return next;
      });
    } finally {
      setWishlistLoading(false);
    }
  };

  /* ============================= */
  /* LOADING                       */
  /* ============================= */

  if (loading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        Đang tải sản phẩm...
      </div>
    );
  }

  /* ============================= */
  /* RENDER                        */
  /* ============================= */

  return (
    <div className="bg-white min-h-screen text-zinc-900">
      {/* BREADCRUMB */}
      <nav className="border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-2 text-[11px] font-medium tracking-widest text-zinc-400">
          <Link to="/" className="hover:text-black transition">
            Trang chủ
          </Link>

          <ChevronRight size={10} strokeWidth={3} className="text-zinc-300" />

          <Link to="/products" className="hover:text-black transition">
            Cửa hàng
          </Link>

          {categoryDisplayName && (
            <>
              <ChevronRight
                size={10}
                strokeWidth={3}
                className="text-zinc-300"
              />

              <Link
                to={`/products/category/${product.categorySlug}`}
                className="hover:text-black transition"
              >
                {categoryDisplayName}
              </Link>
            </>
          )}

          <ChevronRight size={10} strokeWidth={3} className="text-zinc-300" />

          <span className="text-zinc-900 font-bold">{product.name}</span>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-16 space-y-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* IMAGE SECTION */}
          <div className="flex gap-6">
            <div className="flex-1 aspect-3/4 overflow-hidden rounded-2xl bg-neutral-100">
              <img
                ref={imageRef}
                src={activeImage}
                alt={product.name}
                onClick={() => {
                  const index = sortedImages.findIndex(
                    (img) => img.imageUrl === activeImage,
                  );
                  setPreviewIndex(index >= 0 ? index : 0);
                  setPreviewImage(activeImage || null);
                  setZoom(1);
                }}
                className="h-full w-full object-cover cursor-zoom-in"
              />
            </div>

            <div className="flex flex-col gap-3">
              {sortedImages.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(img.imageUrl)}
                  className={`h-20 w-16 overflow-hidden rounded-lg border ${
                    activeImage === img.imageUrl
                      ? "border-black"
                      : "border-neutral-200"
                  }`}
                >
                  <img
                    src={img.imageUrl}
                    className="h-full w-full object-cover cursor-pointer"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* INFO SECTION */}
          <div className="space-y-10">
            <div>
              <h1 className="text-3xl font-medium">{product.name}</h1>
              <p className="mt-2 text-xs uppercase tracking-widest text-neutral-500">
                SKU: {selectedSize?.sku}
              </p>
            </div>

            <div className="flex items-end gap-4">
              <span className="text-2xl font-semibold">
                {selectedSize?.salePrice?.toLocaleString()}₫
              </span>

              {selectedSize?.originalPrice !== selectedSize?.salePrice && (
                <span className="text-sm text-neutral-400 line-through">
                  {selectedSize?.originalPrice?.toLocaleString()}₫
                </span>
              )}
            </div>

            {selectedSize && (
              <div className="text-sm">
                {selectedSize.availableStock > 10 && (
                  <span className="text-green-600">
                    Còn {selectedSize.availableStock} sản phẩm
                  </span>
                )}

                {selectedSize.availableStock > 0 &&
                  selectedSize.availableStock <= 10 && (
                    <span className="text-orange-600 font-medium">
                      Sắp hết hàng – chỉ còn {selectedSize.availableStock}
                    </span>
                  )}

                {selectedSize.availableStock === 0 && (
                  <span className="text-red-600 font-medium">Hết hàng</span>
                )}
              </div>
            )}

            {/* COLOR */}
            <div>
              <p className="mb-3 text-xs uppercase tracking-widest text-neutral-600">
                Màu sắc
              </p>

              <div>
                <p className="mb-2 text-sm font-medium">
                  {selectedVariant?.colorName}
                </p>

                <div className="flex gap-3">
                  {variants.map((variant) => {
                    const imageUrl = getPrimaryImage(variant);

                    const isActive = selectedVariant?.id === variant.id;

                    const isOutOfStock = !variant.sizes?.some(
                      (size) => size.availableStock > 0,
                    );

                    return (
                      <button
                        key={variant.id}
                        onClick={() => handleSelectVariant(variant)}
                        disabled={isOutOfStock}
                        className={`relative h-16 w-16 rounded-lg overflow-hidden border transition ${
                          isActive
                            ? "border-black"
                            : "border-neutral-300 hover:border-black"
                        } ${isOutOfStock ? "opacity-40 cursor-not-allowed" : ""}`}
                      >
                        <img
                          src={imageUrl}
                          alt={variant.colorName}
                          className="h-full w-full object-cover"
                        />

                        {/* Gạch chéo nếu hết hàng */}
                        {isOutOfStock && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-[2px] w-full bg-black rotate-45" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SIZE */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-widest text-neutral-600">
                  Kích thước
                </p>

                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-xs text-black underline hover:text-neutral-600 transition"
                >
                  Hướng dẫn chọn size
                </button>
              </div>

              <div className="flex gap-3">
                {selectedVariant?.sizes?.map((size) => (
                  <button
                    key={size.id}
                    disabled={size.availableStock === 0}
                    onClick={() => handleSelectSize(size)}
                    className={`h-10 w-12 text-sm border ${
                      selectedSize?.id === size.id
                        ? "border-black"
                        : "border-neutral-300"
                    } ${size.availableStock === 0 && "opacity-30 cursor-not-allowed"}`}
                  >
                    {size.sizeName}
                  </button>
                ))}
              </div>
            </div>

            {/* QUANTITY */}
            <div>
              <p className="mb-3 text-xs uppercase tracking-widest text-neutral-600">
                Số lượng
              </p>

              <div className="flex items-center border w-fit">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="px-4 py-2 text-lg"
                >
                  -
                </button>

                <span className="px-6">{quantity}</span>

                <button
                  onClick={() =>
                    selectedSize &&
                    setQuantity((prev) =>
                      Math.min(selectedSize.availableStock, prev + 1),
                    )
                  }
                  className="px-4 py-2 text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* ADD TO CART */}
            <div className="flex gap-4">
              {/* Add to cart */}
              <Button
                size="lg"
                className="flex-1 h-14 rounded-none bg-black text-white hover:bg-neutral-800"
                disabled={!selectedSize || selectedSize.availableStock === 0}
                onClick={async () => {
                  if (!selectedSize) return;
                  if (!isAuthenticated) {
                    toast.info("Vui lòng đăng nhập để thêm vào giỏ hàng 🛒");
                    // navigate("/login");
                    return;
                  }
                  try {
                    await dispatch(
                      addCartItem({
                        productVariantSizeId: selectedSize.id,
                        quantity,
                      }),
                    ).unwrap();

                    animateToCart();

                    toast.success(
                      `Đã thêm ${quantity} sản phẩm vào giỏ hàng 🛒`,
                      {
                        description: `${selectedVariant?.colorName} - Size ${selectedSize.sizeName}`,
                      },
                    );

                    setQuantity(1);
                  } catch (err) {
                    await fetchDetail(productSlug!);
                    toast.error("Sản phẩm đã hết hàng!");
                  }
                }}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Thêm vào giỏ hàng
              </Button>

              {/* Wishlist */}
              <button
                onClick={() => handleToggleWishlist(product.id)}
                disabled={wishlistLoading}
                className={`h-14 w-14 flex items-center justify-center border transition ${
                  isWishlisted
                    ? "bg-black text-white border-black"
                    : "border-neutral-300 hover:border-black"
                } ${wishlistLoading ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isWishlisted ? "fill-current" : ""
                  } ${wishlistLoading ? "animate-pulse" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="max-w-3xl space-y-8">
          <h2 className="text-xl font-medium">Mô tả sản phẩm</h2>

          <div className="bg-neutral-50 rounded-2xl p-8 whitespace-pre-line text-sm text-neutral-700 leading-relaxed">
            {product.description}
          </div>
        </div>

        {/* RELATED */}
        {relatedByCategory.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-medium mb-8">Sản phẩm cùng danh mục</h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {relatedByCategory.map((item) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlistIds.has(product.id)}
                  onToggleWishlist={() => handleToggleWishlist(product.id)}
                />
              ))}
            </div>
          </div>
        )}

        {relatedByBrand.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-medium mb-8">
              Sản phẩm cùng thương hiệu
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {relatedByBrand.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  isWishlisted={wishlistIds.has(item.id)}
                  onToggleWishlist={() => handleToggleWishlist(item.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* <FeaturedProducts embedded /> */}

        {previewImage && (
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            onClick={() => {
              setPreviewImage(null);
              setZoom(1);
            }}
          >
            <div
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* CLOSE */}
              <button
                onClick={() => {
                  setPreviewImage(null);
                  setZoom(1);
                }}
                className="absolute top-6 right-6 text-white text-3xl z-50"
              >
                ✕
              </button>

              {/* LEFT */}
              {sortedImages.length > 1 && (
                <button
                  onClick={() => {
                    setPreviewIndex((prev) =>
                      prev === 0 ? sortedImages.length - 1 : prev - 1,
                    );
                    setZoom(1);
                  }}
                  className="absolute left-6 text-white text-4xl z-50"
                >
                  ‹
                </button>
              )}

              {/* IMAGE */}
              <img
                src={previewImage}
                onWheel={handleWheelZoom}
                style={{ transform: `scale(${zoom})` }}
                className="max-h-[85vh] object-contain transition-transform duration-200 cursor-zoom-in"
              />

              {/* RIGHT */}
              {sortedImages.length > 1 && (
                <button
                  onClick={() => {
                    setPreviewIndex((prev) =>
                      prev === sortedImages.length - 1 ? 0 : prev + 1,
                    );
                    setZoom(1);
                  }}
                  className="absolute right-6 text-white text-4xl z-50"
                >
                  ›
                </button>
              )}
            </div>
          </div>
        )}
        {isSizeGuideOpen && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={() => setIsSizeGuideOpen(false)}
          >
            <div
              className="bg-white max-w-3xl w-full rounded-2xl p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="absolute top-4 right-4 text-2xl"
              >
                ✕
              </button>

              {/* ===== TABS ===== */}
              <div className="flex gap-6 border-b mb-6">
                <button
                  onClick={() => setActiveSizeTab("guide")}
                  className={`pb-2 text-sm font-medium ${
                    activeSizeTab === "guide"
                      ? "border-b-2 border-black text-black"
                      : "text-gray-400"
                  }`}
                >
                  Hướng dẫn chọn size
                </button>

                <button
                  onClick={() => setActiveSizeTab("table")}
                  className={`pb-2 text-sm font-medium ${
                    activeSizeTab === "table"
                      ? "border-b-2 border-black text-black"
                      : "text-gray-400"
                  }`}
                >
                  Bảng size
                </button>
              </div>

              {/* ===== GUIDE TAB ===== */}
              {activeSizeTab === "guide" && (
                <div className="space-y-6 text-center">
                  <p className="text-sm text-gray-600">
                    Tìm kích thước phù hợp với mong muốn và số đo của riêng bạn
                  </p>

                  {/* HEIGHT */}
                  <div className="flex justify-center gap-6">
                    <div>
                      <p className="text-sm font-medium mb-2">Chiều cao</p>
                      <select
                        className="border rounded-md px-4 py-2"
                        onChange={(e) => setHeight(Number(e.target.value))}
                      >
                        <option value="">Chọn chiều cao</option>
                        <option value="162">1m60–1m64</option>
                        <option value="168">1m64–1m72</option>
                        <option value="173">1m70–1m76</option>
                        <option value="176">1m74–1m78</option>
                        <option value="178">1m76–1m80</option>
                      </select>
                    </div>

                    {/* WEIGHT */}
                    <div>
                      <p className="text-sm font-medium mb-2">Cân nặng</p>
                      <select
                        className="border rounded-md px-4 py-2"
                        onChange={(e) => setWeight(Number(e.target.value))}
                      >
                        <option value="">Chọn cân nặng</option>
                        <option value="58">54–62kg</option>
                        <option value="65">62–68kg</option>
                        <option value="72">68–76kg</option>
                        <option value="80">76–84kg</option>
                        <option value="87">84–90kg</option>
                      </select>
                    </div>
                  </div>

                  {/* RESULT */}
                  {suggestedSize && (
                    <div className="mt-6">
                      <p className="text-sm text-gray-600">
                        Gợi ý size phù hợp:
                      </p>

                      <div className="mt-3 flex justify-center">
                        <span className="px-6 py-2 bg-black text-white rounded-full text-sm font-semibold">
                          {suggestedSize}
                        </span>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-6">
                    *Thông số sản phẩm có thể thay đổi tùy theo mẫu thiết kế
                  </p>
                </div>
              )}

              {/* ===== TABLE TAB ===== */}
              {activeSizeTab === "table" && (
                <div className="flex justify-center">
                  <img
                    src="https://file.hstatic.net/200000887901/file/ao_so_mi_dang_vua.jpg"
                    alt="Size Guide"
                    className="max-w-full rounded-xl border"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
