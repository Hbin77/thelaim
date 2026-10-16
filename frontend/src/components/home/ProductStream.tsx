'use client';

import { useEffect, useRef } from 'react';
import { Link } from '@/i18n/navigation';
import type { Product } from '@/types';

// 상품 사진이 두 줄로 반대 방향으로 흐른다. 스크롤이 빠를수록 빨라지고 기운다.
export default function ProductStream({ products }: { products: Product[] }) {
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const rows = rowsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!rows.length) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    let x = 0;
    let boost = 0;
    let lastY = window.scrollY;
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(rows[0].parentElement!);
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const y = window.scrollY;
      boost += (y - lastY) * 0.06;
      lastY = y;
      boost *= 0.9;
      if (!visible) return;
      x += 0.45 + Math.abs(boost);
      const skew = Math.max(-8, Math.min(8, boost * 0.6));
      rows.forEach((row, i) => {
        const half = row.scrollWidth / 2;
        const off = (x % half) * (i % 2 ? 1 : -1) - (i % 2 ? half : 0);
        row.style.transform = `translate3d(${off}px,0,0) skewX(${skew}deg)`;
      });
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  if (products.length === 0) return null;
  const half = Math.ceil(products.length / 2);
  const lines = [products.slice(0, half), products.slice(half)];

  return (
    <section className="overflow-hidden bg-ink py-[12vh]" aria-label="Collection">
      {lines.map((line, li) => (
        <div
          key={li}
          ref={(el) => {
            rowsRef.current[li] = el;
          }}
          className="flex w-max gap-3 py-1.5 will-change-transform md:gap-4"
        >
          {[...line, ...line].map((p, i) => (
            <Link
              key={`${p.id}-${i}`}
              href={{ pathname: '/products', query: { item: p.slug } }}
              tabIndex={i >= line.length ? -1 : undefined}
              aria-hidden={i >= line.length ? true : undefined}
              className="group relative block h-[34vh] min-h-[200px] w-[26vh] min-w-[150px] flex-none overflow-hidden rounded-[2px] bg-paper/5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image_url}
                alt={i < line.length ? p.name : ''}
                loading="lazy"
                className="h-full w-full object-cover grayscale-[.85] transition-[filter,transform] duration-700 ease-out-soft group-hover:scale-[1.05] group-hover:grayscale-0"
              />
            </Link>
          ))}
        </div>
      ))}
    </section>
  );
}
