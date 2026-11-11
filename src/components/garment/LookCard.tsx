import Image from "next/image";
import Link from "next/link";
import type { Look } from "@/content/looks";
import { getCollection } from "@/content/looks";
import { getFabric } from "@/content/fabrics";
import { GarmentArt } from "./GarmentArt";

export function LookCard({ look, priority = false }: { look: Look; priority?: boolean }) {
  const cover = look.images?.find((i) => i.stage === "final");
  const col = getCollection(look.collection);
  return (
    <Link
      href={`/looks/${look.slug}`}
      className="group relative block overflow-hidden rounded-[1.75rem] border border-line bg-ink-3 transition-colors duration-500 hover:border-gold/60"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,rgba(211,149,47,0.14),transparent)] transition-opacity duration-700 group-hover:opacity-150" />
        {cover ? (
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
            className="object-cover transition-transform duration-[1.2s] group-hover:scale-[1.04]"
          />
        ) : (
          <>
            {/* finished piece, crossfades to the sketch on hover */}
            <GarmentArt look={look} progress={1} className="absolute inset-0 m-auto h-[88%] w-auto transition-opacity duration-700 group-hover:opacity-0" />
            <GarmentArt look={look} progress={0.2} title={`${look.title}, sketch`} className="absolute inset-0 m-auto h-[88%] w-auto opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          </>
        )}
        <span className="absolute left-4 top-4 rounded-full border border-line bg-ink/70 px-3 py-1 font-caps text-[0.58rem] tracking-[0.25em] text-gold backdrop-blur">
          {col?.kicker}
        </span>
      </div>
      <div className="flex items-end justify-between gap-4 border-t border-line px-5 py-4">
        <div>
          <h3 className="font-display text-2xl leading-tight text-bone">{look.title}</h3>
          <p className="mt-1 text-xs tracking-wide text-mute">{look.fabrics.map((f) => getFabric(f).name).join(" · ")}</p>
        </div>
        <span className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-gold transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
