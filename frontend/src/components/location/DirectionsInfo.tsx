'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Card from '@/components/ui/Card';
import StaggerChildren, { staggerItemVariants } from '@/components/animations/StaggerChildren';

function CarIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 18L8 10C8.5 8 10 7 12 7H20C22 7 23.5 8 24 10L26 18" stroke="#004346" strokeWidth="2" strokeLinecap="round" fill="none" />
      <rect x="4" y="18" width="24" height="8" rx="2" stroke="#004346" strokeWidth="2" fill="none" />
      <circle cx="10" cy="22" r="2" fill="#004346" />
      <circle cx="22" cy="22" r="2" fill="#004346" />
    </svg>
  );
}

function BusIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="4" width="20" height="22" rx="4" stroke="#004346" strokeWidth="2" fill="none" />
      <rect x="9" y="8" width="14" height="8" rx="1" stroke="#004346" strokeWidth="2" fill="none" />
      <circle cx="11" cy="22" r="1.5" fill="#004346" />
      <circle cx="21" cy="22" r="1.5" fill="#004346" />
      <line x1="10" y1="26" x2="10" y2="29" stroke="#004346" strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="26" x2="22" y2="29" stroke="#004346" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ParkingIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="24" height="24" rx="4" stroke="#004346" strokeWidth="2" fill="none" />
      <path d="M13 24V8H18C21.3 8 24 10.7 24 14C24 17.3 21.3 20 18 20H13" stroke="#004346" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

const directions = [
  { icon: CarIcon, titleKey: 'car', descKey: 'car_desc' },
  { icon: BusIcon, titleKey: 'bus', descKey: 'bus_desc' },
  { icon: ParkingIcon, titleKey: 'parking', descKey: 'parking_desc' },
] as const;

export default function DirectionsInfo() {
  const t = useTranslations('location');

  return (
    <section className="py-8">
      <StaggerChildren className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {directions.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div key={i} variants={staggerItemVariants}>
              <Card className="h-full">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-deep/10">
                  <Icon />
                </div>
                <h3 className="text-lg font-semibold text-navy">{t(item.titleKey)}</h3>
                <p className="mt-2 text-navy/60">{t(item.descKey)}</p>
              </Card>
            </motion.div>
          );
        })}
      </StaggerChildren>
    </section>
  );
}
