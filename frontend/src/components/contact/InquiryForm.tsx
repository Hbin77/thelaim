'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { useMessages, useTranslations } from 'next-intl';
import { CheckCircle, AlertCircle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button, { Arrow } from '@/components/ui/Button';
import { submitContact } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { ContactFormData } from '@/types';

type ProductItems = Record<string, { name: string }>;

export default function InquiryForm() {
  const t = useTranslations('contact');
  const searchParams = useSearchParams();
  const items = ((useMessages() as Record<string, unknown>).productItems ?? {}) as ProductItems;
  const productParam = searchParams.get('product') || '';
  // 제품 창에서 넘어오면 상품 이름(이 언어)으로 채워 둔다
  const productDefault = items[productParam]?.name ?? productParam;

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    defaultValues: {
      company_name: '',
      contact_person: '',
      email: '',
      phone: '',
      product_interest: productDefault,
      message: '',
      preferred_contact: 'email',
    },
  });

  const preferred = watch('preferred_contact');

  const onSubmit = async (data: ContactFormData) => {
    setStatus('loading');
    try {
      await submitContact(data);
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div role="status" className="rounded-[6px] border border-line bg-white px-6 py-16 text-center md:px-10">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-lime">
          <CheckCircle className="h-8 w-8 text-ink" aria-hidden="true" />
        </span>
        <h2 className="mt-6 text-2xl font-extrabold tracking-[-0.03em] text-ink">{t('success_title')}</h2>
        <p className="mt-2 text-ink-2">{t('success_message')}</p>
        <Button variant="secondary" className="mt-8" onClick={() => setStatus('idle')}>
          {t('submit')}
        </Button>
      </div>
    );
  }

  const contactOptions = [
    { value: 'email', label: t('preferred_email') },
    { value: 'phone', label: t('preferred_phone') },
    { value: 'kakao', label: t('preferred_kakao') },
  ] as const;

  return (
    <div className="rounded-[6px] border border-line bg-white p-6 md:p-10">
      <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-ink">{t('form_title')}</h2>

      {status === 'error' && (
        <div role="alert" className="mt-6 flex items-start gap-3 rounded-[4px] border border-error/25 bg-error/[0.06] p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-none text-error" aria-hidden="true" />
          <div>
            <p className="font-semibold text-error">{t('error_title')}</p>
            <p className="text-sm text-error">{t('error_message')}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 grid gap-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            id="company_name"
            label={t('company_name')}
            placeholder={t('company_name_placeholder')}
            autoComplete="organization"
            required
            error={errors.company_name?.message}
            {...register('company_name', { required: t('validation_company') })}
          />
          <Input
            id="contact_person"
            label={t('contact_person')}
            placeholder={t('contact_person_placeholder')}
            autoComplete="name"
            required
            error={errors.contact_person?.message}
            {...register('contact_person', { required: t('validation_person') })}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            id="email"
            label={t('email')}
            type="email"
            autoComplete="email"
            placeholder={t('email_placeholder')}
            required
            error={errors.email?.message}
            {...register('email', {
              required: t('validation_email'),
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: t('validation_email'),
              },
            })}
          />
          <Input
            id="phone"
            label={t('phone')}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder={t('phone_placeholder')}
            {...register('phone')}
          />
        </div>

        <Input
          id="product_interest"
          label={t('product_interest')}
          placeholder={t('product_interest_placeholder')}
          {...register('product_interest')}
        />

        <Textarea
          id="message"
          label={t('message')}
          placeholder={t('message_placeholder')}
          required
          error={errors.message?.message}
          rows={6}
          {...register('message', {
            required: t('validation_message'),
            minLength: {
              value: 10,
              message: t('validation_message_min'),
            },
          })}
        />

        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-ink">{t('preferred_contact')}</legend>
          <div className="grid grid-cols-3 gap-1 rounded-full border border-line bg-paper p-1">
            {contactOptions.map((opt) => (
              <label
                key={opt.value}
                className={cn(
                  'relative flex min-h-11 cursor-pointer items-center justify-center rounded-full text-sm font-semibold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-olive',
                  preferred === opt.value ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'
                )}
              >
                <input type="radio" value={opt.value} className="sr-only" {...register('preferred_contact')} />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <Button type="submit" size="lg" className="w-full" disabled={status === 'loading'}>
          {status === 'loading' ? t('submitting') : t('submit')}
          {status !== 'loading' && <Arrow />}
        </Button>
      </form>
    </div>
  );
}
