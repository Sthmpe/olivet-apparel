/** Classes domain: sewing and fashion design courses offered by the studio. */

export type CourseFormat = "in-person" | "online";

export type Course = {
  id: string;
  title: string;
  level: "Foundation" | "Intermediate" | "Advanced";
  format: CourseFormat;
  duration: string;
  priceNaira: number;
  summary: string;
  outcomes: string[];
};

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export function coursesByFormat<T extends Course>(courses: readonly T[], format?: CourseFormat | null): T[] {
  return format ? courses.filter((c) => c.format === format) : [...courses];
}
