import Image from "next/image";
import Link from "next/link";
import { nav, site, whatsappLink } from "@/content/site";
import { collections } from "@/content/looks";

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-ink-2">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Image src="/brand/lockup.png" alt="Olivet Apparel" width={180} height={138} className="h-auto w-40" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-mute">{site.description}</p>
        </div>

        <div>
          <p className="kicker mb-5">Collections</p>
          <ul className="space-y-3 text-sm text-bone/80">
            {collections.map((c) => (
              <li key={c.slug}>
                <Link className="transition-colors hover:text-gold-light" href={`/collections/${c.slug}`}>
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="kicker mb-5">Explore</p>
          <ul className="space-y-3 text-sm text-bone/80">
            {nav.map((n) => (
              <li key={n.href}>
                <Link className="transition-colors hover:text-gold-light" href={n.href}>
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link className="transition-colors hover:text-gold-light" href="/book">
                Book a consultation
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="kicker mb-5">Studio</p>
          <ul className="space-y-3 text-sm text-bone/80">
            <li>{site.city}</li>
            <li>
              <a className="transition-colors hover:text-gold-light" href={`tel:+${site.whatsapp}`}>
                {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a className="transition-colors hover:text-gold-light" href={whatsappLink("Hello Olivet Apparel ✨")} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </li>
            <li>
              <a className="transition-colors hover:text-gold-light" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            <li>
              <a className="transition-colors hover:text-gold-light" href={`https://instagram.com/${site.instagram}`} target="_blank" rel="noopener noreferrer">
                @{site.instagram}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="hairline opacity-40" />
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 py-6 text-xs tracking-wide text-mute sm:flex-row sm:items-center sm:px-8">
        <p>© Olivet Apparel by {site.designer}. Every piece made by hand, for one person.</p>
        <p className="font-caps tracking-[0.3em] text-gold/70">Follow the thread</p>
      </div>
    </footer>
  );
}
