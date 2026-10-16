'use client';

import {motion} from 'framer-motion';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useTranslations } from 'next-intl';
import { Car, Bus, SquareParking } from 'lucide-react';

const directions = [
  { icon: Car, titleKey: 'car', descKey: 'car_desc' },
  { icon: Bus, titleKey: 'bus', descKey: 'bus_desc' },
  { icon: SquareParking, titleKey: 'parking', descKey: 'parking_desc' },
] as const;

export default function DirectionsInfo() {
  const t = useTranslations('location');
  const reduce = useReduceMotion();

  return (
    <ol className="grid border-t border-line md:grid-cols-3">
      {directions.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.li
            key={item.titleKey}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.2, 0.7, 0.1, 1] }}
            className="border-b border-line py-8 md:border-b-0 md:py-10 md:pr-8 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:pl-8"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-lime">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="serif-i text-xl text-olive">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <h3 className="mt-5 text-xl font-bold tracking-[-0.03em] text-ink">{t(item.titleKey)}</h3>
            <p className="mt-2 text-[16px] leading-relaxed text-ink-2">{t(item.descKey)}</p>
          </motion.li>
        );
      })}
    </ol>
  );
}
