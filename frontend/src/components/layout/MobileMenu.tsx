'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Link, usePathname } from '@/i18n/navigation';
import { COMPANY } from '@/lib/constants';
import LanguageSwitcher from './LanguageSwitcher';
import { NAV_ITEMS } from './nav-items';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

type LenisLike = { stop: () => void; start: () => void };

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const t = useTranslations('nav');
  const tUi = useTranslations('ui');
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // 열리면 뒤쪽 스크롤을 멈추고 닫기 단추로 초점, 닫히면 열기 전 초점(메뉴 단추)으로 돌아간다
  useEffect(() => {
    if (!open) return;
    const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
    const prevFocus = document.activeElement as HTMLElement | null;
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = '';
      prevFocus?.focus?.();
    };
  }, [open]);

  // Esc로 닫고, Tab이 메뉴 밖으로 나가지 않게
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab' || !panelRef.current) return;
      const f = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={tUi('menu')}
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
          className="on-dark fixed inset-0 z-[100] flex flex-col bg-ink text-paper lg:hidden"
        >
          <div className="wrap flex h-16 items-center justify-between md:h-20">
            <div className="relative h-7 w-[104px]">
              <Image src="/images/logo.png" alt="THELAIM" fill sizes="110px" className="object-contain object-left brightness-0 invert" />
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-paper/10"
              aria-label={tUi('menu_close')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav aria-label={tUi('menu')} data-lenis-prevent className="wrap mt-6 flex-1 overflow-y-auto">
            <ul>
              {NAV_ITEMS.map(({ href, key }, i) => {
                const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
                return (
                  <motion.li
                    key={key}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.06, duration: 0.5, ease: [0.2, 0.7, 0.1, 1] }}
                    className="border-b border-line-dark"
                  >
                    <Link
                      href={href}
                      onClick={onClose}
                      aria-current={isActive ? 'page' : undefined}
                      className="flex min-h-[72px] items-center gap-5 text-[28px] font-bold tracking-[-0.03em]"
                    >
                      <span className="serif-i w-7 text-lg text-lime">{String(i + 1).padStart(2, '0')}</span>
                      <span className={isActive ? 'text-lime' : undefined}>{t(key)}</span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          <div className="wrap flex flex-wrap items-end justify-between gap-6 pb-[max(28px,env(safe-area-inset-bottom))] pt-6">
            <div className="grid gap-1 text-[15px]">
              <a href={`tel:${COMPANY.phone}`} className="flex min-h-11 items-center font-semibold text-paper">
                {COMPANY.phone}
              </a>
              <a href={`mailto:${COMPANY.email}`} className="flex min-h-11 items-center text-mist">
                {COMPANY.email}
              </a>
            </div>
            <LanguageSwitcher dark up />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
