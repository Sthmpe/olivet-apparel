import type { Course } from "@/domain/courses";

/**
 * Sewing classes. Prices and durations are placeholders until confirmed by the
 * designer (see the client questionnaire).
 */
export const courses: Course[] = [
  {
    id: "foundation-studio",
    title: "Foundation Sewing",
    level: "Foundation",
    format: "in-person",
    duration: "4 weeks · 2 days a week",
    priceNaira: 120_000,
    summary: "For complete beginners. Learn the machine, take measurements and sew your first garments.",
    outcomes: ["Using and caring for a sewing machine", "Taking body measurements", "Seams, hems and zips", "A simple skirt and top"],
  },
  {
    id: "foundation-online",
    title: "Foundation Sewing Online",
    level: "Foundation",
    format: "online",
    duration: "6 weeks · self-paced",
    priceNaira: 100_000,
    summary: "The foundation class at your own pace, with video lessons and feedback on WhatsApp.",
    outcomes: ["Recorded lessons you keep", "Weekly feedback on your work", "Measurements and basic patterns", "Certificate on completion"],
  },
  {
    id: "pattern-drafting",
    title: "Pattern Drafting and Construction",
    level: "Intermediate",
    format: "in-person",
    duration: "6 weeks · 2 days a week",
    priceNaira: 170_000,
    summary: "Draft your own patterns from measurements and build fitted dresses, trousers and jackets.",
    outcomes: ["Bodice, skirt and trouser blocks", "Darts, linings and fitting", "Reading and adjusting patterns", "A fitted dress from your own pattern"],
  },
  {
    id: "pattern-drafting-online",
    title: "Pattern Drafting Online",
    level: "Intermediate",
    format: "online",
    duration: "8 weeks · self-paced",
    priceNaira: 150_000,
    summary: "The intermediate class online, for students who already sew confidently.",
    outcomes: ["Step-by-step drafting videos", "Live Q&A sessions", "Feedback on your fittings", "Certificate on completion"],
  },
  {
    id: "bridal-corsetry",
    title: "Bridal and Corsetry Masterclass",
    level: "Advanced",
    format: "in-person",
    duration: "8 weeks · 3 days a week",
    priceNaira: 230_000,
    summary: "Structured bodices, corsets, lace work and finishing for bridal and evening gowns.",
    outcomes: ["Corset boning and structure", "Working with lace and beading", "Gown linings and finishing", "A complete corseted bodice"],
  },
];

export const classPerks = ["Certificate on completion", "A sewing machine for every student", "Small classes", "Hands-on from day one"];
