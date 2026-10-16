'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

// 한 문장: 스크롤하는 만큼 낱말이 아래에서 차오르듯 드러난다.
export default function Statement() {
  const t = useTranslations('hero');
  const ref = useRef<HTMLHeadingElement>(null);
  const text = t('title');
  const spaced = text.includes(' ');
  const words = spaced ? text.split(' ') : Array.from(text);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = [...el.querySelectorAll<HTMLElement>('[data-w]')];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      spans.forEach((s) => (s.style.transform = 'none'));
      return;
    }
    let raf = 0;
    const paint = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.92 - r.top) / (window.innerHeight * 0.6)));
      spans.forEach((s, i) => {
        const k = Math.min(1, Math.max(0, p * (spans.length + 2) - i));
        s.style.transform = `translate3d(0,${(1 - k) * 110}%,0)`;
        s.style.opacity = String(0.2 + k * 0.8);
      });
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener('scroll', kick, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', kick);
    };
  }, []);

  return (
    <section className="flex min-h-[90svh] items-center bg-ink py-24">
      <h2 ref={ref} className="wrap text-[clamp(2.4rem,7.4vw,7rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-paper">
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <span data-w className="inline-block will-change-transform">
              {w}
              {spaced && ' '}
            </span>
          </span>
        ))}
      </h2>
    </section>
  );
}
