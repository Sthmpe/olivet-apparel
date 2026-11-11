import Image from "next/image";
import Link from "next/link";
import { ThreadStage } from "@/components/thread/ThreadStage";
import { FittingRoom } from "@/components/garment/FittingRoom";
import { GarmentArt } from "@/components/garment/GarmentArt";
import { SwatchDrawer } from "@/components/home/SwatchDrawer";
import { collections, getLook, looksIn } from "@/content/looks";
import { whatsappLink } from "@/content/site";
import { WhatsAppIcon } from "@/components/layout/WhatsAppFab";

const tilts = ["-3deg", "2deg", "-1.5deg", "3deg"];

const process = [
  { n: "01", title: "Consultation", body: "Tell us about the occasion, your style and the feeling you want. In the studio, or over a call.", when: "Week 0" },
  { n: "02", title: "Design & fabric", body: "We sketch your piece and choose the fabric together: colour, weight, the way it moves.", when: "Week 1" },
  { n: "03", title: "Measure & fit", body: "Precise measurements, then fittings until it feels like a second skin.", when: "Weeks 2–8" },
  { n: "04", title: "Finish & deliver", body: "Hand-finished, pressed and delivered on time, ready for your moment.", when: "Your day" },
];

export default function Home() {
  const featured = getLook("the-aurelia")!;

  return (
    <ThreadStage>
      {/* ── Hero ───────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 md:pt-32">
        <div className="pointer-events-none absolute -right-40 top-10 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(closest-side,rgba(211,149,47,0.16),transparent)]" />
        <div className="mx-auto grid min-h-[calc(100dvh-8rem)] max-w-7xl items-center gap-10 px-4 sm:px-8 md:grid-cols-[1.1fr_1fr]">
          <div className="relative z-10 order-2 md:order-1">
            <p className="kicker rise">Olivet Apparel · Bespoke Atelier</p>
            <h1 className="rise mt-6 font-display text-[3.4rem] font-light leading-[0.95] text-bone sm:text-7xl lg:text-[6.4rem]" style={{ animationDelay: "120ms" }}>
              Made for one.
              <br />
              <em className="gold-text gold-shimmer font-normal">Sewn for you.</em>
            </h1>
            <p className="rise mt-8 max-w-md text-base leading-relaxed text-mute sm:text-lg" style={{ animationDelay: "240ms" }}>
              Bridal, celebration and evening wear designed around your body, your story and your day. Every piece
              begins as a sketch with your name on it.
            </p>
            <div className="rise mt-10 flex flex-wrap gap-4" style={{ animationDelay: "360ms" }}>
              <Link href="/book" className="btn-gold">
                Book a consultation
              </Link>
              <Link href="/collections" className="btn-ghost">
                Explore the collections
              </Link>
            </div>
          </div>

          <div className="relative order-1 mx-auto w-full max-w-[17rem] md:order-2 md:max-w-[34rem]">
            <Image
              src="/brand/mark.png"
              alt="The Olivet Apparel mark: a gold gown on a dress form inside the letter O, with a needle and thread"
              width={900}
              height={719}
              priority
              className="rise relative h-auto w-full drop-shadow-[0_30px_80px_rgba(211,149,47,0.25)]"
            />
            {/* the thread leaves the needle in the mark */}
            <span data-stitch="center" className="absolute left-[69%] top-[81%] h-px w-px" />
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl justify-center pb-10 md:justify-start md:px-8">
          <a href="#manifesto" className="group flex items-center gap-3 font-caps text-[0.62rem] tracking-[0.35em] text-mute transition-colors hover:text-gold-light">
            <span className="block h-10 w-px bg-gradient-to-b from-transparent to-gold" />
            Follow the thread
          </a>
        </div>
      </section>

      {/* ── Manifesto ──────────────────────────── */}
      <section id="manifesto" className="mx-auto max-w-5xl px-6 py-24 sm:px-8 md:py-36">
        <p data-stitch="left" data-stitch-y="0.2" className="reveal font-display text-[2rem] font-light leading-[1.2] text-bone/90 sm:text-5xl md:text-[3.6rem]">
          We don&apos;t make clothes for <span className="text-mute line-through decoration-gold/60">sizes</span>. We make them for{" "}
          <em className="gold-text">people</em>: for the way you walk into a room, the story you want to tell, and the day you
          will remember forever.
        </p>
      </section>

      {/* ── Collections on the line ────────────── */}
      <section className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-8 md:pb-36">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="kicker">The Collections</p>
            <h2 className="mt-4 font-display text-5xl font-light text-bone md:text-6xl">Hung on the line</h2>
          </div>
          <Link href="/collections" className="btn-ghost self-start md:self-auto">
            View every look
          </Link>
        </div>

        <div className="relative pt-12">
          {/* the thread becomes a clothesline */}
          <span data-stitch="1" className="absolute left-0 top-6 h-px w-px" />
          <span data-stitch="99" className="absolute right-0 top-[1.6rem] h-px w-px" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4 lg:gap-6">
            {collections.map((c, i) => {
              const first = looksIn(c.slug)[0];
              return (
                <Link
                  key={c.slug}
                  href={`/collections/${c.slug}`}
                  className="tag-sway group relative block"
                  style={{ ["--tilt" as string]: tilts[i % tilts.length] }}
                >
                  {/* tag string up to the line */}
                  <span className="absolute -top-12 left-1/2 h-12 w-px -translate-x-1/2 bg-gradient-to-b from-gold/80 to-gold/30" />
                  <div className="relative overflow-hidden rounded-t-[999px] rounded-b-[1.5rem] border border-line bg-ink-3 transition-colors duration-500 group-hover:border-gold/70">
                    <span className="absolute left-1/2 top-4 z-10 h-3 w-3 -translate-x-1/2 rounded-full border border-gold/70 bg-ink" />
                    <div className="relative aspect-[3/4] bg-[radial-gradient(60%_50%_at_50%_50%,rgba(211,149,47,0.16),transparent)]">
                      {first && <GarmentArt look={first} className="absolute inset-x-0 bottom-2 top-8 m-auto h-[85%] w-auto" title={`${c.title}: ${first.title}`} />}
                    </div>
                    <div className="border-t border-line px-4 py-4 text-center sm:px-5">
                      <p className="font-caps text-[0.58rem] tracking-[0.3em] text-gold">{c.kicker}</p>
                      <h3 className="mt-2 font-display text-2xl text-bone sm:text-[1.7rem]">{c.title}</h3>
                      <p className="mt-1 text-xs text-mute">{looksIn(c.slug).length} looks</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── The Fitting Room ───────────────────── */}
      <section className="relative border-y border-line bg-ink-2/80">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-24 sm:px-8 md:grid-cols-2 md:py-32">
          <div data-stitch="left" data-stitch-y="0.15">
            <p className="kicker">The Fitting Room</p>
            <h2 className="mt-4 font-display text-5xl font-light leading-tight text-bone md:text-6xl">
              From the first line
              <br />
              <em className="gold-text">to the final stitch.</em>
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-mute">
              Drag the needle to watch <span className="text-bone">{featured.title}</span> come to life: sketch, fabric,
              fitting and finish. This is how every Olivet piece is made: slowly, by hand, for one person.
            </p>
            <Link href={`/looks/${featured.slug}`} className="btn-ghost mt-10">
              See {featured.title}
            </Link>
          </div>
          <FittingRoom look={featured} />
        </div>
      </section>

      {/* ── Swatch drawer ──────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-8 md:py-36">
        <div className="mb-12 grid gap-6 md:grid-cols-2 md:items-end" data-stitch="right" data-stitch-y="0.3">
          <div>
            <p className="kicker">The Swatch Drawer</p>
            <h2 className="mt-4 font-display text-5xl font-light text-bone md:text-6xl">Choose by feel</h2>
          </div>
          <p className="max-w-md leading-relaxed text-mute md:justify-self-end">
            Some people start with a silhouette. Others start with a fabric they can&apos;t stop touching. Pull a swatch to
            see everything made from it.
          </p>
        </div>
        <SwatchDrawer />
      </section>

      {/* ── Process ────────────────────────────── */}
      <section className="relative mx-auto max-w-6xl px-4 pb-24 sm:px-8 md:pb-36">
        <div className="mb-16 text-center">
          <p className="kicker">The Atelier Way</p>
          <h2 className="mt-4 font-display text-5xl font-light text-bone md:text-6xl">How your piece is made</h2>
        </div>
        <ol className="space-y-6 md:space-y-0">
          {process.map((s, i) => (
            <li key={s.n} className={`reveal md:flex ${i % 2 ? "md:justify-end" : ""}`}>
              <div
                data-stitch={i % 2 ? "left" : "right"}
                data-stitch-y="0.5"
                className="relative rounded-[1.5rem] border border-line bg-ink-3/90 p-7 backdrop-blur md:w-[46%] md:p-9"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="gold-text font-display text-5xl italic">{s.n}</span>
                  <span className="font-caps text-[0.6rem] tracking-[0.3em] text-mute">{s.when}</span>
                </div>
                <h3 className="mt-4 font-display text-3xl text-bone">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-mute">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Discover ───────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-8 md:pb-36">
        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/style-finder" className="group relative overflow-hidden rounded-[2rem] border border-line bg-ink-3 p-8 transition-colors duration-500 hover:border-gold/60 md:p-12" data-stitch="center" data-stitch-y="0">
            <p className="kicker">Style Finder</p>
            <h3 className="mt-4 max-w-sm font-display text-4xl font-light text-bone md:text-5xl">Not sure what you want yet?</h3>
            <p className="mt-4 max-w-sm text-mute">Four quick questions. We&apos;ll find the looks that were made for you.</p>
            <span className="btn-ghost mt-8">Find my style</span>
            <svg className="absolute -bottom-10 -right-10 h-56 w-56 text-gold/10 transition-transform duration-[1.2s] group-hover:rotate-12" viewBox="0 0 100 100" fill="none" stroke="currentColor" aria-hidden="true">
              <circle cx="50" cy="50" r="40" />
              <circle cx="50" cy="50" r="28" />
              <circle cx="50" cy="50" r="16" />
            </svg>
          </Link>
          <Link href="/collections" className="group relative overflow-hidden rounded-[2rem] border border-line bg-ink-3 p-8 transition-colors duration-500 hover:border-gold/60 md:p-12">
            <p className="kicker">Wear it · AI fitting</p>
            <h3 className="mt-4 max-w-sm font-display text-4xl font-light text-bone md:text-5xl">See it on you before it&apos;s made.</h3>
            <p className="mt-4 max-w-sm text-mute">
              Upload a photo and preview a look on yourself with our virtual fitting room. Then book it in one tap.
            </p>
            <span className="btn-ghost mt-8">Choose a look</span>
            <svg className="absolute -bottom-6 -right-4 h-56 w-40 text-gold/10 transition-transform duration-[1.2s] group-hover:-translate-y-2" viewBox="0 0 60 100" fill="none" stroke="currentColor" aria-hidden="true">
              <rect x="4" y="4" width="52" height="92" rx="26" />
              <rect x="12" y="12" width="36" height="76" rx="18" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── The thread ties off ────────────────── */}
      <section className="relative overflow-hidden border-t border-line">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[36rem] w-[60rem] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(211,149,47,0.14),transparent)]" />
        <div className="relative mx-auto max-w-3xl px-6 py-28 text-center md:py-40">
          <svg data-stitch="center" data-stitch-y="0.1" className="mx-auto h-16 w-24 text-gold" viewBox="0 0 96 64" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
            <path d="M48 6 C 48 20 30 22 22 34 C 14 46 30 58 42 46 C 50 38 46 30 48 30 C 50 30 46 38 54 46 C 66 58 82 46 74 34 C 66 22 48 20 48 6" />
          </svg>
          <h2 className="mt-8 font-display text-6xl font-light leading-none text-bone md:text-8xl">
            Let&apos;s make <em className="gold-text">yours.</em>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-mute">
            Tell us about your occasion. We&apos;ll reply within one working day to plan your consultation.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/book" className="btn-gold">
              Book a consultation
            </Link>
            <a href={whatsappLink("Hello Olivet Apparel ✨ I'd love to book a consultation.")} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp us
            </a>
          </div>
        </div>
      </section>
    </ThreadStage>
  );
}
