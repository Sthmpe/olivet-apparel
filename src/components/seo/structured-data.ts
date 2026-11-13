import type { Category } from "@/domain/catalog";
import { formatNaira, type Course } from "@/domain/courses";

/**
 * schema.org structured data. Search engines read it to show the business,
 * its services and its classes correctly in results. Pure functions, so the
 * output is easy to test.
 */

type SiteInfo = {
  name: string;
  url: string;
  description: string;
  phoneDisplay: string;
  email: string;
  city: string;
  instagram: string;
  designer: string;
};

export function businessSchema(site: SiteInfo, categories: readonly Category[]) {
  const [locality, country = "Nigeria"] = site.city.split(",").map((s) => s.trim());
  return {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "@id": `${site.url}/#business`,
    name: site.name,
    url: site.url,
    description: site.description,
    logo: `${site.url}/brand/lockup.png`,
    image: `${site.url}/opengraph-image.jpg`,
    telephone: site.phoneDisplay.replace(/\s/g, ""),
    email: site.email,
    priceRange: "₦₦",
    address: { "@type": "PostalAddress", addressLocality: locality, addressCountry: country === "Nigeria" ? "NG" : country },
    areaServed: { "@type": "Country", name: "Nigeria" },
    founder: { "@type": "Person", name: site.designer },
    sameAs: [`https://instagram.com/${site.instagram}`],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Bespoke fashion",
      itemListElement: categories.map((c) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: `${c.label} outfits`, description: c.summary },
      })),
    },
  };
}

export function websiteSchema(site: Pick<SiteInfo, "name" | "url">) {
  return { "@context": "https://schema.org", "@type": "WebSite", "@id": `${site.url}/#website`, name: site.name, url: site.url };
}

export function coursesSchema(site: Pick<SiteInfo, "name" | "url">, courses: readonly Course[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: courses.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Course",
        name: c.title,
        description: c.summary,
        educationalLevel: c.level,
        provider: { "@type": "Organization", name: site.name, sameAs: site.url },
        offers: { "@type": "Offer", price: c.priceNaira, priceCurrency: "NGN", category: "Paid", description: formatNaira(c.priceNaira) },
        hasCourseInstance: { "@type": "CourseInstance", courseMode: c.format === "online" ? "Online" : "Onsite", courseWorkload: c.duration },
      },
    })),
  };
}
