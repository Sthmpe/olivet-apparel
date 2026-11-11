"use client";

import { useId } from "react";
import type { Fabric } from "@/content/fabrics";
import { FabricPattern } from "./FabricPattern";

/** A square of fabric, drawn in code. */
export function Swatch({ fabric, className = "" }: { fabric: Fabric; className?: string }) {
  const id = "sw" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <defs>
        <FabricPattern id={id} fabric={fabric.id} colors={fabric.colors} />
        <linearGradient id={id + "s"} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#${id})`} />
      <rect width="100" height="100" fill={`url(#${id}s)`} />
      {/* pinked edge */}
      <path d="M0 100 L5 95 L10 100 L15 95 L20 100 L25 95 L30 100 L35 95 L40 100 L45 95 L50 100 L55 95 L60 100 L65 95 L70 100 L75 95 L80 100 L85 95 L90 100 L95 95 L100 100" fill="#050505" />
    </svg>
  );
}
