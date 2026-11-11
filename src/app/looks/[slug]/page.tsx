import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FittingRoom } from "@/components/garment/FittingRoom";
import { LookCard } from "@/components/garment/LookCard";
import { TryOn } from "@/components/tryon/TryOn";
import { WhatsAppIcon } from "@/components/layout/WhatsAppFab";
import { getCollection, getLook, looks, occasions, relatedLooks } from "@/content/looks";
import { getFabric } from "@/content/fabrics";
import { whatsappLink } from "@/content/site";

export function generateStaticParams() {
  return looks.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/looks/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const l = getLook(slug);
  return l ? { title: l.title, description: l.story } : {};
}

const silhouetteName: Record<string, string> = {
  ballgown: "Ball gown",
  aline: "A-line",
  mermaid: "Mermaid",
  column: "Column",
  suit: "Two-piece suit",
  jumpsuit: "Jumpsuit",
  kaftan: "Kaftan",
  twopiece: "Crop top & skirt",
};

export default async function LookPage({ params }: PageProps<"/looks/[slug]">) {
  const { slug } = await params;
  const look = getLook(slug);
  if (!look) notFound();
  const col = getCollection(look.collection)!;
  const related = relatedLooks(look);
  const occasion = occasions.find((o) => o.id === look.occasion)!.label;

  const specs = [
    ["Occasion", occasion],
    ["Silhouette", silhouetteName[look.silhouette]],
    ["Fabric", look.fabrics.map((f) => getFabric(f).name).join(", ")],
    ["Lead time", `From ${look.leadWeeks} weeks`],
    ["Made", "To your measurements"],
  ];

  return (
    <>
      <section className="relative overflow-hidden pt-28 md:pt-32">
        <div className="pointer-events-none absolute -left-40 top-20 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(closest-side,rgba(211,149,47,0.12),transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
          <nav aria-label="Breadcrumb" className="text-xs tracking-wide text-mute">
            <Link href="/collections" className="hover:text-gold-light">
              Collections
            </Link>
            <span className="mx-2 text-gold/50">/</span>
            <Link href={`/collections/${col.slug}`} className="hover:text-gold-light">
              {col.title}
            </Link>
            <span className="mx-2 text-gold/50">/</span>
            <span className="text-bone/80">{look.title}</span>
          </nav>

          <div className="mt-8 grid items-start gap-14 pb-24 md:grid-cols-[1fr_1fr] md:gap-20">
            <div className="md:sticky md:top-28">
              <FittingRoom look={look} />
            </div>

            <div>
              <p className="kicker">{col.title}</p>
              <h1 className="mt-4 font-display text-6xl font-light leading-none text-bone md:text-7xl">{look.title}</h1>
              <p className="mt-8 font-display text-2xl font-light italic leading-snug text-bone/85">{look.story}</p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link href={`/book?look=${look.slug}`} className="btn-gold">
                  Book this look
                </Link>
                <TryOn slug={look.slug} title={look.title} ready={Boolean(look.tryOnGarment)} />
              </div>
              <a
                href={whatsappLink(`Hello Olivet Apparel ✨ I'm interested in "${look.title}" (${col.title}). Could you tell me more?`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm text-mute transition-colors hover:text-gold-light"
              >
                <WhatsAppIcon className="h-4 w-4" /> Ask about this look on WhatsApp
              </a>

              <dl className="mt-12 divide-y divide-line border-y border-line">
                {specs.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[8rem_1fr] gap-4 py-4 text-sm">
                    <dt className="font-caps text-[0.62rem] tracking-[0.25em] text-gold">{k}</dt>
                    <dd className="text-bone/90">{v}</dd>
                  </div>
                ))}
              </dl>

              <h2 className="mt-12 kicker">The details</h2>
              <ul className="mt-5 space-y-3">
                {look.details.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-bone/85">
                    <span className="mt-2.5 h-px w-5 shrink-0 bg-gold" />
                    {d}
                  </li>
                ))}
              </ul>

              <div className="mt-12 rounded-[1.5rem] border border-line bg-ink-3 p-6">
                <p className="font-display text-2xl text-bone">Make it yours</p>
                <p className="mt-2 text-sm leading-relaxed text-mute">
                  Every Olivet piece can be adapted: a different colour, a sleeve, a longer train, a modest neckline. Tell us
                  in your booking and we&apos;ll sketch the changes with you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-ink-2/60">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-8">
          <p className="kicker">You may also love</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((l) => (
              <LookCard key={l.slug} look={l} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
