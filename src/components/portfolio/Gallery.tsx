"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CATEGORIES, filterByCategory, getCategory, isCategoryId, type PortfolioPhoto } from "@/domain/catalog";
import { whatsappLink } from "@/content/site";
import { TryOnDialog } from "@/components/tryon/TryOnDialog";
import { PhotoPlaceholder } from "./PhotoPlaceholder";

export function Gallery({ photos }: { photos: PortfolioPhoto[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const raw = params.get("category");
  const category = isCategoryId(raw) ? raw : null;
  const shown = useMemo(() => filterByCategory(photos, category), [photos, category]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const choose = (id: string | null) => {
    setOpenIndex(null);
    router.replace(id ? `${pathname}?category=${id}` : pathname, { scroll: false });
  };

  const step = useCallback(
    (delta: number) => setOpenIndex((i) => (i === null ? i : (i + delta + shown.length) % shown.length)),
    [shown.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, step]);

  const chip = (active: boolean) =>
    `shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${active ? "bg-fg text-page" : "bg-card text-fg/80 hover:text-gold"}`;

  const open = openIndex === null ? null : shown[openIndex];

  return (
    <>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter by category">
        <button type="button" className={chip(!category)} onClick={() => choose(null)} aria-pressed={!category}>
          All
        </button>
        {CATEGORIES.map((c) => (
          <button key={c.id} type="button" className={chip(category === c.id)} onClick={() => choose(c.id)} aria-pressed={category === c.id}>
            {c.label}
          </button>
        ))}
      </div>

      {shown.length > 0 ? (
        <div className="mt-8 columns-2 gap-3 sm:gap-4 lg:columns-3">
          {shown.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setOpenIndex(i)}
              className="group relative mb-3 block w-full overflow-hidden rounded-2xl sm:mb-4"
              aria-label={`View ${p.title}`}
            >
              <Image
                src={p.src}
                alt={p.alt}
                width={p.width}
                height={p.height}
                sizes="(min-width: 1024px) 30vw, 48vw"
                className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10 text-left opacity-0 transition-opacity group-hover:opacity-100">
                <span className="block font-display text-xl text-white">{p.title}</span>
                <span className="text-xs uppercase tracking-widest text-white/70">{getCategory(p.category).label}</span>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-8 grid gap-6 rounded-3xl bg-panel p-6 sm:grid-cols-[14rem_1fr] sm:items-center sm:p-8">
          <div className="aspect-[3/4] overflow-hidden rounded-2xl">
            <PhotoPlaceholder label={category ? getCategory(category).label : "Portfolio"} />
          </div>
          <div>
            <p className="font-display text-3xl text-fg">New photos are on the way.</p>
            <p className="mt-2 max-w-md text-muted">
              Tell us what you have in mind and we will send you examples of {category ? getCategory(category).label.toLowerCase() : "our"} styles on WhatsApp.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/book${category ? `?category=${category}` : ""}`} className="btn btn-primary">
                Book now
              </Link>
              <a href={whatsappLink("Hello Olivet Apparel, could you send me some examples of your work?")} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-black/95 text-white" role="dialog" aria-modal="true" aria-label={open.title}>
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <p className="text-sm text-white/70">
              {openIndex! + 1} / {shown.length}
            </p>
            <button type="button" onClick={() => setOpenIndex(null)} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10" aria-label="Close">
              ✕
            </button>
          </div>
          <div className="relative min-h-0 flex-1">
            <Image src={open.src} alt={open.alt} fill sizes="100vw" className="object-contain" priority />
            {shown.length > 1 && (
              <>
                <button type="button" onClick={() => step(-1)} className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 sm:left-6" aria-label="Previous photo">
                  ‹
                </button>
                <button type="button" onClick={() => step(1)} className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 sm:right-6" aria-label="Next photo">
                  ›
                </button>
              </>
            )}
          </div>
          <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="font-display text-2xl">{open.title}</p>
              <p className="text-xs uppercase tracking-widest text-white/60">{getCategory(open.category).label}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={`/book?category=${open.category}&style=${encodeURIComponent(open.title)}`} className="btn btn-primary">
                Book this style
              </Link>
              <TryOnDialog photoUrl={open.src} title={open.title} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
