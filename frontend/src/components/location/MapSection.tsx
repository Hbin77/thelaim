'use client';

import { useTranslations } from 'next-intl';
import { COORDINATES } from '@/lib/constants';

export default function MapSection() {
  const t = useTranslations('location');

  const mapSrc = `https://map.kakao.com/link/map/${encodeURIComponent(t('address'))},${COORDINATES.lat},${COORDINATES.lng}`;

  return (
    <section className="py-8">
      <div className="overflow-hidden rounded-2xl border border-navy/10 shadow-md">
        <iframe
          src={`https://map.kakao.com/link/map/THELAIM,${COORDINATES.lat},${COORDINATES.lng}`}
          width="100%"
          height="100%"
          className="h-[60vh] w-full"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title={t('address_label')}
        />
      </div>
    </section>
  );
}
