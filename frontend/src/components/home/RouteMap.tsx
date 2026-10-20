'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { Pause, Play } from 'lucide-react';
import { MAP_DOTS, MAP_OUTLINES } from './map-dots';

type Point = { x: number; y: number };
type Country = 'china' | 'korea' | 'japan' | 'usa';
type Particle = Point & { country: Country };
const TAU = Math.PI * 2;
const ease = (n: number) => 1 - Math.pow(1 - Math.max(0, Math.min(1, n)), 3);
const countryForKind = (kind: number): Country => kind === 1 ? 'china' : kind === 2 || kind === 3 ? 'korea' : kind === 4 ? 'japan' : 'usa';
const localPoint = (lon: number, lat: number, country: Country): Point => {
  const origin = country === 'china' ? [104, 35] : country === 'korea' ? [128, 38] : country === 'japan' ? [137, 36] : [145.3, 33];
  return { x: (lon - origin[0]) * 0.82, y: origin[1] - lat };
};
const particles: Particle[] = MAP_DOTS.map(([lon, lat, kind]) => {
  const country = countryForKind(kind);
  return { ...localPoint(lon, lat, country), country };
});
const silhouettes = MAP_OUTLINES.map(({ kind, points }) => {
  const country = countryForKind(kind);
  return { country, points: points.map(([lon, lat]) => localPoint(lon, lat, country)) };
});

function curve(a: Point, b: Point, bend: number, p: number): Point {
  const dx = b.x - a.x, dy = b.y - a.y;
  const arc = Math.sin(p * Math.PI) * bend;
  return { x: a.x + dx * p + dy * arc, y: a.y + dy * p - dx * arc };
}

