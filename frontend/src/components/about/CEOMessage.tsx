'use client';

import { useTranslations } from 'next-intl';
import Container from '@/components/ui/Container';
import FadeIn from '@/components/animations/FadeIn';

export default function CEOMessage() {
  const t = useTranslations('about');

  return (
    <section className="py-24 bg-navy/[0.02]">
      <Container>
        <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-[60px] md:text-[120px] leading-none text-ocean/20 font-cormorant select-none">
              &ldquo;
            </span>
            <blockquote className="-mt-8 md:-mt-16 text-xl leading-relaxed text-navy/80 lg:text-2xl">
              {t('ceo_message')}
            </blockquote>
            <div className="mt-8">
              <div className="mx-auto h-1 w-12 rounded-full bg-ocean" />
              <p className="mt-4 text-lg font-medium text-navy">{t('ceo_name')}</p>
              <p className="text-ocean">THELAIM</p>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
