import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { site, whatsappLink } from "@/content/site";

export const metadata: Metadata = {
  title: "The Atelier",
  description: "The story, values and process behind Olivet Apparel, a bespoke fashion house.",
};

const values = [
  { title: "Made for one", body: "No racks of sizes. Every piece is cut from a pattern drafted for your body." },
  { title: "By hand", body: "Beading, hems, lace appliqué: the details that make couture are done slowly, by hand." },
  { title: "On time", body: "Your date is sacred. We plan backwards from it, with fittings booked from day one." },
  { title: "Honest advice", body: "We'll tell you what will flatter, what fabric will last, and what fits your budget." },
];

const faqs = [
  {
    q: "How early should I book?",
    a: "For bridal, 3–6 months before your date is ideal. Celebration and evening pieces usually need 4–8 weeks, and everyday tailoring 2–4 weeks. Rush orders are sometimes possible, so ask.",
  },
  {
    q: "I'm not in the same city. Can I still order?",
    a: "Yes. We can work from your measurements with a guided video call, and deliver to you. For bridal we recommend at least one in-person fitting.",
  },
  {
    q: "Can I change a design from the collections?",
    a: "Always. Colour, neckline, sleeves, length, train: every look is a starting sketch that we adapt with you.",
  },
  {
    q: "Do you make asoebi for groups?",
    a: "Yes. Group orders for families and bridal parties are welcome. Book a consultation and tell us the group size and date.",
  },
  {
    q: "How do I pay?",
    a: "We confirm the price after your consultation. A deposit secures your production slot and the balance is due before delivery.",
  },
];

export default function AtelierPage() {
  return (
    <>
      <PageHero
        kicker="The Atelier"
        title={
          <>
            A studio where every garment <em className="gold-text">has a name on it.</em>
          </>
        }
      >
        Founded by designer {site.designer}, Olivet Apparel is a bespoke fashion house built on one idea: that clothes should be made for a person, not a size.
        We design bridal, celebration, evening and everyday couture, sketched for you, cut for you and finished by hand.
      </PageHero>

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-8 md:grid-cols-2 md:py-24">
        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,rgba(211,149,47,0.18),transparent)]" />
          <Image src="/brand/mark.png" alt="" width={900} height={719} className="relative h-auto w-full" />
        </div>
        <div className="space-y-6 text-lg leading-relaxed text-mute">
          <p className="font-display text-3xl font-light italic leading-snug text-bone">
            &ldquo;The needle in our mark isn&apos;t decoration. It&apos;s a promise: that someone sat with your garment and
            sewed it with care.&rdquo;
          </p>
          <p>
            Our mark is a gown on a dress form inside the letter O, with a needle and thread sweeping through it. That thread
            runs through everything we do, from the first conversation and the first sketch to the final stitch on the morning
            of your event.
          </p>
          <p>
            {site.designer} works closely with each client, one at a time, so that what you wear feels like you: your story, your culture,
            your confidence.
          </p>
        </div>
      </section>

      <section className="border-y border-line bg-ink-2/70">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-8 md:py-28">
          <p className="kicker">What we stand for</p>
          <div className="mt-10 grid gap-px overflow-hidden rounded-[1.75rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <div key={v.title} className="bg-ink-3 p-8">
                <span className="gold-text font-display text-4xl italic">0{i + 1}</span>
                <h2 className="mt-5 font-display text-3xl text-bone">{v.title}</h2>
                <p className="mt-3 leading-relaxed text-mute">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-8 md:py-28">
        <p className="kicker">Questions</p>
        <h2 className="mt-4 font-display text-5xl font-light text-bone">Before you book</h2>
        <div className="mt-10 divide-y divide-line border-y border-line">
          {faqs.map((f) => (
            <details key={f.q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-2xl text-bone marker:hidden">
                {f.q}
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-gold transition-transform duration-500 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-2xl leading-relaxed text-mute">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 py-16 sm:px-8 md:flex-row md:items-center">
          <div>
            <p className="kicker">Visit the studio</p>
            <p className="mt-3 font-display text-4xl text-bone">{site.city}</p>
            <p className="mt-2 text-mute">
              By appointment only ·{" "}
              <a href={`tel:+${site.whatsapp}`} className="hover:text-gold-light">
                {site.phoneDisplay}
              </a>
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/book" className="btn-gold">
              Book a consultation
            </Link>
            <a href={whatsappLink("Hello Olivet Apparel ✨ I'd like to visit the studio.")} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              WhatsApp the studio
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
