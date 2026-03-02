import HeroSection from '@/components/home/HeroSection';
import CompanyIntroSection from '@/components/home/CompanyIntroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import CTASection from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CompanyIntroSection />
      <FeaturedProducts />
      <WhyChooseUs />
      <CTASection />
    </>
  );
}
