'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Modal from '@/components/ui/Modal';
import { buttonClass, Arrow } from '@/components/ui/Button';
import { COMPANY } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export default function ProductModal({ product: current, open, onClose }: ProductModalProps) {
  const t = useTranslations('products');
  const ui = useTranslations('ui');
  const tCommon = useTranslations('common');
  const [activeImage, setActiveImage] = useState(0);
  const touchX = useRef<number | null>(null);
  // 닫히는 동안에도 내용이 남아 있게 마지막 상품을 기억한다
  const lastRef = useRef<Product | null>(current);
  if (current) lastRef.current = current;
  const product = current ?? lastRef.current;

  useEffect(() => setActiveImage(0), [product?.slug]);

  const images = product ? (product.image_urls?.length ? product.image_urls : [product.image_url]).filter(Boolean) : [];
  const go = (d: number) => setActiveImage((i) => (i + d + images.length) % images.length);

  // 창이 열려 있으면 키보드 좌우로 사진을 넘긴다
  useEffect(() => {
    if (!open || images.length < 2) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') setActiveImage((i) => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setActiveImage((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, images.length]);

  return (
    <Modal open={open && !!current} onClose={onClose} label={product?.name} closeLabel={tCommon('close')} className="md:max-w-5xl">
      {product && (
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:gap-10">
          {/* 사진: 화살표·손가락 밀기·키보드 좌우 */}
          <div>
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-white"
              onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (touchX.current === null || images.length < 2) return;
                const dx = e.changedTouches[0].clientX - touchX.current;
                if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
                touchX.current = null;
              }}
            >
              {images.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src + i}
                  src={src}
                  alt={i === activeImage ? product.name : ''}
                  aria-hidden={i !== activeImage}
                  className={cn('absolute inset-0 h-full w-full object-cover transition-opacity duration-500', i === activeImage ? 'opacity-100' : 'opacity-0')}
                />
              ))}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label={ui('image_prev')}
                    className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink shadow backdrop-blur transition-colors hover:bg-paper"
                  >
                    <Arrow className="h-4 w-4 rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label={ui('image_next')}
                    className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink shadow backdrop-blur transition-colors hover:bg-paper"
                  >
                    <Arrow className="h-4 w-4" />
                  </button>
                  <span className="absolute bottom-3 left-3 rounded-full bg-ink/80 px-2.5 py-0.5 text-[12px] font-semibold tabular-nums text-paper">
                    {activeImage + 1} / {images.length}
                  </span>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-2 flex gap-2 overflow-x-auto p-1 scrollbar-hide">
                {images.map((img, i) => (
                  <button
                    key={img + i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    aria-label={ui('image_n', { n: i + 1 })}
                    aria-pressed={i === activeImage}
                    className={cn(
                      'h-16 w-14 flex-none overflow-hidden rounded-[3px] bg-white ring-offset-2 ring-offset-paper transition',
                      i === activeImage ? 'ring-2 ring-ink' : 'opacity-70 ring-1 ring-line hover:opacity-100'
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 정보 */}
          <div className="flex flex-col md:py-2">
            <p className="text-sm font-semibold text-olive">{product.category_name}</p>
            <h2 className="mt-1 text-[clamp(1.6rem,3vw,2.25rem)] font-extrabold leading-tight tracking-[-0.04em] text-ink">{product.name}</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-2">{product.description}</p>

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mt-8">
                <h3 className="eyebrow text-ink-3">{t('specifications')}</h3>
                <dl className="mt-3 border-t border-line">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-4 border-b border-line py-3 text-[15px]">
                      <dt className="font-medium text-ink-3">{key}</dt>
                      <dd className="font-semibold text-ink">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="mt-auto grid gap-2 pt-8 sm:grid-cols-2">
              <Link href={`/contact?product=${product.slug}`} className={buttonClass('primary', 'lg')}>
                {t('inquiry')}
                <Arrow />
              </Link>
              <a href={`tel:${COMPANY.phone}`} className={buttonClass('secondary', 'lg')}>
                {ui('call')}
              </a>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
