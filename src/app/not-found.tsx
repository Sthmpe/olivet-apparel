import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[80dvh] flex-col items-center justify-center px-6 pt-24 text-center">
      <p className="kicker">404</p>
      <h1 className="mt-4 font-display text-6xl font-light text-fg md:text-7xl">
        Page <em className="gold-text">not found</em>
      </h1>
      <p className="mt-5 max-w-md text-muted">This page does not exist. Try one of these instead.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/" className="btn-gold">
          Back home
        </Link>
        <Link href="/styles" className="btn-ghost">
          See styles
        </Link>
      </div>
    </section>
  );
}
