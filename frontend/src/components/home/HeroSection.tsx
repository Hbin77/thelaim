'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LOGO_BIRD, LOGO_LETTERS, LOGO_VIEWBOX } from './logo-paths';
import RouteMap from './RouteMap';

// 글자별 바닥선 아래로 숨기는 클립 영역(로고 좌표). [x, y, 너비, 높이]
const CLIPS = [
  [0, 560, 890, 990],
  [810, 220, 1080, 1330],
  [1880, 560, 805, 1010],
  [2712, 575, 1135, 1245],
  [3280, 560, 740, 1010],
  [4098, 575, 500, 970],
  [4588, 560, 1600, 985],
];
// 인트로 새 심볼의 비행: 궤적 선(로고 좌표)과, 같은 곡선을 새 심볼 중심(6600, 300) 기준으로 옮긴 이동 경로
const TRAIL = 'M-200 1700 C3500 2050 7000 1800 6600 300';
const FLIGHT = 'M-6800 1400 C-3100 1750 400 1500 0 0';
const EASE = { calcMode: 'spline', keyTimes: '0;1', keySplines: '.45 0 .2 1' } as const;
// 상단 바 logo.png(1987×541)에서 글자가 차지하는 영역 — 날아간 로고가 정확히 그 위에 내려앉게
const PNG = { w: 1987, h: 541, x: 91, y: 45, inkW: 1835 };

const vars = (o: Record<string, string | number>) => o as CSSProperties;

