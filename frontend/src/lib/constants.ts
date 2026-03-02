export const COMPANY = {
  name: 'THELAIM',
  nameKo: '디앤인터내셔널',
  fullName: '디앤인터내셔널 (THELAIM)',
  ceo: '정대근',
  businessType: '중국 수출입 | 수입도소매',
  address: '대구광역시 북구 유통단지로7길 35',
  addressEn: '35, Yutongdanji-ro 7-gil, Buk-gu, Daegu, Korea',
  phone: '010-4404-4592',
  phoneIntl: '+82-10-4404-4592',
  email: 'thelaim@naver.com',
  blog: 'https://blog.naver.com/jdgangel',
  cafe: 'https://cafe.naver.com/dnint',
  businessNumber: '504-22-11224',
  onlineSalesNumber: '2011-대구수성구-0440',
} as const;

export const BUSINESS_HOURS = {
  weekday: '09:00 - 18:00',
  lunch: '12:00 - 13:00',
  saturday: '09:00 - 13:00',
  weekend: '일요일/공휴일 휴무',
} as const;

export const COORDINATES = {
  lat: 35.9091,
  lng: 128.6075,
} as const;

export const SOCIAL_LINKS = {
  blog: 'https://blog.naver.com/jdgangel',
  cafe: 'https://cafe.naver.com/dnint',
} as const;

export const IMAGES = {
  hero: '/images/hero/hero-main.jpg',
  about: {
    collection: '/images/about/collection-display.jpg',
    dresses: '/images/about/dress-collection.jpg',
  },
  products: {
    summerFloralPants: '/images/products/summer-floral-pants.jpg',
    floralPajamaSet: '/images/products/floral-pajama-set.jpg',
    floralBlouseCloseup: '/images/products/floral-blouse-closeup.jpg',
    summerPleatsPants: '/images/products/summer-pleats-pants.jpg',
    checkPantsCollection: '/images/products/check-pants-collection.jpg',
    floralBlouseCollection: '/images/products/floral-blouse-collection.jpg',
    floralDressOrange: '/images/products/floral-dress-orange.jpg',
    toilePatternDress: '/images/products/toile-pattern-dress.jpg',
  },
} as const;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thelaim.co.kr';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const LOCALES = ['ko', 'en', 'zh', 'ja'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'ko';
