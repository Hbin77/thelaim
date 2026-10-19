'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { MAP_DOTS } from './map-dots';
import { LOGO_BIRD } from './logo-paths';

// 오른쪽 흐름 지도: 중국·한반도·일본 일대를 점으로 찍은 하프톤 지도를 원근으로 눕혀 그린다(캔버스 2D, WebGL 아님).
// 중국에서 대구종합유통단지까지 공중으로 솟는 호가 그려지고, 대구에서 전국 도시로 낮은 호가 퍼진다.
// 대구에서 일본(도쿄)과 미국으로도 호가 이어진다. 미국은 깔끔하게 보이도록 일본 오른쪽 옆에 작게 옮겨 그린 도식이다.
// 새 심볼이 그 호를 따라 7초에 한 번 날아가고, 지도는 아주 천천히 좌우로 돌아 입체감을 준다.
type LngLat = [number, number];
const SRC: LngLat = [116.4, 30.6]; // 중국(특정 도시가 아니라 일대를 가리키는 표시)
const HUB: LngLat = [128.6, 35.87]; // 대구
const CITIES: LngLat[] = [
  [126.98, 37.57], // 서울
  [128.9, 37.75], // 강릉
  [127.38, 36.35], // 대전
  [126.85, 35.16], // 광주
  [129.08, 35.18], // 부산
];
const JAPAN: LngLat = [139.7, 35.7]; // 도쿄
const USA: LngLat = [147.2, 36.9]; // 일본 옆으로 옮긴 미국 도식의 가운데
const CENTER: LngLat = [133, 36];
const FK = 0.9; // 초점 거리(화면 폭 배수)
const KX = Math.cos((34 * Math.PI) / 180);
const MAIN_H = 4.2; // 중국→대구 호의 높이
const FAN_H = 0.7;
const JP_H = 2.2;
const US_H = 3.2;
const INTRO = 2.4; // 점 지도가 깔리고 큰 호가 그려지는 시간(초)
const LOOP = 7;

