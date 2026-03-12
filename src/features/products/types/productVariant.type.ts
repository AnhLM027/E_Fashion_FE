export interface ProductVariant {
    id: string;
    isActive: boolean;

    productId: string;
    productName: string;

    colorId: string;
    colorName: string;
    colorCode: string;

    images: ProductVariantImage[];
    sizes: ProductVariantSize[];
}

export interface ProductVariantImage {
    id: string;
    productVariantId: string;
    imageUrl: string;
    isPrimary: boolean;
    sortOrder: number;
}

export interface ProductVariantSize {
    id: string;
    productVariantId: string;
    sku: string;
    sizeName: string;
    originalPrice: number;
    salePrice: number;
    stock: number;
    reservedStock: number;
    availableStock: number;
}