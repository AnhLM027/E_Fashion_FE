// API configuration for backend service
export const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  ADMIN: {
    PRODUCTS: '/api/admin/products',
    PRODUCT_ID: (id: string) => `/api/admin/products/${id}`,

    CATEGORIES: '/api/admin/categories',
    BRANDS: '/api/admin/brands',
    ORDERS: '/api/admin/orders',
    USERS: '/api/admin/users',
  },
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
    REFRESH: '/api/auth/refresh',
  },
  PRODUCTS: {
    LIST: '/api/products',
    DETAIL: (id: string) => `/api/products/${id}`,
    DETAIL_BY_SLUG: (slug: string) => `/api/products/slug/${slug}`,
    SEARCH: '/api/products/search',
    CATEGORIES: '/api/categories',
    BY_CATEGORY: (category: string) => `/api/products/category/${category}`,
    GET_IMAGES: (productId: string) => `/api/products/${productId}/images`,

    FEATURED: (type: "bestsellers" | "new" | "sale") =>
      `/api/products/featured?type=${type}`,
  },
  BRANDS: {
    LIST: '/api/brands',
    DETAIL: (id: string) => `/api/brands/${id}`,
  },
  CATEGORIES: {
    LIST: '/api/categories',
    DETAIL: (id: string) => `/api/categories/${id}`,
    ROOT: '/api/categories/root',
    TREE: '/api/categories/tree',
    TREE_BY_ID: (id: string) => `/api/categories/tree/${id}`,
  },
  CART: {
    GET: '/api/carts',
    ADD_ITEM: '/api/carts/items',
    UPDATE_ITEM: (productVariantSizeId: string) =>
      `/api/carts/items/${productVariantSizeId}`,
    REMOVE_ITEM: (productVariantSizeId: string) =>
      `/api/carts/items/${productVariantSizeId}`,
  },
  ORDERS: {
    CREATE: '/api/orders',
    LIST: '/api/orders',
    DETAIL: (id: string) => `/api/orders/${id}`,
  },
  USER: {
    PROFILE: '/api/profile',
    UPDATE: '/api/user/update',
    ADDRESSES: '/api/user/addresses',
  },
  COUPON: {
    BASE: "/api/coupons"
  },
};

export const API_TIMEOUT = 10000; // 10 seconds
