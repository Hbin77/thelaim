import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  eyebrow?: string; // 영문 부제(이탤릭)
  index?: string; // 섹션 번호
  className?: string;
  align?: 'left' | 'center';
  dark?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  eyebrow,
  index,
  className,
  align = 'left',
  dark = false,
}: SectionHeadingProps) {
  return (
    <div className={cn('mb-12 md:mb-16', align === 'center' && 'text-center', className)}>
      {(eyebrow || index) && (
        <p className={cn('eyebrow mb-5', dark ? 'text-mist' : 'text-ink-3', align === 'center' && 'justify-center')}>
          {index && <span className={dark ? 'text-lime' : 'text-olive'}>{index}</span>}
          {index && eyebrow && <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />}
          {eyebrow && <span lang="en">{eyebrow}</span>}
        </p>
      )}
      {/* text-h2는 tailwind-merge가 색으로 오인해 지우므로 cn을 쓰지 않는다 */}
      <h2 className={`text-h2 font-bold ${dark ? 'text-paper' : 'text-ink'}`}>{title}</h2>
      {subtitle && (
        <p className={cn('mt-5 max-w-xl text-lg', dark ? 'text-mist' : 'text-ink-2', align === 'center' && 'mx-auto')}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
