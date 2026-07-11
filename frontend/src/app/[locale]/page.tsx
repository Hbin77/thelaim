import HeroSection from '@/components/home/HeroSection';
import CompanyIntroSection from '@/components/home/CompanyIntroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import CTASection from '@/components/home/CTASection';
import { getFeaturedProducts } from '@/lib/api';
import type { Product } from '@/types';

export const dynamic = 'force-dynamic';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let featured: Product[] = [];
  try {
    featured = await getFeaturedProducts(locale);
  } catch (error) {
    console.error('Failed to load featured products from API:', error);
  }

  return (
    <>
      <HeroSection />
      <CompanyIntroSection />
      <FeaturedProducts products={featured} />
      <WhyChooseUs />
      <CTASection />
    </>
  );
}
