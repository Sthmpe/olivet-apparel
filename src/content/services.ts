import type { CategoryId } from "@/domain/catalog";

/** What each service includes. One entry per category in the catalog domain. */
export const serviceDetails: Record<CategoryId, { includes: string[] }> = {
  bridal: { includes: ["Wedding and reception gowns", "Second outfits and robes", "Bridal party and family outfits"] },
  prom: { includes: ["Prom and graduation gowns", "Corsets and structured bodices", "Matching accessories"] },
  dinner: { includes: ["Dinner and gala dresses", "Birthday and anniversary looks", "Cocktail dresses"] },
  corporate: { includes: ["Skirt and trouser suits", "Office dresses", "Blazers and two-piece sets"] },
  everyday: { includes: ["Church and outing dresses", "Tops, skirts and sets", "Comfortable everyday wear"] },
  ankara: { includes: ["Ankara dresses and sets", "Owambe and party styles", "Ankara for couples and families"] },
  trousers: { includes: ["Palazzo and wide-leg trousers", "Tailored trousers", "Trouser and top sets"] },
};

export const processSteps = [
  { title: "Choose a style", body: "Pick from the portfolio, or send a photo of what you have in mind." },
  { title: "Get measured", body: "In the studio, or on a video call if you are not in Lagos." },
  { title: "Fitting", body: "We fit the outfit on you and adjust until it sits perfectly." },
  { title: "Delivery", body: "Finished, pressed and ready before your date." },
];
