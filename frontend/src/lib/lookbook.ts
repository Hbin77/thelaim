// 상품 사진 목록: 종류와 원래 크기. 화면에는 원래 해상도보다 크게 늘리지 않는다.
//  single  옷 한 벌(세로, 고화질)  · collection  같은 옷 여러 색(가로)
//  detail  원단 근접(정사각)       · panorama    아주 가로로 긴 진열
export type ShotKind = 'single' | 'collection' | 'detail' | 'panorama';
export interface Shot {
  src: string;
  w: number;
  h: number;
  kind: ShotKind;
  slug: string;
}

const P = '/images/products/';
export const SHOTS: Shot[] = [
  { src: P + 'rayon-button-frill-dress.jpg', w: 1023, h: 1536, kind: 'single', slug: 'rayon-button-frill-dress' },
  { src: P + 'rayon-button-frill-dress-collection.jpg', w: 1378, h: 1024, kind: 'collection', slug: 'rayon-button-frill-dress' },
  { src: P + 'rayon-button-frill-dress-detail.jpg', w: 1280, h: 1280, kind: 'detail', slug: 'rayon-button-frill-dress' },
  { src: P + 'stripe-wide-pants.jpg', w: 1151, h: 1439, kind: 'single', slug: 'stripe-wide-pants' },
  { src: P + 'stripe-wide-pants-collection.jpg', w: 1470, h: 1279, kind: 'collection', slug: 'stripe-wide-pants' },
  { src: P + 'stripe-wide-pants-detail.jpg', w: 1280, h: 1280, kind: 'detail', slug: 'stripe-wide-pants' },
  { src: P + 'check-gingham-pants.jpg', w: 1151, h: 1439, kind: 'single', slug: 'check-gingham-pants' },
  { src: P + 'check-gingham-pants-collection.jpg', w: 1280, h: 1280, kind: 'collection', slug: 'check-gingham-pants' },
  { src: P + 'check-gingham-pants-detail.jpg', w: 1280, h: 1280, kind: 'detail', slug: 'check-gingham-pants' },
  { src: P + 'rayon-lace-pants-character.jpg', w: 1024, h: 1280, kind: 'single', slug: 'rayon-lace-pants-character' },
  { src: P + 'rayon-lace-pants-character-collection.jpg', w: 1492, h: 1279, kind: 'collection', slug: 'rayon-lace-pants-character' },
  { src: P + 'rayon-lace-pants-character-detail.jpg', w: 1280, h: 1280, kind: 'detail', slug: 'rayon-lace-pants-character' },
  { src: P + 'pleats-rayon-dress.jpg', w: 1023, h: 1536, kind: 'single', slug: 'pleats-rayon-dress' },
  { src: P + 'pleats-rayon-dress-collection.jpg', w: 1399, h: 1279, kind: 'collection', slug: 'pleats-rayon-dress' },
  { src: P + 'asa-cotton-dress.jpg', w: 922, h: 1382, kind: 'single', slug: 'asa-cotton-dress' },
  { src: P + 'asa-cotton-dress-collection.jpg', w: 1430, h: 1280, kind: 'collection', slug: 'asa-cotton-dress' },
  { src: P + 'rayon-lace-pants-toile.jpg', w: 1151, h: 1440, kind: 'single', slug: 'rayon-lace-pants-toile' },
  { src: P + 'rayon-lace-pants-toile-collection.jpg', w: 1280, h: 1280, kind: 'collection', slug: 'rayon-lace-pants-toile' },
  { src: P + 'rayon-lace-pants.jpg', w: 1152, h: 1440, kind: 'single', slug: 'rayon-lace-pants-floral' },
  { src: P + 'rayon-lace-pants-collection.jpg', w: 1406, h: 1023, kind: 'collection', slug: 'rayon-lace-pants-floral' },
  { src: P + 'rayon-lace-shorts.jpg', w: 1023, h: 1365, kind: 'single', slug: 'rayon-lace-shorts-floral' },
  { src: P + 'rayon-lace-shorts-collection.jpg', w: 1365, h: 1023, kind: 'collection', slug: 'rayon-lace-shorts-floral' },
  { src: P + 'rayon-lace-shorts-character.jpg', w: 1453, h: 1279, kind: 'collection', slug: 'rayon-lace-shorts-character' },
  { src: P + 'rayon-lace-shorts-toile.jpg', w: 1156, h: 1024, kind: 'collection', slug: 'rayon-lace-shorts-toile' },
  { src: P + 'rayon-lace-shorts-toile-collection.jpg', w: 1312, h: 512, kind: 'panorama', slug: 'rayon-lace-shorts-toile' },
];

export const byKind = (k: ShotKind) => SHOTS.filter((s) => s.kind === k);
export const shotsOf = (slug: string) => SHOTS.filter((s) => s.slug === slug);

// 이 사진을 몇 px(CSS)까지 넓혀도 되는지: 화면 배율 1.25배까지는 선명하게 본다
export const maxCssWidth = (s: Shot) => Math.round(s.w / 1.25);
