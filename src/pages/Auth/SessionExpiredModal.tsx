import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";

interface Props {
  open: boolean;
  onLogin: () => void;
}

export default function SessionExpiredModal({ open, onLogin }: Props) {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 w-[420px] text-center shadow-xl">
        <h2 className="text-xl font-semibold mb-2">
          Phiên đăng nhập đã hết hạn
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Vui lòng đăng nhập lại để tiếp tục sử dụng hệ thống.
        </p>

        <Button
          className="w-full bg-black text-white"
          onClick={() => {
            onLogin();
            navigate("/login");
          }}
        >
          Đăng nhập lại
        </Button>
      </div>
    </div>
  );
}
