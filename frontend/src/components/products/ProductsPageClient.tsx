'use client';

import { useState, useCallback } from 'react';
import { useMessages } from 'next-intl';
import Container from '@/components/ui/Container';
import ProductSearch from '@/components/products/ProductSearch';
import CategoryTabs from '@/components/products/CategoryTabs';
import ProductGrid from '@/components/products/ProductGrid';
import ProductModal from '@/components/products/ProductModal';
import type { Product, Category } from '@/types';

interface ProductsPageClientProps {
  products: Product[];
  categories: Category[];
}

export default function ProductsPageClient({ products: apiProducts, categories }: ProductsPageClientProps) {
  const messages = useMessages();
  const productItems = (messages as Record<string, unknown>).productItems as Record<string, { name: string; desc: string; specs: Record<string, string> }>;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // API는 상품 레지스트리(카테고리·이미지·노출)를, messages는 로케일 카피를 담당한다.
  const products: Product[] = apiProducts.map((p) => ({
    ...p,
    name: productItems[p.slug]?.name ?? p.name,
    description: productItems[p.slug]?.desc ?? p.description,
    specifications: productItems[p.slug]?.specs ?? p.specifications,
  }));

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || product.category_slug === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-12">
      <Container>
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-sm">
            <ProductSearch onSearch={handleSearch} />
          </div>
          <CategoryTabs
            categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        <ProductGrid
          key={`${activeCategory}-${searchQuery}`}
          products={filteredProducts}
          onSelectProduct={setSelectedProduct}
        />
      </Container>

      <ProductModal
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
