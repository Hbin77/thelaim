'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Input from '@/components/ui/Input';

interface ProductSearchProps {
  onSearch: (query: string) => void;
}

export default function ProductSearch({ onSearch }: ProductSearchProps) {
  const t = useTranslations('products');
  const [value, setValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, 300);
    return () => clearTimeout(timer);
  }, [value, onSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy/40" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t('search_placeholder')}
        className="pl-12"
      />
    </div>
  );
}
