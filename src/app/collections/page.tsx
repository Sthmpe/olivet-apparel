import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { CollectionBrowser } from "@/components/collections/CollectionBrowser";

export const metadata: Metadata = {
  title: "Styles",
  description: "Bridal, owambe, evening and everyday styles by Olivet Apparel. Browse by occasion or fabric.",
};

export default function CollectionsPage() {
  return (
    <>
      <PageHero kicker="Styles" title={<>Choose a style. <em className="gold-text">We make it to fit you.</em></>}>
        Filter by occasion or fabric. Any style can be changed to suit you.
      </PageHero>
      <Suspense fallback={<div className="mx-auto h-[60vh] max-w-7xl px-4 sm:px-8" />}>
        <CollectionBrowser />
      </Suspense>
    </>
  );
}
