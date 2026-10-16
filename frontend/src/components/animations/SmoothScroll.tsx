'use client';

import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import { MotionConfig } from 'framer-motion';

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // '동작 줄이기'면 관성 스크롤을 쓰지 않는다
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;
    (window as unknown as Record<string, unknown>).__lenis = lenis;

    lenis.on('scroll', () => {
      import('gsap/ScrollTrigger').then((mod) => {
        mod.ScrollTrigger.update();
      });
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as Record<string, unknown>).__lenis;
    };
  }, []);

  // 기기에서 '동작 줄이기'를 켜면 framer-motion의 이동·확대 애니메이션을 끈다
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
