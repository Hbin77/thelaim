import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: 'left' | 'center';
}

export default function SectionHeading({
  title,
  subtitle,
  className,
  align = 'center',
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-12',
        align === 'center' && 'text-center',
        className
      )}
    >
      <h2 className="font-serif-kr text-3xl font-normal tracking-[0.04em] text-navy md:text-4xl">{title}</h2>
      {subtitle && (
        <p className="mt-4 text-lg text-ocean">{subtitle}</p>
      )}
      <div
        className={cn(
          'mt-4 h-1 w-16 rounded-full bg-emerald',
          align === 'center' && 'mx-auto'
        )}
      />
    </div>
  );
}
