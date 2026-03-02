'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Card from '@/components/ui/Card';

function getIsOpen(): boolean {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 6=Sat
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const time = hours * 60 + minutes;

  // Closed on weekends
  if (day === 0 || day === 6) return false;

  // Open weekdays 09:00 - 18:00
  return time >= 540 && time < 1080;
}

export default function BusinessHours() {
  const t = useTranslations('location');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(getIsOpen());
    const interval = setInterval(() => setIsOpen(getIsOpen()), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="mt-6">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="h-5 w-5 text-teal-deep" />
        <h3 className="text-lg font-semibold text-navy">{t('business_hours')}</h3>
        <span
          className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            isOpen ? 'bg-emerald/10 text-emerald' : 'bg-red-50 text-red-500'
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${isOpen ? 'bg-emerald' : 'bg-red-500'}`} />
          {isOpen ? 'OPEN' : 'CLOSED'}
        </span>
      </div>
      <div className="space-y-2 text-navy/70">
        <p>{t('weekday')}</p>
        <p>{t('weekend')}</p>
      </div>
    </Card>
  );
}
