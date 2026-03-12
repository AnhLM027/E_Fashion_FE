import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    location: "New York, Mỹ",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    rating: 5,
    text: "Chất lượng trang phục của LUXE thực sự vượt trội. Mỗi sản phẩm tôi mua đều trở thành món đồ không thể thiếu trong tủ quần áo. Sự chăm chút trong từng chi tiết và định hướng bền vững khiến tôi trở thành khách hàng trung thành.",
  },
  {
    id: 2,
    name: "James Chen",
    location: "London, Anh",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    rating: 4,
    text: "Cuối cùng tôi cũng tìm được một thương hiệu kết hợp hoàn hảo giữa phong cách và chất lượng. Form dáng rất vừa vặn, và đội ngũ chăm sóc khách hàng đã hỗ trợ tôi vượt ngoài mong đợi. Rất đáng để giới thiệu!",
  },
  {
    id: 3,
    name: "Emma Thompson",
    location: "Sydney, Úc",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    rating: 5,
    text: "Tôi thực sự ấn tượng với vẻ đẹp thanh lịch vượt thời gian của các bộ sưu tập LUXE. Những thiết kế này có thể linh hoạt từ ban ngày đến buổi tối, hoàn toàn xứng đáng với giá trị bỏ ra. Đúng nghĩa là những món đồ đầu tư lâu dài.",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  return (
    <section className="py-16 md:py-24 bg-foreground">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-mb text-3xl font-medium md:text-4xl">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Hãy gia nhập cùng hàng nghìn khách hàng hài lòng đã trải nghiệm sự
            khác biệt của LUXE
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          {/* Quote Icon */}
          <Quote className="absolute -top-4 left-0 h-16 w-16 text-muted opacity-20 md:-left-8" />

          {/* Testimonial Cards */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full shrink-0 px-4 md:px-12"
                >
                  <div className="text-center">
                    {/* Rating */}
                    <div className="mb-6 flex justify-center gap-1">
                      {Array.from({ length: testimonial.rating }).map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 fill-accent text-accent fill-yellow-300"
                          />
                        ),
                      )}
                    </div>

                    {/* Quote */}
                    <blockquote className="mb-8 text-lg leading-relaxed text-foreground md:text-xl">
                      &quot;{testimonial.text}&quot;
                    </blockquote>

                    {/* Author */}
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-full">
                        <img
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prev}
              className="rounded-full border border-border p-2 transition-colors hover:bg-muted"
              aria-label="Đánh giá trước"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((t, index) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "h-2 w-2 rounded-full transition-colors",
                    index === currentIndex ? "bg-foreground" : "bg-border",
                  )}
                  aria-label={`Chuyển đến đánh giá ${index + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              className="rounded-full border border-border p-2 transition-colors hover:bg-muted"
              aria-label="Đánh giá tiếp theo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
