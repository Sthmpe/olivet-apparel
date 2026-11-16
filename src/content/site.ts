/**
 * Brand and contact settings. Contact details can be changed with environment
 * variables on Vercel without editing code (see Configuration in the README).
 */
export const site = {
  name: "Olivet Apparel",
  /** The name she leads with on the site. */
  designer: "Oluwagbemisola",
  designerFullName: "Racheal Solomon Oluwagbemisola",
  tagline: "Bespoke fashion, designed around you.",
  /** The designer's own words, lightly edited for grammar. */
  intro:
    "Olivet Apparel is a bespoke fashion house creating bridal, prom, dinner, corporate and everyday couture, designed to bring out the elegance in your body, your story and your day.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://olivet-apparel.vercel.app",
  /** International format, digits only. */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2347043366083",
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE_DISPLAY ?? "+234 704 336 6083",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "rachealsolomon2020@gmail.com",
  /** Inbox that receives booking requests through FormSubmit. */
  bookingEmail: process.env.NEXT_PUBLIC_BOOKING_EMAIL ?? "rachealsolomon2020@gmail.com",
  /** "Town, State". Change NEXT_PUBLIC_STUDIO_CITY to "Lagos, Lagos State" after the move. */
  city: process.env.NEXT_PUBLIC_STUDIO_CITY ?? "Ilorin, Kwara State",
  country: "Nigeria",
  socials: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM ?? "olivet_apparel",
    tiktok: process.env.NEXT_PUBLIC_TIKTOK ?? "olivet_apparel",
    youtube: process.env.NEXT_PUBLIC_YOUTUBE ?? "olivet_apparel",
  },
} as const;

/** The town alone, for short copy such as "Fashion designer in Ilorin". */
export const town = site.city.split(",")[0].trim();

export const description = `Bespoke fashion house in ${town}, Nigeria, by designer ${site.designer}: bridal, prom, dinner, corporate, everyday, Ankara and trouser outfits made to measure, plus sewing classes in person and online.`;

export const socialLinks = [
  { label: "Instagram", handle: site.socials.instagram, url: `https://www.instagram.com/${site.socials.instagram}` },
  { label: "TikTok", handle: site.socials.tiktok, url: `https://www.tiktok.com/@${site.socials.tiktok}` },
  { label: "YouTube", handle: site.socials.youtube, url: `https://www.youtube.com/@${site.socials.youtube}` },
] as const;

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
