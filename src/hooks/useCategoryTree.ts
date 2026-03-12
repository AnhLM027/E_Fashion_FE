import { useEffect, useState, useMemo } from "react";
import { categoryApi } from "@/features/categories/api/categoryApi";

export interface Category {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
    isActive: boolean;
    parentId: string | null;
    children: Category[];
}

export const useCategoryTree = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await categoryApi.getTree();
            setCategories(data);
        } catch (error) {
            console.error("Fetch categories failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const flattenLeafCategories = (
        nodes: Category[],
        level = 0
    ): { id: string; name: string; level: number }[] => {
        return nodes.flatMap((node) => {
            if (node.children && node.children.length > 0) {
                return flattenLeafCategories(node.children, level + 1);
            }

            return [{ id: node.id, name: node.name, level }];
        });
    };

    const flattenAllCategories = (
        nodes: Category[],
        level = 0
    ): { id: string; name: string; level: number }[] => {
        return nodes.flatMap((node) => [
            { id: node.id, name: node.name, level },
            ...flattenAllCategories(node.children || [], level + 1),
        ]);
    };

    const buildSlugMap = (nodes: Category[]) => {
        const map = new Map<string, string>();

        const traverse = (cats: Category[]) => {
            for (const cat of cats) {
                map.set(cat.slug, cat.name);
                if (cat.children?.length) {
                    traverse(cat.children);
                }
            }
        };

        traverse(nodes);
        return map;
    };

    const slugNameMap = useMemo(
        () => buildSlugMap(categories),
        [categories]
    );

    return {
        categories,
        slugNameMap,
        allCategoryOptions: flattenAllCategories(categories),
        leafCategoryOptions: flattenLeafCategories(categories),
        loading,
        refresh: fetchCategories,
    };
};
