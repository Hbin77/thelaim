'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from './nav-items';

export default function Navigation({ dark = false }: { dark?: boolean }) {
  const t = useTranslations('nav');
  const ui = useTranslations('ui');
  const pathname = usePathname();

  return (
    <nav aria-label={ui('nav_main')} className="hidden items-center gap-1 lg:flex">
      {NAV_ITEMS.map(({ href, key }) => {
        const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
        return (
          <Link
            key={key}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'group relative flex min-h-11 items-center px-4 text-[15px] font-semibold transition-colors',
              dark ? (isActive ? 'text-paper' : 'text-paper/60 hover:text-paper') : isActive ? 'text-ink' : 'text-ink-2 hover:text-ink'
            )}
          >
            {t(key)}
            <span
              aria-hidden="true"
              className={cn(
                'absolute inset-x-4 bottom-2 h-[3px] origin-left rounded-full bg-lime transition-transform duration-500 ease-out-soft',
                isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}
