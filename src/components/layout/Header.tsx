"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/content/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  if (pathname.startsWith("/studio")) return null;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open ? "border-b border-line bg-ink/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8 md:h-20">
        <Link href="/" className="group flex items-center gap-3" aria-label="Olivet Apparel, home" onClick={() => setOpen(false)}>
          <Image src="/brand/mark.png" alt="" width={44} height={35} className="h-8 w-auto transition-transform duration-500 group-hover:rotate-[-4deg] md:h-9" priority />
          <span className="leading-none">
            <span className="block font-caps text-[1.05rem] tracking-[0.28em] text-bone">OLIVET</span>
            <span className="block font-caps text-[0.55rem] tracking-[0.62em] text-gold">APPAREL</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Main">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-[0.78rem] uppercase tracking-[0.2em] transition-colors hover:text-gold-light ${
                  active ? "text-gold-light" : "text-bone/80"
                }`}
              >
                {item.label}
                <span className={`absolute -bottom-2 left-0 h-px bg-gold transition-all duration-500 ${active ? "w-full" : "w-0"}`} />
              </Link>
            );
          })}
          <Link href="/book" className="btn-gold !px-5 !py-3">
            Book
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
          <span className={`absolute h-px w-6 bg-gold transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1.5"}`} />
          <span className={`absolute h-px w-6 bg-gold transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1.5"}`} />
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`fixed inset-x-0 top-16 bottom-0 bg-ink transition-opacity duration-500 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        hidden={!open}
      >
        <nav className="flex h-full flex-col justify-center gap-8 px-8" aria-label="Mobile">
          {[{ href: "/", label: "Home" }, ...nav].map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="font-display text-5xl italic text-bone transition-colors hover:text-gold-light"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/book" onClick={() => setOpen(false)} className="btn-gold mt-6 self-start">
            Book a consultation
          </Link>
        </nav>
      </div>
    </header>
  );
}
