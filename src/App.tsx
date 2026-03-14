import { Routes, Route } from "react-router-dom";
import { ROUTES } from "./config/routes";

import { useAuth } from "@/features/auth/hooks/useAuth";

import ScrollToTop from "@/components/Page/ScrollToTop";

import { Toaster } from "sonner";

import RequireAdmin from "@/features/auth/components/RequireAdmin";

import MainLayout from "./layouts/MainLayout/MainLayout";
import AuthLayout from "./layouts/AuthLayout/AuthLayout";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";

import Home from "./pages/Home/Home";
// import CartPage from "./pages/Cart/CartPage";

import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage";
import AcceptAccountPage from "./pages/Auth/AcceptAccountPage";

import ProductsPage from "./pages/Product/ProductsPage";
import ProductDetailPage from "./pages/Product/ProductDetailPage";
import CartPage from "./pages/Cart/CartPage";

import CheckoutPage from "./pages/Checkout/CheckoutPage";

import PaymentInfoPage from "./pages/Payment/PaymentInfoPage";
import OrdersPage from "./pages/Orders/OrdersPage";
import OrderDetailPage from "./pages/Orders/OrderDetailPage";

import ProfilePage from "@/pages/Profile/ProfilePage";
import WishlistPage from "./pages/Wishlist/WishlistPage";
import MyCouponsPage from "./pages/Coupon/MyCouponsPage";

import AdminDashboardPage from "./pages/Admin/Dashboard/AdminDashboardPage";
import AdminProductsPage from "./pages/Admin/Products/AdminProductsPage";
import AdminCategoriesPage from "./pages/Admin/Categories/AdminCategoriesPage";
import AdminBrandsPage from "./pages/Admin/Brands/AdminBrandsPage";
import AdminOrdersPage from "./pages/Admin/Orders/AdminOrdersPage";
import AdminOrderDetailPage from "./pages/Admin/Orders/AdminOrderDetailPage";
import AdminUsersPage from "./pages/Admin/Users/AdminUsersPage";
import AdminProductDetailPage from "./pages/Admin/Products/AdminProductDetailPage";
import AdminColorPage from "./pages/Admin/Products/AdminColorPage";
import AdminCouponsPage from "./pages/Admin/Coupons/AdminCouponsPage";
// import AdminReviewsPage from "./pages/Admin/Reviews/AdminReviewsPage";
import AdminChatsPage from "./pages/Admin/Chats/AdminChatsPage";
// import AdminKnowledgeBasePage from "./pages/Admin/KnowledgeBase/AdminKnowledgeBasePage";

import AboutPage from "@/pages/Supports/AboutPage";
import ContactPage from "@/pages/Supports/ContactPage";
import ShippingPolicyPage from "@/pages/Supports/ShippingPolicyPage";
import ReturnPolicyPage from "@/pages/Supports/ReturnPolicyPage";

function App() {
  const { isAuthInitialized } = useAuth();

  if (!isAuthInitialized) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full" />
      </div>
    );
  }
  return (
    <>
      <ScrollToTop />
      <Toaster position="top-right" richColors />
      <Routes>
        {/* ===== MAIN LAYOUT ===== */}
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
          <Route
            path={ROUTES.PRODUCTS_BY_CATEGORY}
            element={<ProductsPage />}
          />
          <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />
          <Route path={ROUTES.CART} element={<CartPage />} />
          <Route path={ROUTES.ACCOUNT_PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
          <Route path="/payment-info/:orderId" element={<PaymentInfoPage />} />
          <Route path={ROUTES.ORDERS} element={<OrdersPage />} />
          <Route
            path={ROUTES.ORDER_DETAIL(":orderId")}
            element={<OrderDetailPage />}
          />
          <Route path={ROUTES.WISHLIST} element={<WishlistPage />} />
          <Route path={ROUTES.MY_COUPONS} element={<MyCouponsPage />} />

          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/shipping" element={<ShippingPolicyPage />} />
          <Route path="/returns" element={<ReturnPolicyPage />} />
        </Route>

        {/* ===== AUTH LAYOUT ===== */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
          <Route path={ROUTES.ACCEPT_ACCOUNT} element={<AcceptAccountPage />} />
        </Route>

        <Route element={<RequireAdmin />}>
          {/* ===== ADMIN LAYOUT ===== */}
          <Route element={<AdminLayout />}>
            <Route
              path={ROUTES.ADMIN_DASHBOARD}
              element={<AdminDashboardPage />}
            />
            <Route
              path={ROUTES.ADMIN_PRODUCTS}
              element={<AdminProductsPage />}
            />
            <Route
              path={ROUTES.ADMIN_PRODUCT_DETAIL(":id")}
              element={<AdminProductDetailPage />}
            />
            <Route path={ROUTES.ADMIN_COLORS} element={<AdminColorPage />} />
            <Route
              path={ROUTES.ADMIN_CATEGORIES}
              element={<AdminCategoriesPage />}
            />
            <Route path={ROUTES.ADMIN_BRANDS} element={<AdminBrandsPage />} />
            <Route path={ROUTES.ADMIN_ORDERS} element={<AdminOrdersPage />} />
            <Route
              path={ROUTES.ADMIN_ORDER_DETAIL(":orderId")}
              element={<AdminOrderDetailPage />}
            />
            <Route path={ROUTES.ADMIN_USERS} element={<AdminUsersPage />} />
            <Route path={ROUTES.ADMIN_COUPONS} element={<AdminCouponsPage />} />
            <Route path={ROUTES.ADMIN_CHATS} element={<AdminChatsPage />} />
            {/* 
        <Route path={ROUTES.ADMIN_REVIEWS} element={<AdminReviewsPage />} />
        <Route path={ROUTES.ADMIN_KNOWLEDGE_BASE} element={<AdminKnowledgeBasePage />}
        /> */}
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
