'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Button from '@/components/ui/Button';

export default function HeroSection() {
  const t = useTranslations('hero');
  const sectionRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const brand = brandRef.current;
    if (!section || !brand) return;

    // Brand name character stagger reveal
    const text = brand.textContent || '';
    brand.innerHTML = text
      .split('')
      .map((char) =>
        char === ' '
          ? ' '
          : `<span style="display:inline-block;opacity:0;transform:translateY(40px)">${char}</span>`
      )
      .join('');

    const spans = brand.querySelectorAll('span');

    const tl = gsap.timeline();
    tl.to(spans, {
      opacity: 1,
      y: 0,
      duration: 0.08,
      stagger: 0.06,
      delay: 0.2,
      ease: 'power3.out',
    });

    // Gradient color shift
    gsap.to(section, {
      backgroundImage: 'linear-gradient(135deg, #172A3A 0%, #004346 50%, #09BC8A 100%)',
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(135deg, #004346 0%, #172A3A 100%)',
      }}
    >
      {/* Decorative elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-emerald/5 blur-3xl hidden md:block" />
        <div className="absolute -bottom-32 -left-20 h-[500px] w-[500px] rounded-full bg-teal-light/5 blur-3xl hidden md:block" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        {/* Brand tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0 }}
          className="mb-4 font-cormorant text-base font-light uppercase tracking-[0.35em] text-emerald"
        >
          {t('tagline')}
        </motion.p>

        {/* Brand name - large and prominent */}
        <h1
          ref={brandRef}
          className="text-[5rem] font-medium leading-none tracking-[0.08em] text-white sm:text-[7rem] md:text-[9rem]"
          style={{ fontFamily: 'var(--font-family-recoleta)' }}
        >
          THELAIM
        </h1>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mx-auto my-8 h-px w-24 bg-gradient-to-r from-transparent via-emerald to-transparent"
        />

        {/* Subtitle */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="font-serif-kr text-xl font-normal tracking-wide text-white/90 sm:text-2xl"
        >
          {t('title')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/60"
        >
          {t('subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link href="/products">
            <Button size="lg" className="bg-emerald px-8 text-white hover:bg-emerald/90">
              {t('cta_primary')}
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="secondary" size="lg" className="border-white/30 px-8 text-white hover:bg-white/10 hover:text-white">
              {t('cta_secondary')}
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown className="h-8 w-8 text-white/40" />
      </motion.div>
    </section>
  );
}
