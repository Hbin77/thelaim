'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Copy, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Card from '@/components/ui/Card';
import { COMPANY, BUSINESS_HOURS } from '@/lib/constants';

export default function AddressCard() {
  const t = useTranslations('location');
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    await navigator.clipboard.writeText(COMPANY.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const infoItems = [
    {
      icon: MapPin,
      label: t('address_label'),
      value: COMPANY.address,
      action: (
        <button
          onClick={copyAddress}
          className="ml-2 rounded-lg p-1.5 text-navy/40 transition-colors hover:bg-navy/5 hover:text-navy"
          aria-label="Copy address"
        >
          {copied ? <Check className="h-4 w-4 text-emerald" /> : <Copy className="h-4 w-4" />}
        </button>
      ),
    },
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
      icon: Clock,
      label: t('business_hours'),
      value: `${t('weekday')}\n${t('weekend')}`,
    },
  ];

  return (
    <section className="py-8">
      <Card>
        <div className="space-y-5">
          {infoItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-teal-deep/10">
                  <Icon className="h-5 w-5 text-teal-deep" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-navy/50">{item.label}</p>
                  {'href' in item && item.href ? (
                    <a
                      href={item.href}
                      className="text-navy transition-colors hover:text-ocean"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="whitespace-pre-line text-navy">{item.value}</p>
                  )}
                </div>
                {'action' in item && item.action}
              </div>
            );
          })}
        </div>
      </Card>
    </section>
  );
}
