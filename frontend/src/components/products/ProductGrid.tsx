'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import StaggerChildren, { staggerItemVariants } from '@/components/animations/StaggerChildren';
import Skeleton from '@/components/ui/Skeleton';
import ProductCard from './ProductCard';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onSelectProduct: (product: Product) => void;
}

export default function ProductGrid({ products, loading, onSelectProduct }: ProductGridProps) {
  const t = useTranslations('products');

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-md">
            <Skeleton className="aspect-[4/5]" />
            <div className="p-5 space-y-3">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-navy/50">{t('no_results')}</p>
      </div>
    );
  }

  return (
    <StaggerChildren className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <motion.div key={product.id} variants={staggerItemVariants}>
          <ProductCard product={product} onSelect={onSelectProduct} />
        </motion.div>
      ))}
    </StaggerChildren>
  );
}
