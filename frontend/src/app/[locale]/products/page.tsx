import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { getProducts, getCategories } from '@/lib/api';
import PageHero from '@/components/ui/PageHero';
import ProductsPageClient from '@/components/products/ProductsPageClient';
import type { Product, Category } from '@/types';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'products' });

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
      <PageHero eyebrow="The Collection" title={t('title')} subtitle={t('subtitle')} />
      <Suspense>
        <ProductsPageClient products={products} categories={categories} />
      </Suspense>
    </>
  );
}
