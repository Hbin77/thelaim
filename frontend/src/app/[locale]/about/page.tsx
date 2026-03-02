import { useTranslations } from 'next-intl';
import CompanyStory from '@/components/about/CompanyStory';
import CEOMessage from '@/components/about/CEOMessage';
import Philosophy from '@/components/about/Philosophy';
import BusinessOverview from '@/components/about/BusinessOverview';

function PageHero() {
  const t = useTranslations('about');

  return (
    <section
      className="flex min-h-[50vh] items-center justify-center"
      style={{
        backgroundImage: 'linear-gradient(135deg, #004346 0%, #172A3A 100%)',
      }}
    >
      <div className="px-4 text-center">
        <h1 className="font-serif-kr text-5xl font-normal tracking-[0.06em] text-white md:text-7xl">
          {t('title')}
        </h1>
        <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-emerald" />
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHero />
      <CompanyStory />
      <CEOMessage />
      <Philosophy />
      <BusinessOverview />
    </>
  );
}
