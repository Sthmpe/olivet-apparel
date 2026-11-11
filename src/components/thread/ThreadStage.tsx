"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * "Follow the Thread": a gold thread that sews the page together as you scroll.
 *
 * Any descendant with `data-stitch="left|right|center|<0-100>"` becomes a point the
 * thread passes through (an eyelet). `data-stitch-y` (0 to 1) sets where on the element.
 * The thread is decoration only: aria-hidden, pointer-events none.
 */

type Pt = { x: number; y: number };

function smoothPath(pts: Pt[]) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const t = 0.22;
    const c1 = { x: p1.x + (p2.x - p0.x) * t, y: p1.y + (p2.y - p0.y) * t };
    const c2 = { x: p2.x - (p3.x - p1.x) * t, y: p2.y - (p3.y - p1.y) * t };
    d += ` C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export function ThreadStage({ children, className = "" }: { children: ReactNode; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const tip = useRef<SVGCircleElement>(null);
  const table = useRef<{ len: number; y: number }[]>([]);
  const total = useRef(0);
  const [geo, setGeo] = useState<{ w: number; h: number; d: string; pts: Pt[] }>({ w: 0, h: 0, d: "", pts: [] });
  const [reached, setReached] = useState(-1);

  const measure = useCallback(() => {
    const el = wrap.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const mobile = w < 768;
    const anchors = Array.from(el.querySelectorAll<HTMLElement>("[data-stitch]"));
    const pts: Pt[] = anchors.map((a) => {
      const r = a.getBoundingClientRect();
      const pos = a.dataset.stitch ?? "center";
      const fy = Number(a.dataset.stitchY ?? 0.5);
      let x: number;
      if (pos === "left") x = mobile ? 10 : r.left - box.left - 28;
      else if (pos === "right") x = mobile ? w - 10 : r.right - box.left + 28;
      else if (pos === "center") x = r.left - box.left + r.width / 2;
      else x = (Number(pos) / 100) * w;
      x = Math.min(w - 6, Math.max(6, x));
      return { x, y: r.top - box.top + r.height * fy };
    });
    pts.sort((a, b) => a.y - b.y);
    setGeo({ w, h, d: smoothPath(pts), pts });
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    if (wrap.current) ro.observe(wrap.current);
    window.addEventListener("load", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("load", measure);
    };
  }, [measure]);

  // Build a length → y lookup once the path exists.
  useEffect(() => {
    const p = path.current;
    if (!p || !geo.d) return;
    const L = p.getTotalLength();
    total.current = L;
    p.style.strokeDasharray = String(L);
    const n = 240;
    table.current = Array.from({ length: n + 1 }, (_, i) => ({ len: (L * i) / n, y: p.getPointAtLength((L * i) / n).y }));
  }, [geo.d]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = wrap.current;
      const p = path.current;
      if (!el || !p || !table.current.length) return;
      const L = total.current;
      const top = el.getBoundingClientRect().top;
      const targetY = reduce ? Infinity : window.innerHeight * 0.62 - top;
      let len = L;
      if (targetY !== Infinity) {
        const t = table.current;
        let i = 0;
        let maxY = -Infinity;
        for (; i < t.length; i++) {
          maxY = Math.max(maxY, t[i].y);
          if (maxY >= targetY) break;
        }
        len = i >= t.length ? L : Math.max(0, t[i].len);
      }
      const off = String(L - len);
      p.style.strokeDashoffset = off;
      if (tip.current) {
        const pt = p.getPointAtLength(Math.max(0.1, len));
        tip.current.setAttribute("cx", String(pt.x));
        tip.current.setAttribute("cy", String(pt.y));
        tip.current.style.opacity = len > 1 && len < L - 1 ? "1" : "0";
      }
      const reachedY = targetY;
      let r = -1;
      geo.pts.forEach((pt, i) => {
        if (pt.y <= reachedY) r = i;
      });
      setReached(r);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [geo]);

  return (
    <div ref={wrap} className={`relative ${className}`}>
      {geo.d && (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-0"
          width={geo.w}
          height={geo.h}
          viewBox={`0 0 ${geo.w} ${geo.h}`}
        >
          {/* faint guide: where the thread will go */}
          <path d={geo.d} fill="none" stroke="var(--gold)" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="2 7" />
          <path
            ref={path}
            d={geo.d}
            fill="none"
            stroke="var(--gold)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray={total.current || 100000}
            strokeDashoffset={total.current || 100000}
          />
          {geo.pts.map((pt, i) => (
            <g key={i} style={{ transition: "opacity .6s" }} opacity={i <= reached ? 1 : 0.25}>
              <circle cx={pt.x} cy={pt.y} r="5.5" fill="var(--ink)" stroke="var(--gold)" strokeWidth="1.2" />
              <circle cx={pt.x} cy={pt.y} r="1.8" fill="var(--gold)" opacity={i <= reached ? 1 : 0.4} />
            </g>
          ))}
          <circle ref={tip} r="3" fill="var(--gold)" style={{ opacity: 0 }} />
        </svg>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
