'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { buttonClass } from '@/components/ui/Button';
import Navigation from './Navigation';
import MobileMenu from './MobileMenu';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const t = useTranslations('ui');
  const tHero = useTranslations('hero');
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMenu = useCallback(() => setMobileOpen(false), []);

  // 조금 내리면 바탕이 생기고, 계속 내리면 숨었다가 올리면 다시 내려온다
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (y > 320 && y > last + 4) setHidden(true);
      else if (y < last - 4) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 상단 바 아래에 붙는 띠(제품 필터)가 상단 바 높이만큼 비켜 서도록 알려 준다
  useEffect(() => {
    document.documentElement.dataset.head = hidden && !mobileOpen ? 'hidden' : 'shown';
  }, [hidden, mobileOpen]);

  return (
    <>
      <a
        href="#main"
        className="fixed left-3 top-3 z-[300] -translate-y-24 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper transition-transform focus:translate-y-0"
      >
        {t('skip')}
      </a>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 text-ink transition-[transform,background-color,box-shadow] duration-500 ease-out-soft',
          scrolled && 'bg-paper/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl',
          hidden && !mobileOpen && '-translate-y-full focus-within:translate-y-0'
        )}
      >
        <div className="wrap flex h-16 items-center justify-between gap-6 md:h-20">
          <Link href="/" className="relative block h-7 w-[104px] shrink-0 md:h-8 md:w-[118px]" aria-label="THELAIM">
            <Image src="/images/logo.png" alt="THELAIM" fill sizes="120px" className="object-contain object-left" priority />
          </Link>

          <Navigation />

          <div className="flex items-center gap-1 md:gap-2">
            <LanguageSwitcher />
            <Link href="/contact" className={buttonClass('primary', 'sm', 'hidden md:inline-flex')}>
              {tHero('cta_secondary')}
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-ink/5 lg:hidden"
              aria-label={t('menu_open')}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6" aria-hidden="true">
                <path d="M4 8h16M4 16h11" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={closeMenu} />
    </>
  );
}
