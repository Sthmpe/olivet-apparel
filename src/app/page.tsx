import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/domain/catalog";
import { site, town, whatsappLink } from "@/content/site";
import { courses } from "@/content/courses";
import { processSteps } from "@/content/services";
import { getPortfolio } from "@/infrastructure/portfolio-query";
import { HeroVisual } from "@/components/home/HeroVisual";
import { CategoryTiles } from "@/components/portfolio/CategoryTiles";
import { CourseCard } from "@/components/classes/CourseCard";
import { WhatsAppIcon } from "@/components/layout/WhatsAppButton";

export default async function HomePage() {
  const photos = await getPortfolio();
  const featured = photos.slice(3, 9);

  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-8 sm:px-8 md:grid-cols-2 md:items-stretch md:pb-24 md:pt-14">
        <div className="flex flex-col justify-center">
          <p className="eyebrow">Bespoke fashion house · {town}</p>
          <h1 className="mt-5 font-display text-[3.3rem] font-light leading-[0.98] text-fg sm:text-7xl lg:text-[5.4rem]">
            Elegance, <em className="gold-text font-normal">made around you.</em>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">{site.intro} Ankara wear and trousers too.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/book" className="btn btn-primary">
              Book now
            </Link>
            <Link href="/portfolio" className="btn btn-secondary">
              View portfolio
            </Link>
          </div>
        </div>
        <div className="md:min-h-[34rem]">
          <HeroVisual photos={photos} />
        </div>
      </section>

      {/* What we make */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-8 md:pb-28">
        <div className="mb-8 flex items-end justify-between gap-6">
          <h2 className="font-display text-4xl font-light text-fg md:text-5xl">What we make</h2>
          <Link href="/portfolio" className="shrink-0 text-sm text-gold hover:underline">
            Full portfolio
          </Link>
        </div>
        <CategoryTiles photos={photos} />
      </section>

      {/* Featured work */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-8 md:pb-28">
          <h2 className="mb-8 font-display text-4xl font-light text-fg md:text-5xl">Recent styles</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {featured.map((p, i) => (
              <Link
                key={p.id}
                href={`/portfolio?category=${p.category}`}
                className={`group relative overflow-hidden rounded-2xl ${i === 0 ? "row-span-2 aspect-auto" : "aspect-[4/5]"}`}
              >
                <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 30vw, 48vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Services */}
      <section className="bg-panel">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-8 md:grid-cols-[1fr_1.4fr] md:py-28">
          <div>
            <p className="eyebrow">Services</p>
            <h2 className="mt-4 font-display text-4xl font-light leading-tight text-fg md:text-5xl">Made to measure, for every occasion.</h2>
            <p className="mt-5 max-w-sm text-muted">Every outfit is cut to your measurements and finished by hand.</p>
            <Link href="/services" className="btn btn-secondary mt-8">
              All services
            </Link>
          </div>
          <ol className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {CATEGORIES.map((c, i) => (
              <li key={c.id}>
                <Link href={`/portfolio?category=${c.id}`} className="group flex gap-4">
                  <span className="font-display text-xl text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block font-display text-2xl text-fg group-hover:text-gold">{c.label}</span>
                    <span className="mt-1 block text-sm text-muted">{c.summary}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Classes */}
      <section className="surface-dark">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-8 md:py-28">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Classes</p>
              <h2 className="mt-4 max-w-xl font-display text-4xl font-light leading-tight md:text-5xl">
                Learn to sew with {site.designer}.
              </h2>
              <p className="mt-4 max-w-lg text-muted">Beginner to advanced, in the studio or online. Certificate on completion.</p>
            </div>
            <Link href="/classes" className="btn btn-secondary self-start md:self-auto">
              All classes
            </Link>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[courses[0], courses[2], courses[4]].map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-8 md:py-28">
        <h2 className="font-display text-4xl font-light text-fg md:text-5xl">How ordering works</h2>
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((s, i) => (
            <li key={s.title}>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0b0a08] font-display text-lg text-[#f2cf7c]">{i + 1}</span>
              <h3 className="mt-4 font-display text-2xl text-fg">{s.title}</h3>
              <p className="mt-1 text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Call to action */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-panel p-8 sm:p-12 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-4xl font-light text-fg md:text-5xl">
              Ready for <em className="gold-text">your outfit?</em>
            </h2>
            <p className="mt-3 text-muted">Send a request and we reply within one working day.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/book" className="btn btn-primary">
              Book now
            </Link>
            <a href={whatsappLink("Hello Olivet Apparel, I would like to order an outfit.")} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
