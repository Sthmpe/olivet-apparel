"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { submitBooking, type BookingState } from "@/app/book/actions";
import { BUDGETS, CONTACTS, FITS, OCCASIONS } from "@/lib/booking";
import { getLook, looks as allLooks, type Look } from "@/content/looks";
import { whatsappLink } from "@/content/site";
import { compressImage } from "@/lib/compress";
import { GarmentArt } from "@/components/garment/GarmentArt";
import { WhatsAppIcon } from "@/components/layout/WhatsAppFab";

const input =
  "w-full rounded-xl border border-line bg-ink-3 px-4 py-3.5 text-bone placeholder:text-mute/60 transition-colors focus:border-gold focus:outline-none";
const label = "mb-2 block text-[0.72rem] uppercase tracking-[0.18em] text-bone/80";

function Section({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <fieldset className="border-t border-line pt-8">
      <legend className="flex items-baseline gap-4">
        <span className="gold-text font-display text-3xl italic">{n}</span>
        <span className="font-display text-3xl text-bone">{title}</span>
      </legend>
      <div className="mt-6 space-y-5">{children}</div>
    </fieldset>
  );
}

function weeksUntil(date: string) {
  const ms = new Date(date + "T12:00:00").getTime() - Date.now();
  return Math.floor(ms / (7 * 24 * 3600 * 1000));
}

