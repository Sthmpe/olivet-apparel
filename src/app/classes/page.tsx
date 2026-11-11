import type { Metadata } from "next";
import Link from "next/link";
import { courses, classPerks } from "@/content/courses";
import { site, whatsappLink } from "@/content/site";
import { PageHeader } from "@/components/ui/PageHeader";
import { CourseList } from "@/components/classes/CourseList";
import { WhatsAppIcon } from "@/components/layout/WhatsAppButton";

export const metadata: Metadata = {
  title: "Sewing classes",
  description: "Learn to sew with Olivet Apparel: foundation, pattern drafting and bridal corsetry classes, in Lagos or online.",
};

export default function ClassesPage() {
  return (
    <>
      <PageHeader eyebrow="Classes" title={<>Learn to sew, <em className="gold-text">step by step.</em></>}>
        Practical, hands-on classes with {site.designer}. Start with Foundation, then move to Intermediate and Advanced. Join
        us in the studio or learn online at your own pace.
      </PageHeader>

      <section className="mx-auto max-w-7xl px-4 sm:px-8">
        <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-fg/85">
          {classPerks.map((perk) => (
            <li key={perk} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              {perk}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-8 md:py-16">
        <CourseList courses={courses} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-panel p-8 sm:p-10 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-3xl text-fg md:text-4xl">Not sure which class to take?</h2>
            <p className="mt-2 text-muted">Message us and we will help you choose the right level.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={whatsappLink("Hello Olivet Apparel, I would like help choosing a sewing class.")} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
            </a>
            <Link href="/book?kind=class" className="btn btn-secondary">
              Enrol online
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
