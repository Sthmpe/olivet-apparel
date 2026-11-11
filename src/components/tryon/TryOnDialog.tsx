"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { compressImage } from "@/components/ui/compress-image";

type State = { s: "idle" } | { s: "working"; preview: string } | { s: "done"; preview: string; result: string } | { s: "error"; message: string };

/**
 * AI try-on. The visitor's photo goes to our own server route, which forwards
 * it to an open-source try-on model with the chosen portfolio photo. Nothing is stored.
 */
export function TryOnDialog({ photoUrl, title }: { photoUrl: string; title: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<State>({ s: "idle" });
  const [consent, setConsent] = useState(false);

  async function onFile(file: File | undefined) {
    if (!file) return;
    try {
      const small = await compressImage(file, 1024);
      const preview = URL.createObjectURL(small);
      setState({ s: "working", preview });
      const body = new FormData();
      body.append("photo", small);
      body.append("photoUrl", photoUrl);
      body.append("title", title);
      const response = await fetch("/api/tryon", { method: "POST", body });
      const data = (await response.json()) as { image?: string; error?: string };
      if (!response.ok || !data.image) throw new Error(data.error ?? "The try-on service is busy right now.");
      setState({ s: "done", preview, result: data.image });
    } catch (error) {
      setState({ s: "error", message: error instanceof Error ? error.message : "Something went wrong." });
    }
  }

  return (
    <>
      <button type="button" className="btn bg-white/10 text-white hover:bg-white/20" onClick={() => dialog.current?.showModal()}>
        Try it on
      </button>
      <dialog
        ref={dialog}
        onClose={() => setState((s) => (s.s === "working" ? s : { s: "idle" }))}
        className="m-auto w-[min(34rem,calc(100vw-2rem))] rounded-3xl bg-page p-0 text-fg backdrop:bg-black/80"
        aria-labelledby="tryon-title"
      >
        <div className="relative p-6 sm:p-8">
          <button type="button" onClick={() => dialog.current?.close()} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-card text-muted" aria-label="Close">
            ✕
          </button>
          <p className="eyebrow">AI try-on</p>
          <h2 id="tryon-title" className="mt-2 pr-10 font-display text-3xl">
            See {title} on you
          </h2>

          {state.s === "idle" || state.s === "error" ? (
            <div className="mt-5 space-y-5">
              <p className="text-muted">Upload a clear, front-facing photo of yourself standing. The preview takes about a minute. Your photo is not stored.</p>
              {state.s === "error" && (
                <p role="alert" className="rounded-2xl bg-card p-4 text-sm">
                  {state.message} Please try again later, or{" "}
                  <Link className="text-gold underline" href="/book">
                    book a consultation
                  </Link>
                  .
                </p>
              )}
              <label className="flex items-start gap-3 text-sm">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 accent-[#b97c1d]" />I agree to my photo being processed by an AI model to create this preview.
              </label>
              <label className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl bg-card p-8 text-center ${consent ? "" : "pointer-events-none opacity-50"}`}>
                <span className="font-display text-2xl">Choose a photo</span>
                <span className="mt-1 text-xs text-muted">From your camera or gallery</span>
                <input type="file" accept="image/*" className="sr-only" disabled={!consent} onChange={(e) => onFile(e.target.files?.[0])} />
              </label>
            </div>
          ) : (
            <div className="mt-5">
              <div className="grid grid-cols-2 gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={state.preview} alt="Your photo" className="aspect-[3/4] w-full rounded-2xl object-cover" />
                {state.s === "done" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={state.result} alt={`AI preview of ${title}`} className="aspect-[3/4] w-full rounded-2xl object-cover" />
                ) : (
                  <div className="flex aspect-[3/4] flex-col items-center justify-center rounded-2xl bg-card">
                    <span className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
                    <p className="mt-4 text-sm text-muted">Creating your preview</p>
                  </div>
                )}
              </div>
              {state.s === "done" && (
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/book" className="btn btn-primary">
                    Book this style
                  </Link>
                  <a href={state.result} download="olivet-try-on.jpg" className="btn btn-secondary">
                    Save preview
                  </a>
                </div>
              )}
              <p className="mt-4 text-xs text-muted">The preview shows the idea. Your outfit is made to your exact measurements.</p>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
