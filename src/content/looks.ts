/**
 * Portfolio content.
 *
 * Every look renders as an atelier sketch (drawn in code) until real photography
 * is added. To add photos for a look, drop files in /public/looks/<slug>/ and list
 * them in `images` with the stage they belong to. The Fitting Room slider and the
 * cards switch to photos automatically.
 *
 * `tryOnGarment` is a clean garment-only photo used by the AI "Wear it" try-on.
 */

export type Silhouette =
  | "ballgown"
  | "aline"
  | "mermaid"
  | "column"
  | "suit"
  | "jumpsuit"
  | "kaftan"
  | "twopiece";

export type Neckline = "sweetheart" | "v" | "offshoulder" | "high";

export type FabricId =
  | "lace"
  | "silk"
  | "aso-oke"
  | "adire"
  | "ankara"
  | "velvet"
  | "sequin"
  | "organza"
  | "crepe";

export type Occasion = "bridal" | "celebration" | "evening" | "everyday";

export type Stage = "sketch" | "fabric" | "fitting" | "final";

export type LookImage = { stage: Stage; src: string; alt: string };

export type Look = {
  slug: string;
  title: string;
  collection: string;
  occasion: Occasion;
  silhouette: Silhouette;
  neckline: Neckline;
  train?: boolean;
  fabrics: FabricId[];
  /** [shadow, base, highlight] colours of the finished piece */
  palette: [string, string, string];
  colourMood: "light" | "jewel" | "dark" | "earth";
  story: string;
  details: string[];
  leadWeeks: number;
  images?: LookImage[];
  tryOnGarment?: string;
};

export type Collection = {
  slug: string;
  title: string;
  occasion: Occasion;
  kicker: string;
  intro: string;
};

export const occasions: { id: Occasion; label: string }[] = [
  { id: "bridal", label: "Bridal" },
  { id: "celebration", label: "Owambe" },
  { id: "evening", label: "Evening" },
  { id: "everyday", label: "Everyday" },
];

export const collections: Collection[] = [
  { slug: "gilded-vows", title: "Bridal", occasion: "bridal", kicker: "Bridal", intro: "Wedding gowns and reception looks." },
  { slug: "owambe-royale", title: "Owambe", occasion: "celebration", kicker: "Owambe", intro: "Aso-oke, adire and lace for parties and asoebi." },
  { slug: "after-dark", title: "Evening", occasion: "evening", kicker: "Evening", intro: "Gowns for dinners, galas and red carpets." },
  { slug: "everyday-couture", title: "Everyday", occasion: "everyday", kicker: "Everyday", intro: "Tailored pieces for work, church and weekends." },
];

