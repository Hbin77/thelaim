'use client';

import { useTranslations } from 'next-intl';
import Container from '@/components/ui/Container';
import FadeIn from '@/components/animations/FadeIn';
import ParallaxSection from '@/components/animations/ParallaxSection';

const highlights = [
  { titleKey: 'highlight1_title', descKey: 'highlight1_desc' },
  { titleKey: 'highlight2_title', descKey: 'highlight2_desc' },
  { titleKey: 'highlight3_title', descKey: 'highlight3_desc' },
] as const;

export default function CompanyIntroSection() {
  const t = useTranslations('company');

  return (
    <section className="py-24 bg-white">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <FadeIn direction="right">
            <h2 className="font-serif-kr text-2xl md:text-3xl lg:text-4xl text-navy">{t('title')}</h2>
            <div className="mt-4 h-1 w-16 rounded-full bg-emerald" />
            <p className="mt-6 text-lg leading-relaxed text-navy/70">
              {t('description')}
            </p>
          </FadeIn>

          <ParallaxSection speed={0.15}>
            <div className="relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="aspect-[3/4] overflow-hidden rounded-2xl">
                  <img src="/images/about/collection-display.jpg" alt="의류 컬렉션" className="h-full w-full object-cover" />
                </div>
                <div className="mt-8 aspect-[3/4] overflow-hidden rounded-2xl">
                  <img src="/images/products/floral-blouse-closeup.jpg" alt="블라우스 컬렉션" className="h-full w-full object-cover" />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-emerald/20" />
            </div>
          </ParallaxSection>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {highlights.map((item, i) => (
            <FadeIn key={i} delay={i * 0.15}>
              <div className="text-center rounded-2xl border border-navy/5 bg-navy/[0.02] px-6 py-8">
                <h3 className="text-h3 font-bold text-teal-deep">{t(item.titleKey)}</h3>
                <p className="mt-2 text-lg text-navy/60">{t(item.descKey)}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
