import type { Neckline, Silhouette } from "@/content/looks";

/**
 * Deterministic garment geometry for illustrationes, drawn in a 240 × 340 box
 * on a dress-form. Pure functions: same inputs always give the same drawing.
 */

export type GarmentGeometry = {
  /** filled silhouette pieces */
  pieces: string[];
  /** pleat / seam lines drawn over the fill */
  lines: string[];
  /** optional flowing sash / train */
  ribbon?: string;
  /** tailor's fitting marks: measure lines */
  marks: string[];
  /** pin positions */
  pins: [number, number][];
};

export const VIEWBOX = "0 0 240 340";

const WAIST_Y = 128;
const HEM_Y = 318;

function bodice(neck: Neckline, waistY = WAIST_Y): string {
  const side = `L 152 80 C 150 100 138 ${waistY - 16} 136 ${waistY} L 104 ${waistY} C 102 ${waistY - 16} 90 100 88 80`;
  switch (neck) {
    case "sweetheart":
      return `M 88 80 C 92 70 104 66 110 72 C 116 78 119 84 120 86 C 121 84 124 78 130 72 C 136 66 148 70 152 80 C 150 100 138 ${waistY - 16} 136 ${waistY} L 104 ${waistY} C 102 ${waistY - 16} 90 100 88 80 Z`;
    case "v":
      return `M 96 56 L 120 100 L 144 56 L 148 58 ${side} L 92 58 Z`;
    case "offshoulder":
      return `M 80 72 Q 120 88 160 72 L 156 84 C 150 104 138 ${waistY - 14} 136 ${waistY} L 104 ${waistY} C 102 ${waistY - 14} 90 104 84 84 Z`;
    case "high":
      return `M 106 44 Q 120 50 134 44 L 148 58 ${side} L 92 58 Z`;
  }
}

function skirt(sil: Silhouette): { d: string; hemL: number; hemR: number; top: number } {
  const t = WAIST_Y;
  switch (sil) {
    case "ballgown":
      return { d: `M 104 ${t} C 70 170 40 250 28 ${HEM_Y} Q 120 336 212 ${HEM_Y} C 200 250 170 170 136 ${t} Z`, hemL: 28, hemR: 212, top: t };
    case "mermaid":
      return {
        d: `M 104 ${t} C 98 170 100 220 103 250 C 96 280 72 304 56 ${HEM_Y + 2} Q 120 334 184 ${HEM_Y + 2} C 168 304 144 280 137 250 C 140 220 142 170 136 ${t} Z`,
        hemL: 56,
        hemR: 184,
        top: t,
      };
    case "column":
      return { d: `M 104 ${t} C 100 200 98 260 95 ${HEM_Y} Q 120 326 145 ${HEM_Y} C 142 260 140 200 136 ${t} Z`, hemL: 95, hemR: 145, top: t };
    case "twopiece":
      return { d: `M 102 ${t + 8} C 84 180 62 260 50 ${HEM_Y} Q 120 332 190 ${HEM_Y} C 178 260 156 180 138 ${t + 8} Z`, hemL: 50, hemR: 190, top: t + 8 };
    case "aline":
    default:
      return { d: `M 104 ${t} C 90 190 64 260 50 ${HEM_Y} Q 120 332 190 ${HEM_Y} C 176 260 150 190 136 ${t} Z`, hemL: 50, hemR: 190, top: t };
  }
}

function pleats(topL: number, topR: number, top: number, hemL: number, hemR: number, n: number, twist = 14): string[] {
  const out: string[] = [];
  for (let i = 1; i < n; i++) {
    const k = i / n;
    const x0 = topL + (topR - topL) * k;
    const x1 = hemL + (hemR - hemL) * k;
    const y1 = HEM_Y + 8 - Math.abs(k - 0.5) * 18;
    out.push(
      `M ${x0.toFixed(1)} ${top + 2} C ${(x0 + twist).toFixed(1)} ${top + 70} ${(x1 + twist * 1.4).toFixed(1)} ${HEM_Y - 80} ${x1.toFixed(1)} ${y1.toFixed(1)}`,
    );
  }
  return out;
}

