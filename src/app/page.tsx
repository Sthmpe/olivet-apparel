import Image from "next/image";
import Link from "next/link";
import { ThreadStage } from "@/components/thread/ThreadStage";
import { FittingRoom } from "@/components/garment/FittingRoom";
import { GarmentArt } from "@/components/garment/GarmentArt";
import { SwatchDrawer } from "@/components/home/SwatchDrawer";
import { WhatsAppIcon } from "@/components/layout/WhatsAppFab";
import { collections, getLook, looksIn } from "@/content/looks";
import { site, whatsappLink } from "@/content/site";

const steps = [
  { n: "1", title: "Pick a style", body: "Choose from our styles, or send a photo of what you want." },
  { n: "2", title: "Book and get measured", body: "Send a request. We take your measurements in the studio or by video call." },
  { n: "3", title: "We sew and deliver", body: "Your outfit is made to fit you and delivered before your date." },
];

export default function Home() {
  const featured = getLook("the-aurelia")!;

  return (
    <ThreadStage>
      {/* Hero: what this is, in one glance */}
      <section className="relative overflow-hidden pt-24 md:pt-28">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 sm:px-8 md:min-h-[calc(100dvh-7rem)] md:grid-cols-2 md:pb-10">
          <div className="order-2 md:order-1">
            <p className="kicker rise">Fashion designer in {site.city.split(",")[0]}</p>
            <h1 className="rise mt-5 font-display text-[3.2rem] font-light leading-[0.98] text-fg sm:text-7xl lg:text-[5.6rem]" style={{ animationDelay: "100ms" }}>
              Custom outfits, <em className="gold-text font-normal">made to fit you.</em>
            </h1>
            <p className="rise mt-6 max-w-md text-lg leading-relaxed text-muted" style={{ animationDelay: "200ms" }}>
              {site.designer} designs and sews bridal, owambe, evening and everyday wear. Pick a style, book, and we make
              it to your measurements.
            </p>
            <div className="rise mt-9 flex flex-wrap gap-4" style={{ animationDelay: "300ms" }}>
              <Link href="/book" className="btn-gold">
                Book now
              </Link>
              <Link href="/styles" className="btn-ghost">
                See styles
              </Link>
            </div>
          </div>

          <div className="order-1 mx-auto w-full max-w-[18rem] md:order-2 md:max-w-[30rem]">
            <div className="on-dark art-well rise relative rounded-t-[999px] rounded-b-[2rem] border border-edge px-8 pb-10 pt-16 md:px-12 md:pb-14 md:pt-24">
              <Image
                src="/brand/mark.png"
                alt="Olivet Apparel logo: a gold gown on a dress form inside the letter O, with a needle and thread"
                width={900}
                height={719}
                priority
                className="h-auto w-full"
              />
              {/* the thread starts at the needle */}
              <span data-stitch="center" className="absolute bottom-0 left-[66%] h-px w-px" />
            </div>
          </div>
        </div>
      </section>

      {/* What we make */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 md:py-24">
        <div className="mb-10 flex items-end justify-between gap-6" data-stitch="left" data-stitch-y="0.5">
          <h2 className="font-display text-4xl font-light text-fg md:text-6xl">What we make</h2>
          <Link href="/styles" className="shrink-0 text-sm text-gold underline-offset-4 hover:underline">
            See all styles
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {collections.map((c) => {
            const first = looksIn(c.slug)[0];
            return (
              <Link
                key={c.slug}
                href={`/styles/${c.slug}`}
                className="group overflow-hidden rounded-[1.5rem] border border-edge bg-card transition-colors duration-500 hover:border-gold"
              >
                <div className="on-dark art-well relative aspect-[3/4]">
                  {first && <GarmentArt look={first} className="absolute inset-0 m-auto h-[84%] w-auto transition-transform duration-700 group-hover:scale-[1.04]" title={`${c.title} style`} />}
                </div>
                <div className="px-4 py-4 sm:px-5">
                  <h3 className="font-display text-2xl text-fg sm:text-3xl">{c.title}</h3>
                  <p className="mt-1 text-sm text-muted">{c.intro}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-edge bg-panel">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 md:py-24">
          <h2 className="font-display text-4xl font-light text-fg md:text-6xl" data-stitch="left" data-stitch-y="0.5">
            How it works
          </h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((s) => (
              <li key={s.n} className="rounded-[1.5rem] border border-edge bg-card p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold font-display text-2xl text-gold">{s.n}</span>
                <h3 className="mt-5 font-display text-3xl text-fg">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* See how it is made */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-8 md:grid-cols-2 md:py-24">
        <div data-stitch="left" data-stitch-y="0.3">
          <h2 className="font-display text-4xl font-light leading-tight text-fg md:text-6xl">
            From sketch <em className="gold-text">to finished outfit</em>
          </h2>
          <p className="mt-5 max-w-md text-lg text-muted">Drag the slider to see how a dress is made.</p>
          <Link href={`/looks/${featured.slug}`} className="btn-ghost mt-8">
            View this style
          </Link>
        </div>
        <FittingRoom look={featured} />
      </section>

      {/* Fabrics */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-8 md:pb-24">
        <h2 className="font-display text-4xl font-light text-fg md:text-6xl" data-stitch="left" data-stitch-y="0.5">
          Browse by fabric
        </h2>
        <p className="mb-8 mt-3 text-muted">Tap a fabric to see the styles made with it.</p>
        <SwatchDrawer />
        <span data-stitch="left" className="block h-px w-px" />
      </section>

      {/* Book */}
      <section className="border-t border-edge bg-panel">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
          <span data-stitch="center" data-stitch-y="0" className="mx-auto block h-px w-px" />
          <h2 className="font-display text-5xl font-light leading-none text-fg md:text-7xl">
            Ready to order <em className="gold-text">yours?</em>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-lg text-muted">Booking takes two minutes. We reply within one working day.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link href="/book" className="btn-gold">
              Book now
            </Link>
            <a href={whatsappLink("Hello Olivet Apparel, I would like to order an outfit.")} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
            </a>
          </div>
          <p className="mt-8 text-sm text-muted">
            Not sure what you want?{" "}
            <Link href="/style-finder" className="text-gold underline-offset-4 hover:underline">
              Find your style in 4 questions
            </Link>
          </p>
        </div>
      </section>
    </ThreadStage>
  );
}
