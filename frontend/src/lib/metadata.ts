import type { Metadata } from 'next';
import { COMPANY, SITE_URL } from './constants';

interface MetadataParams {
  title: string;
  description: string;
  path?: string;
  image?: string;
}

export function generatePageMetadata({
  title,
  description,
  path = '',
  image = '/og-image.jpg',
}: MetadataParams): Metadata {
  const fullTitle = `${title} | ${COMPANY.name}`;
  const url = `${SITE_URL}${path}`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: COMPANY.name,
      images: [{ url: image, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
      languages: {
        ko: `${SITE_URL}/ko${path}`,
        en: `${SITE_URL}/en${path}`,
        zh: `${SITE_URL}/zh${path}`,
      },
    },
  };
}
