'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  label?: string; // 제목이 화면에 없을 때 읽어 줄 이름
  closeLabel?: string;
  className?: string;
  children: React.ReactNode;
}

type LenisLike = { stop: () => void; start: () => void };

// 좁은 화면에선 아래에서 올라오는 시트, 넓은 화면에선 가운데 창
export default function Modal({ open, onClose, title, label, closeLabel = 'Close', className, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // 열려 있는 동안 뒤쪽 스크롤을 멈추고, 닫히면 열기 전 초점으로 돌아간다
  useEffect(() => {
    if (!open) return;
    const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
    const prevFocus = document.activeElement as HTMLElement | null;
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    const t = setTimeout(() => panelRef.current?.focus(), 30);
    return () => {
      clearTimeout(t);
      lenis?.start();
      document.documentElement.style.overflow = '';
      prevFocus?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      // 초점이 창 밖으로 나가지 않게
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center md:items-center md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink/60 backdrop-blur-[6px]"
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title ?? label}
            tabIndex={-1}
            data-lenis-prevent
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.45, ease: [0.2, 0.7, 0.1, 1] }}
            className={cn(
              'relative max-h-[92dvh] w-full overflow-y-auto overscroll-contain rounded-t-2xl bg-paper shadow-2xl outline-none md:max-w-lg md:rounded-[6px]',
              className
            )}
          >
            <div className="sticky top-0 z-10 flex h-14 items-center justify-between bg-paper/90 px-5 backdrop-blur md:px-6">
              <span aria-hidden="true" className="mx-auto h-1 w-10 rounded-full bg-ink/15 md:hidden" />
              {title && <h2 className="text-lg font-bold text-ink">{title}</h2>}
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 top-2 flex h-11 w-11 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-ink/5 hover:text-ink"
                aria-label={closeLabel}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-5 pb-8 md:px-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
