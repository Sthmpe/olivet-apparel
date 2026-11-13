import Image from "next/image";
import Link from "next/link";
import { description, navigation, site, socialLinks, whatsappLink } from "@/content/site";

export function Footer() {
  return (
    <footer className="surface-dark">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-8 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Image src="/brand/lockup.png" alt="Olivet Apparel" width={180} height={138} className="h-auto w-36" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">{description}</p>
        </div>
        <div>
          <p className="eyebrow mb-5">Explore</p>
          <ul className="space-y-3 text-sm">
            {navigation.map((n) => (
              <li key={n.href}>
                <Link className="text-fg/80 hover:text-gold-light" href={n.href}>
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link className="text-fg/80 hover:text-gold-light" href="/book">
                Book now
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-5">Contact</p>
          <ul className="space-y-3 text-sm text-fg/80">
            <li>{site.city}</li>
            <li>
              <a className="hover:text-gold-light" href={`tel:+${site.whatsapp}`}>
                {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a className="hover:text-gold-light" href={whatsappLink("Hello Olivet Apparel")} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </li>
            <li>
              <a className="hover:text-gold-light" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            {socialLinks.map((s) => (
              <li key={s.label}>
                <a className="hover:text-gold-light" href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.label} @{s.handle}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 px-4 pb-10 text-xs text-muted sm:flex-row sm:px-8">
        <p>© Olivet Apparel by {site.designer}</p>
        <p>{site.tagline}</p>
      </div>
    </footer>
  );
}
