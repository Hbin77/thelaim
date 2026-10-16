'use client';

import { Package, Truck, ShoppingBag, MapPin } from 'lucide-react';
import {motion} from 'framer-motion';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useTranslations } from 'next-intl';
import SectionHeading from '@/components/ui/SectionHeading';

const businessItems = [
  { icon: Package, key: 'business_import' },
  { icon: Truck, key: 'business_wholesale' },
  { icon: ShoppingBag, key: 'business_online' },
  { icon: MapPin, key: 'business_location' },
] as const;

// 산지에서 매장까지: 하는 일을 순서대로
export default function BusinessOverview() {
  const t = useTranslations('about');
  const reduce = useReduceMotion();

  return (
    <section className="section-y bg-paper-2">
      <div className="wrap">
        <SectionHeading index="03" eyebrow="What We Do" title={t('business_title')} />
        <div className="relative">
        <span aria-hidden="true" className="absolute left-0 right-0 top-[52px] hidden h-px bg-ink/15 lg:block" />
        <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {businessItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.li
                key={item.key}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.2, 0.7, 0.1, 1] }}
                className="relative rounded-[4px] border border-line bg-paper p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-lime">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="serif-i text-2xl text-ink/30">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <p className="mt-8 text-lg font-bold leading-snug tracking-[-0.03em] text-ink">{t(item.key)}</p>
              </motion.li>
            );
          })}
        </ol>
        </div>
      </div>
    </section>
  );
}
