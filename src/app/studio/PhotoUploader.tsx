"use client";

import { useActionState, useRef, useState } from "react";
import { CATEGORIES } from "@/domain/catalog";
import { compressImage } from "@/components/ui/compress-image";
import { uploadPhotos, type StudioActionState } from "./actions";

export function PhotoUploader() {
  const [state, action, pending] = useActionState<StudioActionState, FormData>(uploadPhotos, {});
  const input = useRef<HTMLInputElement>(null);
  const [count, setCount] = useState(0);

  async function onChoose(list: FileList | null) {
    if (!list || !input.current) return;
    const small = await Promise.all(Array.from(list).slice(0, 6).map((f) => compressImage(f, 1600, 0.82).catch(() => f)));
    const transfer = new DataTransfer();
    small.forEach((f) => transfer.items.add(f));
    input.current.files = transfer.files;
    setCount(small.length);
  }

  return (
    <form action={action} className="grid gap-4 rounded-3xl bg-card p-6 sm:grid-cols-2">
      <label className="text-sm font-medium">
        Category
        <select name="category" className="field mt-2 !bg-page" defaultValue="">
          <option value="" disabled>
            Choose
          </option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm font-medium">
        Style name (optional)
        <input name="title" placeholder="e.g. Lace mermaid gown" className="field mt-2 !bg-page" />
      </label>
      <label className="flex cursor-pointer items-center gap-4 rounded-2xl bg-page px-4 py-4 sm:col-span-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-panel text-xl text-gold">+</span>
        <span className="text-sm text-muted">{count ? `${count} photo${count > 1 ? "s" : ""} ready` : "Choose up to 6 photos at a time"}</span>
        <input ref={input} type="file" name="photos" accept="image/*" multiple className="sr-only" onChange={(e) => onChoose(e.target.files)} />
      </label>
      <div className="flex items-center gap-4 sm:col-span-2">
        <button className="btn btn-primary" disabled={pending}>
          {pending ? "Uploading" : "Add to portfolio"}
        </button>
        {state.error && <p className="text-sm text-red-700 dark:text-red-300">{state.error}</p>}
        {state.message && <p className="text-sm text-gold">{state.message}</p>}
      </div>
    </form>
  );
}
