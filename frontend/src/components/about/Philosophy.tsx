'use client';

import { useTranslations } from 'next-intl';
import {motion} from 'framer-motion';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import SectionHeading from '@/components/ui/SectionHeading';
import { SWATCHES } from '@/lib/swatches';

const philosophies = [
  { titleKey: 'trust_title', descKey: 'trust_desc', swatch: 0 },
  { titleKey: 'quality_title', descKey: 'quality_desc', swatch: 2 },
  { titleKey: 'partnership_title', descKey: 'partnership_desc', swatch: 3 },
] as const;

export default function Philosophy() {
  const t = useTranslations('about');
  const reduce = useReduceMotion();

  return (
    <section className="section-y">
      <div className="wrap">
        <SectionHeading index="02" eyebrow="How We Work" title={t('philosophy_title')} />
        <ul className="grid gap-5 md:grid-cols-3">
          {philosophies.map((item, i) => (
            <motion.li
              key={item.titleKey}
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.2, 0.7, 0.1, 1] }}
              className="group overflow-hidden rounded-[4px] border border-line bg-white"
            >
              {/* 원단 견본 띠 */}
              <div
                aria-hidden="true"
                className="h-24 bg-cover bg-center transition-[height] duration-700 ease-out-soft group-hover:h-32"
                style={{ backgroundImage: `url(${SWATCHES[item.swatch].src})` }}
              />
              <div className="p-7 md:p-8">
                <span className="serif-i text-xl text-olive">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-ink">{t(item.titleKey)}</h3>
                <p className="mt-3 text-[16px] leading-relaxed text-ink-2">{t(item.descKey)}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
