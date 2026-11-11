import Link from "next/link";
import { formatNaira, type Course } from "@/domain/courses";

export function CourseCard({ course, detailed = false }: { course: Course; detailed?: boolean }) {
  return (
    <article className="flex flex-col rounded-3xl bg-card p-6 sm:p-7">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted">
        <span>{course.level}</span>
        <span aria-hidden="true">·</span>
        <span>{course.format === "online" ? "Online" : "In the studio"}</span>
      </div>
      <h3 className="mt-3 font-display text-3xl leading-tight text-fg">{course.title}</h3>
      <p className="mt-2 text-muted">{course.summary}</p>
      {detailed && (
        <ul className="mt-5 space-y-2 text-sm text-fg/85">
          {course.outcomes.map((o) => (
            <li key={o} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              {o}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto flex items-end justify-between gap-4 pt-6">
        <div>
          <p className="font-display text-3xl text-gold">{formatNaira(course.priceNaira)}</p>
          <p className="text-xs text-muted">{course.duration}</p>
        </div>
        <Link href={`/book?kind=class&course=${course.id}`} className="btn btn-primary !min-h-11 !px-5">
          Enrol
        </Link>
      </div>
    </article>
  );
}
