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
// 인트로 새 심볼의 비행 궤적(로고 좌표): 글자 위쪽 하늘로 크게 돌아 새 심볼 자리(중심 6600, 300)에 내려앉는다.
// 글자를 가로지르지 않게 h의 꼭대기(y≈234)보다 위로만 지나간다.
const TRAIL = 'M-300 300 C2000 -520 4800 -320 6600 300';
const BIRD_C = [6600, 300];
const FLY = { start: 2.5, dur: 1.5, erase: 1 }; // 초
const inout = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
// 상단 바 logo.png(1987×541)에서 글자가 차지하는 영역 — 날아간 로고가 정확히 그 위에 내려앉게
const PNG = { w: 1987, h: 541, x: 91, y: 45, inkW: 1835 };

const vars = (o: Record<string, string | number>) => o as CSSProperties;

// 홈 첫 화면 — 로고 플레이 + 메인 화면(2D 모션그래픽).
// 인트로: 라임색 점이 바닥선으로 펴지고, 글자들이 그 선 위로 솟아오르고, 새 심볼이 궤적을 그리며 날아와 앉는다.
// 끝나면 로고가 줄어들며 상단 바의 로고 자리로 날아가 앉고(그때까지 상단 로고는 숨김), 막이 걷히며 메인 화면이 드러난다.
// 메인 화면: 전체 화면 점 지도 위에 문구·버튼을 겹치고, '중국 현지 소싱 → THELAIM → 전국 소매·도매' 흐름을 그린다(RouteMap).
// 재방문·'동작 줄이기'는 인트로를 건너뛴다.
export default function HeroSection() {
  const t = useTranslations('hero');
  const company = useTranslations('footer');
  const [phase, setPhase] = useState<'wait' | 'run' | 'move' | 'done'>('wait');
  const trailRef = useRef<SVGPathElement>(null);
  const birdRef = useRef<SVGGElement>(null);
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

  // 새 심볼 비행과 궤적 선은 스크립트로 한 프레임씩 같이 움직인다(브라우저마다 SMIL 시작 시점이 달라 어긋나던 문제)
  useEffect(() => {
    if (phase !== 'run') return;
    const trail = trailRef.current;
    const bird = birdRef.current;
    if (!trail || !bird) return;
    const L = trail.getTotalLength();
    trail.style.strokeDasharray = `${L} ${L}`;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      const p = inout(Math.min(1, Math.max(0, (t - FLY.start) / FLY.dur)));
      const e = inout(Math.min(1, Math.max(0, (t - FLY.start - FLY.dur - 0.05) / FLY.erase)));
      const pt = trail.getPointAtLength(L * p);
      bird.setAttribute('transform', `translate(${pt.x - BIRD_C[0]} ${pt.y - BIRD_C[1]})`);
      trail.style.strokeDashoffset = String(e > 0 ? -L * e : L * (1 - p));
      if (t < FLY.start + FLY.dur + FLY.erase + 0.1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const tag = t('tagline');
  const cut = tag.indexOf(' Import');
  const tagline = cut > 0 ? [tag.slice(0, cut), tag.slice(cut + 1)] : [tag];
  const intro = phase === 'run' || phase === 'move';
  const shown = phase === 'move' || phase === 'done';

  return (
    <section className={`network-hero relative isolate h-svh min-h-[760px] overflow-hidden bg-paper ${shown ? 'lp-shown' : ''}`}>
      {shown && <RouteMap labels={[t('route_from'), company('company_name'), t('route_to'), t('route_jp'), t('route_us')]} delay={phase === 'move' ? 0.6 : 0.2} />}
      <div aria-hidden="true" className="network-copy-veil pointer-events-none absolute inset-0" />

      <div className="wrap pointer-events-none relative z-10 flex h-full items-center pt-20">
        <div className="network-copy pointer-events-auto">
          {/* 큰 제목: 영문 한 줄을 두 줄로 — 'Premium Fashion' / 'Import & Wholesale'(이탤릭) */}
          <h1 className="network-title font-display leading-[0.98] tracking-[-0.025em] text-ink">
            <span className="lp-in block whitespace-nowrap" style={vars({ '--i': 0 })}>
              {tagline[0]}
            </span>
            {tagline[1] && (
              <span className="lp-in block whitespace-nowrap italic text-olive" style={vars({ '--i': 1 })}>
                {tagline[1]}
              </span>
            )}
          </h1>
          <p className="lp-in mt-7 max-w-[26em] text-base leading-relaxed text-ink-2 md:text-lg" style={vars({ '--i': 2 })}>
            {t('subtitle')}
          </p>
          {/* 버튼 대신 밑줄 링크: 가리키면 밑줄이 왼쪽에서 다시 그어지고 화살표가 밀려난다 */}
          <div className="lp-in mt-8 flex flex-wrap gap-x-10 gap-y-1" style={vars({ '--i': 3 })}>
            {([['/products', t('cta_primary')], ['/contact', t('cta_secondary')]] as const).map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="group inline-flex min-h-11 items-center gap-2.5 py-2 text-[17px] font-semibold tracking-[-0.01em] text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
              >
                <span className="lp-link">{label}</span>
                <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 transition-transform duration-500 ease-out-soft group-hover:translate-x-1">
                  <path d="M3 10h13M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </Link>
            ))}
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
                {/* 라임 점 → 바닥선 */}
                <circle className="lp-fx lp-dot" cx="3090" cy="1560" r="90" fill="var(--color-lime)" opacity="0" />
                <g className="lp-fx lp-base-out">
                  <line className="lp-fx lp-base" x1="0" x2="6180" y1="1560" y2="1560" stroke="currentColor" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
                </g>
                {/* 새 심볼이 지나간 궤적: 새와 함께 그려지고, 앉은 뒤 꼬리부터 지워진다 */}
                <path ref={trailRef} d={TRAIL} strokeDasharray="99999" strokeDashoffset="99999" fill="none" stroke="currentColor" strokeOpacity=".55" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                {[0, 1].map((i) => (
                  <circle key={i} className="lp-fx lp-ripple" style={vars({ '--i': i })} cx="6600" cy="300" r="560" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                ))}
              </>
            )}
            <g fill="currentColor">
              {LOGO_LETTERS.map((d, i) => (
                <g key={i} clipPath={`url(#lp-c${i})`}>
                  <path d={d} className="lp-letter" style={vars({ '--i': i })} />
                </g>
              ))}
              <g ref={birdRef}>
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
