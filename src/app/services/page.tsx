import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, coverPhotos } from "@/domain/catalog";
import { processSteps, serviceDetails } from "@/content/services";
import { getPortfolio } from "@/infrastructure/portfolio-query";
import { PageHeader } from "@/components/ui/PageHeader";
import { PhotoPlaceholder } from "@/components/portfolio/PhotoPlaceholder";

export const metadata: Metadata = {
  title: "Services",
  description: "Bespoke bridal, prom, dinner, corporate, everyday, Ankara and trouser outfits, made to measure in Lagos.",
};

export default async function ServicesPage() {
  const covers = coverPhotos(await getPortfolio());

  return (
    <>
      <PageHeader eyebrow="Services" title={<>Everything is <em className="gold-text">made to measure.</em></>}>
        Tell us the occasion and we design, cut and sew the outfit around you. Prices depend on the design and fabric, so
        every order starts with a free consultation.
      </PageHeader>

      <section className="mx-auto max-w-7xl space-y-4 px-4 pb-20 sm:px-8">
        {CATEGORIES.map((c, i) => {
          const cover = covers.get(c.id);
          return (
            <article key={c.id} className="grid gap-6 rounded-3xl bg-panel p-4 sm:grid-cols-[13rem_1fr] sm:items-center sm:p-5 md:grid-cols-[15rem_1fr_auto] md:gap-10">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:aspect-[3/4]">
                {cover ? <Image src={cover.src} alt={cover.alt} fill sizes="15rem" className="object-cover" /> : <PhotoPlaceholder label={c.label} />}
              </div>
              <div className="px-2 sm:px-0">
                <p className="font-display text-lg text-gold">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="font-display text-4xl text-fg">{c.label}</h2>
                <p className="mt-2 max-w-lg text-muted">{c.summary}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {serviceDetails[c.id].includes.map((item) => (
                    <li key={item} className="rounded-full bg-card px-3 py-1.5 text-sm text-fg/85">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-3 px-2 pb-2 sm:col-span-2 sm:px-0 sm:pb-0 md:col-span-1 md:flex-col">
                <Link href={`/book?category=${c.id}`} className="btn btn-primary">
                  Book
                </Link>
                <Link href={`/portfolio?category=${c.id}`} className="btn btn-secondary">
                  See styles
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <section className="surface-dark">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-8 md:py-24">
          <h2 className="font-display text-4xl font-light md:text-5xl">What every order includes</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((s, i) => (
              <li key={s.title}>
                <span className="font-display text-3xl text-gold">{i + 1}</span>
                <h3 className="mt-2 font-display text-2xl">{s.title}</h3>
                <p className="mt-1 text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
