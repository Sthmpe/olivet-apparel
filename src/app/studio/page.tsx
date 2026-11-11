import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { BOOKING_STATUSES, whatsappLinkTo } from "@/domain/booking";
import { getCategory } from "@/domain/catalog";
import { courses } from "@/content/courses";
import { isSignedIn, studioConfigured } from "@/infrastructure/auth/studio-session";
import { bookingRepository, features } from "@/infrastructure/container";
import { getPortfolio } from "@/infrastructure/portfolio-query";
import { deletePhoto, signOut, updateRequest } from "./actions";
import { LoginForm } from "./LoginForm";
import { PhotoUploader } from "./PhotoUploader";

export const metadata: Metadata = { title: "Studio", robots: { index: false, follow: false } };

const statusLabel = (s: string) => s.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase());

export default function StudioPage() {
  return (
    <div className="mx-auto min-h-dvh max-w-6xl px-4 py-10 sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0b0a08]">
            <Image src="/brand/mark.png" alt="" width={44} height={35} className="h-6 w-auto" />
          </span>
          <span>
            <span className="block font-caps tracking-[0.3em] text-fg">STUDIO</span>
            <span className="block text-xs text-muted">Olivet Apparel</span>
          </span>
        </Link>
      </div>
      <Suspense fallback={<p className="mt-16 text-muted">Opening the studio</p>}>
        <StudioContent />
      </Suspense>
    </div>
  );
}

async function StudioContent() {
  await connection(); // read cookies and settings per request, never at build time
  if (!studioConfigured()) return <Notice title="The studio is not set up yet">Add a STUDIO_PASSWORD environment variable on Vercel, then redeploy.</Notice>;
  if (!(await isSignedIn())) return <LoginForm />;

  return (
    <div className="mt-10 space-y-16">
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="rounded-full bg-card px-3 py-1.5">Photo uploads {features.photoUploads() ? "on" : "off"}</span>
        <span className="rounded-full bg-card px-3 py-1.5">Request inbox {features.database() ? "on" : "off"}</span>
        <form action={signOut}>
          <button className="rounded-full bg-card px-3 py-1.5 text-muted hover:text-gold">Sign out</button>
        </form>
      </div>
      <PhotosSection />
      <RequestsSection />
    </div>
  );
}

async function PhotosSection() {
  const uploads = (await getPortfolio()).filter((p) => p.origin === "studio");
  return (
    <section>
      <h2 className="font-display text-4xl text-fg">Portfolio photos</h2>
      <p className="mt-2 text-muted">Photos appear on the website straight away. Faceless and mannequin shots work best.</p>
      <div className="mt-6">
        {features.photoUploads() ? <PhotoUploader /> : <Notice title="Photo storage is off">Connect a Vercel Blob store to this project to upload photos.</Notice>}
      </div>
      {uploads.length > 0 && (
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {uploads.map((p) => (
            <li key={p.id} className="overflow-hidden rounded-2xl bg-card">
              <div className="relative aspect-[3/4]">
                <Image src={p.src} alt={p.alt} fill sizes="16rem" className="object-cover" />
              </div>
              <div className="flex items-center justify-between gap-2 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-fg">{p.title}</p>
                  <p className="text-xs text-muted">{getCategory(p.category).label}</p>
                </div>
                <form action={deletePhoto}>
                  <input type="hidden" name="url" value={p.src} />
                  <input type="hidden" name="pathname" value={p.id} />
                  <button className="rounded-full bg-page px-3 py-1.5 text-xs text-muted hover:text-red-600" aria-label={`Delete ${p.title}`}>
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

async function RequestsSection() {
  const repository = bookingRepository();
  if (!repository) {
    return (
      <section>
        <h2 className="font-display text-4xl text-fg">Requests</h2>
        <Notice title="Requests arrive by WhatsApp and email">Connect a Postgres database (free on Neon) to also keep every request here.</Notice>
      </section>
    );
  }
  const requests = await repository.list(200);
  return (
    <section>
      <h2 className="font-display text-4xl text-fg">Requests</h2>
      {requests.length === 0 ? (
        <p className="mt-3 text-muted">No requests yet.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {requests.map((r) => (
            <li key={r.id} className="rounded-3xl bg-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gold">{r.reference}</p>
                  <h3 className="mt-1 font-display text-3xl text-fg">{r.fullName}</h3>
                  <p className="text-sm text-muted">
                    {r.kind === "class" ? courses.find((c) => c.id === r.courseId)?.title ?? "Class" : r.category ? getCategory(r.category).label : "Outfit"}
                    {r.eventDate ? ` · ${r.eventDate}` : ""} · {r.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a className="btn btn-primary !min-h-10 !px-4" target="_blank" rel="noopener noreferrer" href={whatsappLinkTo(r.phone, `Hello ${r.fullName.split(" ")[0]}, thank you for contacting Olivet Apparel (${r.reference}).`)}>
                    WhatsApp
                  </a>
                  <a className="btn btn-secondary !min-h-10 !bg-page !px-4" href={`tel:${r.phone}`}>
                    Call
                  </a>
                </div>
              </div>
              <dl className="mt-4 grid gap-x-8 gap-y-1 text-sm sm:grid-cols-2">
                {[
                  ["Phone", r.phone],
                  ["Email", r.email],
                  ["Style", r.styleRef],
                  ["Budget", r.kind === "outfit" ? r.budget : null],
                  ["Notes", r.notes],
                ]
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="flex gap-3">
                      <dt className="w-16 shrink-0 text-muted">{k}</dt>
                      <dd className="text-fg">{v}</dd>
                    </div>
                  ))}
              </dl>
              {r.inspirationUrls.length > 0 && (
                <div className="mt-4 flex gap-2">
                  {r.inspirationUrls.map((u) => (
                    <a key={u} href={u} target="_blank" rel="noopener noreferrer" className="relative block h-20 w-16 overflow-hidden rounded-xl">
                      <Image src={u} alt="Client inspiration photo" fill sizes="4rem" className="object-cover" />
                    </a>
                  ))}
                </div>
              )}
              <form action={updateRequest} className="mt-5 flex flex-wrap items-end gap-3">
                <input type="hidden" name="id" value={r.id} />
                <select name="status" defaultValue={r.status} className="field !min-h-10 !w-auto !bg-page !py-2 text-sm" aria-label="Status">
                  {BOOKING_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {statusLabel(s)}
                    </option>
                  ))}
                </select>
                <input name="adminNotes" defaultValue={r.adminNotes ?? ""} placeholder="Private notes" className="field !min-h-10 !bg-page !py-2 text-sm sm:flex-1" aria-label="Private notes" />
                <button className="btn btn-secondary !min-h-10 !bg-page !px-4">Save</button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 max-w-xl rounded-3xl bg-card p-6">
      <p className="font-display text-2xl text-fg">{title}</p>
      <p className="mt-2 text-muted">{children}</p>
    </div>
  );
}
