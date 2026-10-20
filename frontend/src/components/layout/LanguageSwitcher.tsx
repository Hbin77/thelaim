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
          'flex min-h-11 min-w-11 items-center justify-center gap-1.5 px-1 text-sm font-medium uppercase tracking-[0.04em] transition-colors duration-200',
          dark ? 'text-paper hover:text-lime' : 'text-ink-2 hover:text-ink'
        )}
        aria-label={t('language')}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {locale}
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={cn('h-3 w-3 transition-transform duration-200', open && 'rotate-180')} aria-hidden="true">
          <path d="m4 6 4 4 4-4" />
        </svg>
      </button>

      {open && (
        <ul
          className={cn(
            'absolute right-0 z-10 min-w-[148px] overflow-hidden rounded-sm border p-1 shadow-sm',
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
                  'flex min-h-11 w-full items-center justify-between gap-4 rounded-sm px-3 text-left text-sm transition-colors',
                  dark ? 'text-paper hover:bg-paper/10' : 'text-ink hover:bg-paper-2',
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
