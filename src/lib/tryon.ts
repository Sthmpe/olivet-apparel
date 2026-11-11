import "server-only";
import { Client, handle_file } from "@gradio/client";

/**
 * Virtual try-on provider. Default: the open-source IDM-VTON model on a free
 * Hugging Face Space, called from our server so visitors' browsers never talk to
 * third parties. Swap TRYON_SPACE for another compatible Space, or replace this
 * function with a paid provider later. The UI does not need to change.
 *
 * Env: TRYON_SPACE (default "yisol/IDM-VTON"), HF_TOKEN (optional, raises free quota).
 */

export type TryOnInput = { person: Blob; garment: Blob; description: string };

export async function tryOn({ person, garment, description }: TryOnInput): Promise<string> {
  const space = process.env.TRYON_SPACE ?? "yisol/IDM-VTON";
  const token = process.env.HF_TOKEN as `hf_${string}` | undefined;
  const client = await Client.connect(space, token ? { token } : {});

  const result = await Promise.race([
    client.predict("/tryon", {
      dict: { background: handle_file(person), layers: [], composite: null },
      garm_img: handle_file(garment),
      garment_des: description,
      is_checked: true,
      is_checked_crop: false,
      denoise_steps: 30,
      seed: 42,
    }),
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("try-on timed out")), 110_000)),
  ]);

  const out = (result.data as Array<{ url?: string } | string>)[0];
  const url = typeof out === "string" ? out : out?.url;
  if (!url) throw new Error("no image returned");

  // Return a data URL so the browser never fetches from the third-party host.
  const img = await fetch(url, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  if (!img.ok) throw new Error(`result fetch ${img.status}`);
  const buf = Buffer.from(await img.arrayBuffer());
  return `data:${img.headers.get("content-type") ?? "image/webp"};base64,${buf.toString("base64")}`;
}
