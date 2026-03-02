import type { MetadataRoute } from 'next';

const BASE_URL = 'https://thelaim.co.kr';
const locales = ['ko', 'en', 'zh'];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/about', '/products', '/location', '/contact'];

  return pages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: page === '' ? 1 : 0.8,
    }))
  );
}
