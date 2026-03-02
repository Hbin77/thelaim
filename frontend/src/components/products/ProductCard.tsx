'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  const t = useTranslations('products');

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-xl"
      onClick={() => onSelect(product)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-navy/5 to-ocean/10">
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="p-5">
        <Badge variant="primary" className="mb-2">{product.category_name}</Badge>
        <h3 className="text-lg font-semibold text-navy">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-navy/60">{product.description}</p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-3 text-ocean"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(product);
          }}
        >
          {t('view_detail')}
        </Button>
      </div>
    </motion.div>
  );
}
