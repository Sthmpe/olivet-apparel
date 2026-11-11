import Link from "next/link";
import { fabrics } from "@/content/fabrics";
import { looks } from "@/content/looks";
import { Swatch } from "@/components/garment/Swatch";

export function SwatchDrawer() {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0 [scrollbar-width:none]">
      <ul className="flex min-w-max items-end gap-3 pt-6 sm:gap-4 lg:min-w-0 lg:justify-between">
        {fabrics.map((f) => {
          const count = looks.filter((l) => l.fabrics.includes(f.id)).length;
          return (
            <li key={f.id}>
              <Link
                href={`/styles?fabric=${f.id}`}
                className="group flex w-28 flex-col items-center sm:w-32"
                aria-label={`${f.name}: ${f.feel}. ${count} styles`}
              >
                <span className="relative block h-44 w-full overflow-hidden rounded-t-xl border border-b-0 border-edge transition-all duration-500 ease-out group-hover:-translate-y-5 group-hover:border-gold/70 group-hover:shadow-[0_20px_50px_-20px_rgba(211,149,47,0.6)] sm:h-52">
                  <Swatch fabric={f} className="h-full w-full" />
                  <span className="absolute inset-x-0 bottom-0 translate-y-full bg-black/80 px-2 py-2 text-center text-[0.65rem] leading-snug text-white/90 transition-transform duration-500 group-hover:translate-y-0">
                    {f.feel}
                  </span>
                </span>
                <span className="w-full border-t border-gold/40 pt-3 text-center">
                  <span className="block font-display text-xl text-fg">{f.name}</span>
                  <span className="block text-[0.65rem] tracking-wide text-muted">
                    {count} {count === 1 ? "style" : "styles"}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
