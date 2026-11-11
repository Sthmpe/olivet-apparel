import { looks, type FabricId, type Look, type Occasion, type Silhouette } from "@/content/looks";

export type Answers = {
  occasion?: Occasion;
  shape?: "sculpted" | "flowing" | "separates";
  mood?: Look["colourMood"];
  feel?: "fluid" | "heritage" | "light";
};

export const shapeSilhouettes: Record<NonNullable<Answers["shape"]>, Silhouette[]> = {
  sculpted: ["mermaid", "column", "jumpsuit", "suit"],
  flowing: ["ballgown", "aline", "kaftan"],
  separates: ["twopiece", "suit", "jumpsuit"],
};

export const feelFabrics: Record<NonNullable<Answers["feel"]>, FabricId[]> = {
  fluid: ["silk", "crepe", "velvet"],
  heritage: ["aso-oke", "adire", "ankara"],
  light: ["sequin", "lace", "organza"],
};

const MAX = 4 + 2 + 2 + 2;

/** Deterministic scoring. No AI, no network: same answers, same results. */
export function matchLooks(a: Answers, count = 3) {
  return looks
    .map((l) => {
      let s = 0;
      if (a.occasion && l.occasion === a.occasion) s += 4;
      if (a.shape && shapeSilhouettes[a.shape].includes(l.silhouette)) s += 2;
      if (a.mood && l.colourMood === a.mood) s += 2;
      if (a.feel && l.fabrics.some((f) => feelFabrics[a.feel!].includes(f))) s += 2;
      return { look: l, score: s, pct: Math.round((s / MAX) * 100) };
    })
    .sort((x, y) => y.score - x.score || x.look.title.localeCompare(y.look.title))
    .slice(0, count);
}
