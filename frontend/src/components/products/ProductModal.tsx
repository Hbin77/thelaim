'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { Product } from '@/types';

interface ProductModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, open, onClose }: ProductModalProps) {
  const t = useTranslations('products');
  const [activeImage, setActiveImage] = useState(0);

  if (!product) return null;

  const images = product.image_urls?.length ? product.image_urls : [product.image_url];

  return (
    <Modal open={open} onClose={onClose} className="max-w-2xl">
      {/* Image gallery */}
      <div className="mb-6">
        <div className="aspect-[3/2] overflow-hidden rounded-xl bg-gradient-to-br from-navy/5 to-ocean/10">
          {images[activeImage] && (
            <img
              src={images[activeImage]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        {images.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                  i === activeImage ? 'border-emerald' : 'border-transparent'
                }`}
              >
                {img && (
                  <img src={img} alt="" className="h-full w-full object-cover" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product info */}
      <Badge variant="primary" className="mb-3">{product.category_name}</Badge>
      <h2 className="text-h2 text-navy">{product.name}</h2>
      <p className="mt-3 leading-relaxed text-navy/70">{product.description}</p>

      {/* Specifications */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-navy">{t('specifications')}</h3>
          <table className="mt-3 w-full">
            <tbody>
              {Object.entries(product.specifications).map(([key, value]) => (
                <tr key={key} className="border-b border-navy/10">
                  <td className="py-2.5 pr-4 text-sm font-medium text-navy/60">{key}</td>
                  <td className="py-2.5 text-sm text-navy">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8">
        <Link href={`/contact?product=${product.slug}`}>
          <Button size="lg" className="w-full">
            {t('inquiry')}
          </Button>
        </Link>
      </div>
    </Modal>
  );
}
