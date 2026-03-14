import { useState } from "react";
import { Link } from "react-router-dom";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { ROUTES } from "@/config/routes";

export default function RegisterPage() {
  const [success, setSuccess] = useState(false);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gray-50">
      {/* LEFT */}
      <div className="hidden lg:block relative">
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=1600&fit=crop"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />

        <div className="relative h-full flex items-end p-16">
          <div className="text-white max-w-lg">
            <h2 className="text-3xl font-semibold mb-3">
              Bắt đầu phong cách của bạn
            </h2>

            <p className="text-sm opacity-90 leading-relaxed">
              Tạo tài khoản để theo dõi đơn hàng và nhận ưu đãi độc quyền từ
              STYLE.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10">
          <Link
            to={ROUTES.HOME}
            className="font-serif text-3xl font-bold tracking-tight"
          >
            STYLE
          </Link>

          {!success ? (
            <>
              <h1 className="mt-8 text-3xl font-semibold tracking-tight">
                Tạo tài khoản
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Đăng ký để mua sắm nhanh hơn
              </p>

              <div className="mt-10">
                <RegisterForm onSuccess={() => setSuccess(true)} />
              </div>

              <p className="mt-8 text-sm text-center text-gray-500">
                Đã có tài khoản?{" "}
                <Link
                  to={ROUTES.LOGIN}
                  className="font-medium text-black hover:underline"
                >
                  Đăng nhập
                </Link>
              </p>
            </>
          ) : (
            <div className="mt-10 text-center space-y-6">
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-4 rounded-lg">
                Tài khoản đã được tạo. Vui lòng kiểm tra email để kích hoạt tài
                khoản.
              </div>

              <Link
                to={ROUTES.LOGIN}
                className="inline-block bg-black text-white px-6 py-3 rounded-lg text-sm hover:bg-zinc-800 transition"
              >
                Đăng nhập
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
