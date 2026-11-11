import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { CollectionBrowser } from "@/components/collections/CollectionBrowser";

export const metadata: Metadata = {
  title: "Collections",
  description: "Bridal, celebration, evening and everyday couture by Olivet Apparel. Browse by occasion or by fabric.",
};

export default function CollectionsPage() {
  return (
    <>
      <PageHero
        kicker="The Collections"
        title={
          <>
            Every look, <em className="gold-text">one thread.</em>
          </>
        }
      >
        Browse by occasion, or pull a fabric from the drawer. Every piece can be made to your measurements, in your colours.
      </PageHero>
      <Suspense fallback={<div className="mx-auto h-[60vh] max-w-7xl px-4 sm:px-8" />}>
        <CollectionBrowser />
      </Suspense>
    </>
  );
}
