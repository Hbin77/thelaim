'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/' as const, key: 'home' },
  { href: '/about' as const, key: 'about' },
  { href: '/products' as const, key: 'products' },
  { href: '/location' as const, key: 'location' },
  { href: '/contact' as const, key: 'contact' },
] as const;

export default function Navigation({ scrolled = false }: { scrolled?: boolean }) {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-8 lg:flex">
      {NAV_ITEMS.map(({ href, key }) => {
        const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
        return (
          <Link
            key={key}
            href={href}
            className={cn(
              'relative text-sm font-medium transition-colors duration-300',
              scrolled
                ? isActive
                  ? 'text-teal-deep'
                  : 'text-navy/70 hover:text-navy'
                : isActive
                  ? 'text-white'
                  : 'text-white/70 hover:text-white'
            )}
          >
            {t(key)}
            {isActive && (
              <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-emerald" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
