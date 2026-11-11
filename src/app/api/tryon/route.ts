import { NextResponse } from "next/server";
import { tryOnService } from "@/infrastructure/container";

export const maxDuration = 120;

const recent = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > 4;
}

/** Only photos from our own Blob store or this site may be used as the garment. */
function isAllowedGarmentUrl(raw: string, requestUrl: string): URL | null {
  try {
    const url = new URL(raw, requestUrl);
    const sameOrigin = url.origin === new URL(requestUrl).origin;
    const ourBlob = url.protocol === "https:" && url.hostname.endsWith(".public.blob.vercel-storage.com");
    return sameOrigin || ourBlob ? url : null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (rateLimited(ip)) return NextResponse.json({ error: "Too many tries. Please wait a few minutes." }, { status: 429 });

  const form = await request.formData().catch(() => null);
  const photo = form?.get("photo");
  const garmentUrl = isAllowedGarmentUrl(String(form?.get("photoUrl") ?? ""), request.url);
  const title = String(form?.get("title") ?? "Outfit").slice(0, 80);

  if (!(photo instanceof File) || !photo.type.startsWith("image/") || photo.size > 4 * 1024 * 1024) {
    return NextResponse.json({ error: "Please upload a photo under 4 MB." }, { status: 400 });
  }
  if (!garmentUrl) return NextResponse.json({ error: "This style cannot be tried on." }, { status: 400 });

  try {
    const garment = await fetch(garmentUrl);
    if (!garment.ok) throw new Error(`garment ${garment.status}`);
    const image = await tryOnService().tryOn(photo, await garment.blob(), title);
    return NextResponse.json({ image });
  } catch (error) {
    console.error("[tryon]", error);
    return NextResponse.json({ error: "The try-on service is busy right now." }, { status: 503 });
  }
}
