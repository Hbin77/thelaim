'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Navigation from './Navigation';
import MobileMenu from './MobileMenu';
import LanguageSwitcher from './LanguageSwitcher';
import { Menu } from 'lucide-react';

export default function Header() {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/90 shadow-md backdrop-blur-lg'
            : 'bg-transparent'
        )}
      >
        <div className="mx-auto flex h-20 md:h-24 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="relative block h-10 w-24 md:h-12 md:w-30 transition-all duration-300">
            <Image
              src="/images/logo.png"
              alt="Thelaim"
              fill
              className={cn(
                'object-contain transition-all duration-300',
                scrolled ? '' : 'brightness-0 invert'
              )}
              priority
            />
          </Link>

          <Navigation scrolled={scrolled} />

          <div className="flex items-center gap-4">
            <LanguageSwitcher scrolled={scrolled} />
            <button
              onClick={() => setMobileOpen(true)}
              className={cn(
                'rounded-lg p-2 transition-colors lg:hidden',
                scrolled
                  ? 'text-navy hover:bg-navy/5'
                  : 'text-white hover:bg-white/10'
              )}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
