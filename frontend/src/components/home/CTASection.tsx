'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { COMPANY } from '@/lib/constants';
import type { Product } from '@/types';

// 마지막: 큰 전화번호와 문의. 마우스가 지나간 자리에 상품 사진이 잠깐 나타났다 사라진다.
export default function CTASection({ products }: { products: Product[] }) {
  const t = useTranslations('nav');
  const areaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const area = areaRef.current;
    if (!area || products.length === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce), (hover: none)').matches) return;
    const srcs = products.map((p) => p.image_url).filter(Boolean);
    srcs.forEach((s) => {
      const im = new window.Image();
      im.src = s;
    });
    let last = { x: 0, y: 0 };
    let k = 0;
    const onMove = (e: PointerEvent) => {
      const r = area.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (Math.hypot(x - last.x, y - last.y) < 90) return;
      last = { x, y };
      const img = document.createElement('img');
      img.src = srcs[k++ % srcs.length];
      img.alt = '';
      img.className = 'trail';
      img.style.left = `${x}px`;
      img.style.top = `${y}px`;
      area.appendChild(img);
      img.animate(
        [
          { opacity: 0, transform: 'translate(-50%,-50%) scale(.6)' },
          { opacity: 1, transform: 'translate(-50%,-50%) scale(1)', offset: 0.15 },
          { opacity: 1, transform: 'translate(-50%,-50%) scale(1)', offset: 0.6 },
          { opacity: 0, transform: 'translate(-50%,-38%) scale(.94)' },
        ],
        { duration: 1400, easing: 'cubic-bezier(.16,1,.3,1)' }
      ).onfinish = () => img.remove();
    };
    area.addEventListener('pointermove', onMove);
    return () => area.removeEventListener('pointermove', onMove);
  }, [products]);

  return (
    <section ref={areaRef} className="trail-area relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden bg-ink px-5 text-center">
      <Link
        href="/contact"
        className="relative z-10 text-[clamp(3.2rem,12vw,11rem)] font-semibold leading-none tracking-[-0.05em] text-paper transition-colors hover:text-lime"
      >
        {t('contact')}
      </Link>
      <div className="relative z-10 mt-10 flex flex-wrap justify-center gap-x-10 gap-y-3 text-lg text-paper/60 md:text-xl">
        <a href={`tel:${COMPANY.phone}`} className="inline-flex min-h-11 items-center tabular-nums transition-colors hover:text-paper">
          {COMPANY.phone}
        </a>
        <a href={`mailto:${COMPANY.email}`} className="inline-flex min-h-11 items-center transition-colors hover:text-paper">
          {COMPANY.email}
        </a>
      </div>
    </section>
  );
}