const css = (n: string) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(1 - t, 3));
const inout = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function RouteMap({ labels, delay }: { labels: string[]; delay: number }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const box = boxRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const C = { ink: css('--color-ink'), lime: css('--color-lime'), mist: css('--color-mist') };
    const bird = LOGO_BIRD.map((d) => new Path2D(d));
    let W = 0, H = 0, F = 0, raf = 0;

    const resize = () => {
      const r = box.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height; F = W * FK;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(box);

    // 경도·위도·높이 → 화면 좌표(원근). theta: 지도 회전, 아주 천천히 흔들린다
    let th = 0;
    const PITCH = (36 * Math.PI) / 180, DIST = 30;
    const sp = Math.sin(PITCH), cp = Math.cos(PITCH);
    const P = ([lon, lat]: LngLat, z = 0) => {
      const X = (lon - CENTER[0]) * KX, Y = lat - CENTER[1];
      const ct = Math.cos(th), st = Math.sin(th);
      const u = X * ct - Y * st, v = X * st + Y * ct;
      const yc = v * sp + z * cp, zc = DIST + v * cp - z * sp;
      return [W * 0.5 + (F * u) / zc, H * 0.56 - (F * yc) / zc, zc] as const;
    };
    const lerp = (a: LngLat, b: LngLat, t: number): LngLat => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    const arcPt = (a: LngLat, b: LngLat, h: number, t: number) => P(lerp(a, b, t), h * 4 * t * (1 - t));
    const stroke = (a: LngLat, b: LngLat, h: number, t0: number, t1: number) => {
      if (t1 <= t0) return;
      ctx.beginPath();
      for (let i = 0; i <= 48; i++) {
        const [x, y] = arcPt(a, b, h, t0 + ((t1 - t0) * i) / 48);
        if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
      }
      ctx.stroke();
    };
    const hubDist = (lon: number, lat: number) => Math.hypot((lon - HUB[0]) * KX, lat - HUB[1]);
    const maxDist = 18;
    const COL = ['', C.mist, C.ink, C.mist, C.mist, C.mist, C.ink];
    const ALPHA = [0, 0.95, 1, 0.5, 0.75, 0.3, 0.55];

    const t0 = performance.now() + delay * 1000;
    const draw = (now: number) => {
      const t = reduce ? 99 : (now - t0) / 1000;
      th = (-12 + (reduce ? 0 : Math.sin(Math.max(t, 0) / 5) * 2.2)) * (Math.PI / 180);
      ctx.clearRect(0, 0, W, H);

      // 점 지도: 대구에서 바깥으로 물결처럼 내려앉으며 깔린다
      for (let k = 1; k <= 6; k++) {
        ctx.fillStyle = COL[k];
        for (const [lon, lat, kind] of MAP_DOTS) {
          if (kind !== k) continue;
          const local = ease((t - (hubDist(lon, lat) / maxDist) * 1.2) / 0.9);
          if (local <= 0) continue;
          const [x, y, z] = P([lon, lat], (1 - local) * 1.5);
          const r = ((kind === 2 ? 30 : kind === 3 ? 22 : kind === 6 ? 16 : 34) / z) * (W / 700) * (FK / 1.5);
          // 화면 가장자리 쪽 점은 서서히 옅어져 지도가 판처럼 잘려 보이지 않게
          const edge = Math.min(1, Math.max(0, (kind === 6 ? 1 : (14 - Math.hypot((lon - CENTER[0]) * KX, lat - CENTER[1])) / 4)));
          if (edge <= 0) continue;
          ctx.globalAlpha = ALPHA[kind] * local * edge;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // 대구에서 전국으로 퍼지는 낮은 호
      const fanT = (t - INTRO) / 1.2;
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1;
      CITIES.forEach((c, i) => {
        const p = ease(fanT - i * 0.12);
        ctx.globalAlpha = 0.55;
        stroke(HUB, c, FAN_H, 0, p);
        if (p > 0.98) {
          const [x, y] = P(c);
          ctx.globalAlpha = 1; ctx.fillStyle = C.ink;
          ctx.beginPath(); ctx.arc(x, y, 2.6, 0, Math.PI * 2); ctx.fill();
          const pulse = ((t - INTRO - 1.4 + i * 0.6) % 3.2) / 3.2;
          if (pulse > 0 && !reduce) {
            ctx.globalAlpha = 0.5 * (1 - pulse);
            ctx.beginPath(); ctx.ellipse(x, y, 4 + pulse * 14, (4 + pulse * 14) * sp, 0, 0, Math.PI * 2); ctx.stroke();
          }
        }
      });

      // 중국 → 대구 큰 호(점선)
      const mainT = inout((t - 0.9) / 1.5);
      ctx.globalAlpha = 1; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.25; ctx.setLineDash([4, 5]);
      stroke(SRC, HUB, MAIN_H, 0, mainT);
      ctx.setLineDash([]);

      // 대구 → 일본, 미국(점선 호). 미국 호는 오른쪽 가장자리 밖으로 빠져나간다
      ctx.globalAlpha = 1; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.1; ctx.setLineDash([3, 5]);
      const jpT = inout((t - INTRO - 0.5) / 1.3);
      const usT = inout((t - INTRO - 0.8) / 1.6);
      stroke(HUB, JAPAN, JP_H, 0, jpT);
      stroke(HUB, USA, US_H, 0, usT);
      ctx.setLineDash([]);
      if (usT > 0.98) {
        const [x, y] = P(USA);
        ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(x, y, 2.8, 0, Math.PI * 2); ctx.fill();
      }
      if (jpT > 0.98) {
        const [x, y] = P(JAPAN);
        ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(x, y, 2.8, 0, Math.PI * 2); ctx.fill();
      }

      // 출발점·거점 표시
      const [sx, sy] = P(SRC);
      ctx.globalAlpha = ease((t - 0.7) / 0.5);
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.ellipse(sx, sy, 6, 6 * sp * 1.4, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(sx, sy, 2, 0, Math.PI * 2); ctx.fill();
      const [hx, hy] = P(HUB);
      const hubIn = ease((t - 2.1) / 0.6);
      if (hubIn > 0) {
        ctx.globalAlpha = hubIn;
        const ring = ((t - 2.1) % 3.2) / 3.2;
        if (!reduce) {
          ctx.globalAlpha = hubIn * 0.6 * (1 - ring); ctx.lineWidth = 1;
          ctx.beginPath(); ctx.ellipse(hx, hy, 8 + ring * 40, (8 + ring * 40) * sp, 0, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.globalAlpha = hubIn;
        ctx.fillStyle = C.lime; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.ellipse(hx, hy, 7, 7 * sp * 1.25, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // 새 심볼: 큰 호를 따라 날아간다
      const ft = reduce ? -1 : ((t - INTRO - 0.4) % LOOP) / LOOP;
      if (t > INTRO + 0.4 && ft < 0.62) {
        const q = inout(ft / 0.58);
        const [bx, by, bz] = arcPt(SRC, HUB, MAIN_H, Math.min(q, 1));
        const s = (0.62 / bz) * (W / 700) * 0.06;
        ctx.globalAlpha = Math.min(1, ft / 0.06, (0.62 - ft) / 0.06);
        ctx.save(); ctx.translate(bx, by); ctx.scale(s, s); ctx.translate(-6600, -300);
        ctx.fillStyle = C.ink; bird.forEach((b) => ctx.fill(b));
        ctx.restore();
        ctx.globalAlpha = 1;
      }

      // 이름표 위치
      const pts = [P(SRC), P(HUB), P(CITIES[4]), P(JAPAN), P(USA)]; // 03은 부산 옆
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

  const offs = ['-translate-x-1/2 translate-y-3', '-translate-x-[calc(100%+22px)] -translate-y-[calc(100%+18px)]', 'translate-x-3 -translate-y-1/2', '-translate-x-1/2 translate-y-3', '-translate-x-1/2 -translate-y-[calc(100%+14px)]'];
  return (
    <div ref={boxRef} className="relative mx-auto aspect-[700/560] max-h-full w-full max-w-[820px]">
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
      {labels.map((text, i) => (
        <div
          key={i}
          ref={(el) => {
            labelRefs.current[i] = el;
          }}
          className="pointer-events-none absolute left-0 top-0"
        >
          <p className={`lp-in whitespace-nowrap text-[11px] font-semibold tracking-[-0.01em] text-ink md:text-[13px]`} style={{ '--i': 7 + i * 2 } as CSSProperties}>
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
