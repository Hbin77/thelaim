'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
  children: React.ReactNode;
}

export default function Modal({
  open,
  onClose,
  title,
  className,
  children,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = (window as unknown as Record<string, { stop: () => void; start: () => void }>).__lenis;
    if (open) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
    return () => {
      lenis?.start();
    };
  }, [open]);

  // Allow native scroll inside modal panel by stopping wheel propagation
  useEffect(() => {
    const panel = panelRef.current;
    if (!open || !panel) return;

    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();
    };

    panel.addEventListener('wheel', handleWheel, { passive: false });
    return () => panel.removeEventListener('wheel', handleWheel);
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-navy/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              'relative max-h-[90vh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-2xl bg-white p-4 md:p-6 shadow-xl',
              className
            )}
          >
            <div className="mb-4 flex items-center justify-between">
              {title && (
                <h2 className="text-xl font-semibold text-navy">{title}</h2>
              )}
              <button
                onClick={onClose}
                className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg text-navy/40 transition-colors hover:text-navy"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
