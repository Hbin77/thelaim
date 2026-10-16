// 첫 화면 원단과 견본 띠에 쓰는 실제 상품 원단(상품 사진에서 잘라 낸 것). 작은 띠·단추에는 thumb(320px)
export const SWATCHES = [
  { key: 'floral', src: '/images/swatches/floral.jpg', thumb: '/images/swatches/floral-s.jpg', product: 'rayon-button-frill-dress' },
  { key: 'gingham', src: '/images/swatches/gingham.jpg', thumb: '/images/swatches/gingham-s.jpg', product: 'check-gingham-pants' },
  { key: 'toile', src: '/images/swatches/toile.jpg', thumb: '/images/swatches/toile-s.jpg', product: 'rayon-lace-pants-toile' },
  { key: 'stripe', src: '/images/swatches/stripe.jpg', thumb: '/images/swatches/stripe-s.jpg', product: 'stripe-wide-pants' },
  { key: 'bloom', src: '/images/swatches/bloom.jpg', thumb: '/images/swatches/bloom-s.jpg', product: 'rayon-lace-pants-character' },
] as const;

export type SwatchKey = (typeof SWATCHES)[number]['key'];
