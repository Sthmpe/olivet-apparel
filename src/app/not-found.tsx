import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[80dvh] flex-col items-center justify-center px-6 pt-24 text-center">
      <p className="kicker">404</p>
      <h1 className="mt-4 font-display text-6xl font-light text-bone md:text-7xl">
        We&apos;ve lost <em className="gold-text">the thread.</em>
      </h1>
      <p className="mt-5 max-w-md text-mute">This page has gone back to the cutting table. Let&apos;s take you somewhere beautiful.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/" className="btn-gold">
          Back home
        </Link>
        <Link href="/collections" className="btn-ghost">
          The collections
        </Link>
      </div>
    </section>
  );
}
