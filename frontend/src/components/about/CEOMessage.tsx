'use client';

import { useTranslations } from 'next-intl';
import {motion} from 'framer-motion';
import { useReduceMotion } from '@/hooks/useReduceMotion';

export default function CEOMessage() {
  const t = useTranslations('about');
  const reduce = useReduceMotion();

  return (
    <section className="on-dark section-y bg-ink text-paper" aria-label={t('ceo_name')}>
      <div className="wrap">
        <motion.figure
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.1, 1] }}
          className="mx-auto max-w-4xl"
        >
          <span aria-hidden="true" className="serif-i block text-[7rem] leading-[0.6] text-lime md:text-[10rem]">
            &ldquo;
          </span>
          <blockquote className="mt-4 text-[clamp(1.45rem,2.8vw,2.35rem)] font-bold leading-[1.5] tracking-[-0.035em]">
            {t('ceo_message')}
          </blockquote>
          <figcaption className="mt-10 flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-12 bg-lime" />
            <span className="text-lg font-semibold">{t('ceo_name')}</span>
            <span className="serif-i text-lg text-mist">Thelaim</span>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
