/**
 * Brand and contact settings. Contact details can be changed with environment
 * variables on Vercel without editing code (see Configuration in the README).
 */
export const site = {
  name: "Olivet Apparel",
  designer: "Titilayomi",
  tagline: "Bespoke fashion, designed around you.",
  /** The designer's own words, lightly edited for grammar. */
  intro:
    "Olivet Apparel is a bespoke fashion house creating bridal, prom, dinner, corporate and everyday couture, designed to bring out the elegance in your body, your story and your day.",
  description:
    "Bespoke fashion house in Lagos creating bridal, prom, dinner, corporate, everyday and Ankara wear, plus sewing classes in person and online.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://olivet-apparel.vercel.app",
  /** International format, digits only. */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348126866152",
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE_DISPLAY ?? "+234 812 686 6152",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@olivetapparel.com",
  /** Inbox that receives booking requests through FormSubmit. Leave unset to use the WhatsApp and email buttons only. */
  bookingEmail: process.env.NEXT_PUBLIC_BOOKING_EMAIL ?? "",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM ?? "olivetapparel",
  city: process.env.NEXT_PUBLIC_STUDIO_CITY ?? "Lagos, Nigeria",
} as const;

/**
 * Search engine settings. Verification codes come from Google Search Console
 * and Bing Webmaster Tools; they are public by design and only prove ownership.
 * The IndexNow key must match the file of the same name in /public.
 */
export const seo = {
  googleVerification: process.env.GOOGLE_SITE_VERIFICATION ?? "",
  bingVerification: process.env.BING_SITE_VERIFICATION ?? "",
  yandexVerification: process.env.YANDEX_SITE_VERIFICATION ?? "",
  indexNowKey: "53374bb85afad88745a79ec2962d9b10",
} as const;

export function whatsappLink(message: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const navigation = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/classes", label: "Classes" },
  { href: "/about", label: "About" },
] as const;
