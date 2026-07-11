'use client';

import { useTranslations, useMessages } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import HorizontalScroll from '@/components/animations/HorizontalScroll';
import FadeIn from '@/components/animations/FadeIn';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { Product } from '@/types';

function ProductCard({ product }: { product: Product }) {
  const t = useTranslations('products');
  const messages = useMessages();
  const productItems = (messages as Record<string, unknown>).productItems as Record<string, { name: string; desc: string; specs: Record<string, string> }>;
  const name = productItems[product.slug]?.name ?? product.name;

  return (
    <div className="group w-72 flex-shrink-0 overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-xl lg:w-auto lg:flex-shrink">
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-navy/5 to-ocean/10">
        {product.image_url && (
          <img src={product.image_url} alt={name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/20 to-transparent transition-opacity group-hover:opacity-0" />
      </div>
      <div className="p-5">
        <Badge variant="primary" className="mb-2">{product.category_name}</Badge>
        <h3 className="text-h3 text-navy">{name}</h3>
        <Link href={`/products`}>
          <Button variant="ghost" size="sm" className="mt-3 text-ocean">
            {t('view_detail')}
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const t = useTranslations('products');
  const tCommon = useTranslations('common');
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-navy/[0.02]">
      <Container>
        <SectionHeading title={t('featured')} subtitle={t('subtitle')} />
      </Container>

      {isDesktop ? (
        <HorizontalScroll className="mt-12">
          <div className="flex gap-8 px-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </HorizontalScroll>
      ) : (
        <Container>
          <div className="mt-12 grid grid-cols-2 gap-4">
            {products.slice(0, 4).map((product, i) => (
              <FadeIn key={product.id} delay={i * 0.1}>
                <ProductCard product={product} />
              </FadeIn>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/products">
              <Button variant="secondary" size="lg">
                {tCommon('view_all')}
              </Button>
            </Link>
          </div>
        </Container>
      )}
    </section>
  );
}
