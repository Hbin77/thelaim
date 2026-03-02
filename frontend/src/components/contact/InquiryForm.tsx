'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CheckCircle, AlertCircle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { submitContact } from '@/lib/api';
import type { ContactFormData } from '@/types';

export default function InquiryForm() {
  const t = useTranslations('contact');
  const searchParams = useSearchParams();
  const productParam = searchParams.get('product') || '';

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    defaultValues: {
      company_name: '',
      contact_person: '',
      email: '',
      phone: '',
      product_interest: productParam,
      message: '',
      preferred_contact: 'email',
    },
  });

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
      <Card className="text-center py-12">
        <CheckCircle className="mx-auto h-12 w-12 text-emerald" />
        <h3 className="mt-4 text-h3 text-navy">{t('success_title')}</h3>
        <p className="mt-2 text-navy/60">{t('success_message')}</p>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => setStatus('idle')}
        >
          {t('submit')}
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="mb-6 text-h3 text-navy">{t('form_title')}</h3>

      {status === 'error' && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <div>
            <p className="font-medium text-red-700">{t('error_title')}</p>
            <p className="text-sm text-red-600">{t('error_message')}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          id="company_name"
          label={t('company_name')}
          placeholder={t('company_name_placeholder')}
          error={errors.company_name?.message}
          {...register('company_name', { required: t('validation_company') })}
        />

        <Input
          id="contact_person"
          label={t('contact_person')}
          placeholder={t('contact_person_placeholder')}
          error={errors.contact_person?.message}
          {...register('contact_person', { required: t('validation_person') })}
        />

        <Input
          id="email"
          label={t('email')}
          type="email"
          placeholder={t('email_placeholder')}
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
          placeholder={t('phone_placeholder')}
          {...register('phone')}
        />

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
          error={errors.message?.message}
          rows={5}
          {...register('message', {
            required: t('validation_message'),
            minLength: {
              value: 10,
              message: t('validation_message_min'),
            },
          })}
        />

        <Select
          id="preferred_contact"
          label={t('preferred_contact')}
          options={[
            { value: 'email', label: t('preferred_email') },
            { value: 'phone', label: t('preferred_phone') },
            { value: 'kakao', label: t('preferred_kakao') },
          ]}
          {...register('preferred_contact')}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? t('submitting') : t('submit')}
        </Button>
      </form>
    </Card>
  );
}
