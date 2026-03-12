import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Check } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Giả lập gọi API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    setIsLoading(false);
  };

  return (
    <section className="bg-foreground py-16 md:py-24 bg-foreground">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 font-mb text-3xl font-medium text-card md:text-4xl">
            Tham gia cộng đồng LUXE
          </h2>
          <p className="mb-8 text-card/80">
            Đăng ký nhận bản tin để được truy cập sớm các bộ sưu tập mới, ưu đãi
            đặc biệt và cảm hứng thời trang được gửi thẳng đến email của bạn.
          </p>

          {isSubmitted ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-card/10 px-6 py-3 text-card">
              <Check className="h-5 w-5" />
              <span>Cảm ơn bạn đã đăng ký!</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex max-w-xl items-center gap-3"
            >
              <Input
                type="email"
                placeholder="Nhập địa chỉ email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 flex-2 border-card/100 bg-card/10 text-card placeholder:text-card/50 focus-visible:ring-card/50"
              />
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="flex-none whitespace-nowrap min-w-30 bg-card text-foreground hover:bg-card/90"
              >
                {isLoading ? "Đang đăng ký..." : "Đăng ký"}
              </Button>
            </form>
          )}

          <p className="mt-4 text-xs text-card/60">
            Khi đăng ký, bạn đồng ý với Chính sách quyền riêng tư và cho phép
            chúng tôi gửi thông tin cập nhật.
          </p>
        </div>
      </div>
    </section>
  );
}
