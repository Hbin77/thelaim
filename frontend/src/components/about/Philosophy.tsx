'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Card from '@/components/ui/Card';
import StaggerChildren, { staggerItemVariants } from '@/components/animations/StaggerChildren';

function TrustIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4L6 12V20C6 28.8 12.4 36.8 20 38C27.6 36.8 34 28.8 34 20V12L20 4Z" stroke="#508991" strokeWidth="2.5" fill="none" />
      <path d="M14 20L18 24L26 16" stroke="#508991" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function QualityIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="14" stroke="#508991" strokeWidth="2.5" fill="none" />
      <path d="M20 10V20L26 26" stroke="#508991" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function PartnershipIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C12 22 14 20 20 20C26 20 28 22 28 22" stroke="#508991" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="14" cy="14" r="4" stroke="#508991" strokeWidth="2.5" fill="none" />
      <circle cx="26" cy="14" r="4" stroke="#508991" strokeWidth="2.5" fill="none" />
      <path d="M8 34C8 28.5 13.4 24 20 24C26.6 24 32 28.5 32 34" stroke="#508991" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

const philosophies = [
  { icon: TrustIcon, titleKey: 'trust_title', descKey: 'trust_desc' },
  { icon: QualityIcon, titleKey: 'quality_title', descKey: 'quality_desc' },
  { icon: PartnershipIcon, titleKey: 'partnership_title', descKey: 'partnership_desc' },
] as const;

export default function Philosophy() {
  const t = useTranslations('about');

  return (
    <section className="py-24">
      <Container>
        <SectionHeading title={t('philosophy_title')} />

        <StaggerChildren className="grid gap-8 md:grid-cols-3">
          {philosophies.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={i} variants={staggerItemVariants}>
                <Card className="text-center h-full">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ocean/10">
                    <Icon />
                  </div>
                  <h3 className="text-xl md:text-2xl text-navy">{t(item.titleKey)}</h3>
                  <p className="mt-3 leading-relaxed text-navy/60">{t(item.descKey)}</p>
                </Card>
              </motion.div>
            );
          })}
        </StaggerChildren>
      </Container>
    </section>
  );
}
