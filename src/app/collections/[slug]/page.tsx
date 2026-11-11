import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { LookCard } from "@/components/garment/LookCard";
import { collections, getCollection, looksIn } from "@/content/looks";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = getCollection(slug);
  return c ? { title: c.title, description: c.intro } : {};
}

export default async function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) notFound();
  const items = looksIn(c.slug);
  const idx = collections.findIndex((x) => x.slug === c.slug);
  const next = collections[(idx + 1) % collections.length];

  return (
    <>
      <PageHero kicker={`${c.kicker} · Collection ${String(idx + 1).padStart(2, "0")}`} title={<em className="gold-text">{c.title}</em>}>
        {c.intro}
      </PageHero>
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((l, i) => (
            <LookCard key={l.slug} look={l} priority={i < 3} />
          ))}
        </div>
      </section>
      <section className="border-t border-line">
        <Link href={`/collections/${next.slug}`} className="group mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-14 sm:px-8">
          <span>
            <span className="kicker">Next collection</span>
            <span className="mt-3 block font-display text-4xl text-bone transition-colors group-hover:text-gold-light md:text-6xl">{next.title}</span>
          </span>
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-line text-gold transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </Link>
      </section>
    </>
  );
}
