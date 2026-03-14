import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Lock, CheckCircle, Loader2 } from "lucide-react";
import { authApi } from "@/features/auth/api/auth.api";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Link đặt lại mật khẩu không hợp lệ");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setError("");
      setLoading(true);

      await authApi.resetPassword({
        token,
        newPassword,
      });

      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không thể đặt lại mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm">
          {!success ? (
            <>
              {/* HEADER */}
              <div className="text-center mb-8">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-black text-white flex items-center justify-center">
                  <Lock size={20} />
                </div>

                <h1 className="text-2xl font-semibold">Đặt lại mật khẩu</h1>

                <p className="text-sm text-zinc-500 mt-2">
                  Nhập mật khẩu mới cho tài khoản của bạn.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* PASSWORD */}
                <div className="space-y-2">
                  <label className="text-sm text-zinc-600">Mật khẩu mới</label>

                  <div className="flex items-center border border-zinc-300 rounded-lg px-3 py-2 focus-within:border-black transition">
                    <Lock className="w-4 h-4 text-zinc-400 mr-2" />

                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="flex-1 outline-none text-sm"
                    />
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="space-y-2">
                  <label className="text-sm text-zinc-600">
                    Xác nhận mật khẩu
                  </label>

                  <div className="flex items-center border border-zinc-300 rounded-lg px-3 py-2 focus-within:border-black transition">
                    <Lock className="w-4 h-4 text-zinc-400 mr-2" />

                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="flex-1 outline-none text-sm"
                    />
                  </div>
                </div>

                {error && <div className="text-sm text-red-500">{error}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:bg-zinc-800 transition flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="animate-spin" size={16} />}
                  Cập nhật mật khẩu
                </button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-6">
              <CheckCircle className="mx-auto text-green-500" size={48} />

              <h2 className="text-xl font-semibold">
                Mật khẩu đã được cập nhật
              </h2>

              <p className="text-sm text-zinc-500">
                Bạn có thể đăng nhập lại bằng mật khẩu mới.
              </p>

              <Link
                to="/login"
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
