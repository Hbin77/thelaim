'use client';

import { Package, Truck, ShoppingBag, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Card from '@/components/ui/Card';
import StaggerChildren, { staggerItemVariants } from '@/components/animations/StaggerChildren';

const businessItems = [
  { icon: Package, key: 'business_import' },
  { icon: Truck, key: 'business_wholesale' },
  { icon: ShoppingBag, key: 'business_online' },
  { icon: MapPin, key: 'business_location' },
] as const;

export default function BusinessOverview() {
  const t = useTranslations('about');

  return (
    <section className="py-24 bg-navy/[0.02]">
      <Container>
        <SectionHeading title={t('business_title')} />

        <StaggerChildren className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {businessItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={i} variants={staggerItemVariants}>
                <Card className="h-full text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald/10">
                    <Icon className="h-6 w-6 text-emerald" />
                  </div>
                  <p className="text-lg font-medium text-navy">{t(item.key)}</p>
                </Card>
              </motion.div>
            );
          })}
        </StaggerChildren>
      </Container>
    </section>
  );
}
