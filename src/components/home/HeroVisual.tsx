import Image from "next/image";
import type { PortfolioPhoto } from "@/domain/catalog";

/** Hero image area: a three-photo arrangement when the portfolio has photos, the brand mark otherwise. */
export function HeroVisual({ photos }: { photos: PortfolioPhoto[] }) {
  if (photos.length >= 3) {
    const [a, b, c] = photos;
    return (
      <div className="grid h-full grid-cols-2 gap-3 sm:gap-4">
        <div className="relative row-span-2 overflow-hidden rounded-3xl">
          <Image src={a.src} alt={a.alt} fill priority sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
          <Image src={b.src} alt={b.alt} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
          <Image src={c.src} alt={c.alt} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex aspect-[4/5] items-center justify-center rounded-3xl bg-[radial-gradient(70%_60%_at_50%_45%,#2a2110_0%,#0b0a08_75%)] p-10 md:aspect-auto md:h-full">
      <Image
        src="/brand/mark.png"
        alt="Olivet Apparel logo: a gold gown on a dress form inside the letter O, with a needle and thread"
        width={900}
        height={719}
        priority
        className="h-auto w-full max-w-md"
      />
    </div>
  );
}
