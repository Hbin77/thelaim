'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { GLOBE_DOTS } from './globe-dots';
import { KOREA_DOTS } from './korea-dots';
import { LOGO_BIRD } from './logo-paths';

// 오른쪽 흐름 지도(캔버스 2D): 태평양을 가운데 둔 점 지구본의 위쪽 일부를 크게 보여 준다.
// 왼쪽에 중국·한반도·일본, 오른쪽 끝에 미국 서해안. 중국 → 대구, 대구 → 일본·미국은 지구 곡면을 따라 솟는 호(대권 항로)로 잇는다.
// 한반도는 실제 비율로는 너무 작아서, 위쪽에 돋보기 원을 띄워 대구에서 전국 도시로 퍼지는 유통망을 확대해 보여 준다.
// 새 심볼은 중국에서 대구로 7초에 한 번 날아오고, 지구본은 아주 천천히 좌우로 돈다.
type LngLat = [number, number];
const SRC: LngLat = [116.4, 30.6]; // 중국(특정 도시가 아니라 일대를 가리키는 표시)
const HUB: LngLat = [128.6, 35.87]; // 대구
const JAPAN: LngLat = [139.7, 35.7]; // 도쿄
const USA: LngLat = [237.6, 37.7]; // 미국 서해안(샌프란시스코 부근)
const CITIES: LngLat[] = [
  [126.98, 37.57], // 서울
  [128.9, 37.75], // 강릉
  [127.38, 36.35], // 대전
  [126.85, 35.16], // 광주
  [129.08, 35.18], // 부산
];
// 지구본 시점: 중심 경도·위도, 반지름(캔버스 폭 배수), 중심 높이(캔버스 높이 배수)
const VIEW = { lon: 178, lat: 10, r: 0.62, cy: 1.06 };
// 돋보기: 위치(캔버스 비율), 반지름(캔버스 폭 배수), 안쪽 지도 중심
const LENS = { x: 0.31, y: 0.27, r: 0.15, center: [127.75, 36.2] as LngLat, span: 6.4 };
const INTRO = 2.2;
const LOOP = 7;

const css = (n: string) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(1 - t, 3));
const inout = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const rad = Math.PI / 180;
const vec = ([lon, lat]: LngLat) => [Math.cos(lat * rad) * Math.cos(lon * rad), Math.cos(lat * rad) * Math.sin(lon * rad), Math.sin(lat * rad)];
// 두 지점 사이 대권 위의 t 지점(경도·위도)
const slerp = (a: LngLat, b: LngLat, t: number): LngLat => {
  const va = vec(a), vb = vec(b);
  const om = Math.acos(Math.min(1, va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2]));
  const s1 = Math.sin((1 - t) * om) / Math.sin(om), s2 = Math.sin(t * om) / Math.sin(om);
  const v = [0, 1, 2].map((i) => s1 * va[i] + s2 * vb[i]);
  return [Math.atan2(v[1], v[0]) / rad, Math.asin(v[2]) / rad];
};

