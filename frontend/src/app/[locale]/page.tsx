import HeroSection from '@/components/home/HeroSection';
import Lookbook from '@/components/home/Lookbook';
import ProductStream from '@/components/home/ProductStream';
import Statement from '@/components/home/Statement';
import CTASection from '@/components/home/CTASection';
import { getProducts } from '@/lib/api';
import type { Product } from '@/types';

export const dynamic = 'force-dynamic';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const products: Product[] = await getProducts({ limit: 100, lang: locale })
    .then((r) => r.items)
    .catch((error) => {
      console.error('Failed to load products from API:', error);
      return [];
    });

  return (
    <div className="bg-ink">
      <HeroSection />
      <Lookbook />
      <Statement />
      <ProductStream products={products} />
      <CTASection products={products} />
    </div>
  );
}
