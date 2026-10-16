import { Instrument_Serif, Noto_Sans_SC } from 'next/font/google';

// 영문 장식(섹션 부제·큰 숫자·원단 이름)
export const instrument = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
  weight: '400',
  style: ['normal', 'italic'],
});

// 중국어 대체 글꼴(한글·영문은 Pretendard)
export const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  variable: '--font-noto-sc',
  display: 'swap',
  weight: ['400', '500', '700'],
  preload: false,
});
