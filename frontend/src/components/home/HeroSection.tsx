'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';
import type { RingHandle } from './ring';

// 첫 화면: 검은 공간에 상품 사진이 둥근 진열대로 돈다. 가운데엔 로고 하나.
// 화면이 고정된 채 스크롤하면 로고가 물러나고 카메라가 진열대 안으로 들어간다.
export default function HeroSection({ products }: { products: Product[] }) {
  const t = useTranslations('hero');
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [noGl, setNoGl] = useState(false);
  const [hoverName, setHoverName] = useState<string | null>(null);
  // 사라지는 동안에도 마지막 이름을 보여 준다
  const [labelText, setLabelText] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section || products.length === 0) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let handle: RingHandle | null = null;
    let cancelled = false;
    // 진열대가 듬성하지 않게 14장 이상으로 채운다
    const list = products.filter((p) => p.image_url).map((p) => ({ src: p.image_url, slug: p.slug, name: p.name }));
    const items = list.length >= 14 ? list : [...list, ...list].slice(0, 18);

    const onScroll = () => {
      const r = section.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = span > 0 ? Math.min(Math.max(-r.top / span, 0), 1) : 0;
      section.style.setProperty('--hp', p.toFixed(4));
      handle?.setProgress(p);
    };
    // 이름표는 커서를 따라다닌다(리렌더 없이 위치만 바꾼다)
    const onMove = (e: PointerEvent) => {
      if (labelRef.current) labelRef.current.style.transform = `translate3d(${e.clientX + 18}px, ${e.clientY + 18}px, 0)`;
    };

    import('./ring').then(({ mountRing }) => {
      if (cancelled) return;
      handle = mountRing(canvas, items, {
        reduce,
        onReady: () => setReady(true),
        onPick: (slug) => router.push({ pathname: '/products', query: { item: slug } }),
        onHover: (name) => {
          setHoverName(name);
          if (name) setLabelText(name);
        },
      });
      if (!handle) setNoGl(true);
      onScroll();
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelled = true;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
      handle?.dispose();
    };
  }, [products, router]);

  return (
    <section
      ref={sectionRef}
      className="hero-pin relative h-[220svh] bg-ink motion-reduce:h-svh"
      aria-label={t('tagline')}
    >
      <div className="sticky top-0 h-svh min-h-[560px] overflow-hidden">
        {/* 진열대 아래 바닥에 떨어지는 은은한 조명 */}
        <div aria-hidden="true" className="hero-floor pointer-events-none absolute inset-0" />
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={cn('absolute inset-0 h-full w-full touch-pan-y transition-opacity duration-[1600ms]', ready ? 'opacity-100' : 'opacity-0')}
        />
        {noGl && (
          <div aria-hidden="true" className="absolute inset-0 grid grid-cols-3 gap-px opacity-40 md:grid-cols-6">
            {products.slice(0, 12).map((p) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={p.id} src={p.image_url} alt="" className="h-full w-full object-cover grayscale" />
            ))}
          </div>
        )}
        <div aria-hidden="true" className="hero-vignette pointer-events-none absolute inset-0" />

        <div className="hero-logo pointer-events-none absolute inset-x-0 top-[13svh] md:top-[11svh]">
          <div className="text-center">
            <h1 className="relative mx-auto h-[clamp(68px,11.5vw,164px)] w-[clamp(250px,42vw,600px)] animate-[logoIn_1.6s_.2s_cubic-bezier(.16,1,.3,1)_both]">
              <span className="sr-only">THELAIM</span>
              <Image src="/images/logo.png" alt="" fill priority sizes="600px" className="object-contain brightness-0 invert" />
            </h1>
            <p className="hero-tagline mx-auto mt-8 max-w-[80vw] text-[11px] uppercase tracking-[0.22em] text-paper/70 md:text-[12px] md:tracking-[0.3em]">
              <span className="block animate-[fadeUp_1.4s_.9s_cubic-bezier(.16,1,.3,1)_both]">{t('tagline')}</span>
            </p>
          </div>
        </div>

        {/* 스크롤 안내: 첫 화면에서만 */}
        <div aria-hidden="true" className="hero-cue pointer-events-none absolute bottom-7 left-1/2 h-12 w-px -translate-x-1/2 overflow-hidden bg-paper/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[drip_2.2s_cubic-bezier(.6,0,.2,1)_infinite] bg-paper/70" />
        </div>
      </div>

      {/* 마우스를 댄 상품 이름 */}
      <div
        ref={labelRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-50 hidden [@media(pointer:fine)]:block"
      >
        <div
          className={cn(
            'flex items-center gap-2 whitespace-nowrap bg-paper px-3 py-2 text-[12px] font-medium tracking-wide text-ink transition-[opacity,transform] duration-300 ease-out',
            hoverName ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
          )}
        >
          {labelText}
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
        </div>
      </div>
    </section>
  );
}
