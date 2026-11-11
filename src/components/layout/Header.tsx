"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation } from "@/content/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (pathname.startsWith("/studio")) return null;

  return (
    <header className="sticky top-0 z-50 bg-page/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8 md:h-20">
        <Link href="/" className="flex items-center gap-3" aria-label="Olivet Apparel, home" onClick={() => setOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0b0a08]">
            <Image src="/brand/mark.png" alt="" width={44} height={35} className="h-6 w-auto" priority />
          </span>
          <span className="leading-none">
            <span className="block font-caps text-[1.02rem] tracking-[0.26em] text-fg">OLIVET</span>
            <span className="mt-0.5 block font-caps text-[0.52rem] tracking-[0.6em] text-gold">APPAREL</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {navigation.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`text-[0.8rem] uppercase tracking-[0.16em] transition-colors hover:text-gold ${active ? "text-gold" : "text-fg/80"}`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link href="/book" className="btn btn-primary !min-h-11 !px-5">
            Book now
          </Link>
        </nav>

        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={`absolute h-0.5 w-6 rounded bg-fg transition-transform ${open ? "rotate-45" : "-translate-y-1.5"}`} />
          <span className={`absolute h-0.5 w-6 rounded bg-fg transition-transform ${open ? "-rotate-45" : "translate-y-1.5"}`} />
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-16 bg-page md:hidden">
          <nav className="flex h-full flex-col gap-2 px-6 pt-10" aria-label="Mobile">
            {[{ href: "/", label: "Home" }, ...navigation].map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="py-2 font-display text-4xl text-fg">
                {item.label}
              </Link>
            ))}
            <Link href="/book" onClick={() => setOpen(false)} className="btn btn-primary mt-8 self-start">
              Book now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