// 홈 첫 화면 — 로고 플레이 + 메인 화면(2D 모션그래픽).
// 인트로: 라임색 점이 바닥선으로 펴지고, 글자들이 그 선 위로 솟아오르고, 새 심볼이 궤적을 그리며 날아와 앉는다.
// 끝나면 로고가 줄어들며 상단 바의 로고 자리로 날아가 앉고(그때까지 상단 로고는 숨김), 막이 걷히며 메인 화면이 드러난다.
// 메인 화면: 왼쪽 문구·버튼, 오른쪽은 점 지도 위에 '중국 현지 소싱 → 대구종합유통단지 → 전국 소매·도매' 흐름을 그린다(RouteMap).
// 재방문·'동작 줄이기'는 인트로를 건너뛴다.
export default function HeroSection() {
  const t = useTranslations('hero');
  const [phase, setPhase] = useState<'wait' | 'run' | 'move' | 'done'>('wait');
  const goRef = useRef<SVGAnimateElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem('thelaim-logoplay') === '1';
    } catch {}
    if (reduce || seen) {
      setPhase('done');
      return;
    }
    root.dataset.intro = 'run';
    setPhase('run');
    const timers = [
      window.setTimeout(() => {
        const svg = logoRef.current;
        const img = document.querySelector('header a[aria-label="THELAIM"]')?.getBoundingClientRect();
        if (svg && img) {
          const from = svg.getBoundingClientRect();
          const s = Math.min(img.width / PNG.w, img.height / PNG.h);
          const x = img.left + PNG.x * s;
          const y = img.top + (img.height - PNG.h * s) / 2 + PNG.y * s;
          svg.style.transform = `translate(${x - from.left}px, ${y - from.top}px) scale(${(PNG.inkW * s) / from.width})`;
        }
        root.dataset.intro = 'move';
        setPhase('move');
      }, 4700),
      window.setTimeout(() => {
        root.removeAttribute('data-intro');
        try {
          sessionStorage.setItem('thelaim-logoplay', '1');
        } catch {}
        setPhase('done');
      }, 5900),
    ];
    return () => {
      timers.forEach(clearTimeout);
      root.removeAttribute('data-intro');
    };
  }, []);

  // 선 궤적·새 비행(SMIL)은 CSS 애니메이션과 같은 순간에 시작
  useEffect(() => {
    if (phase === 'run') goRef.current?.beginElement();
  }, [phase]);

  const intro = phase === 'run' || phase === 'move';
  const shown = phase === 'move' || phase === 'done';

  return (
    <section className={`relative h-svh min-h-[640px] overflow-hidden bg-paper ${shown ? 'lp-shown' : ''}`}>
      <div aria-hidden="true" className="lp-grid absolute inset-0" />

      <div className="wrap relative grid h-full grid-rows-[minmax(0,1fr)_auto] gap-6 pb-[max(56px,8svh)] pt-24 md:grid-cols-12 md:grid-rows-1 md:items-center md:gap-8 md:pb-0 md:pt-20">
        {/* 흐름 그래픽 */}
        <div className="relative md:order-2 md:col-span-7 md:col-start-6">
          {shown && <RouteMap labels={[t('route_from'), t('route_hub'), t('route_to')]} delay={phase === 'move' ? 0.6 : 0.2} />}
        </div>
        <div className="md:order-1 md:col-span-5">
          <p className="lp-in font-display text-[17px] italic text-olive md:text-[19px]" style={vars({ '--i': 0 })}>
            {t('tagline')}
          </p>
          <h1 className="lp-in mt-4 max-w-[11em] text-[clamp(32px,4.4vw,64px)] font-bold leading-[1.14] tracking-[-0.03em] text-ink" style={vars({ '--i': 1 })}>
            {t('title')}
          </h1>
          <p className="lp-in mt-5 max-w-[30em] text-[15px] leading-relaxed text-ink-2 md:text-base" style={vars({ '--i': 2 })}>
            {t('subtitle')}
          </p>
          <div className="lp-in mt-8 flex flex-wrap gap-3" style={vars({ '--i': 3 })}>
            <Link
              href="/products"
              className="inline-flex h-12 items-center rounded-full bg-ink px-7 text-[15px] font-semibold text-paper transition-colors hover:bg-olive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {t('cta_primary')}
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center rounded-full border border-ink/25 px-7 text-[15px] font-semibold text-ink transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {t('cta_secondary')}
            </Link>
          </div>
        </div>
      </div>

      {/* 인트로 막: 로고 플레이 → 로고가 상단 바로 날아가고 막이 걷힌다 */}
      {intro && (
        <div
          aria-hidden="true"
          className={`fixed inset-0 z-[60] grid place-items-center transition-[background-color] duration-[900ms] ${phase === 'run' ? 'bg-paper' : 'bg-transparent'}`}
        >
          <svg
            ref={logoRef}
            viewBox={LOGO_VIEWBOX}
            className={`w-[86vw] max-w-[1400px] origin-top-left overflow-visible text-ink transition-transform duration-[1100ms] ease-[cubic-bezier(.77,0,.18,1)] md:w-[64vw] ${phase === 'run' ? 'lp-run' : ''}`}
          >
            <defs>
              {CLIPS.map(([x, y, w, h], i) => (
                <clipPath key={i} id={`lp-c${i}`}>
                  <rect x={x} y={y} width={w} height={h} />
                </clipPath>
              ))}
            </defs>
            {phase === 'run' && (
              <>
                <animate ref={goRef} id="lpgo" attributeName="opacity" begin="indefinite" dur="0.01s" />
                {/* 라임 점 → 바닥선 */}
                <circle className="lp-fx lp-dot" cx="3090" cy="1560" r="90" fill="var(--color-lime)" opacity="0" />
                <g className="lp-fx lp-base-out">
                  <line className="lp-fx lp-base" x1="0" x2="6180" y1="1560" y2="1560" stroke="currentColor" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
                </g>
                {/* 새 심볼이 지나간 궤적: 새와 함께 그려지고, 앉은 뒤 꼬리부터 지워진다 */}
                <path d={TRAIL} pathLength={1} strokeDasharray="1 1" strokeDashoffset="1" fill="none" stroke="currentColor" strokeOpacity=".55" strokeWidth="1" vectorEffect="non-scaling-stroke">
                  <animate attributeName="stroke-dashoffset" values="1;0" begin="lpgo.begin+2.5s" dur="1.5s" fill="freeze" {...EASE} />
                  <animate attributeName="stroke-dashoffset" values="0;-1" begin="lpgo.begin+4.05s" dur="1s" fill="freeze" {...EASE} />
                </path>
                {[0, 1].map((i) => (
                  <circle key={i} className="lp-fx lp-ripple" style={vars({ '--i': i })} cx="6600" cy="300" r="760" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                ))}
              </>
            )}
            <g fill="currentColor">
              {LOGO_LETTERS.map((d, i) => (
                <g key={i} clipPath={`url(#lp-c${i})`}>
                  <path d={d} className="lp-letter" style={vars({ '--i': i })} />
                </g>
              ))}
              <g>
                {phase === 'run' && <animateMotion path={FLIGHT} begin="lpgo.begin+2.5s" dur="1.5s" fill="freeze" keyPoints="0;1" {...EASE} />}
                <g className="lp-fx lp-bird">
                  {LOGO_BIRD.map((d, i) => (
                    <path key={i} d={d} />
                  ))}
                </g>
              </g>
            </g>
          </svg>
        </div>
      )}
    </section>
  );
}
