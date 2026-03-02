'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  const t = useTranslations('products');

  const tabs = [
    { key: 'all', label: t('filter_all') },
    ...categories.map((cat) => ({ key: cat, label: cat })),
  ];

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onCategoryChange(tab.key)}
            className={cn(
              'relative whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-colors',
              activeCategory === tab.key
                ? 'text-white'
                : 'text-navy/60 hover:text-navy'
            )}
          >
            {activeCategory === tab.key && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 rounded-full bg-emerald"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
