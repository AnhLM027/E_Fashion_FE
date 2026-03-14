import { useState } from "react";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { authApi } from "@/features/auth/api/auth.api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await authApi.forgotPassword(email);

      setSent(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Không thể gửi email đặt lại mật khẩu",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm">
          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-black text-white flex items-center justify-center">
              <Mail size={20} />
            </div>

            <h1 className="text-2xl font-semibold">Quên mật khẩu</h1>

            <p className="text-sm text-zinc-500 mt-2">
              Nhập email để nhận liên kết đặt lại mật khẩu.
            </p>
          </div>

          {sent ? (
            <div className="space-y-6 text-center">
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-4 rounded-lg">
                Chúng tôi đã gửi link đặt lại mật khẩu tới email của bạn.
              </div>

              <Link
                to="/login"
                className="inline-block bg-black text-white px-6 py-3 rounded-lg text-sm hover:bg-zinc-800 transition"
              >
                Quay lại đăng nhập
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* EMAIL */}
              <div className="space-y-2">
                <label className="text-sm text-zinc-600">Email</label>

                <div className="flex items-center border border-zinc-300 rounded-lg px-3 py-2 focus-within:border-black transition">
                  <Mail className="w-4 h-4 text-zinc-400 mr-2" />

                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 outline-none text-sm"
                  />
                </div>
              </div>

              {error && <div className="text-sm text-red-500">{error}</div>}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:bg-zinc-800 transition flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="animate-spin" size={16} />}
                Gửi liên kết đặt lại mật khẩu
              </button>

              {/* BACK */}
              <div className="text-center text-sm text-zinc-500 flex items-center justify-center gap-2">
                <ArrowLeft size={16} />

                <Link
                  to="/login"
                  className="hover:underline text-black font-medium"
                >
                  Quay lại đăng nhập
                </Link>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-zinc-400 mt-6">
          Nếu bạn không nhận được email, hãy kiểm tra hộp thư spam.
        </p>
      </div>
    </div>
  );
}
