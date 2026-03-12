import { Navigate, Link, useNavigate } from "react-router-dom";
import { LoginForm } from "../../features/auth/components/LoginForm";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { ROUTES } from "../../config/routes";
import { chatApi } from "@/features/chat/api/chatApi";

const LoginPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to={ROUTES.HOME} replace />;

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gray-50">
      {/* LEFT */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10">
          <Link
            to={ROUTES.HOME}
            className="font-serif text-3xl font-bold tracking-tight"
          >
            STYLE
          </Link>

          <h1 className="mt-8 text-3xl font-semibold tracking-tight">
            Chào mừng trở lại
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Đăng nhập để tiếp tục mua sắm
          </p>

          <div className="mt-10">
            <LoginForm
              onSuccess={async () => {
                try {
                  const guestId = localStorage.getItem("guestId");

                  if (guestId) {
                    await chatApi.mergeGuestSession(guestId);
                    localStorage.removeItem("guestId");
                  }
                } catch (err) {
                  console.error("Merge guest session failed", err);
                }

                navigate(ROUTES.HOME, { replace: true });
              }}
            />
          </div>

          <p className="mt-8 text-sm text-center text-gray-500">
            Chưa có tài khoản?{" "}
            <Link
              to={ROUTES.REGISTER}
              className="font-medium text-black hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="hidden lg:block relative">
        <img
          src="https://images.unsplash.com/photo-1520975916090-3105956dac38?w=1200&h=1600&fit=crop"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />

        <div className="relative h-full flex items-end p-16">
          <div className="text-white max-w-lg">
            <h2 className="text-3xl font-semibold mb-3">Thời trang cao cấp</h2>
            <p className="text-sm opacity-90 leading-relaxed">
              Phong cách hiện đại, chất lượng cao và thiết kế tinh tế dành riêng
              cho bạn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
