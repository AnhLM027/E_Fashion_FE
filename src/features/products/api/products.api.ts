import axiosClient from "@/lib/axiosClient";
import type { Product } from "../types/product.type";
import type { ProductImage } from "../types/productImage.type";
import type { HomeProduct } from "../types/homeProduct.type";
import { API_ENDPOINTS } from "../../../config/api.config";
import type { ProductVariant } from "../types/productVariant.type";

// 📂 DISCOVERY (Public/Guest)
export const productsApi = {
  getAll: async (params?: {
    keyword?: string;
    categorySlugs?: string[];
    brandSlugs?: string[];
    colorSlugs?: string[];
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Product[]> => {
    if (params?.keyword) {
      return await axiosClient.get(API_ENDPOINTS.DISCOVERY.PRODUCTS.SEARCH, {
        params: { keyword: params.keyword },
      });
    }

    return await axiosClient.get(API_ENDPOINTS.DISCOVERY.PRODUCTS.LIST, {
      params,
    });
  },

  getById: async (id: string): Promise<Product> => {
    return await axiosClient.get(API_ENDPOINTS.DISCOVERY.PRODUCTS.DETAIL(id));
  },

  getBySlug: async (slug: string): Promise<Product> => {
    return await axiosClient.get(API_ENDPOINTS.DISCOVERY.PRODUCTS.DETAIL_BY_SLUG(slug));
  },

  getVariantsByProductId: async (productId: string): Promise<ProductVariant[]> => {
    return axiosClient.get(API_ENDPOINTS.DISCOVERY.PRODUCTS.VARIANTS(productId));
  },

  getImages: (productId: string): Promise<ProductImage[]> =>
    axiosClient.get(API_ENDPOINTS.DISCOVERY.PRODUCTS.IMAGES(productId)),

  getBestSellers: async (): Promise<HomeProduct[]> => {
    return axiosClient.get(API_ENDPOINTS.DISCOVERY.PRODUCTS.FEATURED("bestsellers"));
  },

  getSale: async (): Promise<HomeProduct[]> => {
    return axiosClient.get(API_ENDPOINTS.DISCOVERY.PRODUCTS.FEATURED("sale"));
  },

  getNewArrivals: async (): Promise<HomeProduct[]> => {
    return axiosClient.get(API_ENDPOINTS.DISCOVERY.PRODUCTS.FEATURED("new"));
  },
};

// 📂 STAFF (ROLE_STAFF & ROLE_ADMIN)
export const staffProductsApi = {
  getAll: async (params?: any): Promise<Product[]> => {
    return axiosClient.get(API_ENDPOINTS.STAFF.PRODUCTS, { params });
  },

  create: async (data: any): Promise<Product> => {
    return axiosClient.post(API_ENDPOINTS.STAFF.PRODUCTS, data);
  },

  update: async (id: string, data: any): Promise<Product> => {
    return axiosClient.put(API_ENDPOINTS.STAFF.PRODUCT_ID(id), data);
  },

  delete: async (id: string): Promise<void> => {
    return axiosClient.delete(API_ENDPOINTS.STAFF.PRODUCT_ID(id));
  },

  updateStatus: async (id: string, status: boolean): Promise<any> => {
    return axiosClient.patch(API_ENDPOINTS.STAFF.PRODUCT_STATUS(id), { status });
  },
};