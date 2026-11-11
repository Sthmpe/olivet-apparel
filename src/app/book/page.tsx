import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingForm } from "@/components/booking/BookingForm";

export const metadata: Metadata = {
  title: "Book a consultation",
  description: "Tell Olivet Apparel about your occasion and the look you love. We reply within one working day.",
};

export default function BookPage() {
  return (
    <section className="relative overflow-hidden pt-28 md:pt-36">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[30rem] w-[56rem] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(211,149,47,0.12),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-8">
        <p className="kicker rise">Book a consultation</p>
        <h1 className="rise mt-5 max-w-3xl font-display text-5xl font-light leading-[1.02] text-bone sm:text-6xl md:text-7xl">
          Let&apos;s begin <em className="gold-text">your sketch.</em>
        </h1>
        <p className="rise mt-6 max-w-xl text-mute">
          Two minutes, no commitment. Tell us about your occasion and what you love, and we&apos;ll reply within one working
          day to plan your consultation.
        </p>
        <Suspense fallback={<div className="mt-14 h-[80vh]" />}>
          <BookingForm />
        </Suspense>
      </div>
    </section>
  );
}
