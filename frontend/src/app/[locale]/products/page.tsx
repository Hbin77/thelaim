import { useTranslations } from 'next-intl';
import { getProducts, getCategories } from '@/lib/api';
import ProductsPageClient from '@/components/products/ProductsPageClient';
import type { Product, Category } from '@/types';

export const dynamic = 'force-dynamic';

function PageHero() {
  const t = useTranslations('products');

  return (
    <section
      className="flex min-h-[50vh] items-center justify-center"
      style={{
        backgroundImage: 'linear-gradient(135deg, var(--color-teal-deep) 0%, var(--color-navy) 100%)',
      }}
    >
      <div className="px-4 text-center">
        <h1 className="font-serif-kr text-5xl font-normal tracking-[0.06em] text-white md:text-7xl">
          {t('title')}
        </h1>
        <p className="mt-5 text-lg font-light text-white/70 md:text-xl">{t('subtitle')}</p>
        <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-emerald" />
      </div>
    </section>
  );
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let products: Product[] = [];
  let categories: Category[] = [];
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      getProducts({ limit: 100, lang: locale }),
      getCategories(locale),
    ]);
    products = productsRes.items;
    categories = categoriesRes;
  } catch (error) {
    console.error('Failed to load products from API:', error);
  }

  return (
    <>
      <PageHero />
      <ProductsPageClient products={products} categories={categories} />
    </>
  );
}
