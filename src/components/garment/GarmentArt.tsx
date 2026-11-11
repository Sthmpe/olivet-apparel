"use client";

import { useId } from "react";
import type { Look } from "@/content/looks";
import { getFabric } from "@/content/fabrics";
import { garmentGeometry, VIEWBOX } from "@/lib/garment";
import { FabricPattern } from "./FabricPattern";

const clamp = (v: number) => Math.min(1, Math.max(0, v));

/** Progress (0–1) at which each stage of the Fitting Room is fully shown. */
export const STAGE_AT = { sketch: 0.2, fabric: 0.42, fitting: 0.62, final: 1 } as const;

type Props = {
  look: Look;
  /** 0 = blank page, 0.2 = sketch, 0.42 = fabric, 0.62 = fitting, 1 = finished */
  progress?: number;
  className?: string;
  title?: string;
  /** animate the sketch line drawing in on mount (CSS) */
  animateDraw?: boolean;
};

export function GarmentArt({ look, progress = 1, className, title, animateDraw }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const g = garmentGeometry(look.silhouette, look.neckline, look.train);
  const fabric = getFabric(look.fabrics[0]);
  const [shadow, base, light] = look.palette;

  const draw = clamp(progress / STAGE_AT.sketch);
  const fabricO = clamp((progress - 0.22) / 0.18);
  const fitO = clamp((progress - 0.44) / 0.14) * (1 - clamp((progress - 0.78) / 0.14));
  const finalO = clamp((progress - 0.66) / 0.3);

  const pieces = g.ribbon ? [...g.pieces, g.ribbon] : g.pieces;

  return (
    <svg viewBox={VIEWBOX} className={className} role="img" aria-label={title ?? `${look.title}, atelier sketch`}>
      <defs>
        <linearGradient id={`gold${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fada81" />
          <stop offset="0.5" stopColor="#d3952f" />
          <stop offset="1" stopColor="#92560a" />
        </linearGradient>
        <linearGradient id={`fin${uid}`} x1="0" y1="0" x2="1" y2="0.25">
          <stop offset="0" stopColor={shadow} />
          <stop offset="0.35" stopColor={base} />
          <stop offset="0.55" stopColor={light} />
          <stop offset="0.75" stopColor={base} />
          <stop offset="1" stopColor={shadow} />
        </linearGradient>
        <FabricPattern id={`fab${uid}`} fabric={fabric.id} colors={fabric.colors} />
      </defs>

      {/* dress form */}
      <g stroke={`url(#gold${uid})`} fill="none" strokeWidth="1.4" opacity={0.25 + 0.75 * draw}>
        <circle cx="120" cy="18" r="5" fill={`url(#gold${uid})`} stroke="none" />
        <path d="M 117 23 L 117 40 M 123 23 L 123 40" />
        <path d="M 92 58 C 100 44 140 44 148 58" />
      </g>

      {/* fabric stage */}
      <g opacity={fabricO * (1 - finalO * 0.85)}>
        {pieces.map((d, i) => (
          <path key={i} d={d} fill={`url(#fab${uid})`} />
        ))}
      </g>

      {/* finished piece */}
      <g opacity={finalO}>
        {pieces.map((d, i) => (
          <path key={i} d={d} fill={`url(#fin${uid})`} />
        ))}
        <g opacity="0.22">
          {pieces.map((d, i) => (
            <path key={i} d={d} fill={`url(#fab${uid})`} style={{ mixBlendMode: "overlay" }} />
          ))}
        </g>
        <g stroke={shadow} strokeWidth="1.6" fill="none" opacity="0.7" strokeLinecap="round">
          {g.lines.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        <g stroke={light} strokeWidth="0.8" fill="none" opacity="0.55" transform="translate(2 0)" strokeLinecap="round">
          {g.lines.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      </g>

      {/* sketch outline: drawn in gold */}
      <g
        stroke={`url(#gold${uid})`}
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animateDraw ? "garment-draw" : undefined}
      >
        {pieces.map((d, i) => (
          <path key={i} d={d} pathLength={1} strokeDasharray="1" strokeDashoffset={animateDraw ? undefined : 1 - draw} />
        ))}
        <g opacity={draw * (1 - finalO)} strokeWidth="0.8">
          {g.lines.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      </g>

      {/* fitting marks: chalk lines + pins */}
      <g opacity={fitO}>
        <g stroke="#f5efe2" strokeWidth="0.9" strokeDasharray="3 3" fill="none">
          {g.marks.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        {g.pins.map(([x, y], i) => (
          <g key={i}>
            <line x1={x} y1={y} x2={x + 7} y2={y - 7} stroke="#e8e2d6" strokeWidth="0.9" />
            <circle cx={x + 7} cy={y - 7} r="2" fill="#d3952f" />
          </g>
        ))}
      </g>
    </svg>
  );
}
