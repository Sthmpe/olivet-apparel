import { CATEGORIES, type Category } from "@/domain/catalog";
import { formatNaira, type Course } from "@/domain/courses";
import { description, site, socialLinks, town } from "@/content/site";

/**
 * schema.org structured data. Search engines and AI assistants read it to
 * understand who the business is, where it is, what it offers and how to
 * contact it. Built from the site settings, so it never drifts from the page.
 */

export function businessSchema(categories: readonly Category[] = CATEGORIES) {
  const region = site.city.split(",")[1]?.trim();
  return {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "@id": `${site.url}/#business`,
    name: site.name,
    alternateName: "Olivet Apparel by Oluwagbemisola",
    url: site.url,
    description,
    slogan: site.tagline,
    logo: `${site.url}/brand/lockup.png`,
    image: `${site.url}/opengraph-image.jpg`,
    telephone: site.phoneDisplay.replace(/\s/g, ""),
    email: site.email,
    priceRange: "₦₦",
    currenciesAccepted: "NGN",
    address: { "@type": "PostalAddress", addressLocality: town, addressRegion: region, addressCountry: "NG" },
    areaServed: [{ "@type": "City", name: town }, { "@type": "Country", name: site.country }],
    founder: { "@type": "Person", name: site.designerFullName, alternateName: site.designer, jobTitle: "Fashion designer" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: site.phoneDisplay.replace(/\s/g, ""),
      email: site.email,
      availableLanguage: ["English"],
      url: `https://wa.me/${site.whatsapp}`,
    },
    sameAs: socialLinks.map((s) => s.url),
    knowsAbout: ["Bespoke tailoring", "Bridal gowns", "Prom dresses", "Corporate wear", "Ankara fashion", "Sewing classes"],
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

export function websiteSchema() {
  return { "@context": "https://schema.org", "@type": "WebSite", "@id": `${site.url}/#website`, name: site.name, url: site.url, publisher: { "@id": `${site.url}/#business` } };
}

export function coursesSchema(courses: readonly Course[]) {
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
