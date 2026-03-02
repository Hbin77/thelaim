import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { cormorant, bodoniModa, notoSerifKR, notoSansSC } from '@/styles/fonts';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SmoothScroll from '@/components/animations/SmoothScroll';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | THELAIM',
    default: 'THELAIM - Global Fashion Export Specialist',
  },
  description: 'THELAIM - Chinese garment and accessory import wholesale specialist based in Daegu.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'THELAIM - Global Fashion Export Specialist',
    description: 'Premium fashion import & wholesale. Direct sourcing from manufacturers to your business.',
    url: 'https://thelaim.co.kr',
    siteName: 'THELAIM',
    images: [
      {
        url: '/images/ogtag.png',
        width: 1659,
        height: 896,
        alt: 'THELAIM - Premium Fashion Import & Wholesale',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'THELAIM - Global Fashion Export Specialist',
    description: 'Premium fashion import & wholesale. Direct sourcing from manufacturers to your business.',
    images: ['/images/ogtag.png'],
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${cormorant.variable} ${bodoniModa.variable} ${notoSerifKR.variable} ${notoSansSC.variable}`}>
      <body className="min-h-screen bg-white antialiased">
        <NextIntlClientProvider messages={messages}>
          <SmoothScroll>
            <Header />
            <main>{children}</main>
            <Footer />
          </SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
