import { useTranslations } from 'next-intl';
import PageHero from '@/components/ui/PageHero';
import CompanyStory from '@/components/about/CompanyStory';
import CEOMessage from '@/components/about/CEOMessage';
import Philosophy from '@/components/about/Philosophy';
import BusinessOverview from '@/components/about/BusinessOverview';

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <>
      <PageHero eyebrow="About Thelaim" title={t('title')} />
      <CompanyStory />
      <CEOMessage />
      <Philosophy />
      <BusinessOverview />
    </>
  );
}
