'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import {motion, useScroll, useTransform} from 'framer-motion';
import { useReduceMotion } from '@/hooks/useReduceMotion';

export default function CompanyStory() {
  const t = useTranslations('about');
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduceMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  // 사진이 커튼처럼 열리며 천천히 올라온다
  const clip = useTransform(scrollYProgress, [0, 0.35], reduce ? ['inset(0% 0 0% 0)', 'inset(0% 0 0% 0)'] : ['inset(18% 0 18% 0)', 'inset(0% 0 0% 0)']);
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-30, 30]);

  return (
    <section className="pt-16 pb-[clamp(88px,12vw,176px)] md:pt-24" aria-labelledby="about-story">
      <div className="wrap grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
        <div>
          <p className="eyebrow text-ink-3">
            <span className="text-olive">01</span>
            <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
            <span lang="en">Our Story</span>
          </p>
          <h2 id="about-story" className="mt-6 text-h2 font-bold text-ink">
            {t('story_title')}
          </h2>
          <p className="mt-6 max-w-[36em] text-lg leading-[1.85] text-ink-2">{t('story_desc')}</p>
        </div>
        <motion.div ref={ref} style={{ clipPath: clip }} className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-white sm:aspect-[5/4] lg:aspect-[4/5]">
          <motion.div style={{ y }} className="absolute -inset-y-10 inset-x-0">
            <Image src="/images/about/collection-display.jpg" alt="" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
