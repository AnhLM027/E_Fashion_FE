import { useState, useCallback } from "react";
import { productsApi } from "../api/products.api";
import type { ProductVariant } from "../types/productVariant.type";
import type { Product } from "../types/product.type";

export function useProductDetail() {
    const [product, setProduct] = useState<Product | null>(null);
    const [variants, setVariants] = useState<ProductVariant[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchDetail = useCallback(async (slug: string) => {
        setLoading(true);
        try {
            // 1️⃣ Lấy product theo slug
            const productRes = await productsApi.getBySlug(slug);
            setProduct(productRes);

            // 2️⃣ Sau khi có id thật → lấy variants
            if (productRes?.id) {
                const variantsRes =
                    await productsApi.getVariantsByProductId(productRes.id);
                setVariants(variantsRes);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    return { product, variants, loading, fetchDetail };
}