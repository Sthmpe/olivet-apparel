import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site, town, whatsappLink } from "@/content/site";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "About",
  description: "About Olivet Apparel, a bespoke fashion house in Ilorin, Nigeria, founded by designer Oluwagbemisola.",
  alternates: { canonical: "/about" },
};

const values = [
  { title: "Made to fit you", body: "Every outfit is cut to your own measurements." },
  { title: "Finished by hand", body: "Beading, lace and hems are finished carefully by hand." },
  { title: "Ready on time", body: "We plan around your date and book fittings early." },
  { title: "Honest advice", body: "We tell you what will suit you and your budget." },
];

const faqs = [
  { q: "How early should I book?", a: "Bridal: 3 to 6 months before your date. Prom, dinner and corporate wear: 3 to 6 weeks. Everyday and Ankara pieces: 1 to 3 weeks. Need it sooner? Ask us." },
  { q: `I don't live in ${town}. Can I still order?`, a: "Yes. We take your measurements on a video call and deliver to you." },
  { q: "Can I change a style from the portfolio?", a: "Yes. Colour, neckline, sleeves and length can all be changed to suit you." },
  { q: "Do you make outfits for groups?", a: "Yes. Tell us the group size and date when you book." },
  { q: "How do I pay?", a: "We agree the price after your consultation. A deposit confirms your order and the balance is paid before delivery." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About" title={<>The designer behind <em className="gold-text">Olivet Apparel</em></>}>
        {site.intro}
      </PageHeader>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 sm:px-8 md:grid-cols-2 md:items-center">
        <div className="flex aspect-[4/3] items-center justify-center rounded-3xl bg-[radial-gradient(70%_60%_at_50%_45%,#2a2110_0%,#0b0a08_75%)] p-10">
          <Image src="/brand/mark.png" alt="" width={900} height={719} className="h-auto w-full max-w-sm" />
        </div>
        <div className="space-y-5 text-lg leading-relaxed text-muted">
          <p>
            {site.designer} founded Olivet Apparel to make clothes that feel personal: designed for one person, cut to their
            measurements and finished with care.
          </p>
          <p>From wedding gowns to office suits and Ankara sets, every piece starts with a conversation about you, your occasion and your style.</p>
        </div>
      </section>

      <section className="bg-panel">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title}>
              <h2 className="font-display text-2xl text-fg">{v.title}</h2>
              <p className="mt-2 text-muted">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-8 md:py-24">
        <h2 className="font-display text-4xl font-light text-fg md:text-5xl">Common questions</h2>
        <div className="mt-8 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl bg-card px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-xl text-fg marker:hidden">
                {f.q}
                <span className="text-2xl text-gold transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-panel p-8 sm:p-10 md:flex-row md:items-center">
          <div>
            <p className="eyebrow">Studio</p>
            <p className="mt-2 font-display text-3xl text-fg">{site.city}</p>
            <p className="mt-1 text-muted">
              By appointment ·{" "}
              <a className="text-gold" href={`tel:+${site.whatsapp}`}>
                {site.phoneDisplay}
              </a>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/book" className="btn btn-primary">
              Book now
            </Link>
            <a href={whatsappLink("Hello Olivet Apparel, I would like to visit the studio.")} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
