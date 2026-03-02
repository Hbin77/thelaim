import { useTranslations } from 'next-intl';
import Container from '@/components/ui/Container';
import MapSection from '@/components/location/MapSection';
import DirectionsInfo from '@/components/location/DirectionsInfo';
import AddressCard from '@/components/location/AddressCard';

function PageHero() {
  const t = useTranslations('location');

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
        <p className="mt-5 text-lg font-light text-white/70 md:text-xl">{t('subtitle')}</p>
        <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-emerald" />
      </div>
    </section>
  );
}

export default function LocationPage() {
  return (
    <>
      <PageHero />
      <div className="py-12">
        <Container>
          <MapSection />
          <DirectionsInfo />
          <AddressCard />
        </Container>
      </div>
    </>
  );
}
