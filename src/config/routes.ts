export const ROUTES = {
  // ================= PUBLIC ROUTES =================
  HOME: "/",
  PRODUCTS: "/products",

  // Product
  PRODUCT_DETAIL: "/products/:productSlug",
  productDetail: (productSlug: string) =>
    `/products/${productSlug}`,

  // Category (product category page)
  PRODUCTS_BY_CATEGORY: "/products/category/*",
  productsByCategory: (categorySlug: string) =>
    `/products/category/${categorySlug}`,

  // Search
  SEARCH: "/search",

  // ================= AUTH ROUTES =================
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot_password",
  RESET_PASSWORD: "/reset_password",
  ACCEPT_ACCOUNT: "/accept_account",

  // ================= CATEGORY MANAGEMENT =================
  CATEGORIES: "/categories",
  CATEGORY_DETAIL: (categorySlug: string) =>
    `/categories/${categorySlug}`,

  // ================= BRAND =================
  BRANDS: "/brands",
  BRAND_DETAIL: (brandSlug: string) =>
    `/brands/${brandSlug}`,

  // ================= USER PROTECTED =================
  CART: "/cart",
  ORDERS: "/orders",
  ORDER_DETAIL: (id: string) => `/orders/${id}`,
  CHECKOUT: "/checkout",
  MY_COUPONS: "/my-coupons",

  ACCOUNT: "/account",
  ACCOUNT_PROFILE: "/account/profile",
  ACCOUNT_ADDRESSES: "/account/addresses",
  ACCOUNT_ORDERS: "/account/orders",

  WISHLIST: "/wishlist",

  // ================= ADMIN =================
  ADMIN_DASHBOARD: "/admin",

  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_PRODUCT_DETAIL: (id: string) =>
    `/admin/products/${id}`,

  ADMIN_COLORS: "/admin/colors",

  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_BRANDS: "/admin/brands",

  ADMIN_ORDERS: "/admin/orders",
  ADMIN_ORDER_DETAIL: (id: string) =>
    `/admin/orders/${id}`,

  ADMIN_USERS: "/admin/users",
  ADMIN_STAFFS: "/admin/staffs",

  ADMIN_COUPONS: "/admin/coupons",
  ADMIN_REVIEWS: "/admin/reviews",
  ADMIN_CHATS: "/admin/chats",
  ADMIN_KNOWLEDGE_BASE: "/admin/knowledge-base",
};