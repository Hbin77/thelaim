import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { instrument, notoSansSC } from '@/styles/fonts';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SmoothScroll from '@/components/animations/SmoothScroll';
import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F3EFE6',
};

// 링크 미리보기(카카오톡·메신저·검색) 문구. 사실만: 대구의 의류·잡화 수입 도매
const META: Record<string, { title: string; description: string; og: string }> = {
  ko: {
    title: 'THELAIM 더라임 | 의류·잡화 수입 도매',
    description: '대구의 의류·잡화 수입 도매 기업. 산지에서 직접 선별한 트렌디한 의류와 잡화를 최적의 가격으로 공급합니다.',
    og: 'ko_KR',
  },
  en: {
    title: 'THELAIM | Apparel & Accessories Import Wholesale',
    description: 'Daegu-based importer and wholesaler of apparel and accessories, hand-picked at the source and supplied at the right price.',
    og: 'en_US',
  },
  zh: {
    title: 'THELAIM | 服装·杂货进口批发',
    description: '位于韩国大邱的服装与杂货进口批发企业。产地直接甄选潮流单品，以优惠价格供货。',
    og: 'zh_CN',
  },
  ja: {
    title: 'THELAIM | アパレル・雑貨 輸入卸',
    description: '韓国・大邱のアパレル・雑貨輸入卸売企業。産地で直接選んだトレンド商品を最適な価格でお届けします。',
    og: 'ja_JP',
  },
};
const OG_IMAGE = { url: '/images/og.jpg', width: 1200, height: 630, alt: 'THELAIM' };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale] ?? META.ko;
  return {
    metadataBase: new URL('https://thelaim.com'),
    title: { template: '%s | THELAIM', default: m.title },
    description: m.description,
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32' },
        { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: `https://thelaim.com/${locale}`,
      siteName: 'THELAIM',
      images: [OG_IMAGE],
      locale: m.og,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: m.title,
      description: m.description,
      images: [OG_IMAGE.url],
    },
  };
}

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
    <html lang={locale} className={`${instrument.variable} ${notoSansSC.variable}`}>
      <body className="min-h-screen bg-paper text-ink antialiased">
        <NextIntlClientProvider messages={messages}>
          <SmoothScroll>
            <Header />
            <main id="main">{children}</main>
            <Footer />
          </SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
