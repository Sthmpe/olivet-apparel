import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { BookingForm } from "@/components/booking/BookingForm";
import { courses } from "@/content/courses";
import { features } from "@/infrastructure/container";

export const metadata: Metadata = {
  title: "Book",
  description: "Book a bespoke outfit or a sewing class with Olivet Apparel. We reply within one working day.",
  alternates: { canonical: "/book" },
};

export default function BookPage() {
  return (
    <>
      <PageHeader eyebrow="Book" title={<>Tell us what <em className="gold-text">you need.</em></>}>
        It takes two minutes. We reply within one working day, and there is nothing to pay now.
      </PageHeader>
      <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-8">
        <Suspense fallback={<div className="h-[70vh]" />}>
          <BookingForm courses={courses} photoUploads={features.photoUploads()} />
        </Suspense>
      </section>
    </>
  );
}
