import axiosClient from "@/lib/axiosClient";
import type { Product } from "../types/product.type";
import type { ProductImage } from "../types/productImage.type";
import type { HomeProduct } from "../types/homeProduct.type";
import { API_ENDPOINTS } from "../../../config/api.config";
import type { ProductVariant } from "../types/productVariant.type";

export const productsApi = {
  // ✅ Filter đúng với backend
  getAll: async (params?: {
    keyword?: string;
    categorySlugs?: string[];
    brandSlugs?: string[];
    colorSlugs?: string[];
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Product[]> => {
    if (params?.keyword) {
      console.log(params.keyword)
      return await axiosClient.get(
        `${API_ENDPOINTS.PRODUCTS.LIST}/search`,
        {
          params: { keyword: params.keyword },
        }
      );
    }

    console.log(params?.categorySlugs)
    return await axiosClient.get(API_ENDPOINTS.PRODUCTS.LIST, {
      params,
    });
  },

  // ✅ GET /api/products/{id}
  getById: async (id: string): Promise<Product> => {
    return await axiosClient.get(
      API_ENDPOINTS.PRODUCTS.DETAIL(id)
    );
  },

  // ✅ GET /api/products/slug/{slug}
  getBySlug: async (slug: string): Promise<Product> => {
    return await axiosClient.get(
      API_ENDPOINTS.PRODUCTS.DETAIL_BY_SLUG(slug)
    );
  },

  // variants
  getVariantsByProductId: async (
    productId: string
  ): Promise<ProductVariant[]> => {
    return axiosClient.get(
      `/api/product-variants/product/${productId}`
    );
  },

  // images
  getImages: (productId: string): Promise<ProductImage[]> =>
    axiosClient.get(
      API_ENDPOINTS.PRODUCTS.GET_IMAGES(productId)
    ),

  // ❗ Nếu backend chưa có featured API thì cần tạo riêng
  getBestSellers: async (): Promise<HomeProduct[]> => {
    return axiosClient.get(
      API_ENDPOINTS.PRODUCTS.FEATURED("bestsellers")
    );
  },

  getSale: async (): Promise<HomeProduct[]> => {
    return axiosClient.get(
      API_ENDPOINTS.PRODUCTS.FEATURED("sale")
    );
  },

  getNewArrivals: async (): Promise<HomeProduct[]> => {
    return axiosClient.get(
      API_ENDPOINTS.PRODUCTS.FEATURED("new")
    );
  },
};