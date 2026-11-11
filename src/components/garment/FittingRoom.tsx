"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Look, Stage } from "@/content/looks";
import { GarmentArt, STAGE_AT } from "./GarmentArt";

const STAGES: { id: Stage; label: string; note: string }[] = [
  { id: "sketch", label: "Sketch", note: "First, we draw your design." },
  { id: "fabric", label: "Fabric", note: "Then we choose the fabric together." },
  { id: "fitting", label: "Fitting", note: "We fit it on you and adjust." },
  { id: "final", label: "Final", note: "Finished and ready to wear." },
];

function stageOf(p: number): Stage {
  if (p < (STAGE_AT.sketch + STAGE_AT.fabric) / 2) return "sketch";
  if (p < (STAGE_AT.fabric + STAGE_AT.fitting) / 2) return "fabric";
  if (p < (STAGE_AT.fitting + STAGE_AT.final) / 2 + 0.05) return "fitting";
  return "final";
}

/**
 * Sketch-to-finished slider: drag from the first sketch to the finished garment.
 * Uses real photos per stage when the look has them; otherwise the code-drawn sketch.
 */
export function FittingRoom({ look, autoplay = true }: { look: Look; autoplay?: boolean }) {
  const [p, setP] = useState(autoplay ? 0 : 1);
  const touched = useRef(false);
  const box = useRef<HTMLDivElement>(null);
  const stage = stageOf(p);
  const photos = look.images ?? [];

  useEffect(() => {
    if (!autoplay) return;
    let raf = 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      raf = requestAnimationFrame(() => setP(1));
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || touched.current) return;
        io.disconnect();
        const start = performance.now();
        const dur = 4200;
        const tick = (now: number) => {
          if (touched.current) return;
          const t = Math.min(1, (now - start) / dur);
          const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          setP(eased);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.45 },
    );
    if (box.current) io.observe(box.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [autoplay]);

  const go = (v: number) => {
    touched.current = true;
    setP(v);
  };

  const current = STAGES.find((s) => s.id === stage)!;

  return (
    <div ref={box} className="flex flex-col items-center">
      <div className="on-dark art-well relative w-full max-w-md rounded-[2rem] border border-edge p-6">
        {photos.length ? (
          <div className="relative aspect-[24/34] w-full overflow-hidden rounded-[2rem]">
            {STAGES.map((s) => {
              const img = photos.find((ph) => ph.stage === s.id);
              return img ? (
                <Image
                  key={s.id}
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 768px) 28rem, 90vw"
                  className={`object-cover transition-opacity duration-700 ${stage === s.id ? "opacity-100" : "opacity-0"}`}
                />
              ) : null;
            })}
          </div>
        ) : (
          <GarmentArt look={look} progress={p} className="relative w-full" title={`${look.title}: ${current.label.toLowerCase()} stage`} />
        )}
      </div>

      <div className="mt-6 w-full max-w-md">
        <label htmlFor={`fit-${look.slug}`} className="sr-only">
          Move from sketch to finished garment
        </label>
        <input
          id={`fit-${look.slug}`}
          type="range"
          min={0}
          max={1000}
          value={Math.round(p * 1000)}
          onChange={(e) => go(Number(e.target.value) / 1000)}
          className="fitting-range"
          aria-valuetext={current.label}
        />
        <div className="mt-3 grid grid-cols-4 text-center">
          {STAGES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => go(STAGE_AT[s.id])}
              className={`font-caps text-[0.62rem] tracking-[0.25em] transition-colors ${
                stage === s.id ? "text-gold-light" : "text-muted hover:text-fg"
              }`}
              aria-pressed={stage === s.id}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="mt-5 min-h-[3rem] text-center font-display text-xl text-fg" aria-live="polite">
          {current.note}
        </p>
      </div>
    </div>
  );
}
