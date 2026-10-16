'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

// 영업시간(한국 시간): 평일 09–18(점심 12–13), 토요일 09–13, 일요일 휴무. 공휴일은 따로 계산하지 않는다
function getIsOpen(now = new Date()): boolean {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Seoul', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const day = get('weekday');
  const time = Number(get('hour')) * 60 + Number(get('minute'));
  if (day === 'Sun') return false;
  if (day === 'Sat') return time >= 540 && time < 780;
  return time >= 540 && time < 1080 && !(time >= 720 && time < 780);
}

export default function BusinessHours({ dark = false, className }: { dark?: boolean; className?: string }) {
  const t = useTranslations('location');
  const ui = useTranslations('ui');
  const tf = useTranslations('footer');
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  useEffect(() => {
    setIsOpen(getIsOpen());
    const interval = setInterval(() => setIsOpen(getIsOpen()), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-3">
        <h3 className={cn('eyebrow', dark ? 'text-mist' : 'text-ink-3')}>{t('business_hours')}</h3>
        {isOpen !== null && (
          <span
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-bold',
              isOpen ? 'bg-lime text-ink' : dark ? 'bg-paper/10 text-mist' : 'bg-ink/[0.06] text-ink-2'
            )}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', isOpen ? 'animate-pulse bg-ink' : 'bg-current')} />
            {isOpen ? ui('open_now') : ui('closed_now')}
          </span>
        )}
      </div>
      <ul className={cn('mt-4 space-y-1.5 text-[15px]', dark ? 'text-paper' : 'text-ink')}>
        <li>{t('weekday')}</li>
        <li>{t('weekend')}</li>
        <li className={dark ? 'text-mist' : 'text-ink-3'}>{tf('lunch_hours')}</li>
      </ul>
    </div>
  );
}
