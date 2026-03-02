'use client';

import { Phone, Mail, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Card from '@/components/ui/Card';
import { COMPANY } from '@/lib/constants';

export default function ContactInfo() {
  const t = useTranslations('location');

  const items = [
    {
      icon: Phone,
      label: t('phone_label'),
      value: COMPANY.phone,
      href: `tel:${COMPANY.phone}`,
    },
    {
      icon: Mail,
      label: t('email_label'),
      value: COMPANY.email,
      href: `mailto:${COMPANY.email}`,
    },
    {
      icon: MapPin,
      label: t('address_label'),
      value: COMPANY.address,
    },
  ];

  return (
    <Card>
      <h3 className="mb-6 text-xl md:text-2xl font-semibold text-navy">{t('address_label')}</h3>
      <div className="space-y-5">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-teal-deep/10">
                <Icon className="h-5 w-5 text-teal-deep" />
              </div>
              <div>
                <p className="text-sm font-medium text-navy/50">{item.label}</p>
                {item.href ? (
                  <a href={item.href} className="text-navy transition-colors hover:text-ocean">
                    {item.value}
                  </a>
                ) : (
                  <p className="text-navy">{item.value}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
