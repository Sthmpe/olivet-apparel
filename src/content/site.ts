/**
 * Brand + contact settings. Contact details can be overridden with environment
 * variables on Vercel without touching code (see README → Configuration).
 */
export const site = {
  name: "Olivet Apparel",
  tagline: "Made for one. Sewn for you.",
  description:
    "Olivet Apparel is a bespoke fashion house creating bridal, celebration, evening and everyday couture, designed around your body, your story and your day.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://olivet-apparel.vercel.app",
  // International format, digits only, e.g. 2348012345678
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2340000000000",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@olivetapparel.com",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM ?? "olivetapparel",
  city: process.env.NEXT_PUBLIC_STUDIO_CITY ?? "Lagos, Nigeria",
  currency: "NGN",
} as const;

export function whatsappLink(text: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const nav = [
  { href: "/collections", label: "Collections" },
  { href: "/style-finder", label: "Style Finder" },
  { href: "/atelier", label: "The Atelier" },
] as const;
