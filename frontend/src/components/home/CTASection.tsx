'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Button from '@/components/ui/Button';
import MagneticButton from '@/components/animations/MagneticButton';
import FadeIn from '@/components/animations/FadeIn';

export default function CTASection() {
  const t = useTranslations();

  return (
    <section className="relative overflow-hidden py-16 md:py-32">
      <div className="absolute inset-0">
        <img src="/images/about/dress-collection.jpg" alt="" className="h-full w-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-navy/70" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        <FadeIn>
          <h2 className="font-serif-kr text-3xl md:text-4xl lg:text-5xl text-white">
            {t('contact.subtitle')}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
            {t('company.description')}
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="mt-10">
            <MagneticButton>
              <Link href="/contact">
                <Button size="lg" className="bg-emerald text-white hover:bg-emerald/90 px-8 md:px-12">
                  {t('nav.contact')}
                </Button>
              </Link>
            </MagneticButton>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
