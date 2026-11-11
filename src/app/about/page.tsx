import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { site, whatsappLink } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: "About Olivet Apparel and its designer, Titilayomi.",
};

const values = [
  { title: "Made to fit you", body: "Every outfit is cut to your own measurements." },
  { title: "Sewn by hand", body: "Beading, lace and hems are finished carefully by hand." },
  { title: "Ready on time", body: "We plan around your date and book fittings early." },
  { title: "Honest advice", body: "We tell you what will suit you and your budget." },
];

const faqs = [
  { q: "How early should I book?", a: "Bridal: 3 to 6 months before your date. Owambe and evening wear: 4 to 8 weeks. Everyday pieces: 2 to 4 weeks. Need it sooner? Ask us." },
  { q: "I don't live nearby. Can I still order?", a: "Yes. We take your measurements on a video call and deliver to you." },
  { q: "Can I change a style?", a: "Yes. You can change the colour, neckline, sleeves or length of any style." },
  { q: "Do you make asoebi for groups?", a: "Yes. Tell us the group size and date when you book." },
  { q: "How do I pay?", a: "We agree the price after your consultation. A deposit confirms your order and the balance is paid before delivery." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero kicker="About" title={<>The designer behind <em className="gold-text">Olivet Apparel</em></>}>
        {site.designer} designs and sews custom outfits in {site.city.split(",")[0]}: bridal, owambe, evening and everyday wear,
        each one made for the person who will wear it.
      </PageHero>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-10 sm:px-8 md:grid-cols-2 md:py-16">
        <div className="on-dark art-well mx-auto w-full max-w-md rounded-[2rem] border border-edge p-10">
          <Image src="/brand/mark.png" alt="" width={900} height={719} className="h-auto w-full" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {values.map((v) => (
            <div key={v.title} className="rounded-[1.5rem] border border-edge bg-card p-6">
              <h2 className="font-display text-2xl text-fg">{v.title}</h2>
              <p className="mt-2 text-muted">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-8 md:py-20">
        <h2 className="font-display text-4xl font-light text-fg md:text-5xl">Common questions</h2>
        <div className="mt-8 divide-y divide-edge border-y border-edge">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-2xl text-fg marker:hidden">
                {f.q}
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-edge text-gold transition-transform duration-500 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="border-t border-edge bg-panel">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 py-14 sm:px-8 md:flex-row md:items-center">
          <div>
            <p className="kicker">Studio</p>
            <p className="mt-3 font-display text-4xl text-fg">{site.city}</p>
            <p className="mt-2 text-muted">
              By appointment.{" "}
              <a href={`tel:+${site.whatsapp}`} className="text-gold hover:underline">
                {site.phoneDisplay}
              </a>
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/book" className="btn-gold">
              Book now
            </Link>
            <a href={whatsappLink("Hello Olivet Apparel, I would like to visit the studio.")} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
