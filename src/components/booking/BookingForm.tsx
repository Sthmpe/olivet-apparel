"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useRef, useState, type ReactNode } from "react";
import { sendBookingRequest, type BookingFormState } from "@/app/book/actions";
import { BUDGETS, CONTACT_METHODS, REQUEST_KINDS, type RequestKind } from "@/domain/booking";
import { CATEGORIES, isCategoryId } from "@/domain/catalog";
import { formatNaira, type Course } from "@/domain/courses";
import { site, whatsappLink } from "@/content/site";
import { emailRequest, mailtoLink } from "@/infrastructure/notify/formsubmit";
import { compressImage } from "@/components/ui/compress-image";
import { WhatsAppIcon } from "@/components/layout/WhatsAppButton";

const label = "mb-2 block text-sm font-medium text-fg";

function Field({ id, title, error, children }: { id: string; title: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className={label}>
        {title}
      </label>
      {children}
      {error && (
        <p className="mt-2 text-sm text-red-700 dark:text-red-300" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function BookingForm({ courses, photoUploads }: { courses: Course[]; photoUploads: boolean }) {
  const params = useSearchParams();
  const initialKind: RequestKind = params.get("kind") === "class" || params.get("course") ? "class" : "outfit";
  const initialCategory = params.get("category");
  const style = params.get("style") ?? "";

  const [state, action, pending] = useActionState<BookingFormState, FormData>(sendBookingRequest, { status: "idle" });
  const [kind, setKind] = useState<RequestKind>(initialKind);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);
  const [emailed, setEmailed] = useState<"idle" | "sent" | "failed">("idle");
  const fileInput = useRef<HTMLInputElement>(null);

  // Deliver the request to the studio inbox for free, once, when it succeeds.
  useEffect(() => {
    if (state.status !== "sent" || !site.bookingEmail || emailed !== "idle") return;
    emailRequest(site.bookingEmail, `New request ${state.reference} from ${name}`, state.brief, email || null).then((ok) => setEmailed(ok ? "sent" : "failed"));
  }, [state, name, email, emailed]);

  async function onPhotos(list: FileList | null) {
    if (!list || !fileInput.current) return;
    const small = await Promise.all(Array.from(list).slice(0, 3).map((f) => compressImage(f, 1400).catch(() => f)));
    const transfer = new DataTransfer();
    small.forEach((f) => transfer.items.add(f));
    fileInput.current.files = transfer.files;
    previews.forEach((p) => URL.revokeObjectURL(p));
    setPreviews(small.map((f) => URL.createObjectURL(f)));
  }

  if (state.status === "sent") {
    const subject = `Request ${state.reference} from the Olivet Apparel website`;
    return (
      <div className="rounded-3xl bg-panel p-8 sm:p-10">
        <p className="eyebrow">Request {state.reference}</p>
        <h2 className="mt-3 font-display text-4xl text-fg md:text-5xl">Thank you{name ? `, ${name.split(" ")[0]}` : ""}.</h2>
        <p className="mt-4 max-w-lg text-muted">
          {emailed === "sent" || state.stored
            ? "Your request has reached us. For the fastest reply, also send it on WhatsApp."
            : "One last step: send your request to us on WhatsApp or by email so it reaches the studio."}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={whatsappLink(state.brief)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <WhatsAppIcon className="h-4 w-4" /> Send on WhatsApp
          </a>
          <a href={mailtoLink(site.bookingEmail || site.email, subject, state.brief)} className="btn btn-secondary">
            Send by email
          </a>
        </div>
        <Link href="/portfolio" className="mt-8 inline-block text-sm text-gold hover:underline">
          Back to the portfolio
        </Link>
      </div>
    );
  }

  const errors = state.status === "invalid" ? state.errors : {};

  return (
    <form action={action} className="space-y-8">
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="styleRef" value={style} />
      <div className="hidden" aria-hidden="true">
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <fieldset>
        <legend className={label}>I would like</legend>
        <div className="grid grid-cols-2 gap-2 rounded-full bg-card p-1.5">
          {REQUEST_KINDS.map((k) => (
            <button
              key={k.value}
              type="button"
              onClick={() => setKind(k.value)}
              aria-pressed={kind === k.value}
              className={`rounded-full py-3 text-sm font-medium transition-colors ${kind === k.value ? "bg-fg text-page" : "text-fg/70 hover:text-fg"}`}
            >
              {k.label}
            </button>
          ))}
        </div>
      </fieldset>

      {kind === "outfit" ? (
        <>
          {style && (
            <p className="rounded-2xl bg-card px-4 py-3 text-sm text-fg">
              Style: <strong className="font-medium">{style}</strong>
            </p>
          )}
          <fieldset>
            <legend className={label}>What is it for?</legend>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <label key={c.id} className="cursor-pointer">
                  <input type="radio" name="category" value={c.id} defaultChecked={isCategoryId(initialCategory) ? initialCategory === c.id : false} className="peer sr-only" />
                  <span className="block rounded-full bg-card px-4 py-2.5 text-sm text-fg/80 transition-colors peer-checked:bg-fg peer-checked:text-page peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-gold">
                    {c.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field id="eventDate" title="Event date (optional)" error={errors.eventDate}>
              <input id="eventDate" name="eventDate" type="date" className="field" />
            </Field>
            <Field id="budget" title="Budget">
              <select id="budget" name="budget" className="field" defaultValue="Not sure yet">
                {BUDGETS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </Field>
          </div>
          {photoUploads && (
            <div>
              <span className={label}>Photos of styles you like (optional, up to 3)</span>
              <label className="flex cursor-pointer items-center gap-4 rounded-2xl bg-card px-4 py-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-panel text-xl text-gold">+</span>
                <span className="text-sm text-muted">Screenshots, saved pictures or fabric photos</span>
                <input ref={fileInput} type="file" name="inspiration" accept="image/*" multiple className="sr-only" onChange={(e) => onPhotos(e.target.files)} />
              </label>
              {previews.length > 0 && (
                <div className="mt-3 flex gap-3">
                  {previews.map((p) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={p} src={p} alt="Selected photo" className="h-20 w-16 rounded-xl object-cover" />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <Field id="courseId" title="Which class?" error={errors.courseId}>
          <select id="courseId" name="courseId" className="field" defaultValue={params.get("course") ?? ""}>
            <option value="" disabled>
              Choose a class
            </option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.format === "online" ? "online" : "in the studio"}) · {formatNaira(c.priceNaira)}
              </option>
            ))}
          </select>
        </Field>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field id="fullName" title="Your name" error={errors.fullName}>
            <input id="fullName" name="fullName" autoComplete="name" className="field" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
        </div>
        <Field id="phone" title="Phone or WhatsApp" error={errors.phone}>
          <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+234" className="field" />
        </Field>
        <Field id="email" title="Email (optional)" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
      </div>

      <fieldset>
        <legend className={label}>Best way to reach you</legend>
        <div className="flex flex-wrap gap-2">
          {CONTACT_METHODS.map((c, i) => (
            <label key={c.value} className="cursor-pointer">
              <input type="radio" name="contactMethod" value={c.value} defaultChecked={i === 0} className="peer sr-only" />
              <span className="block rounded-full bg-card px-4 py-2.5 text-sm text-fg/80 transition-colors peer-checked:bg-fg peer-checked:text-page">{c.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field id="notes" title="Anything else? (optional)">
        <textarea id="notes" name="notes" rows={4} className="field" placeholder={kind === "outfit" ? "Colours, fabric, or changes you would like" : "Your sewing experience so far"} />
      </Field>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Sending" : "Send request"}
        </button>
        <p className="text-sm text-muted">No payment now.</p>
      </div>
    </form>
  );
}
