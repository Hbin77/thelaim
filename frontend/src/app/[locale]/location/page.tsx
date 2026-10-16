import { useTranslations } from 'next-intl';
import PageHero from '@/components/ui/PageHero';
import MapSection from '@/components/location/MapSection';
import DirectionsInfo from '@/components/location/DirectionsInfo';
import AddressCard from '@/components/location/AddressCard';

export default function LocationPage() {
  const t = useTranslations('location');

  return (
    <>
      <PageHero eyebrow="Visit the Showroom" title={t('title')} subtitle={t('subtitle')} />
      <div className="wrap py-14 md:py-20">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          <MapSection />
          <AddressCard />
        </div>
        <div className="mt-16 md:mt-24">
          <DirectionsInfo />
        </div>
      </div>
    </>
  );
}
