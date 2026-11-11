import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, coverPhotos, type PortfolioPhoto } from "@/domain/catalog";
import { PhotoPlaceholder } from "./PhotoPlaceholder";

export function CategoryTiles({ photos }: { photos: PortfolioPhoto[] }) {
  const covers = coverPhotos(photos);
  return (
    <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      {CATEGORIES.map((c) => {
        const cover = covers.get(c.id);
        return (
          <Link key={c.id} href={`/portfolio?category=${c.id}`} className="group w-56 shrink-0 snap-start sm:w-64">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
              {cover ? (
                <Image src={cover.src} alt={cover.alt} fill sizes="16rem" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              ) : (
                <PhotoPlaceholder label={c.label} />
              )}
            </div>
            <p className="mt-3 font-display text-2xl text-fg group-hover:text-gold">{c.label}</p>
            <p className="text-sm text-muted">{c.summary}</p>
          </Link>
        );
      })}
    </div>
  );
}
