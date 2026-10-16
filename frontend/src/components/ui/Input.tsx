import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const fieldClass =
  'w-full rounded-[4px] border border-line bg-white px-4 text-[15px] text-ink transition-[border-color,box-shadow] duration-200 placeholder:text-ink-3 hover:border-ink/30 focus:border-ink focus:outline-none focus:ring-4 focus:ring-lime/50';

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className, id, required, ...props }, ref) => (
  <div className="w-full">
    {label && (
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-ink">
        {label}
        {required && <span className="ml-1 text-olive" aria-hidden="true">*</span>}
      </label>
    )}
    <input
      ref={ref}
      id={id}
      aria-required={required || undefined}
      aria-invalid={error ? true : undefined}
      aria-describedby={error && id ? `${id}-error` : undefined}
      className={cn(fieldClass, 'min-h-[52px]', error && 'border-error focus:border-error focus:ring-error/15', className)}
      {...props}
    />
    {error && (
      <p id={id ? `${id}-error` : undefined} className="mt-1.5 text-sm font-medium text-error">
        {error}
      </p>
    )}
  </div>
));

Input.displayName = 'Input';
export default Input;
