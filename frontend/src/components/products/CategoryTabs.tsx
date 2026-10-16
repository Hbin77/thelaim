'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface CategoryTabsProps {
  categories: { slug: string; name: string }[];
  counts?: Record<string, number>;
  activeCategory: string;
  onCategoryChange: (categorySlug: string) => void;
}

export default function CategoryTabs({ categories, counts = {}, activeCategory, onCategoryChange }: CategoryTabsProps) {
  const t = useTranslations('products');

  const tabs = [{ key: 'all', label: t('filter_all') }, ...categories.map((cat) => ({ key: cat.slug, label: cat.name }))];

  return (
    <div className="scrollbar-hide -mx-[clamp(20px,4vw,56px)] overflow-x-auto px-[clamp(20px,4vw,56px)] lg:mx-0 lg:px-0">
      <div role="group" aria-label={t('category')} className="flex w-max gap-1.5">
        {tabs.map((tab) => {
          const active = activeCategory === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onCategoryChange(tab.key)}
              aria-pressed={active}
              className={cn(
                'relative flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full px-5 text-[15px] font-semibold transition-colors',
                active ? 'text-paper' : 'text-ink-2 hover:bg-ink/5 hover:text-ink'
              )}
            >
              {active && (
                <motion.span
                  layoutId="activeCategory"
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                />
              )}
              <span className="relative">{tab.label}</span>
              {counts[tab.key] !== undefined && (
                <span className={cn('relative text-[12px] tabular-nums', active ? 'text-lime' : 'text-ink-3')}>{counts[tab.key]}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
