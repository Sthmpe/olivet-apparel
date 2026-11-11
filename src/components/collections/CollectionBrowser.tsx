"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { looks, occasions, type FabricId, type Occasion } from "@/content/looks";
import { fabrics } from "@/content/fabrics";
import { LookCard } from "@/components/garment/LookCard";
import { Swatch } from "@/components/garment/Swatch";

export function CollectionBrowser() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const occasion = (params.get("occasion") as Occasion | null) ?? null;
  const fabric = (params.get("fabric") as FabricId | null) ?? null;

  const set = (key: "occasion" | "fabric", value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const q = next.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  };

  const shown = useMemo(
    () => looks.filter((l) => (!occasion || l.occasion === occasion) && (!fabric || l.fabrics.includes(fabric))),
    [occasion, fabric],
  );

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 text-[0.72rem] uppercase tracking-[0.18em] transition-colors ${
      active ? "border-gold bg-gold text-ink" : "border-line text-bone/80 hover:border-gold/60 hover:text-gold-light"
    }`;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-28 sm:px-8">
      <div className="sticky top-16 z-30 -mx-4 border-y border-line bg-ink/90 px-4 py-4 backdrop-blur-md sm:mx-0 sm:rounded-full sm:border sm:px-4 md:top-24">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by occasion">
          <button type="button" className={chip(!occasion)} onClick={() => set("occasion", null)} aria-pressed={!occasion}>
            All
          </button>
          {occasions.map((o) => (
            <button key={o.id} type="button" className={chip(occasion === o.id)} onClick={() => set("occasion", occasion === o.id ? null : o.id)} aria-pressed={occasion === o.id}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none]" role="group" aria-label="Filter by fabric">
        {fabrics.map((f) => {
          const active = fabric === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => set("fabric", active ? null : f.id)}
              aria-pressed={active}
              className={`group flex shrink-0 items-center gap-3 rounded-full border py-1.5 pl-1.5 pr-4 transition-colors ${
                active ? "border-gold bg-gold/10" : "border-line hover:border-gold/60"
              }`}
            >
              <span className="block h-8 w-8 overflow-hidden rounded-full">
                <Swatch fabric={f} className="h-full w-full" />
              </span>
              <span className={`text-sm ${active ? "text-gold-light" : "text-bone/80"}`}>{f.name}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-8 text-sm text-mute" aria-live="polite">
        {shown.length} {shown.length === 1 ? "look" : "looks"}
        {fabric || occasion ? (
          <button type="button" className="ml-3 text-gold underline-offset-4 hover:underline" onClick={() => router.replace(pathname, { scroll: false })}>
            Clear filters
          </button>
        ) : null}
      </p>

      {shown.length ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((l, i) => (
            <LookCard key={l.slug} look={l} priority={i < 3} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-[2rem] border border-line p-12 text-center">
          <p className="font-display text-3xl text-bone">Nothing on the rail for that combination yet.</p>
          <p className="mt-3 text-mute">But anything can be made. Tell us what you have in mind.</p>
          <a href="/book" className="btn-gold mt-8">
            Request a custom piece
          </a>
        </div>
      )}
    </section>
  );
}
