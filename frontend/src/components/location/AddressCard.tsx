'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Arrow } from '@/components/ui/Button';
import { COMPANY } from '@/lib/constants';
import BusinessHours from '@/components/contact/BusinessHours';
import { MAP_LINKS } from './MapSection';

export default function AddressCard() {
  const t = useTranslations('location');
  const ui = useTranslations('ui');
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(COMPANY.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const extLink = 'group/btn flex min-h-12 items-center justify-between gap-3 rounded-[4px] border border-line bg-paper px-4 text-[15px] font-semibold text-ink transition-colors hover:border-ink';

  return (
    <div className="flex flex-col rounded-[6px] border border-line bg-white p-6 md:p-8">
      <p className="eyebrow text-ink-3">{t('address_label')}</p>
      <p className="mt-3 text-[clamp(1.35rem,2.2vw,1.65rem)] font-extrabold leading-snug tracking-[-0.03em] text-ink">{COMPANY.address}</p>
      <p className="mt-1 text-sm text-ink-3">{COMPANY.addressEn}</p>

      <button
        type="button"
        onClick={copyAddress}
        className="mt-4 inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-line px-4 text-sm font-semibold text-ink-2 transition-colors hover:border-ink hover:text-ink"
      >
        {copied ? <Check className="h-4 w-4 text-olive" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
        <span aria-live="polite">{copied ? ui('copied') : ui('copy_address')}</span>
      </button>

      <div className="mt-6 grid gap-2">
        <a href={MAP_LINKS.kakao} target="_blank" rel="noopener noreferrer" className={extLink}>
          {ui('map_kakao')}
          <Arrow className="h-4 w-4 -rotate-45" />
        </a>
        <a href={MAP_LINKS.naver} target="_blank" rel="noopener noreferrer" className={extLink}>
          {ui('map_naver')}
          <Arrow className="h-4 w-4 -rotate-45" />
        </a>
      </div>

      <div className="mt-6 grid gap-1 border-t border-line pt-6 text-[15px]">
        <p className="eyebrow text-ink-3">{t('phone_label')}</p>
        <a href={`tel:${COMPANY.phone}`} className="inline-flex min-h-11 items-center text-lg font-bold text-ink hover:text-olive">
          {COMPANY.phone}
        </a>
        <p className="eyebrow mt-2 text-ink-3">{t('email_label')}</p>
        <a href={`mailto:${COMPANY.email}`} className="inline-flex min-h-11 items-center font-semibold text-ink hover:text-olive">
          {COMPANY.email}
        </a>
      </div>

      <BusinessHours className="mt-6 border-t border-line pt-6" />
    </div>
  );
}
