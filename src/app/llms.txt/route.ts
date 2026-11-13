import { CATEGORIES } from "@/domain/catalog";
import { formatNaira } from "@/domain/courses";
import { courses } from "@/content/courses";
import { description, site, socialLinks, town } from "@/content/site";

/**
 * /llms.txt: a plain-text summary of the business for AI assistants
 * (ChatGPT, Claude, Perplexity, Gemini), following the llms.txt convention.
 */
export function GET() {
  const body = `# ${site.name}

> ${description}

${site.name} is run by fashion designer ${site.designer} (${site.designerFullName}). The studio is in ${site.city}, ${site.country}. Clients outside ${town} are measured by video call and their outfits are delivered.

## Contact

- WhatsApp and phone: ${site.phoneDisplay} (https://wa.me/${site.whatsapp})
- Email: ${site.email}
${socialLinks.map((s) => `- ${s.label}: @${s.handle} (${s.url})`).join("\n")}
- Book online: ${site.url}/book

## What she makes

${CATEGORIES.map((c) => `- ${c.label}: ${c.summary}`).join("\n")}

Every outfit is made to the client's measurements. Prices depend on the design and fabric and are agreed after a free consultation.

## Sewing classes

${courses.map((c) => `- ${c.title} (${c.level}, ${c.format === "online" ? "online" : "in the studio"}, ${c.duration}): ${formatNaira(c.priceNaira)}. ${c.summary}`).join("\n")}

## Pages

- [Portfolio](${site.url}/portfolio): photos by category
- [Services](${site.url}/services): what each service includes
- [Classes](${site.url}/classes): course details and prices
- [About](${site.url}/about): the designer and common questions
- [Book](${site.url}/book): request an outfit or a class
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
