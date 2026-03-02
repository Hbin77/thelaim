'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';

const NAV_ITEMS = [
  { href: '/' as const, key: 'home' },
  { href: '/about' as const, key: 'about' },
  { href: '/products' as const, key: 'products' },
  { href: '/location' as const, key: 'location' },
  { href: '/contact' as const, key: 'contact' },
] as const;

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const t = useTranslations('nav');

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-white lg:hidden"
        >
          <div className="flex h-20 items-center justify-between px-4 sm:px-6">
            <div className="relative h-8 w-28">
              <Image
                src="/images/logo.png"
                alt="Thelaim"
                fill
                className="object-contain"
              />
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-navy transition-colors hover:bg-navy/5"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex flex-col items-center gap-8 pt-16">
            {NAV_ITEMS.map(({ href, key }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={href}
                  onClick={onClose}
                  className="text-2xl font-medium text-navy transition-colors hover:text-teal-deep"
                >
                  {t(key)}
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="mt-8 flex justify-center">
            <LanguageSwitcher />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
