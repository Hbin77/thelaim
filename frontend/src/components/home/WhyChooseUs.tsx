'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Card from '@/components/ui/Card';
import StaggerChildren, { staggerItemVariants } from '@/components/animations/StaggerChildren';

function QualityIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 4L28.9 16.2L42 17.5L32 26.3L34.8 39.2L24 33L13.2 39.2L16 26.3L6 17.5L19.1 16.2L24 4Z" stroke="#09BC8A" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function SolutionIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="10" width="36" height="28" rx="4" stroke="#09BC8A" strokeWidth="2.5" fill="none" />
      <path d="M18 22L22 26L30 18" stroke="#09BC8A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NetworkIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="18" stroke="#09BC8A" strokeWidth="2.5" fill="none" />
      <ellipse cx="24" cy="24" rx="8" ry="18" stroke="#09BC8A" strokeWidth="2.5" fill="none" />
      <line x1="6" y1="24" x2="42" y2="24" stroke="#09BC8A" strokeWidth="2.5" />
    </svg>
  );
}

const features = [
  { icon: QualityIcon, titleKey: 'item1_title', descKey: 'item1_desc' },
  { icon: SolutionIcon, titleKey: 'item2_title', descKey: 'item2_desc' },
  { icon: NetworkIcon, titleKey: 'item3_title', descKey: 'item3_desc' },
] as const;

export default function WhyChooseUs() {
  const t = useTranslations('features');

  return (
    <section className="py-24 bg-white">
      <Container>
        <SectionHeading title={t('title')} />

        <StaggerChildren className="grid gap-8 md:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div key={i} variants={staggerItemVariants}>
                <Card className="text-center h-full">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald/10">
                    <Icon />
                  </div>
                  <h3 className="text-xl md:text-2xl text-navy">{t(feature.titleKey)}</h3>
                  <p className="mt-3 leading-relaxed text-navy/60">{t(feature.descKey)}</p>
                </Card>
              </motion.div>
            );
          })}
        </StaggerChildren>
      </Container>
    </section>
  );
}
