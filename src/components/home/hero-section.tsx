import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const heroSlides = [
  {
    id: 1,
    title: "Bộ sưu tập mùa mới",
    subtitle: "Xuân / Hè 2026",
    description: "Khám phá những xu hướng mới nhất trong thời trang đương đại",
    cta: "Mua sắm ngay",
    link: "/products?category=new-arrivals",
    image:
      "https://theme.hstatic.net/200000690725/1001078549/14/slide_2_img.jpg?v=1054",
    align: "right" as const,
  },
  {
    id: 2,
    title: "Vẻ đẹp vượt thời gian",
    subtitle: "Bộ sưu tập thiết yếu",
    description:
      "Những thiết kế được tuyển chọn, định hình phong cách hiện đại",
    cta: "Khám phá bộ sưu tập",
    link: "/products?category=essentials",
    image:
      "https://theme.hstatic.net/200000690725/1001078549/14/slide_4_img.jpg?v=1054",
    align: "center" as const,
  },
  {
    id: 3,
    title: "Thời trang bền vững",
    subtitle: "Phong cách thân thiện môi trường",
    description: "Chất lượng cao cấp gắn liền với trách nhiệm môi trường",
    cta: "Mua sắm bền vững",
    link: "/products?category=sustainable",
    image:
      "https://theme.hstatic.net/200000690725/1001078549/14/slide_1_img.jpg?v=1054",
    align: "left" as const,
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // ===== DRAG STATE =====
  const startX = useRef<number | null>(null);
  const isDragging = useRef(false);

  // ===== AUTO SLIDE =====
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  };

  // ===== DRAG HANDLERS =====
  const handleDragStart = (clientX: number) => {
    startX.current = clientX;
    isDragging.current = true;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging.current || startX.current === null) return;

    const diff = clientX - startX.current;

    // nếu kéo quá 80px → chuyển slide
    if (Math.abs(diff) > 80) {
      if (diff < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      isDragging.current = false;
      startX.current = null;
    }
  };

  const handleDragEnd = () => {
    isDragging.current = false;
    startX.current = null;
  };

  return (
    <section
      className="relative h-[90vh] min-h-[600px] w-full overflow-hidden select-none"
      onMouseDown={(e) => handleDragStart(e.clientX)}
      onMouseMove={(e) => handleDragMove(e.clientX)}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
      onTouchEnd={handleDragEnd}
    >
      {/* Slides */}
      {heroSlides.map((s, index) => (
        <div
          key={s.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === currentSlide ? "opacity-100" : "opacity-0"
          )}
        >
          <img
            src={s.image}
            alt={s.title}
            className="h-full w-full object-cover pointer-events-none"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-black/20" />
        </div>
      ))}

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/50 p-3 text-white backdrop-blur-sm transition hover:bg-white hover:text-black"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/50 p-3 text-white backdrop-blur-sm transition hover:bg-white hover:text-black"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "h-1.5 transition-all duration-300",
              index === currentSlide
                ? "w-10 bg-white"
                : "w-4 bg-white/40 hover:bg-white/70"
            )}
          />
        ))}
      </div>
    </section>
  );
}