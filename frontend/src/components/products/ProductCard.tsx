'use client';

import { useTranslations } from 'next-intl';
import { Arrow } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  const t = useTranslations('products');
  const second = product.image_urls?.find((u) => u && u !== product.image_url);

  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      aria-haspopup="dialog"
      className="group/btn block w-full rounded-[4px] text-left focus-visible:outline-offset-4"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-white">
        {product.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className={cn('absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out-soft group-hover/btn:scale-[1.04]', second && 'group-hover/btn:opacity-0')}
          />
        )}
        {second && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={second} alt="" loading="lazy" className="absolute inset-0 h-full w-full scale-[1.04] object-cover opacity-0 transition-opacity duration-700 group-hover/btn:opacity-100" />
        )}
        {product.image_urls?.length > 1 && (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-paper/90 px-2 py-0.5 text-[11px] font-bold tabular-nums text-ink-2 backdrop-blur">
            +{product.image_urls.length - 1}
          </span>
        )}
      </div>
      <div className="pt-4">
        <p className="text-[13px] font-semibold text-olive">{product.category_name}</p>
        <h3 className="mt-0.5 text-[17px] font-bold leading-snug tracking-[-0.02em] text-ink">{product.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-2">{product.description}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
          {t('view_detail')}
          <Arrow className="h-3.5 w-3.5" />
        </span>
      </div>
    </button>
  );
}
