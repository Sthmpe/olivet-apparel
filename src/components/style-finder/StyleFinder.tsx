"use client";

import Link from "next/link";
import { useState } from "react";
import { matchLooks, type Answers } from "@/lib/style-finder";
import { GarmentArt } from "@/components/garment/GarmentArt";
import { getLook } from "@/content/looks";

type Q = {
  key: keyof Answers;
  title: string;
  options: { value: string; label: string; hint: string; colors?: string[]; look?: string }[];
};

const questions: Q[] = [
  {
    key: "occasion",
    title: "What are we dressing you for?",
    options: [
      { value: "bridal", label: "My wedding", hint: "The aisle, the reception, the moment", look: "the-aurelia" },
      { value: "celebration", label: "A party", hint: "Owambe, birthdays, asoebi", look: "royal-ember" },
      { value: "evening", label: "An evening", hint: "Galas, dinners, red carpets", look: "midnight-gilt" },
      { value: "everyday", label: "Everyday life", hint: "Work, church, weekends", look: "the-directress" },
    ],
  },
  {
    key: "shape",
    title: "Which shape feels like you?",
    options: [
      { value: "sculpted", label: "Sculpted", hint: "Fitted, structured, statuesque", look: "seraphine" },
      { value: "flowing", label: "Flowing", hint: "Volume, movement, drama", look: "velvet-hour" },
      { value: "separates", label: "Separates", hint: "Two pieces, sharp and modern", look: "adire-bloom" },
    ],
  },
  {
    key: "mood",
    title: "Pick a colour mood.",
    options: [
      { value: "light", label: "Ivory & champagne", hint: "Soft, luminous, timeless", colors: ["#fffaf0", "#efe3c8", "#d9b46a"] },
      { value: "jewel", label: "Jewel tones", hint: "Emerald, wine, indigo", colors: ["#14684d", "#7d1d31", "#21397a"] },
      { value: "dark", label: "Midnight & gold", hint: "Black, plum, liquid gold", colors: ["#0a0a0a", "#4b1748", "#d3952f"] },
      { value: "earth", label: "Earth & spice", hint: "Camel, rust, mustard", colors: ["#a87b47", "#a8481f", "#c98a12"] },
    ],
  },
  {
    key: "feel",
    title: "How should it feel on your skin?",
    options: [
      { value: "fluid", label: "Fluid", hint: "Silk, crepe, velvet" },
      { value: "heritage", label: "Heritage", hint: "Aso-oke, adire, ankara" },
      { value: "light", label: "Light-catching", hint: "Lace, sequin, organza" },
    ],
  },
];

export function StyleFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const done = step >= questions.length;
  const q = questions[Math.min(step, questions.length - 1)];

  const choose = (value: string) => {
    setAnswers((a) => ({ ...a, [q.key]: value }));
    setStep((s) => s + 1);
  };

  const results = done ? matchLooks(answers) : [];
  const styleParam = Object.entries(answers)
    .map(([k, v]) => `${k}:${v}`)
    .join("|");
  const signature = [
    questions[0].options.find((o) => o.value === answers.occasion)?.label,
    questions[1].options.find((o) => o.value === answers.shape)?.label,
    questions[2].options.find((o) => o.value === answers.mood)?.label,
    questions[3].options.find((o) => o.value === answers.feel)?.label,
  ].filter(Boolean);

  return (
    <section className="relative min-h-dvh overflow-hidden pt-28 md:pt-36">
      <div className="relative mx-auto max-w-6xl px-4 pb-24 sm:px-8">
        {/* progress thread */}
        <div className="flex items-center gap-2" aria-hidden="true">
          {questions.map((_, i) => (
            <span key={i} className="relative h-px flex-1 bg-edge">
              <span className="absolute inset-y-0 left-0 bg-gold transition-all duration-700" style={{ width: i < step ? "100%" : "0%" }} />
            </span>
          ))}
        </div>
        <p className="kicker mt-6">{done ? "Your matches" : `Question ${step + 1} of ${questions.length}`}</p>

        {!done ? (
          <div key={step} className="rise">
            <h1 className="mt-4 font-display text-5xl font-light text-fg md:text-6xl">{q.title}</h1>
            <div className={`mt-12 grid gap-4 sm:grid-cols-2 ${q.options.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
              {q.options.map((o) => {
                const look = o.look ? getLook(o.look) : undefined;
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => choose(o.value)}
                    className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-edge bg-card text-left transition-all duration-500 hover:-translate-y-1 hover:border-gold/70"
                  >
                    <span className="on-dark art-well relative flex aspect-[4/3] items-center justify-center">
                      {look ? (
                        <GarmentArt look={look} progress={0.2} className="h-[85%] w-auto transition-opacity duration-500 group-hover:opacity-0" />
                      ) : o.colors ? (
                        <span className="flex -space-x-4">
                          {o.colors.map((c) => (
                            <span key={c} className="h-16 w-16 rounded-full border border-gold/40 transition-transform duration-500 group-hover:scale-110" style={{ background: c }} />
                          ))}
                        </span>
                      ) : (
                        <span className="font-display text-7xl italic text-gold/30 transition-colors group-hover:text-gold/70">{o.label[0]}</span>
                      )}
                      {look && <GarmentArt look={look} progress={1} className="absolute inset-0 m-auto h-[85%] w-auto opacity-0 transition-opacity duration-500 group-hover:opacity-100" />}
                    </span>
                    <span className="border-t border-edge p-5">
                      <span className="block font-display text-2xl text-fg">{o.label}</span>
                      <span className="mt-1 block text-sm text-muted">{o.hint}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            {step > 0 && (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="mt-10 text-sm text-muted hover:text-gold-light">
                ← Back
              </button>
            )}
          </div>
        ) : (
          <div className="rise">
            <h1 className="mt-4 font-display text-5xl font-light leading-tight text-fg md:text-6xl">
              {signature.map((s, i) => (
                <span key={s}>
                  {i > 0 && <span className="mx-3 text-gold/50">·</span>}
                  {i % 2 ? <em className="gold-text">{s}</em> : s}
                </span>
              ))}
            </h1>
            <p className="mt-6 max-w-xl text-muted">These styles match your answers. Any of them can be changed to suit you.</p>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {results.map(({ look, pct }, i) => (
                <Link
                  key={look.slug}
                  href={`/looks/${look.slug}`}
                  className="group relative overflow-hidden rounded-[1.75rem] border border-edge bg-card transition-colors hover:border-gold/70"
                >
                  <span className="absolute right-4 top-4 z-10 rounded-full border border-gold/50 bg-black/70 px-3 py-1 text-xs text-[#fada81]">{pct}% match</span>
                  {i === 0 && <span className="absolute left-4 top-4 z-10 font-caps text-[0.6rem] tracking-[0.3em] text-[#fada81]">Best match</span>}
                  <span className="on-dark art-well flex aspect-[4/5] items-center justify-center">
                    <GarmentArt look={look} className="h-[86%] w-auto" />
                  </span>
                  <span className="block border-t border-edge p-5">
                    <span className="block font-display text-2xl text-fg">{look.title}</span>
                    <span className="mt-1 block text-sm text-muted">{look.story.split(".")[0]}.</span>
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link href={`/book?look=${results.map((r) => r.look.slug).join(",")}&style=${encodeURIComponent(styleParam)}`} className="btn-gold">
                Book one of these
              </Link>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setAnswers({});
                  setStep(0);
                }}
              >
                Start again
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
