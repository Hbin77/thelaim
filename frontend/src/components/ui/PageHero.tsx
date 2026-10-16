import { SWATCHES } from '@/lib/swatches';
import { cn } from '@/lib/utils';

interface PageHeroProps {
  eyebrow: string; // 영문 부제
  title: string;
  subtitle?: string;
  className?: string;
}

// 하위 페이지 머리: 아마천 바탕에 큰 제목, 오른쪽에 실제 원단 견본 띠
export default function PageHero({ eyebrow, title, subtitle, className }: PageHeroProps) {
  return (
    <section className={cn('relative overflow-hidden border-b border-line pt-32 pb-14 md:pt-44 md:pb-20', className)}>
      <div className="wrap grid items-end gap-10 md:grid-cols-[minmax(0,1fr)_auto]">
        <div className="animate-[rise_0.9s_cubic-bezier(0.2,0.7,0.1,1)_both]">
          <p lang="en" className="serif-i text-2xl text-olive md:text-3xl">{eyebrow}</p>
          <h1 className="mt-3 text-h1 font-extrabold text-ink">{title}</h1>
          {subtitle && <p className="mt-5 max-w-xl text-lg text-ink-2">{subtitle}</p>}
        </div>
        <ul aria-hidden="true" className="hidden h-40 gap-1.5 md:flex lg:h-48">
          {SWATCHES.map((s, i) => (
            <li
              key={s.key}
              className="w-9 overflow-hidden rounded-[3px] shadow-[0_10px_24px_-14px_rgb(20_28_36/0.5)] animate-[drop_1s_cubic-bezier(0.2,0.7,0.1,1)_both] lg:w-11"
              style={{ animationDelay: `${0.15 + i * 0.07}s`, backgroundImage: `url(${s.thumb})`, backgroundSize: '220%', backgroundPosition: 'center' }}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
