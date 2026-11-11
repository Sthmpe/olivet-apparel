import type { Metadata } from "next";
import { StyleFinder } from "@/components/style-finder/StyleFinder";

export const metadata: Metadata = {
  title: "Style Finder",
  description: "Four quick questions to find the Olivet Apparel looks that were made for you.",
};

export default function StyleFinderPage() {
  return <StyleFinder />;
}
