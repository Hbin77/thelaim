'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

const NAV_ITEMS = [
  { href: '/' as const, key: 'home' },
  { href: '/about' as const, key: 'about' },
  { href: '/products' as const, key: 'products' },
  { href: '/location' as const, key: 'location' },
  { href: '/contact' as const, key: 'contact' },
] as const;

export default function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <Link href="/" className="relative mb-2 block h-12 w-28 md:h-14 md:w-36">
              <Image
                src="/images/logo.png"
                alt="Thelaim"
                fill
                className="object-contain object-left brightness-0 invert"
              />
            </Link>
            <p className="text-sm leading-relaxed text-white/60">
              {t('description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold text-white">
              {t('quick_links')}
            </h4>
            <ul className="space-y-2">
              {NAV_ITEMS.map(({ href, key }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-sm transition-colors hover:text-emerald"
                  >
                    {nav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4 font-semibold text-white">
              {t('contact_info')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>{t('address')}</li>
              <li>{t('phone')}</li>
              <li>{t('email')}</li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="mb-4 font-semibold text-white">
              {t('business_hours')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>{t('weekday_hours')}</li>
              <li>{t('saturday_hours')}</li>
              <li>{t('weekend_hours')}</li>
              <li>{t('lunch_hours')}</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-white/10 pt-8 sm:flex-row sm:justify-between">
          <p className="text-sm text-white/50">
            {t('copyright', { year: String(year) })}
          </p>
          <div className="flex gap-6 text-sm text-white/50">
            <Link href="/privacy" className="transition-colors hover:text-white/80">
              {t('privacy_policy')}
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white/80">
              {t('terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