export const looks: Look[] = [
  // ── Gilded Vows ─────────────────────────────
  {
    slug: "the-aurelia",
    title: "The Aurelia",
    collection: "gilded-vows",
    occasion: "bridal",
    silhouette: "ballgown",
    neckline: "sweetheart",
    train: true,
    fabrics: ["lace", "organza"],
    palette: ["#b9a27a", "#efe3c8", "#fffaf0"],
    colourMood: "light",
    story:
      "A sweetheart bodice in hand-cut lace, floating over layers of organza that sweep into a cathedral train. Made for an entrance.",
    details: ["Hand-appliquéd lace bodice", "Six-layer organza skirt", "Detachable cathedral train", "Corseted inner structure"],
    leadWeeks: 12,
  },
  {
    slug: "seraphine",
    title: "Seraphine",
    collection: "gilded-vows",
    occasion: "bridal",
    silhouette: "mermaid",
    neckline: "offshoulder",
    fabrics: ["lace", "sequin"],
    palette: ["#a8977c", "#e9dfcf", "#fffdf7"],
    colourMood: "light",
    story:
      "Off-the-shoulder and sculpted to the knee, then released into a soft flare. Sequins catch the light only when she moves.",
    details: ["Sculpted mermaid fit", "Tonal sequin embroidery", "Off-shoulder drape", "Concealed corset boning"],
    leadWeeks: 10,
  },
  {
    slug: "second-light",
    title: "Second Light",
    collection: "gilded-vows",
    occasion: "bridal",
    silhouette: "jumpsuit",
    neckline: "v",
    fabrics: ["crepe", "silk"],
    palette: ["#9c7a3c", "#d9b46a", "#f6e2ae"],
    colourMood: "light",
    story:
      "The reception look. A champagne-gold crepe jumpsuit with a deep V and wide palazzo legs, made for dancing until the last song.",
    details: ["Heavy silk crepe", "Wide palazzo leg", "Plunging V with modesty panel option", "Hidden side pockets"],
    leadWeeks: 6,
  },

  // ── Owambe Royale ───────────────────────────
  {
    slug: "royal-ember",
    title: "Royal Ember",
    collection: "owambe-royale",
    occasion: "celebration",
    silhouette: "kaftan",
    neckline: "high",
    fabrics: ["aso-oke"],
    palette: ["#4a0f1c", "#7d1d31", "#c4485f"],
    colourMood: "jewel",
    story:
      "Hand-woven aso-oke in wine and gold, cut into a regal kaftan with sweeping sleeves. Pair it with a gele and own the room.",
    details: ["Hand-woven aso-oke", "Gold thread neckline embroidery", "Statement bell sleeves", "Matching gele available"],
    leadWeeks: 5,
  },
  {
    slug: "emerald-court",
    title: "Emerald Court",
    collection: "owambe-royale",
    occasion: "celebration",
    silhouette: "mermaid",
    neckline: "high",
    fabrics: ["aso-oke", "lace"],
    palette: ["#0b3b2c", "#14684d", "#3fa47f"],
    colourMood: "jewel",
    story:
      "Emerald aso-oke meets beaded lace in a high-neck mermaid silhouette. Structured, statuesque and unmistakably celebratory.",
    details: ["Beaded lace overlay", "Aso-oke flare", "High illusion neckline", "Asoebi group orders welcome"],
    leadWeeks: 6,
  },
  {
    slug: "adire-bloom",
    title: "Adire Bloom",
    collection: "owambe-royale",
    occasion: "celebration",
    silhouette: "twopiece",
    neckline: "offshoulder",
    fabrics: ["adire"],
    palette: ["#0f1d45", "#21397a", "#5d7fc9"],
    colourMood: "jewel",
    story:
      "Indigo adire dyed by hand, made into an off-shoulder crop and a full skirt. Heritage cloth with a modern line.",
    details: ["Hand-dyed indigo adire", "Off-shoulder crop top", "Full gathered skirt", "Wear together or apart"],
    leadWeeks: 4,
  },

  // ── After Dark ──────────────────────────────
  {
    slug: "midnight-gilt",
    title: "Midnight Gilt",
    collection: "after-dark",
    occasion: "evening",
    silhouette: "column",
    neckline: "v",
    fabrics: ["sequin"],
    palette: ["#5a3c0c", "#b8862f", "#f3d27a"],
    colourMood: "dark",
    story: "A liquid-gold sequin column with a deep V. Simple lines, maximum light.",
    details: ["Hand-set sequin mesh", "Floor-length column", "Deep V neckline", "Back slit for movement"],
    leadWeeks: 5,
  },
  {
    slug: "velvet-hour",
    title: "Velvet Hour",
    collection: "after-dark",
    occasion: "evening",
    silhouette: "aline",
    neckline: "offshoulder",
    fabrics: ["velvet"],
    palette: ["#240a24", "#4b1748", "#8a3c84"],
    colourMood: "dark",
    story: "Deep plum velvet, off the shoulder, falling into a soft A-line. Rich to the touch and warm in the light.",
    details: ["Silk-velvet", "Off-shoulder neckline", "A-line skirt with soft volume", "Satin-lined"],
    leadWeeks: 5,
  },
  {
    slug: "noir-sash",
    title: "Noir Sash",
    collection: "after-dark",
    occasion: "evening",
    silhouette: "aline",
    neckline: "v",
    train: true,
    fabrics: ["silk"],
    palette: ["#050505", "#1b1b1b", "#4a4a4a"],
    colourMood: "dark",
    story:
      "Black silk with a sash that sweeps from the waist into a train, echoing the ribbon in the Olivet mark.",
    details: ["Duchess silk", "Waist-to-train sash", "Wrapped V bodice", "Hand-rolled hem"],
    leadWeeks: 6,
  },

  // ── Everyday Couture ────────────────────────
  {
    slug: "the-directress",
    title: "The Directress",
    collection: "everyday-couture",
    occasion: "everyday",
    silhouette: "suit",
    neckline: "v",
    fabrics: ["crepe"],
    palette: ["#6b4a26", "#a87b47", "#dcb27e"],
    colourMood: "earth",
    story: "A camel crepe suit with a sharp shoulder and a fluid wide trouser. Boardroom authority, cut for her.",
    details: ["Structured shoulder", "Single-button jacket", "High-waist wide trouser", "Made-to-measure fit"],
    leadWeeks: 3,
  },
  {
    slug: "sunday-silk",
    title: "Sunday Silk",
    collection: "everyday-couture",
    occasion: "everyday",
    silhouette: "aline",
    neckline: "high",
    fabrics: ["silk"],
    palette: ["#6e2a12", "#a8481f", "#e08451"],
    colourMood: "earth",
    story: "Rust silk with a modest high neck and an easy A-line. For church, brunch, and everything in between.",
    details: ["Washable silk", "Modest high neckline", "Midi to maxi length", "Covered button back"],
    leadWeeks: 3,
  },
  {
    slug: "market-day",
    title: "Market Day",
    collection: "everyday-couture",
    occasion: "everyday",
    silhouette: "jumpsuit",
    neckline: "high",
    fabrics: ["ankara"],
    palette: ["#7a4b06", "#c98a12", "#f2c14e"],
    colourMood: "earth",
    story: "Bold ankara cut into an easy wide-leg jumpsuit. Colourful, comfortable, made to move.",
    details: ["Premium cotton ankara", "Wide-leg cut", "Tie waist", "Pockets, always"],
    leadWeeks: 2,
  },
];

export function getLook(slug: string) {
  return looks.find((l) => l.slug === slug);
}

export function getCollection(slug: string) {
  return collections.find((c) => c.slug === slug);
}

export function looksIn(collection: string) {
  return looks.filter((l) => l.collection === collection);
}

/** Deterministic "you may also love": shared fabrics, occasion and silhouette. */
export function relatedLooks(look: Look, count = 3) {
  return looks
    .filter((l) => l.slug !== look.slug)
    .map((l) => ({
      l,
      score:
        (l.occasion === look.occasion ? 3 : 0) +
        l.fabrics.filter((f) => look.fabrics.includes(f)).length * 2 +
        (l.silhouette === look.silhouette ? 1 : 0) +
        (l.colourMood === look.colourMood ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score || a.l.title.localeCompare(b.l.title))
    .slice(0, count)
    .map((x) => x.l);
}
