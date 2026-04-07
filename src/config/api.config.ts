export const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  // 📂 1. Luồng ADMIN (ROLE_ADMIN)
  // Chỉ dành cho Quản trị viên hệ thống
  ADMIN: {
    USERS: '/api/admin/users',
    USER_ID: (id: string) => `/api/admin/users/${id}`,
    ACTIVATE_USER: (id: string) => `/api/admin/users/${id}/activate`,
    DEACTIVATE_USER: (id: string) => `/api/admin/users/${id}/deactivate`,

    DASHBOARD: '/api/admin/dashboard',
    EXPORT_DASHBOARD: (type: string) => `/api/admin/dashboard/export/${type}`,

    // Quản lý cấu trúc (Write/Delete)
    BRANDS: '/api/admin/brands',
    BRAND_ID: (id: string) => `/api/admin/brands/${id}`,
    CATEGORIES: '/api/admin/categories',
    CATEGORY_ID: (id: string) => `/api/admin/categories/${id}`,
    COUPONS: '/api/admin/coupons',
    COUPON_ID: (id: string) => `/api/admin/coupons/${id}`,

    // Khử sự cố dữ liệu
    PRODUCT_RESTORE: (id: string) => `/api/admin/products/${id}/restore`,
    PRODUCT_HARD_DELETE: (id: string) => `/api/admin/products/${id}/hard`,
  },

  // 📂 2. Luồng STAFF (ROLE_STAFF & ROLE_ADMIN)
  // Quản lý cửa hàng, đơn hàng, sản phẩm
  STAFF: {
    ORDERS: '/api/staff/orders',
    ORDER_ID: (id: string) => `/api/staff/orders/${id}`,
    ORDER_STATUS: (id: string) => `/api/staff/orders/${id}/status`,
    ORDER_HISTORY: (id: string) => `/api/staff/orders/${id}/status-history`,
    EXPORT_ORDERS: '/api/staff/orders/export',
    
    PRODUCTS: '/api/staff/products',
    PRODUCT_ID: (id: string) => `/api/staff/products/${id}`,
    PRODUCT_STATUS: (id: string) => `/api/staff/products/${id}/status`,
    PRODUCT_ATTRIBUTES: (productId: string) => `/api/staff/products/${productId}/attributes`,
    PRODUCTS_SEARCH: '/api/staff/products/search',

    CHAT_SESSIONS: '/api/staff/chat/sessions',
    CHAT_MESSAGES: (sessionId: string) => `/api/staff/chat/sessions/${sessionId}/messages`,
    CHAT_CLOSE: (sessionId: string) => `/api/staff/chat/sessions/${sessionId}/close`,
    CHAT_READ: (sessionId: string) => `/api/staff/chat/sessions/${sessionId}/read`,
    CHAT_UPLOAD: '/api/staff/chat/upload',
    
    BRANDS: '/api/staff/brands',
    // Giám sát categories (Read)
    CATEGORIES: '/api/staff/categories',
    CATEGORIES_TREE: '/api/staff/categories/tree',
    COUPONS: '/api/staff/coupons',

    COLORS: '/api/staff/colors',
    COLOR_ID: (id: string) => `/api/staff/colors/${id}`,
    ATTRIBUTES: '/api/staff/attributes',
    ATTRIBUTE_ID: (id: string) => `/api/staff/attributes/${id}`,
    VARIANTS: '/api/staff/product-variants',
    VARIANT_ID: (id: string) => `/api/staff/product-variants/${id}`,
    VARIANT_IMAGES: '/api/staff/variant-images',
    VARIANT_IMAGE_ID: (id: string) => `/api/staff/variant-images/${id}`,
    VARIANT_IMAGES_BY_VARIANT: (variantId: string) => `/api/staff/product-variants/${variantId}/images`,
    VARIANT_SIZES: '/api/staff/product-variant-sizes',
    VARIANT_SIZE_ID: (id: string) => `/api/staff/product-variant-sizes/${id}`,
  },

  // 📂 3. Luồng CUSTOMER (Người dùng đã đăng nhập)
  // Cá nhân hóa cho khách hàng
  CUSTOMER: {
    PROFILE: '/api/customer/profile',
    CHANGE_PASSWORD: '/api/customer/profile/password',
    CARTS: '/api/customer/carts',
    CART_ITEMS: '/api/customer/carts/items',
    CART_ITEMS_CHANGE: '/api/customer/carts/items/change-variant',
    CART_ITEM: (id: string) => `/api/customer/carts/items/${id}`,
    ORDERS: '/api/customer/orders',
    MY_ORDERS: '/api/customer/orders/my',
    ADDRESSES: '/api/customer/addresses',
    ADDRESS_ID: (id: string) => `/api/customer/addresses/${id}`,
    WISHLIST: '/api/customer/wishlist',
    WISHLIST_ID: (id: string) => `/api/customer/wishlist/${id}`,
    RATINGS: '/api/customer/ratings',
    RATINGS_ORDER: (orderId: string) => `/api/customer/ratings/order/${orderId}`,
    RATING_ID: (id: string) => `/api/customer/ratings/${id}`,
  },

  // 📂 4. Luồng DISCOVERY (Public/Guest)
  // Không yêu cầu đăng nhập
  DISCOVERY: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh',
      ME: '/api/auth/me',
      ACCEPT_ACCOUNT: "/api/auth/accept",
      FORGOT_PASSWORD: "/api/auth/forgot-password",
      RESET_PASSWORD: "/api/auth/reset-password",
    },
    PRODUCTS: {
      LIST: '/api/products',
      DETAIL: (id: string) => `/api/products/${id}`,
      DETAIL_BY_SLUG: (slug: string) => `/api/products/slug/${slug}`,
      SEARCH: '/api/products/search',
      FEATURED: (type: string) => `/api/products/featured?type=${type}`,
      IMAGES: (id: string) => `/api/products/${id}/images`,
      VARIANTS: (id: string) => `/api/product-variants/product/${id}`,
    },
    BRANDS: {
      LIST: '/api/brands',
      DETAIL: (id: string) => `/api/brands/${id}`,
    },
    CATEGORIES: {
      LIST: '/api/categories',
      TREE: '/api/categories/tree',
      ROOT: '/api/categories/root',
      DETAIL: (id: string) => `/api/categories/${id}`,
    },
    RATINGS_BY_PRODUCT: (productId: string) => `/api/ratings/product/${productId}`,
    CHAT_SESSION: '/api/chat/session',
    CHAT_UPLOAD: '/api/chat/upload',
    CHAT_MESSAGES: (sessionId: string) => `/api/chat/${sessionId}/messages`,
    CHAT_READ: (sessionId: string) => `/api/chat/sessions/${sessionId}/read`,
    CHAT_MERGE: '/api/chat/merge',
    CHAT_FEEDBACK: (sessionId: string) => `/api/chat/${sessionId}/feedback`,
  },

  // Các endpoint tiện ích khác
  COUPON: {
    BASE: "/api/coupons"
  },
};

export const API_TIMEOUT = 10000; // 10 seconds