const DRESS_MARKS = ["M 86 80 L 154 80", `M 102 ${WAIST_Y} L 138 ${WAIST_Y}`, "M 120 92 L 120 300"];
const DRESS_PINS: [number, number][] = [
  [92, 84],
  [148, 84],
  [106, WAIST_Y - 4],
  [134, WAIST_Y - 4],
  [120, 210],
];

export function garmentGeometry(sil: Silhouette, neck: Neckline, train = false): GarmentGeometry {
  if (sil === "suit") {
    return {
      pieces: [
        // trousers
        "M 98 168 C 96 230 92 280 88 320 L 116 320 L 120 206 L 124 320 L 152 320 C 148 280 144 230 142 168 Z",
        // jacket
        "M 90 58 L 120 112 L 150 58 C 154 90 156 130 158 170 Q 120 180 82 170 C 84 130 86 90 90 58 Z",
        // sleeves
        "M 90 60 C 82 90 76 120 72 154 L 84 156 C 88 126 92 100 96 80 Z",
        "M 150 60 C 158 90 164 120 168 154 L 156 156 C 152 126 148 100 144 80 Z",
      ],
      lines: ["M 120 112 L 120 174", "M 104 92 L 112 104", "M 136 92 L 128 104", "M 120 206 L 120 320", "M 98 150 L 110 150", "M 130 150 L 142 150"],
      marks: ["M 86 70 L 154 70", "M 98 168 L 142 168", "M 160 60 L 160 170"],
      pins: [
        [96, 66],
        [144, 66],
        [100, 166],
        [140, 166],
      ],
    };
  }

  if (sil === "kaftan") {
    return {
      pieces: [
        "M 100 48 Q 120 58 140 48 L 204 108 L 190 128 L 154 100 C 158 180 162 250 168 320 Q 120 330 72 320 C 78 250 82 180 86 100 L 50 128 L 36 108 Z",
      ],
      lines: [
        "M 108 56 Q 120 74 132 56",
        "M 104 60 Q 120 86 136 60",
        "M 120 82 L 120 140",
        "M 92 110 C 92 190 90 250 86 318",
        "M 148 110 C 148 190 150 250 154 318",
        "M 56 118 L 86 108",
        "M 184 118 L 154 108",
      ],
      marks: ["M 40 112 L 200 112", "M 86 200 L 154 200"],
      pins: [
        [100, 70],
        [140, 70],
        [120, 150],
      ],
    };
  }

  if (sil === "jumpsuit") {
    const top = bodice(neck);
    return {
      pieces: [`M 104 ${WAIST_Y} C 98 200 90 260 80 320 L 116 320 L 120 196 L 124 320 L 160 320 C 150 260 142 200 136 ${WAIST_Y} Z`, top],
      lines: [`M 102 ${WAIST_Y} Q 120 ${WAIST_Y + 6} 138 ${WAIST_Y}`, "M 120 196 L 120 320", "M 96 200 C 94 250 92 290 90 318", "M 144 200 C 146 250 148 290 150 318"],
      marks: DRESS_MARKS,
      pins: DRESS_PINS,
    };
  }

  const sk = skirt(sil);
  const top = sil === "twopiece" ? bodice(neck, 112) : bodice(neck);
  const n = sil === "ballgown" ? 8 : sil === "column" ? 3 : 6;
  const g: GarmentGeometry = {
    pieces: [sk.d, top],
    lines: [
      ...pleats(106, 134, sk.top, sk.hemL + 6, sk.hemR - 6, n, sil === "column" || sil === "mermaid" ? 1 : 12),
      sil === "twopiece" ? "" : `M 102 ${WAIST_Y} Q 120 ${WAIST_Y + 7} 138 ${WAIST_Y}`,
      neck === "sweetheart" || neck === "v" ? "M 112 100 C 116 110 118 118 120 126" : "",
      neck === "sweetheart" || neck === "v" ? "M 128 100 C 124 110 122 118 120 126" : "",
    ].filter(Boolean),
    marks: DRESS_MARKS,
    pins: DRESS_PINS,
  };
  if (train) {
    // a sash that leaves the waist and pools on the floor, like the ribbon in the Olivet mark
    g.ribbon = `M 133 ${WAIST_Y + 1} C 150 168 160 226 150 272 C 140 300 96 318 10 332 C 54 340 128 338 166 318 C 180 294 174 226 142 ${WAIST_Y + 1} Z`;
  }
  return g;
}
