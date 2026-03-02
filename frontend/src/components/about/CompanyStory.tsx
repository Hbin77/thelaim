'use client';

import { useTranslations } from 'next-intl';
import Container from '@/components/ui/Container';
import FadeIn from '@/components/animations/FadeIn';
import SlideUp from '@/components/animations/SlideUp';

export default function CompanyStory() {
  const t = useTranslations('about');

  return (
    <section className="py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <FadeIn direction="right">
            <h2 className="font-serif-kr text-2xl md:text-3xl text-navy">{t('story_title')}</h2>
            <div className="mt-4 h-1 w-16 rounded-full bg-emerald" />
            <p className="mt-6 text-lg leading-relaxed text-navy/70">
              {t('story_desc')}
            </p>
          </FadeIn>

          <SlideUp>
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                <img src="/images/about/collection-display.jpg" alt="디앤인터내셔널 의류 컬렉션" className="h-full w-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-2xl bg-emerald/10 -z-10 hidden md:block" />
              <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-teal-light/20 -z-10 hidden md:block" />
            </div>
          </SlideUp>
        </div>
      </Container>
    </section>
  );
}