export default function RouteMap({ labels, delay }: { labels: string[]; delay: number }) {
  const locale = useLocale();
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const elapsedRef = useRef(0);

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!box || !canvas || !ctx) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const styles = getComputedStyle(document.documentElement);
    const color = (name: string) => styles.getPropertyValue(`--color-${name}`).trim();
    const colors = { ink: color('ink'), map: color('ink-3'), olive: color('olive'), lime: color('lime'), paper: color('paper') };
    let width = 0, height = 0, raf = 0, previous = 0, lastPaint = 0, headerClearance = 104;
    let visible = true;
    let reducedMotion = media.matches;
    setReduced(reducedMotion);

    const draw = (time: number) => {
      const mobile = width < 1024;
      const t = reducedMotion ? 12 : Math.max(0, time - delay);
      const intro = ease(t / 3.2);
      const scene = Math.min(width, height * 1.65);
      const configs = mobile ? {
        china: { x: 0.22, y: 0.66, scale: 0.0084, rotation: -0.18 },
        korea: { x: 0.53, y: 0.66, scale: 0.058, rotation: -0.16 },
        japan: { x: 0.52, y: 0.85, scale: 0.020, rotation: 0.38 },
        usa: { x: 0.82, y: 0.70, scale: 0.063, rotation: -0.18 },
      } : {
        china: { x: 0.32, y: 0.40, scale: 0.0082, rotation: -0.10 },
        korea: { x: 0.61, y: 0.43, scale: 0.044, rotation: -0.18 },
        japan: { x: 0.63, y: 0.77, scale: 0.0135, rotation: 0.38 },
        usa: { x: 0.84, y: 0.39, scale: 0.066, rotation: -0.18 },
      };
      const project = (point: Point, country: Country): Point => {
        const c = configs[country];
        const rotation = c.rotation;
        const scale = scene * c.scale;
        return {
          x: width * c.x + (point.x * Math.cos(rotation) - point.y * Math.sin(rotation)) * scale,
          y: height * c.y + (point.x * Math.sin(rotation) + point.y * Math.cos(rotation)) * scale * (mobile ? 0.78 : 0.9),
        };
      };
      const hub = project({ x: 0.6 * 0.82, y: 2.13 }, 'korea');
      const china = project({ x: 3, y: -6 }, 'china');
      const japan = project({ x: 1, y: 0 }, 'japan');
      const usa = project({ x: -0.7, y: 0 }, 'usa');
      ctx.clearRect(0, 0, width, height);

      // A still, softly filled silhouette supports the dots without an enclosing outline.
      silhouettes.forEach(({ country, points }) => {
        ctx.beginPath();
        points.forEach((point, i) => {
          const p = project(point, country);
          if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y);
        });
        ctx.closePath();
        ctx.fillStyle = colors.map; ctx.globalAlpha = intro * (country === 'korea' ? 0.04 : 0.03); ctx.fill();
      });

      // Country geometry and dot opacity stay fixed; only the connection highlights move.
      for (const dot of particles) {
        const p = project(dot, dot.country);
        const distance = Math.hypot((p.x - hub.x) / width, (p.y - hub.y) / height);
        const reveal = reducedMotion ? 1 : ease((t - distance * 1.15) / 2.0);
        if (!reveal) continue;
        const { x, y } = p;
        if (x < -4 || x > width + 4 || y < -4 || y > height + 4) continue;
        const edge = Math.min(1, Math.max(0, Math.min(x + 8, width + 8 - x, y + 8, height + 8 - y) / 90));
        ctx.globalAlpha = reveal * edge * (dot.country === 'korea' ? 0.64 : 0.50);
        ctx.fillStyle = colors.map;
        const radius = (dot.country === 'korea' ? 1.85 : dot.country === 'usa' ? 1.35 : 1.4) * Math.max(dot.country === 'korea' ? 0.45 : 0.38, scene / 1500);
        ctx.beginPath(); ctx.arc(x, y, radius, 0, TAU); ctx.fill();

      }

      const stroke = (a: Point, b: Point, bend: number, from: number, to: number) => {
        if (to <= from) return;
        ctx.beginPath();
        for (let i = 0; i <= 80; i++) {
          const p = curve(a, b, bend, from + (to - from) * i / 80);
          if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y);
        }
        ctx.stroke();
      };
      const routes = [
        { a: china, b: hub, bend: 0.38 },
        { a: hub, b: japan, bend: 0.42 },
        { a: hub, b: usa, bend: 0.52 },
      ];
      routes.forEach(({ a, b, bend: requestedBend }, i) => {
        // Keep each connection and its moving highlight below the navigation.
        // Reducing curvature preserves a smooth arc instead of flattening it at a clip edge.
        let maxBend = requestedBend;
        if (b.x > a.x) {
          for (let sample = 1; sample < 80; sample++) {
            const p = sample / 80;
            maxBend = Math.min(maxBend, (a.y + (b.y - a.y) * p - headerClearance) / ((b.x - a.x) * Math.sin(p * Math.PI)));
          }
        }
        const bend = Math.min(requestedBend, Math.max(0, maxBend));
        // A quiet continuous connection establishes the network; the comet gives it direction.
        const connection = reducedMotion ? 1 : ease((t - 0.5 - i * 0.2) / 1.1);
        ctx.strokeStyle = colors.olive;
        ctx.lineWidth = mobile ? 0.85 : 1;
        ctx.lineCap = 'round';
        ctx.globalAlpha = connection * 0.48;
        stroke(a, b, bend, 0, 1);
        ctx.lineCap = 'butt';
        if (reducedMotion || t < 0.8 + i * 0.45) return;
        const cycle = ((t - 0.8 - i * 0.45) % 3.8) / 3.8;
        if (cycle > 0.84) return;
        const travel = cycle / 0.84;
        const head = 0.5 - Math.cos(travel * Math.PI) * 0.5;
        const opacity = Math.min(1, travel * 8, (1 - travel) * 8);
        ctx.strokeStyle = colors.olive;
        ctx.lineCap = 'round';
        for (let trail = 0; trail < 12; trail++) {
          const from = Math.max(0, head - (trail + 1) * 0.019);
          const to = Math.max(0, head - trail * 0.019);
          ctx.globalAlpha = opacity * (1 - trail / 12) * 0.85;
          ctx.lineWidth = (1 - trail / 16) * (mobile ? 1.8 : 2.4);
          stroke(a, b, bend, from, to);
        }
        const point = curve(a, b, bend, head);
        ctx.globalAlpha = opacity;
        ctx.fillStyle = colors.olive;
        ctx.beginPath(); ctx.arc(point.x, point.y, mobile ? 2.2 : 3, 0, TAU); ctx.fill();
        ctx.lineCap = 'butt';
      });

      [china, japan, usa].forEach((p) => {
        ctx.globalAlpha = intro;
        ctx.fillStyle = colors.paper; ctx.strokeStyle = colors.olive; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, TAU); ctx.fill(); ctx.stroke();
        ctx.fillStyle = colors.ink; ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, TAU); ctx.fill();
      });
      ctx.globalAlpha = intro;
      ctx.fillStyle = colors.paper; ctx.beginPath(); ctx.arc(hub.x, hub.y, 16, 0, TAU); ctx.fill();
      ctx.fillStyle = colors.lime; ctx.strokeStyle = colors.ink; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(hub.x, hub.y, 9, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.globalAlpha = 1;

      const points = [china, hub, japan, usa];
      labelRefs.current.forEach((el, i) => {
        if (!el) return;
        // Keep captions inside the viewport even when the land extends past its edge.
        const x = Math.max(mobile ? 30 : 64, Math.min(width - (mobile ? 34 : 96), points[i].x));
        el.style.transform = `translate(${x}px, ${points[i].y}px)`;
        el.style.opacity = String(reducedMotion ? 1 : ease((t - 1.2 - i * 0.12) / 0.8));
      });
    };
    const active = () => !paused && !reducedMotion && visible && !document.hidden;
    const tick = (now: number) => {
      if (!active()) return;
      if (previous) elapsedRef.current += Math.min((now - previous) / 1000, 0.1);
      previous = now;
      if (now - lastPaint >= 1000 / 30) { draw(elapsedRef.current); lastPaint = now; }
      raf = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(raf); previous = 0;
      draw(elapsedRef.current);
      if (active()) raf = requestAnimationFrame(tick);
    };
    const resize = () => {
      const rect = box.getBoundingClientRect();
      width = rect.width; height = rect.height;
      headerClearance = (document.querySelector('header')?.getBoundingClientRect().height ?? 80) + 24;
      canvas.style.setProperty('--network-header-height', `${headerClearance - 24}px`);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sync();
    };
    const preference = () => { reducedMotion = media.matches; setReduced(reducedMotion); sync(); };
    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    resize(); resizeObserver.observe(box); intersectionObserver.observe(box);
    media.addEventListener('change', preference);
    document.addEventListener('visibilitychange', sync);
    return () => {
      cancelAnimationFrame(raf); resizeObserver.disconnect(); intersectionObserver.disconnect();
      media.removeEventListener('change', preference);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [delay, paused]);

  const captions = [
    { name: labels[0], kicker: '01 / CHINA', className: 'network-label-china' },
    { name: labels[1], kicker: '02 / KOREA · THELAIM', className: 'network-label-hub' },
    { name: labels[3], kicker: '03 / JAPAN', className: 'network-label-japan' },
    { name: labels[4], kicker: '04 / UNITED STATES', className: 'network-label-usa' },
  ];
  return (
    <div ref={boxRef} className="network-map absolute inset-0">
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0">
        {captions.map(({ name, kicker, className }, i) => (
          <div key={kicker || 'domestic'} ref={(el) => { labelRefs.current[i] = el; }} className={`network-label absolute left-0 top-0 opacity-0 ${className}`}>
            <div className="network-label-content">
              {kicker && <span className="block font-sans text-[10px] font-medium tracking-[0.16em] text-olive md:text-xs">{kicker}</span>}
              <span className="network-label-name block text-sm font-semibold text-ink md:text-base">{name}</span>
              {i === 1 && <span className="network-label-detail block text-xs font-normal text-ink-2">{labels[2]}</span>}
            </div>
          </div>
        ))}
      </div>
      <div className="network-caption pointer-events-none absolute bottom-8 left-[clamp(20px,4vw,56px)] flex items-center gap-3 text-[10px] font-medium tracking-[0.2em] text-ink-3 md:bottom-10 md:text-xs" aria-hidden="true">
        <span className="h-px w-8 bg-olive" /> THELAIM — BEYOND BORDERS
      </div>
      {!reduced && <button type="button" onClick={() => setPaused((value) => !value)} aria-pressed={paused}
        aria-label={locale === 'ko' ? (paused ? '지도 모션 재생' : '지도 모션 일시정지') : (paused ? 'Play map animation' : 'Pause map animation')}
        className="absolute bottom-6 right-[clamp(20px,4vw,56px)] z-20 inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-line bg-paper/90 px-4 text-[10px] font-medium tracking-[0.12em] text-ink-2 transition-colors hover:bg-paper-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-olive md:bottom-8">
        {paused ? <Play size={12} aria-hidden="true" /> : <Pause size={12} aria-hidden="true" />}
        <span className="hidden sm:inline">MOTION {paused ? 'OFF' : 'ON'}</span>
      </button>}
    </div>
  );
}
