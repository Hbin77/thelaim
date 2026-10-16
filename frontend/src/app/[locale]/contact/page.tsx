import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import PageHero from '@/components/ui/PageHero';
import InquiryForm from '@/components/contact/InquiryForm';
import ContactInfo from '@/components/contact/ContactInfo';

export default function ContactPage() {
  const t = useTranslations('contact');

  return (
    <>
      <PageHero eyebrow="Get in Touch" title={t('title')} subtitle={t('subtitle')} />
      <div className="wrap grid gap-8 py-14 md:py-20 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-10">
        <Suspense>
          <InquiryForm />
        </Suspense>
        <div className="lg:sticky lg:top-28 lg:self-start">
          <ContactInfo />
        </div>
      </div>
    </>
  );
}