export function BookingForm() {
  const params = useSearchParams();
  const initialLooks = (params.get("look") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => getLook(s));
  const style = params.get("style") ?? "";
  const first = initialLooks[0] ? getLook(initialLooks[0]) : undefined;

  const [state, action, pending] = useActionState<BookingState, FormData>(submitBooking, { status: "idle" });
  const [selected, setSelected] = useState<string[]>(initialLooks);
  const [name, setName] = useState("");
  const [occasion, setOccasion] = useState<string>(first?.occasion ?? "");
  const [date, setDate] = useState("");
  const [fit, setFit] = useState<string>("unsure");
  const [pickerOpen, setPickerOpen] = useState(initialLooks.length === 0);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const startedRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (startedRef.current) startedRef.current.value = String(Date.now());
  }, []);

  const chosen = selected.map((s) => getLook(s)).filter(Boolean) as Look[];
  const lead = Math.max(0, ...chosen.map((l) => l.leadWeeks), occasion === "bridal" ? 10 : occasion ? 3 : 0);
  const weeks = date ? weeksUntil(date) : null;
  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const toggle = (slug: string) => setSelected((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug].slice(-6)));

  async function onFiles(list: FileList | null) {
    if (!list || !fileRef.current) return;
    const files = Array.from(list).slice(0, 3);
    const small = await Promise.all(files.map((f) => compressImage(f, 1400).catch(() => f)));
    const dt = new DataTransfer();
    small.forEach((f) => dt.items.add(f));
    fileRef.current.files = dt.files;
    previews.forEach((p) => URL.revokeObjectURL(p));
    setPreviews(small.map((f) => URL.createObjectURL(f)));
  }

  if (state.status === "sent") {
    return (
      <div className="rise mt-14 grid items-center gap-12 md:grid-cols-[1fr_1fr]">
        <div>
          <p className="kicker">Request received</p>
          <h2 className="mt-4 font-display text-5xl font-light text-bone md:text-6xl">
            Thank you{name ? `, ${name.split(" ")[0]}` : ""}. <em className="gold-text">We got your request.</em>
          </h2>
          {state.delivered ? (
            <p className="mt-6 max-w-md text-mute">
              We will contact you within one working day. For a faster reply, send your request on WhatsApp too.
            </p>
          ) : (
            <p className="mt-6 max-w-md text-gold-light">
              One last step: tap the button below to send your request to us on WhatsApp.
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-4">
            <a href={whatsappLink(state.brief)} target="_blank" rel="noopener noreferrer" className="btn-gold">
              <WhatsAppIcon className="h-4 w-4" /> Send on WhatsApp
            </a>
            <Link href="/collections" className="btn-ghost">
              See more styles
            </Link>
          </div>
        </div>
        <Ticket reference={state.reference} name={name} occasion={occasion} date={date} looks={chosen} stamped />
      </div>
    );
  }

  const err = state.status === "error" ? state.errors ?? {} : {};

  return (
    <form action={action} className="mt-14 grid gap-14 lg:grid-cols-[1.25fr_1fr]" noValidate={false}>
      <div className="min-w-0 space-y-12">
        <input type="hidden" name="looks" value={selected.join(",")} />
        <input type="hidden" name="style" value={style} />
        <input ref={startedRef} type="hidden" name="started" defaultValue="0" />
        <div className="hidden" aria-hidden="true">
          <label>
            Company <input name="company" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <Section n="1" title="Your style">
          {chosen.length > 0 && (
            <ul className="flex flex-wrap gap-3">
              {chosen.map((l) => (
                <li key={l.slug} className="flex items-center gap-3 rounded-full border border-gold/50 bg-gold/5 py-1.5 pl-1.5 pr-3">
                  <span className="art-well flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
                    <GarmentArt look={l} className="h-9 w-auto" />
                  </span>
                  <span className="text-sm text-bone">{l.title}</span>
                  <button type="button" onClick={() => toggle(l.slug)} className="ml-1 text-mute hover:text-gold-light" aria-label={`Remove ${l.title}`}>
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button type="button" onClick={() => setPickerOpen((o) => !o)} className="text-sm text-gold underline-offset-4 hover:underline" aria-expanded={pickerOpen}>
            {pickerOpen ? "Hide styles" : chosen.length ? "+ Add another style" : "+ Choose from our styles"}
          </button>
          {pickerOpen && (
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] sm:mx-0 sm:px-0">
              {allLooks.map((l) => {
                const on = selected.includes(l.slug);
                return (
                  <button
                    key={l.slug}
                    type="button"
                    onClick={() => toggle(l.slug)}
                    aria-pressed={on}
                    className={`flex w-28 shrink-0 flex-col items-center rounded-2xl border p-2 transition-colors ${on ? "border-gold bg-gold/10" : "border-line hover:border-gold/50"}`}
                  >
                    <span className="on-dark art-well flex w-full justify-center rounded-xl py-1">
                      <GarmentArt look={l} className="h-28 w-auto" />
                    </span>
                    <span className="mt-1 text-center text-xs leading-tight text-bone/85">{l.title}</span>
                  </button>
                );
              })}
            </div>
          )}
          <div>
            <span className={label}>Inspiration photos (optional, up to 3)</span>
            <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-line px-4 py-4 transition-colors hover:border-gold/60">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-gold">+</span>
              <span className="text-sm text-mute">Add photos of styles or fabrics you like</span>
              <input ref={fileRef} type="file" name="inspiration" accept="image/*" multiple className="sr-only" onChange={(e) => onFiles(e.target.files)} />
            </label>
            {previews.length > 0 && (
              <div className="mt-3 flex gap-3">
                {previews.map((p) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={p} src={p} alt="Inspiration preview" className="h-20 w-16 rounded-lg object-cover" />
                ))}
              </div>
            )}
          </div>
        </Section>

        <Section n="2" title="Your occasion">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="occasion">
                Occasion
              </label>
              <select id="occasion" name="occasion" required className={input} value={occasion} onChange={(e) => setOccasion(e.target.value)}>
                <option value="" disabled>
                  Choose one
                </option>
                {OCCASIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="eventDate">
                Event date
              </label>
              <input id="eventDate" name="eventDate" type="date" min={minDate} className={input} value={date} onChange={(e) => setDate(e.target.value)} />
              {err.eventDate && <p className="mt-2 text-sm text-gold-light">{err.eventDate}</p>}
            </div>
          </div>
          {weeks !== null && (
            <p className={`rounded-xl border px-4 py-3 text-sm ${weeks >= lead ? "border-line text-bone/85" : "border-gold/50 bg-gold/5 text-gold-light"}`} aria-live="polite">
              {weeks < 0
                ? "That date has passed. Please pick a future date."
                : weeks >= lead
                  ? `Your event is ${weeks} week${weeks === 1 ? "" : "s"} away: lovely timing${lead ? ` (we need about ${lead})` : ""}.`
                  : `Your event is ${weeks} week${weeks === 1 ? "" : "s"} away. That's tight for ${chosen.length ? "this style" : "this occasion"} (usually ${lead}+ weeks), but tell us and we'll see what's possible.`}
            </p>
          )}
          <div>
            <span className={label}>Delivery</span>
            <div className="flex flex-wrap gap-3">
              {[
                ["pickup", "I'll collect from the studio"],
                ["delivery", "Please deliver to me"],
              ].map(([v, l], i) => (
                <label key={v} className="flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm has-[:checked]:border-gold has-[:checked]:text-gold-light">
                  <input type="radio" name="delivery" value={v} defaultChecked={i === 0} className="accent-[#d3952f]" />
                  {l}
                </label>
              ))}
            </div>
          </div>
        </Section>

        <Section n="3" title="Measurements">
          <div className="grid gap-3 sm:grid-cols-3">
            {FITS.map((f) => (
              <label key={f.value} className="cursor-pointer rounded-2xl border border-line p-4 transition-colors has-[:checked]:border-gold has-[:checked]:bg-gold/5">
                <input type="radio" name="fit" value={f.value} checked={fit === f.value} onChange={() => setFit(f.value)} className="sr-only" />
                <span className="block font-display text-xl text-bone">{f.label}</span>
                <span className="mt-1 block text-xs text-mute">{f.hint}</span>
              </label>
            ))}
          </div>
          {fit === "send_measurements" && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                ["bust", "Bust"],
                ["waist", "Waist"],
                ["hips", "Hips"],
                ["shoulder", "Shoulder"],
                ["length", "Full length"],
                ["height", "Height"],
              ].map(([k, l]) => (
                <div key={k}>
                  <label className={label} htmlFor={`m_${k}`}>
                    {l}
                  </label>
                  <input id={`m_${k}`} name={`m_${k}`} inputMode="decimal" placeholder="inches" className={input} />
                </div>
              ))}
              <p className="col-span-full text-xs text-mute">Not sure how to measure? Leave it, and we&apos;ll guide you on a quick video call.</p>
            </div>
          )}
          <div>
            <label className={label} htmlFor="budget">
              Budget
            </label>
            <select id="budget" name="budget" className={input} defaultValue="Not sure yet">
              {BUDGETS.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>
        </Section>

        <Section n="4" title="Your details">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={label} htmlFor="fullName">
                Full name
              </label>
              <input id="fullName" name="fullName" required autoComplete="name" className={input} value={name} onChange={(e) => setName(e.target.value)} aria-invalid={Boolean(err.fullName)} />
              {err.fullName && <p className="mt-2 text-sm text-gold-light">{err.fullName}</p>}
            </div>
            <div>
              <label className={label} htmlFor="phone">
                Phone / WhatsApp
              </label>
              <input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="+234…" className={input} aria-invalid={Boolean(err.phone)} />
              {err.phone && <p className="mt-2 text-sm text-gold-light">{err.phone}</p>}
            </div>
            <div>
              <label className={label} htmlFor="email">
                Email (optional)
              </label>
              <input id="email" name="email" type="email" autoComplete="email" className={input} aria-invalid={Boolean(err.email)} />
              {err.email && <p className="mt-2 text-sm text-gold-light">{err.email}</p>}
            </div>
          </div>
          <div>
            <span className={label}>Best way to reach you</span>
            <div className="flex flex-wrap gap-3">
              {CONTACTS.map((c, i) => (
                <label key={c.value} className="flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm has-[:checked]:border-gold has-[:checked]:text-gold-light">
                  <input type="radio" name="preferredContact" value={c.value} defaultChecked={i === 0} className="accent-[#d3952f]" />
                  {c.label}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className={label} htmlFor="notes">
              Anything else? (optional)
            </label>
            <textarea id="notes" name="notes" rows={4} className={input} placeholder="Colours, changes to the style, anything we should know" />
          </div>
        </Section>

        {state.status === "error" && (
          <p role="alert" className="rounded-xl border border-gold/50 bg-gold/5 px-4 py-3 text-sm text-gold-light">
            {state.message}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-5 border-t border-line pt-8">
          <button type="submit" className="btn-gold disabled:opacity-60" disabled={pending}>
            {pending ? "Sending…" : "Send my request"}
          </button>
          <p className="text-xs text-mute">No payment now. We reply within one working day.</p>
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="sticky top-28">
          <Ticket name={name} occasion={occasion} date={date} looks={chosen} />
        </div>
      </div>
    </form>
  );
}

/** A couture garment ticket that fills in as you type. */
function Ticket({
  reference,
  name,
  occasion,
  date,
  looks,
  stamped,
}: {
  reference?: string;
  name: string;
  occasion: string;
  date: string;
  looks: Look[];
  stamped?: boolean;
}) {
  const occ = OCCASIONS.find((o) => o.value === occasion)?.label;
  const hero = looks[0];
  return (
    <div className="relative mx-auto max-w-sm">
      <span className="absolute -top-10 left-1/2 h-10 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-gold" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-t-[999px] rounded-b-[1.75rem] border border-gold/50 bg-ink-3 shadow-xl">
        <span className="absolute left-1/2 top-5 z-10 h-4 w-4 -translate-x-1/2 rounded-full border border-gold bg-ink" aria-hidden="true" />
        <div className="on-dark art-well flex aspect-[4/3] items-end justify-center pt-10">
          {hero ? (
            <GarmentArt key={hero.slug} look={hero} className="h-[92%] w-auto" />
          ) : (
            <p className="mb-10 px-10 text-center font-display text-xl italic text-mute">Your style will appear here</p>
          )}
        </div>
        <div className="space-y-4 border-t border-dashed border-gold/40 p-6">
          <p className="font-caps text-[0.6rem] tracking-[0.4em] text-gold">Olivet Apparel order</p>
          {[
            ["Made for", name || "…"],
            ["Occasion", occ ?? "…"],
            ["Date", date ? new Date(date + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "…"],
            ["Style", looks.length ? looks.map((l) => l.title).join(", ") : "Custom design"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
              <span className="text-[0.65rem] uppercase tracking-[0.2em] text-mute">{k}</span>
              <span className="text-right font-display text-xl text-bone">{v}</span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[0.65rem] uppercase tracking-[0.2em] text-mute">No.</span>
            <span className="font-caps tracking-[0.2em] text-gold-light">{reference ?? "OA-·····"}</span>
          </div>
        </div>
        {stamped && (
          <span className="absolute right-6 top-24 rotate-[-14deg] rounded-full border-2 border-gold px-4 py-2 font-caps text-xs tracking-[0.3em] text-gold-light">
            Received
          </span>
        )}
      </div>
    </div>
  );
}
