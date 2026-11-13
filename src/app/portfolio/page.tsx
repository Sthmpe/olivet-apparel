import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Gallery } from "@/components/portfolio/Gallery";
import { getPortfolio } from "@/infrastructure/portfolio-query";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Bridal, prom, dinner, corporate, everyday, Ankara and trouser styles by Olivet Apparel.",
  alternates: { canonical: "/portfolio" },
};

export default async function PortfolioPage() {
  const photos = await getPortfolio();
  return (
    <>
      <PageHeader eyebrow="Portfolio" title={<>Styles we make, <em className="gold-text">made to fit you.</em></>}>
        Choose a category, open any photo, and book that style in your own measurements and colours.
      </PageHeader>
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-8">
        <Suspense fallback={<div className="h-[60vh]" />}>
          <Gallery photos={photos} />
        </Suspense>
      </section>
    </>
  );
}
