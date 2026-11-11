import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-8 md:pb-14 md:pt-20">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-4 max-w-4xl font-display text-5xl font-light leading-[1.02] text-fg sm:text-6xl md:text-7xl">{title}</h1>
      {children && <div className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{children}</div>}
    </section>
  );
}
