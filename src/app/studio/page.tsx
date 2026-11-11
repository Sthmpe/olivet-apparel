import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { connection } from "next/server";
import { isSignedIn, studioConfigured } from "@/lib/studio-auth";
import { ensureSchema, hasDatabase, sql } from "@/lib/db";
import { hasEmail } from "@/lib/email";
import { getLook } from "@/content/looks";
import { OCCASIONS, STATUSES, labelFor } from "@/lib/booking";
import { signOut, updateBooking } from "./actions";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Studio", robots: { index: false, follow: false } };

type Row = {
  id: number;
  reference: string;
  full_name: string;
  email: string | null;
  phone: string;
  preferred_contact: string;
  occasion: string | null;
  event_date: Date | null;
  fit: string;
  measurements: Record<string, string> | null;
  delivery: string | null;
  budget_range: string | null;
  notes: string | null;
  look_slugs: string[];
  style_finder: string | null;
  attachment_count: number;
  status: string;
  admin_notes: string | null;
  emailed_at: Date | null;
  created_at: Date;
};

const statusLabel = (s: string) => s.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase());

export default function StudioPage() {
  return (
    <div className="min-h-dvh bg-ink">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <div className="flex items-center gap-3">
          <Image src="/brand/mark.png" alt="" width={44} height={35} className="h-9 w-auto" />
          <div>
            <p className="font-caps tracking-[0.3em] text-bone">THE STUDIO</p>
            <p className="text-xs text-mute">Olivet Apparel · private</p>
          </div>
        </div>
        <Suspense fallback={<p className="mt-16 text-mute">Opening the studio…</p>}>
          <StudioContent />
        </Suspense>
      </div>
    </div>
  );
}

async function StudioContent() {
  await connection(); // read env + cookies per request, never at build time
  if (!studioConfigured()) {
    return (
      <Notice title="The studio isn't set up yet">
        Add a <code className="text-gold-light">STUDIO_PASSWORD</code> environment variable on Vercel, then redeploy.
      </Notice>
    );
  }
  if (!(await isSignedIn())) return <LoginForm />;

  const status = (
    <div className="flex flex-wrap gap-3 text-xs">
      <span className={`rounded-full border px-3 py-1 ${hasDatabase() ? "border-gold/50 text-gold-light" : "border-line text-mute"}`}>
        Database {hasDatabase() ? "connected" : "not connected"}
      </span>
      <span className={`rounded-full border px-3 py-1 ${hasEmail() ? "border-gold/50 text-gold-light" : "border-line text-mute"}`}>
        Email alerts {hasEmail() ? "on" : "off"}
      </span>
      <form action={signOut}>
        <button className="rounded-full border border-line px-3 py-1 text-mute hover:border-gold hover:text-gold-light">Sign out</button>
      </form>
    </div>
  );

  if (!hasDatabase()) {
    return (
      <div className="mt-10 space-y-6">
        {status}
        <Notice title="Connect a database to keep a booking inbox">
          Add a <code className="text-gold-light">DATABASE_URL</code> (free Neon or Supabase Postgres) on Vercel. Bookings still
          reach you by email and WhatsApp in the meantime.
        </Notice>
      </div>
    );
  }

  await ensureSchema();
  const rows = (await sql()`select * from bookings order by created_at desc limit 200`) as unknown as Row[];
  const counts = STATUSES.map((s) => [s, rows.filter((r) => r.status === s).length] as const);

  return (
    <div className="mt-10">
      {status}
      <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {counts.map(([s, n]) => (
          <div key={s} className="rounded-2xl border border-line bg-ink-3 p-4">
            <p className="font-display text-3xl text-bone">{n}</p>
            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-mute">{statusLabel(s)}</p>
          </div>
        ))}
      </div>

      <h1 className="mt-12 font-display text-4xl text-bone">Booking requests</h1>
      {rows.length === 0 ? (
        <p className="mt-6 text-mute">No bookings yet. They&apos;ll appear here the moment someone books.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {rows.map((r) => (
            <li key={r.id} className="rounded-[1.5rem] border border-line bg-ink-3 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-caps text-xs tracking-[0.25em] text-gold">{r.reference}</p>
                  <h2 className="mt-1 font-display text-3xl text-bone">{r.full_name}</h2>
                  <p className="mt-1 text-sm text-mute">
                    {labelFor(OCCASIONS, r.occasion ?? "other")}
                    {r.event_date ? ` · ${new Date(r.event_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}` : ""} · received{" "}
                    {new Date(r.created_at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    className="btn-gold !px-4 !py-2.5"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://wa.me/${r.phone.replace(/\D/g, "").replace(/^0/, "234")}?text=${encodeURIComponent(`Hello ${r.full_name.split(" ")[0]}, thank you for booking with Olivet Apparel (${r.reference}) ✨`)}`}
                  >
                    WhatsApp
                  </a>
                  <a className="btn-ghost !px-4 !py-2.5" href={`tel:${r.phone}`}>
                    Call
                  </a>
                  {r.email && (
                    <a className="btn-ghost !px-4 !py-2.5" href={`mailto:${r.email}?subject=${encodeURIComponent(`Your Olivet Apparel booking ${r.reference}`)}`}>
                      Email
                    </a>
                  )}
                </div>
              </div>
              <dl className="mt-5 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
                {[
                  ["Phone", r.phone],
                  ["Email", r.email],
                  ["Prefers", r.preferred_contact],
                  ["Looks", r.look_slugs.map((s) => getLook(s)?.title ?? s).join(", ")],
                  ["Fit", r.fit.replaceAll("_", " ")],
                  ["Measurements", r.measurements ? Object.entries(r.measurements).map(([k, v]) => `${k} ${v}`).join(" · ") : null],
                  ["Delivery", r.delivery],
                  ["Budget", r.budget_range],
                  ["Style Finder", r.style_finder?.replaceAll("|", ", ")],
                  ["Photos", r.attachment_count ? `${r.attachment_count} (sent by email)` : null],
                ]
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="flex gap-3 border-b border-line py-1.5">
                      <dt className="w-28 shrink-0 text-xs uppercase tracking-[0.15em] text-gold/80">{k}</dt>
                      <dd className="text-bone/90">{v}</dd>
                    </div>
                  ))}
              </dl>
              {r.notes && <p className="mt-4 rounded-xl bg-ink p-4 text-sm italic text-bone/85">&ldquo;{r.notes}&rdquo;</p>}
              <form action={updateBooking} className="mt-5 flex flex-wrap items-end gap-3">
                <input type="hidden" name="id" value={r.id} />
                <label className="text-xs text-mute">
                  Status
                  <select name="status" defaultValue={r.status} className="mt-1 block rounded-xl border border-line bg-ink px-3 py-2 text-sm text-bone">
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {statusLabel(s)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="min-w-[14rem] flex-1 text-xs text-mute">
                  Private notes
                  <input name="admin_notes" defaultValue={r.admin_notes ?? ""} className="mt-1 block w-full rounded-xl border border-line bg-ink px-3 py-2 text-sm text-bone" />
                </label>
                <button className="btn-ghost !px-4 !py-2.5">Save</button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-10 max-w-xl rounded-[1.5rem] border border-line bg-ink-3 p-8">
      <h1 className="font-display text-3xl text-bone">{title}</h1>
      <p className="mt-3 text-mute">{children}</p>
    </div>
  );
}
