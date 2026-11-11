import type { ReactNode } from "react";

export function PageHero({ kicker, title, children }: { kicker: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden pt-32 md:pt-40">
      <div className="relative mx-auto max-w-7xl px-4 pb-12 sm:px-8 md:pb-16">
        <p className="kicker rise">{kicker}</p>
        <h1 className="rise mt-5 max-w-4xl font-display text-5xl font-light leading-[1.02] text-fg sm:text-6xl md:text-7xl" style={{ animationDelay: "100ms" }}>
          {title}
        </h1>
        {children && (
          <div className="rise mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg" style={{ animationDelay: "200ms" }}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