export default function RouteMap({ labels, delay }: { labels: string[]; delay: number }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const box = boxRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const C = { ink: css('--color-ink'), lime: css('--color-lime'), mist: css('--color-mist'), paper: css('--color-paper'), line: css('--color-line') };
    const bird = LOGO_BIRD.map((d) => new Path2D(d));
    let W = 0, H = 0, raf = 0;

    const resize = () => {
      const r = box.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(box);

    // 정사영 지구본: 경도·위도·고도 → 화면 좌표와 앞면 정도(cos c, 0 이하면 뒷면)
    let l0 = VIEW.lon;
    const p0 = VIEW.lat * rad;
    const G = ([lon, lat]: LngLat, alt = 0) => {
      const R = W * VIEW.r * (1 + alt);
      const l = (lon - l0) * rad, p = lat * rad;
      const cosc = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
      const x = Math.cos(p) * Math.sin(l);
      const y = Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l);
      return [W / 2 + R * x, H * VIEW.cy - R * y, cosc] as const;
    };
    const arcG = (a: LngLat, b: LngLat, h: number, t: number) => G(slerp(a, b, t), h * Math.sin(Math.PI * t));
    const strokeG = (a: LngLat, b: LngLat, h: number, p: number) => {
      if (p <= 0) return;
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const [x, y] = arcG(a, b, h, (p * i) / 80);
        if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
      }
      ctx.stroke();
    };

    // 돋보기 안: 한반도 주변을 평면으로 크게
    const lens = () => ({ x: W * LENS.x, y: H * LENS.y, r: Math.max(56, W * LENS.r) });
    const L = ([lon, lat]: LngLat) => {
      const { x, y, r } = lens();
      const s = (2 * r) / LENS.span;
      return [x + (lon - LENS.center[0]) * Math.cos(36 * rad) * s, y - (lat - LENS.center[1]) * s] as const;
    };

    const angDist = (lon: number, lat: number) => {
      const a = vec([lon, lat]), b = vec(HUB);
      return Math.acos(Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])) / rad;
    };
    const COL: Record<number, string> = { 1: C.mist, 2: C.ink, 3: C.mist, 4: C.mist, 5: C.mist, 6: C.mist };
    const ALPHA: Record<number, number> = { 1: 0.9, 2: 1, 3: 0.55, 4: 0.9, 5: 0.4, 6: 0.9 };
    const dist = GLOBE_DOTS.map(([lon, lat]) => angDist(lon, lat));

    const t0 = performance.now() + delay * 1000;
    const draw = (now: number) => {
      const t = reduce ? 99 : (now - t0) / 1000;
      l0 = VIEW.lon + (reduce ? 0 : Math.sin(Math.max(t, 0) / 6) * 1.6);
      ctx.clearRect(0, 0, W, H);
      const dotR = Math.max(1.1, W / 430);

      // 지구본 점: 대구에서 바깥으로 물결처럼 깔리고, 가장자리(지평선)로 갈수록 작고 옅어진다
      for (let i = 0; i < GLOBE_DOTS.length; i++) {
        const [lon, lat, k] = GLOBE_DOTS[i];
        const local = ease((t - (dist[i] / 120) * 1.6) / 0.8);
        if (local <= 0) continue;
        const [x, y, c] = G([lon, lat]);
        if (c <= 0.02 || x < -4 || x > W + 4 || y < -4 || y > H + 4) continue;
        ctx.globalAlpha = ALPHA[k] * local * Math.min(1, c * 2.2);
        ctx.fillStyle = COL[k];
        ctx.beginPath();
        ctx.arc(x, y, dotR * (k === 2 ? 0.75 : 1) * (0.45 + 0.55 * c), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // 큰 호: 중국 → 대구(굵은 점선), 대구 → 일본·미국(가는 점선)
      ctx.strokeStyle = C.ink;
      ctx.lineWidth = 1.25; ctx.setLineDash([4, 5]);
      strokeG(SRC, HUB, 0.05, inout((t - 0.9) / 1.4));
      ctx.lineWidth = 1.1; ctx.setLineDash([3, 5]);
      const jpT = inout((t - INTRO - 0.3) / 1.1);
      const usT = inout((t - INTRO - 0.6) / 2);
      strokeG(HUB, JAPAN, 0.025, jpT);
      strokeG(HUB, USA, 0.16, usT);
      ctx.setLineDash([]);

      // 지점 표시
      const mark = (p: LngLat, on: number, ring = false) => {
        if (on <= 0) return;
        const [x, y] = G(p);
        ctx.globalAlpha = on; ctx.fillStyle = C.ink; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.4;
        if (ring) { ctx.beginPath(); ctx.arc(x, y, 5.5, 0, Math.PI * 2); ctx.stroke(); }
        ctx.beginPath(); ctx.arc(x, y, ring ? 1.9 : 2.8, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      };
      mark(SRC, ease((t - 0.7) / 0.5), true);
      mark(JAPAN, jpT > 0.98 ? 1 : 0);
      mark(USA, usT > 0.98 ? 1 : 0);
      const usPulse = ((t - INTRO - 2.8) % 3.2) / 3.2;
      if (usT > 0.98 && !reduce && usPulse > 0) {
        const [x, y] = G(USA);
        ctx.globalAlpha = 0.5 * (1 - usPulse); ctx.strokeStyle = C.ink; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(x, y, 4 + usPulse * 16, (4 + usPulse * 16) * 0.6, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // 돋보기: 지구본의 대구에서 원까지 두 줄로 잇고, 원 안에 한반도 유통망
      const lensIn = ease((t - 1.8) / 0.9);
      const [hx, hy] = G(HUB);
      const { x: lx, y: ly, r: lr } = lens();
      if (lensIn > 0) {
        // 대구 점에서 원에 닿는 두 접선
        const ang = Math.atan2(hy - ly, hx - lx), d = Math.hypot(hx - lx, hy - ly);
        const off = Math.acos(Math.min(1, lr / d));
        ctx.globalAlpha = 0.35 * lensIn; ctx.strokeStyle = C.ink; ctx.lineWidth = 1;
        for (const s of [-1, 1]) {
          ctx.beginPath(); ctx.moveTo(hx, hy);
          ctx.lineTo(lx + lr * Math.cos(ang + s * off), ly + lr * Math.sin(ang + s * off));
          ctx.stroke();
        }
        // 원 바탕
        const rr = lr * (0.85 + 0.15 * lensIn);
        ctx.globalAlpha = lensIn;
        ctx.fillStyle = C.paper; ctx.beginPath(); ctx.arc(lx, ly, rr, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = C.ink; ctx.lineWidth = 1; ctx.stroke();
        ctx.save(); ctx.beginPath(); ctx.arc(lx, ly, rr - 1, 0, Math.PI * 2); ctx.clip();
        // 한반도 점
        const kr = Math.max(0.9, lr / 62);
        for (const [lon, lat, k] of KOREA_DOTS) {
          const [x, y] = L([lon, lat]);
          ctx.globalAlpha = lensIn * (k === 2 ? 1 : 0.4);
          ctx.fillStyle = k === 2 ? C.ink : C.mist;
          ctx.beginPath(); ctx.arc(x, y, kr, 0, Math.PI * 2); ctx.fill();
        }
        // 대구 → 전국 도시
        const [ux, uy] = L(HUB);
        const fanT = (t - INTRO) / 1.2;
        ctx.strokeStyle = C.ink; ctx.lineWidth = 1;
        CITIES.forEach((c, i) => {
          const p = ease(fanT - i * 0.12);
          if (p <= 0) return;
          const [cx, cy] = L(c);
          const mx = (ux + cx) / 2, my = (uy + cy) / 2 - lr * 0.18;
          ctx.globalAlpha = 0.6;
          ctx.beginPath(); ctx.moveTo(ux, uy);
          for (let j = 1; j <= 24; j++) {
            const q = (p * j) / 24;
            ctx.lineTo((1 - q) * (1 - q) * ux + 2 * (1 - q) * q * mx + q * q * cx, (1 - q) * (1 - q) * uy + 2 * (1 - q) * q * my + q * q * cy);
          }
          ctx.stroke();
          if (p > 0.98) {
            ctx.globalAlpha = 1; ctx.fillStyle = C.ink;
            ctx.beginPath(); ctx.arc(cx, cy, 2.4, 0, Math.PI * 2); ctx.fill();
            const pulse = ((t - INTRO - 1.4 + i * 0.6) % 3.2) / 3.2;
            if (pulse > 0 && !reduce) {
              ctx.globalAlpha = 0.45 * (1 - pulse);
              ctx.beginPath(); ctx.arc(cx, cy, 3 + pulse * 10, 0, Math.PI * 2); ctx.stroke();
            }
          }
        });
        // 대구 거점
        const ring = ((t - 2.1) % 3.2) / 3.2;
        if (!reduce && ring > 0) {
          ctx.globalAlpha = 0.5 * (1 - ring) * lensIn;
          ctx.beginPath(); ctx.arc(ux, uy, 6 + ring * 22, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.globalAlpha = lensIn; ctx.fillStyle = C.lime; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(ux, uy, 5.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.restore();
      }
      // 지구본 위 대구 점
      ctx.globalAlpha = ease((t - 2.1) / 0.6);
      ctx.fillStyle = C.lime; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(hx, hy, 3.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.globalAlpha = 1;

      // 새 심볼: 중국 → 대구 호를 따라 날아온다
      const ft = reduce ? -1 : ((t - INTRO - 0.4) % LOOP) / LOOP;
      if (t > INTRO + 0.4 && ft < 0.62) {
        const q = inout(ft / 0.58);
        const [bx, by] = arcG(SRC, HUB, 0.05, Math.min(q, 1));
        const s = (W / 700) * 0.0042;
        ctx.globalAlpha = Math.min(1, ft / 0.06, (0.62 - ft) / 0.06);
        ctx.save(); ctx.translate(bx, by); ctx.scale(s, s); ctx.translate(-6600, -300);
        ctx.fillStyle = C.ink; bird.forEach((b) => ctx.fill(b));
        ctx.restore();
        ctx.globalAlpha = 1;
      }

      // 이름표 위치: 01 중국, 02 대구(돋보기 안), 03 전국(돋보기 안 부산 옆), 04 일본, 05 미국
      const pts = [G(SRC), L(HUB), L(CITIES[4]), G(JAPAN), G(USA)];
      labelRefs.current.forEach((el, i) => {
        if (el) el.style.transform = `translate(${pts[i][0]}px, ${pts[i][1]}px)`;
      });

      if (!reduce) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [delay]);

  const offs = [
    'translate-x-[-12px] translate-y-3',
    '-translate-x-1/2 -translate-y-[calc(100%+12px)]',
    'translate-x-2.5 -translate-y-1/2',
    'translate-x-[-50%] translate-y-3',
    '-translate-x-full -translate-y-[calc(100%+10px)]',
  ];
  return (
    <div ref={boxRef} className="relative w-full aspect-[3/2]">
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
      {labels.map((text, i) => (
        <div
          key={i}
          ref={(el) => {
            labelRefs.current[i] = el;
          }}
          className="pointer-events-none absolute left-0 top-0"
        >
          <p className="lp-in whitespace-nowrap text-[11px] font-semibold tracking-[-0.01em] text-ink md:text-[13px]" style={{ '--i': 7 + i * 2 } as CSSProperties}>
            <span className={`block rounded-sm bg-paper/85 px-1.5 py-0.5 ${offs[i]}`}>
              <span className="mr-1.5 font-display text-[13px] font-normal italic text-olive md:text-[15px]">0{i + 1}</span>
              {text}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}
