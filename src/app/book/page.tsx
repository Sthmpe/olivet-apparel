import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingForm } from "@/components/booking/BookingForm";

export const metadata: Metadata = {
  title: "Book",
  description: "Book a custom outfit with Olivet Apparel. We reply within one working day.",
};

export default function BookPage() {
  return (
    <section className="relative overflow-hidden pt-28 md:pt-36">
      <div className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-8">
        <p className="kicker rise">Book</p>
        <h1 className="rise mt-5 max-w-3xl font-display text-5xl font-light leading-[1.02] text-fg sm:text-6xl md:text-7xl">
          Book <em className="gold-text">your outfit</em>
        </h1>
        <p className="rise mt-6 max-w-xl text-muted">
          Fill this in and we reply within one working day. No payment now.
        </p>
        <Suspense fallback={<div className="mt-14 h-[80vh]" />}>
          <BookingForm />
        </Suspense>
      </div>
    </section>
  );
}
