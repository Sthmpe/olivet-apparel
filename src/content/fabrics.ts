import type { FabricId } from "./looks";

export type Fabric = {
  id: FabricId;
  name: string;
  feel: string;
  /** colours used to draw the swatch texture */
  colors: [string, string];
};

export const fabrics: Fabric[] = [
  { id: "lace", name: "Lace", feel: "Delicate, hand-finished, romantic", colors: ["#efe6d2", "#c9b994"] },
  { id: "silk", name: "Silk", feel: "Fluid, cool, luminous", colors: ["#1d1a17", "#8a7556"] },
  { id: "aso-oke", name: "Aso-oke", feel: "Hand-woven, regal, structured", colors: ["#7d1d31", "#d4a24c"] },
  { id: "adire", name: "Adire", feel: "Hand-dyed indigo, heritage", colors: ["#1b2f66", "#8ea6dd"] },
  { id: "ankara", name: "Ankara", feel: "Bold print, joyful, easy", colors: ["#c98a12", "#0f5c5a"] },
  { id: "velvet", name: "Velvet", feel: "Deep, soft, rich", colors: ["#3a1038", "#8a3c84"] },
  { id: "sequin", name: "Sequin", feel: "Light-catching, glamorous", colors: ["#6b4a12", "#f3d27a"] },
  { id: "organza", name: "Organza", feel: "Sheer, airy, sculptural", colors: ["#f4ecdc", "#ffffff"] },
  { id: "crepe", name: "Crepe", feel: "Matte, tailored, graceful", colors: ["#a87b47", "#d9b88a"] },
];

export function getFabric(id: FabricId) {
  return fabrics.find((f) => f.id === id)!;
}
