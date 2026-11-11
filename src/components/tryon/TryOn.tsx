"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { compressImage } from "@/lib/compress";

type State =
  | { s: "idle" }
  | { s: "working"; preview: string }
  | { s: "done"; preview: string; result: string }
  | { s: "error"; message: string; preview?: string };

/**
 * "Wear it": virtual try-on. Sends the visitor's photo to our own server route,
 * which forwards it to an open-source try-on model. Photos are not stored.
 */
export function TryOn({ slug, title, ready }: { slug: string; title: string; ready: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<State>({ s: "idle" });
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const d = dialog.current;
    const onClose = () => setState((st) => (st.s === "working" ? st : { s: "idle" }));
    d?.addEventListener("close", onClose);
    return () => d?.removeEventListener("close", onClose);
  }, []);

  async function onFile(file: File | undefined) {
    if (!file) return;
    try {
      const small = await compressImage(file, 1024);
      const preview = URL.createObjectURL(small);
      setState({ s: "working", preview });
      const fd = new FormData();
      fd.append("photo", small);
      fd.append("slug", slug);
      const res = await fetch("/api/tryon", { method: "POST", body: fd });
      const data = (await res.json()) as { image?: string; error?: string };
      if (!res.ok || !data.image) throw new Error(data.error ?? "The fitting room is busy right now.");
      setState({ s: "done", preview, result: data.image });
    } catch (e) {
      setState({ s: "error", message: e instanceof Error ? e.message : "Something went wrong." });
    }
  }

  return (
    <>
      <button type="button" className="btn-ghost" onClick={() => dialog.current?.showModal()}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M12 3l1.8 4.6L18 9l-4.2 1.4L12 15l-1.8-4.6L6 9l4.2-1.4z" />
          <path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
        </svg>
        Wear it · AI try-on
      </button>

      <dialog
        ref={dialog}
        className="m-auto w-[min(36rem,calc(100vw-2rem))] rounded-[2rem] border border-line bg-ink-2 p-0 text-bone backdrop:bg-black/80 backdrop:backdrop-blur-sm"
        aria-labelledby="tryon-title"
      >
        <div className="relative p-7 sm:p-9">
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-line text-mute hover:border-gold hover:text-gold-light"
            aria-label="Close"
          >
            ✕
          </button>
          <p className="kicker">Virtual fitting room</p>
          <h2 id="tryon-title" className="mt-3 pr-10 font-display text-4xl font-light">
            Wear <em className="gold-text">{title}</em>
          </h2>

          {!ready ? (
            <div className="mt-6 space-y-4 text-mute">
              <p>
                {title} is being photographed for the virtual fitting room. Once its garment photo is in, you&apos;ll be able
                to see it on yourself right here.
              </p>
              <p>
                Can&apos;t wait? Book a consultation and we&apos;ll sketch {title} on your silhouette, in your colours.
              </p>
              <Link href={`/book?look=${slug}`} className="btn-gold mt-2">
                Book this look
              </Link>
            </div>
          ) : state.s === "idle" || state.s === "error" ? (
            <div className="mt-6">
              <p className="text-mute">
                Upload a clear, front-facing photo, standing, with good light. It takes about a minute. Your photo is used
                only to create the preview and is not stored.
              </p>
              {state.s === "error" && (
                <p role="alert" className="mt-4 rounded-xl border border-gold/40 bg-gold/5 p-4 text-sm text-gold-light">
                  {state.message} Try again shortly, or{" "}
                  <Link className="underline" href={`/book?look=${slug}`}>
                    book and we&apos;ll style it for you
                  </Link>
                  .
                </p>
              )}
              <label className="mt-6 flex items-start gap-3 text-sm text-bone/85">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 accent-[#d3952f]" />
                I agree to my photo being processed by an AI model to create this preview.
              </label>
              <label
                className={`mt-6 flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed p-10 text-center transition-colors ${
                  consent ? "border-gold/60 hover:bg-gold/5" : "pointer-events-none border-line opacity-50"
                }`}
              >
                <span className="font-display text-2xl">Choose a photo</span>
                <span className="mt-1 text-xs text-mute">JPG or PNG · from your camera or gallery</span>
                <input type="file" accept="image/*" className="sr-only" disabled={!consent} onChange={(e) => onFile(e.target.files?.[0])} />
              </label>
            </div>
          ) : (
            <div className="mt-6">
              <div className="grid grid-cols-2 gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={state.preview} alt="Your photo" className="aspect-[3/4] w-full rounded-2xl object-cover opacity-80" />
                {state.s === "done" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={state.result} alt={`You wearing ${title}: AI preview`} className="aspect-[3/4] w-full rounded-2xl object-cover" />
                ) : (
                  <div className="flex aspect-[3/4] w-full flex-col items-center justify-center rounded-2xl border border-line">
                    <svg viewBox="0 0 40 40" className="h-12 w-12 animate-spin text-gold [animation-duration:2.4s]" fill="none" stroke="currentColor" aria-hidden="true">
                      <circle cx="20" cy="20" r="16" strokeDasharray="4 6" />
                    </svg>
                    <p className="mt-4 font-display text-xl italic">Stitching your look…</p>
                    <p className="mt-1 px-4 text-center text-xs text-mute">Usually under a minute</p>
                  </div>
                )}
              </div>
              {state.s === "done" && (
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={`/book?look=${slug}`} className="btn-gold">
                    Book this look
                  </Link>
                  <a href={state.result} download={`olivet-${slug}-preview.jpg`} className="btn-ghost">
                    Save preview
                  </a>
                </div>
              )}
              <p className="mt-4 text-xs text-mute">AI previews show the idea, not the final fit. Your piece is made to your exact measurements.</p>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
