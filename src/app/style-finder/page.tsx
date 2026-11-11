import type { Metadata } from "next";
import { StyleFinder } from "@/components/style-finder/StyleFinder";

export const metadata: Metadata = {
  title: "Find my style",
  description: "Answer four quick questions to find the Olivet Apparel styles that suit you.",
};

export default function StyleFinderPage() {
  return <StyleFinder />;
}
