'use client';

import {motion, AnimatePresence} from 'framer-motion';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useTranslations } from 'next-intl';
import Skeleton from '@/components/ui/Skeleton';
import ProductCard from './ProductCard';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onSelectProduct: (product: Product) => void;
}

const GRID = 'grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4 xl:gap-y-14';

export default function ProductGrid({ products, loading, onSelectProduct }: ProductGridProps) {
  const t = useTranslations('products');
  const reduce = useReduceMotion();

  if (loading) {
    return (
      <div className={GRID}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="aspect-[4/5]" />
            <Skeleton className="mt-4 h-4 w-16" />
            <Skeleton className="mt-2 h-5 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-[4px] border border-dashed border-ink/20 py-24 text-center">
        <p className="text-lg text-ink-2">{t('no_results')}</p>
      </div>
    );
  }

  // 거르면 남은 카드가 제자리로 미끄러져 모인다
  return (
    <ul className={GRID}>
      <AnimatePresence mode="popLayout" initial={false}>
        {products.map((product, i) => (
          <motion.li
            key={product.id}
            layout={!reduce}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5, delay: reduce ? 0 : Math.min(i, 8) * 0.03, ease: [0.2, 0.7, 0.1, 1] }}
          >
            <ProductCard product={product} onSelect={onSelectProduct} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
