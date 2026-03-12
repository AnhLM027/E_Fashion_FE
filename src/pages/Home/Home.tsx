import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { PromoBanner } from "@/components/home/promo-banner";
import { ClaimCouponSection } from "@/components/home/claim-coupon-section";

export const Home: React.FC = () => {

  return (
    <div className="w-full">
      <HeroSection />
      <CategoryGrid />
      <ClaimCouponSection />
      <FeaturedProducts />
      <PromoBanner />
      <FeaturesSection />
      {/* <TestimonialsSection /> */}
      {/* <NewsletterSection /> */}
      
    </div>
  );
};

export default Home;
