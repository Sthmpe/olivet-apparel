import type { FabricId } from "@/content/looks";

/** An SVG <pattern> that draws a fabric texture in code. Place inside <defs>. */
export function FabricPattern({ id, fabric, colors }: { id: string; fabric: FabricId; colors: [string, string] }) {
  const [a, b] = colors;
  switch (fabric) {
    case "lace":
      return (
        <pattern id={id} width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill={a} />
          <circle cx="8" cy="8" r="5.5" fill="none" stroke={b} strokeWidth="0.8" />
          <circle cx="0" cy="0" r="5.5" fill="none" stroke={b} strokeWidth="0.8" />
          <circle cx="16" cy="16" r="5.5" fill="none" stroke={b} strokeWidth="0.8" />
          <circle cx="8" cy="8" r="1.2" fill={b} />
        </pattern>
      );
    case "silk":
      return (
        <pattern id={id} width="48" height="48" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <rect width="48" height="48" fill={a} />
          <rect x="0" width="18" height="48" fill={b} opacity="0.35" />
          <rect x="22" width="4" height="48" fill={b} opacity="0.2" />
        </pattern>
      );
    case "aso-oke":
      return (
        <pattern id={id} width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill={a} />
          <rect y="2" width="12" height="2" fill={b} />
          <rect y="7" width="12" height="0.7" fill={b} opacity="0.7" />
          <rect x="5" width="1" height="12" fill="#000" opacity="0.12" />
        </pattern>
      );
    case "adire":
      return (
        <pattern id={id} width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" fill={a} />
          <circle cx="12" cy="12" r="8" fill="none" stroke={b} strokeWidth="1.4" opacity="0.8" />
          <circle cx="12" cy="12" r="4" fill="none" stroke={b} strokeWidth="1" opacity="0.8" />
          <circle cx="12" cy="12" r="1.2" fill={b} />
          <path d="M0 0 L4 4 M24 0 L20 4 M0 24 L4 20 M24 24 L20 20" stroke={b} strokeWidth="1" />
        </pattern>
      );
    case "ankara":
      return (
        <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill={a} />
          <path d="M10 1 L19 10 L10 19 L1 10 Z" fill={b} />
          <circle cx="10" cy="10" r="3.5" fill={a} />
          <circle cx="10" cy="10" r="1.6" fill="#7d1d31" />
          <circle cx="0" cy="0" r="2.5" fill="#7d1d31" />
          <circle cx="20" cy="20" r="2.5" fill="#7d1d31" />
        </pattern>
      );
    case "velvet":
      return (
        <pattern id={id} width="60" height="60" patternUnits="userSpaceOnUse">
          <rect width="60" height="60" fill={a} />
          <ellipse cx="30" cy="30" rx="26" ry="14" fill={b} opacity="0.25" />
        </pattern>
      );
    case "sequin":
      return (
        <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill={a} />
          <circle cx="1.5" cy="1.5" r="1.3" fill={b} />
          <circle cx="4.5" cy="4.5" r="1.3" fill={b} opacity="0.75" />
        </pattern>
      );
    case "organza":
      return (
        <pattern id={id} width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill={a} opacity="0.85" />
          <path d="M0 8 L8 0 M-2 2 L2 -2 M6 10 L10 6" stroke={b} strokeWidth="0.6" />
        </pattern>
      );
    case "crepe":
    default:
      return (
        <pattern id={id} width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill={a} />
          <circle cx="2" cy="3" r="0.6" fill={b} opacity="0.6" />
          <circle cx="7" cy="8" r="0.5" fill={b} opacity="0.6" />
          <circle cx="8" cy="2" r="0.4" fill={b} opacity="0.5" />
        </pattern>
      );
  }
}
