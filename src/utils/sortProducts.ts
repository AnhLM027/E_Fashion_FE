export type SortKey = "name-asc" | "name-desc" | "category-asc" | "brand-asc";

export function sortProducts(products: any[], sortKey: SortKey) {
    const sorted = [...products];

    switch (sortKey) {
        case "name-asc":
            return sorted.sort((a, b) =>
                a.name.localeCompare(b.name, "vi", { sensitivity: "base" })
            );

        case "name-desc":
            return sorted.sort((a, b) =>
                b.name.localeCompare(a.name, "vi", { sensitivity: "base" })
            );

        case "category-asc":
            return sorted.sort((a, b) =>
                (a.categoryName || "").localeCompare(
                    b.categoryName || "",
                    "vi",
                    { sensitivity: "base" }
                )
            );

        case "brand-asc":
            return sorted.sort((a, b) =>
                (a.brandName || "").localeCompare(
                    b.brandName || "",
                    "vi",
                    { sensitivity: "base" }
                )
            );

        default:
            return sorted;
    }
}