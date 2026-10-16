'use client';

import { useEffect, useRef } from 'react';
import { useMessages } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { SHOTS, maxCssWidth, shotsOf, type Shot } from '@/lib/lookbook';
import { cn } from '@/lib/utils';

type ProductItems = Record<string, { name: string }>;

// 룩북: 상품 하나를 한 펼침면에. 옷 한 벌 사진은 크게 세우고, 여러 색 진열 사진은 가로로 넓게,
// 원단 근접 사진은 작게 겹친다. 어떤 사진도 원래 해상도보다 크게 늘리지 않는다.
// 움직임: 화면에 들어오면 아래에서 걷히듯 드러나고, 층마다 다른 속도로 흐른다(시차).
const SPREADS = ['rayon-button-frill-dress', 'stripe-wide-pants', 'rayon-lace-pants-character', 'check-gingham-pants', 'pleats-rayon-dress'];

function Frame({ shot, className, speed = 0, sizes }: { shot: Shot; className?: string; speed?: number; sizes?: string }) {
  return (
    <div data-speed={speed} className={cn('lb-frame relative will-change-transform', className)} style={{ maxWidth: maxCssWidth(shot) }}>
      <div className="lb-clip overflow-hidden rounded-[2px]" style={{ aspectRatio: `${shot.w} / ${shot.h}` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={shot.src} alt="" width={shot.w} height={shot.h} loading="lazy" sizes={sizes} className="lb-img h-full w-full object-cover" />
      </div>
    </div>
  );
}

export default function Lookbook() {
  const items = ((useMessages() as Record<string, unknown>).productItems ?? {}) as ProductItems;
  const ref = useRef<HTMLElement>(null);
  const panorama = SHOTS.find((s) => s.kind === 'panorama');

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const frames = [...root.querySelectorAll<HTMLElement>('.lb-frame')];
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add('lb-in'), io.unobserve(e.target))),
      { rootMargin: '0px 0px -12% 0px' }
    );
    frames.forEach((f) => io.observe(f));
    if (reduce) {
      frames.forEach((f) => f.classList.add('lb-in'));
      return () => io.disconnect();
    }
    let raf = 0;
    const paint = () => {
      raf = 0;
      const vh = window.innerHeight;
      frames.forEach((f) => {
        const s = Number(f.dataset.speed || 0);
        if (!s) return;
        const r = f.getBoundingClientRect();
        const mid = r.top + r.height / 2 - vh / 2;
        f.style.transform = `translate3d(0,${(-mid * s).toFixed(1)}px,0)`;
      });
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', kick);
    };
  }, []);

  return (
    <section ref={ref} className="bg-ink pb-[14vh] text-paper" aria-label="Lookbook">
      {SPREADS.map((slug, i) => {
        const shots = shotsOf(slug);
        const single = shots.find((s) => s.kind === 'single');
        const coll = shots.find((s) => s.kind === 'collection');
        const detail = shots.find((s) => s.kind === 'detail');
        if (!single || !coll) return null;
        const flip = i % 2 === 1;
        return (
          <Link
            key={slug}
            href={{ pathname: '/products', query: { item: slug } }}
            className="wrap group relative grid grid-cols-12 items-start gap-x-4 py-[12vh] md:gap-x-8"
          >
            {/* 옷 한 벌: 크게 세운다 */}
            <div className={cn('col-span-9 md:col-span-5', flip ? 'md:col-start-8' : 'md:col-start-1')}>
              <Frame shot={single} speed={0.04} className="w-full" />
              <p className="mt-5 text-[15px] text-paper/80 md:text-base">{items[slug]?.name}</p>
            </div>
            {/* 여러 색 진열: 가로로 넓게, 반대편에 */}
            <div className={cn('relative col-span-11 mt-10 md:col-span-6 md:mt-[18vh]', flip ? 'col-start-2 md:col-start-1 md:row-start-1' : 'col-start-2 md:col-start-7')}>
              <Frame shot={coll} speed={0.1} className={cn('w-full', flip ? 'ml-auto' : '')} />
              {/* 원단 근접: 작게 겹친다 */}
              {detail && (
                <Frame
                  shot={detail}
                  speed={0.2}
                  className={cn('absolute -bottom-[14%] w-[38%] max-w-[300px] shadow-[0_24px_50px_-20px_rgb(0_0_0/.7)]', flip ? '-right-[6%]' : '-left-[10%]')}
                />
              )}
            </div>
          </Link>
        );
      })}

      {/* 아주 가로로 긴 진열 사진: 원래 크기 안에서 가운데 */}
      {panorama && (
        <Link href={{ pathname: '/products', query: { item: panorama.slug } }} className="wrap block py-[10vh]">
          <Frame shot={panorama} className="mx-auto w-full" />
        </Link>
      )}
    </section>
  );
}
