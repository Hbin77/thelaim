'use client';

import { useTranslations } from 'next-intl';
import { COMPANY, COORDINATES } from '@/lib/constants';

// 지도 안에 카카오맵 사이트 전체(검색창·목록)를 넣으면 좁은 칸에서 어수선해서, 표시만 하는 지도를 넣고
// 길찾기는 카카오맵·네이버 지도 단추로 연다
const d = 0.0055;
const EMBED = `https://www.openstreetmap.org/export/embed.html?bbox=${COORDINATES.lng - d * 1.6}%2C${COORDINATES.lat - d}%2C${COORDINATES.lng + d * 1.6}%2C${COORDINATES.lat + d}&layer=mapnik&marker=${COORDINATES.lat}%2C${COORDINATES.lng}`;

export const MAP_LINKS = {
  kakao: `https://map.kakao.com/link/map/THELAIM,${COORDINATES.lat},${COORDINATES.lng}`,
  naver: `https://map.naver.com/p/search/${encodeURIComponent(COMPANY.address)}`,
};

export default function MapSection() {
  const t = useTranslations('location');

  return (
    <div className="relative h-[52vh] min-h-[340px] overflow-hidden rounded-[6px] border border-line bg-paper-2 lg:h-[640px]">
      <iframe
        src={EMBED}
        className="absolute inset-0 h-full w-full"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        title={t('address_label')}
      />
    </div>
  );
}
