import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'lime' | 'light';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-paper hover:bg-olive',
  secondary: 'border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-paper',
  ghost: 'text-ink hover:bg-ink/5',
  lime: 'bg-lime text-ink hover:bg-paper',
  light: 'border border-paper/30 text-paper hover:border-paper hover:bg-paper hover:text-ink',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'min-h-11 px-5 text-sm',
  md: 'min-h-12 px-6 text-[15px]',
  lg: 'min-h-14 px-8 text-base',
};

// <Link>에 버튼 모양을 입힐 때도 같은 클래스를 쓴다(링크 안에 버튼을 넣지 않기 위해)
export function buttonClass(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return cn(
    'group/btn inline-flex items-center justify-center gap-2.5 rounded-full font-semibold tracking-[-0.01em] transition-[background-color,color,border-color] duration-300 disabled:cursor-not-allowed disabled:opacity-60',
    variantStyles[variant],
    sizeStyles[size],
    className
  );
}

// 오른쪽으로 밀리는 화살표
export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
      className={cn('h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1', className)}
    >
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, type = 'button', ...props }, ref) => (
    <button ref={ref} type={type} className={buttonClass(variant, size, className)} {...props}>
      {children}
    </button>
  )
);

Button.displayName = 'Button';
export default Button;
