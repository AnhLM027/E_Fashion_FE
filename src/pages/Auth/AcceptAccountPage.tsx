import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { authApi } from "@/features/auth/api/auth.api";

export default function AcceptAccountPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setError("Link kích hoạt không hợp lệ");
        setLoading(false);
        return;
      }

      try {
        await authApi.acceptAccount(token);
        setSuccess(true);
      } catch (err: any) {
        setError(
          err?.response?.data?.message || "Không thể kích hoạt tài khoản",
        );
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm text-center space-y-6">
          {loading && (
            <>
              <Loader2
                className="animate-spin mx-auto text-zinc-600"
                size={40}
              />
              <p className="text-zinc-600">Đang kích hoạt tài khoản...</p>
            </>
          )}

          {!loading && success && (
            <>
              <CheckCircle className="mx-auto text-green-500" size={48} />

              <h2 className="text-xl font-semibold">
                Tài khoản đã được kích hoạt
              </h2>

              <p className="text-sm text-zinc-500">
                Bạn có thể đăng nhập ngay bây giờ.
              </p>

              <Link
                to="/login"
                className="inline-block bg-black text-white px-6 py-3 rounded-lg text-sm hover:bg-zinc-800 transition"
              >
                Đăng nhập
              </Link>
            </>
          )}

          {!loading && !success && (
            <>
              <XCircle className="mx-auto text-red-500" size={48} />

              <h2 className="text-xl font-semibold">Kích hoạt thất bại</h2>

              <p className="text-sm text-zinc-500">{error}</p>

              <Link
                to="/login"
                className="inline-block bg-black text-white px-6 py-3 rounded-lg text-sm hover:bg-zinc-800 transition"
              >
                Quay lại đăng nhập
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
