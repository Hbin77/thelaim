'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { COMPANY, SOCIAL_LINKS } from '@/lib/constants';
import { NAV_ITEMS } from './nav-items';

export default function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const ui = useTranslations('ui');
  const year = new Date().getFullYear();

  const linkCls = 'inline-flex min-h-11 items-center transition-colors hover:text-lime';

  return (
    <footer className="on-dark bg-ink text-mist">
      <div className="wrap pt-20 md:pt-28">
        <div className="grid gap-12 border-b border-line-dark pb-14 lg:grid-cols-[1.3fr_1fr_1.2fr_1fr]">
          <div>
            <Link href="/" className="relative block h-10 w-[150px]" aria-label="THELAIM">
              <Image src="/images/logo.png" alt="THELAIM" fill sizes="150px" className="object-contain object-left brightness-0 invert" />
            </Link>
            <p className="mt-5 text-xl font-semibold tracking-[-0.02em] text-paper">{t("description")}</p>
            <div className="mt-6 flex gap-2 text-sm">
              <a href={SOCIAL_LINKS.blog} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-full border border-line-dark px-4 text-paper transition-colors hover:border-lime hover:text-lime">
                {ui('blog')} ↗
              </a>
              <a href={SOCIAL_LINKS.cafe} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-full border border-line-dark px-4 text-paper transition-colors hover:border-lime hover:text-lime">
                {ui('cafe')} ↗
              </a>
            </div>
          </div>

          <nav aria-label={t('quick_links')}>
            <h2 className="eyebrow text-paper">{t('quick_links')}</h2>
            <ul className="mt-4 text-[15px]">
              {NAV_ITEMS.map(({ href, key }) => (
                <li key={key}>
                  <Link href={href} className={linkCls}>
                    {nav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow text-paper">{t('contact_info')}</h2>
            <ul className="mt-4 text-[15px]">
              <li className="flex min-h-11 items-center">{t('address')}</li>
              <li>
                <a href={`tel:${COMPANY.phone}`} className={linkCls}>
                  {t('phone')}
                </a>
              </li>
              <li>
                <a href={`mailto:${COMPANY.email}`} className={linkCls}>
                  {t('email')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="eyebrow text-paper">{t('business_hours')}</h2>
            <ul className="mt-4 space-y-2.5 pt-2.5 text-[15px]">
              <li>{t('weekday_hours')}</li>
              <li>{t('saturday_hours')}</li>
              <li>{t('weekend_hours')}</li>
              <li>{t('lunch_hours')}</li>
            </ul>
          </div>
        </div>

        <dl className="flex flex-wrap gap-x-6 gap-y-1.5 py-8 text-[13px] text-mist/90">
          <p className="text-paper/80">{t('company_name')}</p>
          <div className="flex gap-2"><dt>{ui('ceo')}</dt><dd className="text-paper/80">{COMPANY.ceo}</dd></div>
          <div className="flex gap-2"><dt>{ui('biz_no')}</dt><dd className="text-paper/80">{COMPANY.businessNumber}</dd></div>
          <div className="flex gap-2"><dt>{ui('ecommerce_no')}</dt><dd className="text-paper/80">{COMPANY.onlineSalesNumber}</dd></div>
        </dl>

        <div className="flex flex-col gap-4 border-t border-line-dark py-8 text-[13px] sm:flex-row sm:items-center sm:justify-between">
          <p>{t('copyright', { year: String(year) })}</p>
          <div className="flex gap-5">
            <Link href="/privacy" className={linkCls}>
              {t('privacy_policy')}
            </Link>
            <Link href="/terms" className={linkCls}>
              {t('terms')}
            </Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
