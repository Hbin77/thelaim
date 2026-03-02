'use client';

import { useState, useCallback } from 'react';
import { useTranslations, useMessages } from 'next-intl';
import Container from '@/components/ui/Container';
import ProductSearch from '@/components/products/ProductSearch';
import CategoryTabs from '@/components/products/CategoryTabs';
import ProductGrid from '@/components/products/ProductGrid';
import ProductModal from '@/components/products/ProductModal';
import type { Product } from '@/types';

const PRODUCT_DATA = [
  { id: 1, slug: 'floral-ruffle-pants', category_slug: 'pants', image_url: '/images/products/summer-floral-pants.jpg', image_urls: ['/images/products/summer-floral-pants.jpg'], is_featured: true },
  { id: 2, slug: 'floral-pajama-set', category_slug: 'set', image_url: '/images/products/floral-pajama-set.jpg', image_urls: ['/images/products/floral-pajama-set.jpg'], is_featured: true },
  { id: 3, slug: 'pleats-wide-pants', category_slug: 'pants', image_url: '/images/products/summer-pleats-pants.jpg', image_urls: ['/images/products/summer-pleats-pants.jpg'], is_featured: true },
  { id: 4, slug: 'check-wide-pants', category_slug: 'pants', image_url: '/images/products/check-pants-collection.jpg', image_urls: ['/images/products/check-pants-collection.jpg'], is_featured: true },
  { id: 5, slug: 'floral-blouse', category_slug: 'top', image_url: '/images/products/floral-blouse-collection.jpg', image_urls: ['/images/products/floral-blouse-collection.jpg'], is_featured: true },
  { id: 6, slug: 'floral-home-dress', category_slug: 'set', image_url: '/images/products/floral-blouse-closeup.jpg', image_urls: ['/images/products/floral-blouse-closeup.jpg'], is_featured: false },
  { id: 7, slug: 'floral-long-dress-orange', category_slug: 'set', image_url: '/images/products/floral-dress-orange.jpg', image_urls: ['/images/products/floral-dress-orange.jpg'], is_featured: false },
  { id: 8, slug: 'toile-pattern-dress', category_slug: 'set', image_url: '/images/products/toile-pattern-dress.jpg', image_urls: ['/images/products/toile-pattern-dress.jpg'], is_featured: false },
];

const CATEGORY_SLUGS = ['pants', 'top', 'set'];
const CATEGORY_KEYS: Record<string, string> = {
  pants: 'filter_pants',
  top: 'filter_top',
  set: 'filter_set',
};

function PageHero() {
  const t = useTranslations('products');

  return (
    <section
      className="flex min-h-[50vh] items-center justify-center"
      style={{
        backgroundImage: 'linear-gradient(135deg, #004346 0%, #172A3A 100%)',
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

export default function ProductsPage() {
  const t = useTranslations('products');
  const messages = useMessages();
  const productItems = (messages as Record<string, unknown>).productItems as Record<string, { name: string; desc: string; specs: Record<string, string> }>;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const products: Product[] = PRODUCT_DATA.map((p) => ({
    ...p,
    name: productItems[p.slug]?.name ?? p.slug,
    description: productItems[p.slug]?.desc ?? '',
    category_name: t(CATEGORY_KEYS[p.category_slug]),
    specifications: productItems[p.slug]?.specs ?? {},
  }));

  const categories = CATEGORY_SLUGS.map((slug) => t(CATEGORY_KEYS[slug]));

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || product.category_name === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <PageHero />
      <div className="py-12">
        <Container>
          <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:max-w-sm">
              <ProductSearch onSearch={handleSearch} />
            </div>
            <CategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          <ProductGrid
            products={filteredProducts}
            onSelectProduct={setSelectedProduct}
          />
        </Container>
      </div>

      <ProductModal
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
