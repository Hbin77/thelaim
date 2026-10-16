'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useMessages, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';
import ProductSearch from '@/components/products/ProductSearch';
import CategoryTabs from '@/components/products/CategoryTabs';
import ProductGrid from '@/components/products/ProductGrid';
import ProductModal from '@/components/products/ProductModal';
import type { Product, Category } from '@/types';

interface ProductsPageClientProps {
  products: Product[];
  categories: Category[];
}

type ProductItems = Record<string, { name: string; desc: string; specs: Record<string, string> }>;

export default function ProductsPageClient({ products: apiProducts, categories }: ProductsPageClientProps) {
  const messages = useMessages();
  const ui = useTranslations('ui');
  const productItems = ((messages as Record<string, unknown>).productItems ?? {}) as ProductItems;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // 주소의 ?category=분류, ?item=상품 으로 바로 열 수 있다(홈의 원단·추천 제품에서 넘어올 때)
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(() => searchParams.get('category') ?? 'all');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(() => searchParams.get('item'));

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // API는 상품 레지스트리(카테고리·이미지·노출)를, messages는 로케일 카피를 담당한다.
  const products: Product[] = useMemo(
    () =>
      apiProducts.map((p) => ({
        ...p,
        name: productItems[p.slug]?.name ?? p.name,
        description: productItems[p.slug]?.desc ?? p.description,
        specifications: productItems[p.slug]?.specs ?? p.specifications,
      })),
    [apiProducts, productItems]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: products.length };
    products.forEach((p) => p.category_slug && (c[p.category_slug] = (c[p.category_slug] ?? 0) + 1));
    return c;
  }, [products]);

  const filteredProducts = products.filter((product) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q || product.name.toLowerCase().includes(q);
    const matchesCategory = activeCategory === 'all' || product.category_slug === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedProduct = products.find((p) => p.slug === selectedSlug) ?? null;

  // 주소가 밖에서 바뀌면(메뉴의 '제품소개', 뒤로 가기) 화면도 따라간다
  useEffect(() => {
    setActiveCategory(searchParams.get('category') ?? 'all');
    setSelectedSlug(searchParams.get('item'));
  }, [searchParams]);

  // 고른 분류·상품을 주소에 남긴다(새로고침·공유해도 그대로)
  useEffect(() => {
    const q = new URLSearchParams();
    if (activeCategory !== 'all') q.set('category', activeCategory);
    if (selectedSlug) q.set('item', selectedSlug);
    const next = q.toString();
    if (next !== searchParams.toString()) {
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, selectedSlug]);

  return (
    <div className="pb-24 md:pb-32">
      <div className="sticky-sub sticky z-30 border-b border-line bg-paper/90 backdrop-blur-xl">
        <div className="wrap flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <CategoryTabs
            categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
            counts={counts}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          <div className="flex items-center gap-4">
            <p aria-live="polite" className="hidden whitespace-nowrap text-sm font-semibold text-ink-3 sm:block">
              {ui('result_count', { count: filteredProducts.length })}
            </p>
            <div className="w-full lg:w-72">
              <ProductSearch onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </div>

      <div className="wrap pt-10 md:pt-14">
        <ProductGrid products={filteredProducts} onSelectProduct={(p) => setSelectedSlug(p.slug)} />
      </div>

      <ProductModal product={selectedProduct} open={!!selectedProduct} onClose={() => setSelectedSlug(null)} />
    </div>
  );
}
