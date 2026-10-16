'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const LOCALE_LABELS: Record<string, string> = {
  ko: '한국어',
  en: 'English',
  zh: '中文',
  ja: '日本語',
};

interface LanguageSwitcherProps {
  dark?: boolean; // 어두운 면(모바일 메뉴) 위
  up?: boolean; // 목록을 위로 펼침
}

export default function LanguageSwitcher({ dark = false, up = false }: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('common');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const switchLocale = (newLocale: string) => {
    // 제품 창·분류처럼 주소 뒤에 붙은 값(?item= 등)은 그대로 둔다
    const query = Object.fromEntries(new URLSearchParams(window.location.search));
    router.replace({ pathname, query }, { locale: newLocale as (typeof routing.locales)[number] });
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold uppercase tracking-[0.08em] transition-colors',
          dark ? 'text-paper hover:bg-paper/10' : 'text-ink-2 hover:bg-ink/5 hover:text-ink'
        )}
        aria-label={t('language')}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-4 w-4" aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" />
          <path d="M2.5 10h15M10 2.5c2.2 2.3 2.2 12.7 0 15M10 2.5c-2.2 2.3-2.2 12.7 0 15" />
        </svg>
        {locale}
      </button>

      {open && (
        <ul
          className={cn(
            'absolute right-0 z-10 min-w-[148px] overflow-hidden rounded-[6px] border p-1.5 shadow-xl',
            up ? 'bottom-full mb-2' : 'top-full mt-2',
            dark ? 'border-line-dark bg-ink' : 'border-line bg-paper'
          )}
        >
          {routing.locales.map((loc) => (
            <li key={loc}>
              <button
                type="button"
                lang={loc}
                onClick={() => switchLocale(loc)}
                aria-current={loc === locale ? 'true' : undefined}
                className={cn(
                  'flex min-h-11 w-full items-center justify-between gap-4 rounded-[4px] px-3 text-left text-sm transition-colors',
                  dark ? 'text-paper hover:bg-paper/10' : 'text-ink hover:bg-ink/5',
                  loc === locale && 'font-bold'
                )}
              >
                {LOCALE_LABELS[loc]}
                {loc === locale && <span aria-hidden="true" className={cn('h-1.5 w-1.5 rounded-full', dark ? 'bg-lime' : 'bg-olive')} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
