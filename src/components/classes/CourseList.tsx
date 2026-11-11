"use client";

import { useState } from "react";
import { coursesByFormat, type Course, type CourseFormat } from "@/domain/courses";
import { CourseCard } from "./CourseCard";

const FILTERS: { value: CourseFormat | null; label: string }[] = [
  { value: null, label: "All classes" },
  { value: "in-person", label: "In the studio" },
  { value: "online", label: "Online" },
];

export function CourseList({ courses }: { courses: Course[] }) {
  const [format, setFormat] = useState<CourseFormat | null>(null);
  const shown = coursesByFormat(courses, format);
  return (
    <>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter classes">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={() => setFormat(f.value)}
            aria-pressed={format === f.value}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${format === f.value ? "bg-fg text-page" : "bg-card text-fg/80 hover:text-gold"}`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((c) => (
          <CourseCard key={c.id} course={c} detailed />
        ))}
      </div>
    </>
  );
}
