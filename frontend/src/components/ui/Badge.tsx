import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'primary' | 'success' | 'outline';

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-navy/10 text-navy',
  primary: 'bg-teal-deep/10 text-teal-deep',
  success: 'bg-emerald/10 text-emerald',
  outline: 'border border-ocean text-ocean',
};

export default function Badge({
  variant = 'default',
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
