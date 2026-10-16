'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { fieldClass } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

interface ProductSearchProps {
  onSearch: (query: string) => void;
}

export default function ProductSearch({ onSearch }: ProductSearchProps) {
  const t = useTranslations('products');
  const ui = useTranslations('ui');
  const [value, setValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => onSearch(value), 300);
    return () => clearTimeout(timer);
  }, [value, onSearch]);

  return (
    <div className="relative">
      <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-3" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t('search_placeholder')}
        aria-label={t('search_placeholder')}
        className={cn(fieldClass, 'min-h-11 rounded-full pl-11 pr-12 [&::-webkit-search-cancel-button]:hidden')}
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue('')}
          aria-label={ui('search_clear')}
          className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-ink-3 hover:bg-ink/5 hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
