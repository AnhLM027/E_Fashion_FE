import { useSearchParams } from "react-router-dom";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

export function ProductsFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [brandOpen, setBrandOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);

  // ================= READ URL PARAMS =================
  const selectedCategories =
    searchParams.get("category")?.split(",").filter(Boolean) || [];

  const selectedBrands =
    searchParams.get("brand")?.split(",").filter(Boolean) || [];

  const selectedColors =
    searchParams.get("color")?.split(",").filter(Boolean) || [];

  const minPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : undefined;

  const maxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : undefined;

  // ================= BUILD FILTER OBJECT =================
  const filters = useMemo(() => {
    return {
      categorySlugs: selectedCategories.length ? selectedCategories : undefined,
      brandSlugs: selectedBrands.length ? selectedBrands : undefined,
      colorSlugs: selectedColors.length ? selectedColors : undefined,
      minPrice,
      maxPrice,
    };
  }, [selectedCategories, selectedBrands, selectedColors, minPrice, maxPrice]);

  // console.log(filters);

  const { products } = useProducts(filters);

  // ================= UNIQUE BRANDS =================
  const brands = useMemo(() => {
    const map = new Map<string, string>();

    products.forEach((p: any) => {
      const slug = p.brandSlug;
      const name = p.brandName;
      if (slug && name) map.set(slug, name);
    });

    return Array.from(map.entries());
  }, [products]);

  // ================= UNIQUE COLORS =================
  const colors = useMemo(() => {
    const map = new Map<string, string>();

    products.forEach((p: any) => {
      if (!p.colors) return;

      p.colors.forEach((color: any) => {
        const slug = color?.slug;
        const name = color?.name;

        if (slug && name) {
          map.set(slug, name);
        }
      });
    });

    return Array.from(map.entries()).sort((a, b) =>
      a[1].localeCompare(b[1], "vi", { sensitivity: "base" }),
    );
  }, [products]);

  // ================= HANDLERS =================
  const updateParams = (newParams: URLSearchParams) => {
    setSearchParams(newParams);
  };

  const toggleParam = (
    key: "brand" | "category" | "color",
    value: string,
    currentValues: string[],
  ) => {
    const newParams = new URLSearchParams(searchParams);
    let arr = [...currentValues];

    if (arr.includes(value)) {
      arr = arr.filter((v) => v !== value);
    } else {
      arr.push(value);
    }

    if (arr.length === 0) {
      newParams.delete(key);
    } else {
      newParams.set(key, arr.join(","));
    }

    updateParams(newParams);
  };

  const updatePrice = (min: number, max: number) => {
    const newParams = new URLSearchParams(searchParams);

    newParams.set("minPrice", String(min));
    newParams.set("maxPrice", String(max));

    updateParams(newParams);
  };

  return (
    <div className="sticky top-24 h-[calc(100vh-7rem)]">
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 space-y-8 h-full overflow-y-auto pr-2 custom-scroll">
        {/* CLEAR FILTER */}
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">Bộ lọc</h2>
          <button
            onClick={() => setSearchParams({})}
            className="text-sm text-red-500 hover:underline"
          >
            Xóa tất cả
          </button>
        </div>

        {/* ================= BRAND ================= */}
        <div>
          <button
            onClick={() => setBrandOpen(!brandOpen)}
            className="flex justify-between items-center w-full mb-4"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wide">
              Thương hiệu
            </h3>
            <ChevronDown
              size={16}
              className={`transition-transform ${brandOpen ? "rotate-180" : ""}`}
            />
          </button>

          {brandOpen && (
            <div className="space-y-3 max-h-60 overflow-auto pr-1">
              {brands.map(([slug, name]) => {
                const active = selectedBrands.includes(slug);
                return (
                  <label
                    key={slug}
                    className={`flex items-center gap-3 cursor-pointer group`}
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition 
                  ${active
                          ? "bg-black border-black"
                          : "border-gray-300 group-hover:border-black"
                        }`}
                    >
                      {active && (
                        <div className="w-2 h-2 bg-white rounded-sm"></div>
                      )}
                    </div>

                    <input
                      type="checkbox"
                      className="hidden"
                      checked={active}
                      onChange={() =>
                        toggleParam("brand", slug, selectedBrands)
                      }
                    />

                    <span
                      className={`text-sm transition ${active ? "font-medium text-black" : "text-gray-600"
                        }`}
                    >
                      {name}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* ================= COLOR ================= */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide mb-4">
            Màu sắc
          </h3>

          <div className="flex flex-wrap gap-3">
            {colors.map(([slug, name]) => {
              const active = selectedColors.includes(slug);

              return (
                <button
                  key={slug}
                  onClick={() => toggleParam("color", slug, selectedColors)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition
                ${active
                      ? "bg-black text-white border-black"
                      : "border-gray-300 hover:border-black text-gray-700"
                    }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border"
                    style={{ backgroundColor: slug }}
                  ></span>
                  {name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= PRICE ================= */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide mb-4">
            Khoảng giá
          </h3>

          <div className="space-y-5">
            {/* RANGE */}
            <div className="relative">
              <input
                type="range"
                min={0}
                max={5000000}
                step={50000}
                value={maxPrice ?? 5000000}
                onChange={(e) => {
                  const newMax = Number(e.target.value);
                  updatePrice(minPrice ?? 0, newMax);
                }}
                className="w-full accent-black cursor-pointer"
              />

              {/* Active range progress */}
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0₫</span>
                <span>5.000.000₫</span>
              </div>
            </div>

            {/* MIN MAX DISPLAY + INPUT */}
            <div className="grid grid-cols-2 gap-4">
              {/* MIN */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Tối thiểu</label>
                <input
                  type="number"
                  value={minPrice ?? 0}
                  min={0}
                  max={maxPrice ?? 5000000}
                  step={50000}
                  onChange={(e) => {
                    const newMin = Number(e.target.value);
                    if (newMin <= (maxPrice ?? 5000000)) {
                      updatePrice(newMin, maxPrice ?? 5000000);
                    }
                  }}
                  className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* MAX */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">Tối đa</label>
                <input
                  type="number"
                  value={maxPrice ?? 5000000}
                  min={minPrice ?? 0}
                  max={5000000}
                  step={50000}
                  onChange={(e) => {
                    const newMax = Number(e.target.value);
                    if (newMax >= (minPrice ?? 0)) {
                      updatePrice(minPrice ?? 0, newMax);
                    }
                  }}
                  className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* DISPLAY RESULT */}
            <div className="text-sm font-medium text-center bg-gray-50 py-2 rounded-xl">
              {(minPrice ?? 0).toLocaleString("vi-VN")}₫{"  —  "}
              {(maxPrice ?? 5000000).toLocaleString("vi-VN")}₫
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
