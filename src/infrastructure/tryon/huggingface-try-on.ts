import "server-only";
import { Client, handle_file } from "@gradio/client";
import type { TryOnService } from "@/application/ports";

/**
 * TryOnService backed by the open-source IDM-VTON model on a Hugging Face
 * Space. Called from the server so visitors' browsers never contact a third
 * party. Photos are processed in memory and never stored.
 */
export class HuggingFaceTryOn implements TryOnService {
  constructor(
    private readonly space = "yisol/IDM-VTON",
    private readonly token?: string,
  ) {}

  async tryOn(person: Blob, garment: Blob, description: string): Promise<string> {
    const auth = this.token ? { token: this.token as `hf_${string}` } : {};
    const client = await Client.connect(this.space, auth);
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

    const output = (result.data as Array<{ url?: string } | string>)[0];
    const url = typeof output === "string" ? output : output?.url;
    if (!url) throw new Error("no image returned");

    const image = await fetch(url, this.token ? { headers: { Authorization: `Bearer ${this.token}` } } : undefined);
    if (!image.ok) throw new Error(`result fetch ${image.status}`);
    const bytes = Buffer.from(await image.arrayBuffer());
    return `data:${image.headers.get("content-type") ?? "image/webp"};base64,${bytes.toString("base64")}`;
  }
}
