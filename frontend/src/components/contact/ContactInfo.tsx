'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Arrow } from '@/components/ui/Button';
import { COMPANY } from '@/lib/constants';
import BusinessHours from './BusinessHours';

// 바로 연락하기: 전화·이메일·주소·영업시간
export default function ContactInfo() {
  const t = useTranslations('location');
  const ui = useTranslations('ui');
  const nav = useTranslations('nav');

  return (
    <aside className="on-dark rounded-[6px] bg-ink p-7 text-paper md:p-10" aria-label={ui('contact_direct')}>
      <p className="text-xl font-bold tracking-[-0.02em] text-lime">{ui("contact_direct")}</p>

      <div className="mt-8">
        <p className="eyebrow text-mist">{t('phone_label')}</p>
        <a href={`tel:${COMPANY.phone}`} className="group/btn mt-2 inline-flex min-h-11 items-center gap-3 text-[clamp(1.75rem,3vw,2.4rem)] font-extrabold tracking-[-0.03em] tabular-nums">
          {COMPANY.phone}
          <Arrow className="h-5 w-5 text-lime" />
        </a>
      </div>

      <div className="mt-6 border-t border-line-dark pt-6">
        <p className="eyebrow text-mist">{t('email_label')}</p>
        <a href={`mailto:${COMPANY.email}`} className="mt-1 inline-flex min-h-11 items-center text-lg font-semibold underline-offset-4 hover:text-lime hover:underline">
          {COMPANY.email}
        </a>
      </div>

      <div className="mt-6 border-t border-line-dark pt-6">
        <p className="eyebrow text-mist">{t('address_label')}</p>
        <p className="mt-2 text-[16px] font-semibold">{COMPANY.address}</p>
        <Link href="/location" className="group/btn mt-1 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-lime">
          {nav('location')}
          <Arrow className="h-3.5 w-3.5" />
        </Link>
      </div>

      <BusinessHours dark className="mt-6 border-t border-line-dark pt-6" />
    </aside>
  );
}
