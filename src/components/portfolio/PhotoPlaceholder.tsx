import Image from "next/image";

/** Shown where a category has no photos yet: the brand mark on black. */
export function PhotoPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[radial-gradient(70%_60%_at_50%_45%,#2a2110_0%,#0b0a08_75%)] p-8">
      <Image src="/brand/mark.png" alt="" width={300} height={240} className="h-auto w-1/2 max-w-40 opacity-90" />
      <span className="font-caps text-[0.6rem] tracking-[0.35em] text-[#d6a142]">{label}</span>
    </div>
  );
}
