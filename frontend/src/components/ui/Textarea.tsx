import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { fieldClass } from './Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, error, className, id, required, ...props }, ref) => (
  <div className="w-full">
    {label && (
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-ink">
        {label}
        {required && <span className="ml-1 text-olive" aria-hidden="true">*</span>}
      </label>
    )}
    <textarea
      ref={ref}
      id={id}
      rows={4}
      aria-required={required || undefined}
      aria-invalid={error ? true : undefined}
      aria-describedby={error && id ? `${id}-error` : undefined}
      className={cn(fieldClass, 'py-3.5 leading-relaxed', error && 'border-error focus:border-error focus:ring-error/15', className)}
      {...props}
    />
    {error && (
      <p id={id ? `${id}-error` : undefined} className="mt-1.5 text-sm font-medium text-error">
        {error}
      </p>
    )}
  </div>
));

Textarea.displayName = 'Textarea';
export default Textarea;
