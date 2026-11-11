import { NextResponse } from "next/server";
import { getLook } from "@/content/looks";
import { tryOn } from "@/lib/tryon";

export const maxDuration = 120;

// Best-effort per-instance rate limit: 4 try-ons per IP per 10 minutes.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 4;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) return NextResponse.json({ error: "You've tried on a lot of looks! Please wait a few minutes." }, { status: 429 });

  const fd = await req.formData().catch(() => null);
  const photo = fd?.get("photo");
  const look = getLook(String(fd?.get("slug") ?? ""));
  if (!(photo instanceof File) || !photo.type.startsWith("image/") || photo.size > 4 * 1024 * 1024) {
    return NextResponse.json({ error: "Please upload a photo under 4 MB." }, { status: 400 });
  }
  if (!look?.tryOnGarment) {
    return NextResponse.json({ error: "This look isn't ready for virtual try-on yet." }, { status: 409 });
  }

  try {
    const garmentRes = await fetch(new URL(look.tryOnGarment, req.url));
    if (!garmentRes.ok) throw new Error("garment image missing");
    const image = await tryOn({
      person: photo,
      garment: await garmentRes.blob(),
      description: `${look.title}, ${look.story.split(".")[0]}`,
    });
    return NextResponse.json({ image });
  } catch (e) {
    console.error("[tryon]", e);
    return NextResponse.json({ error: "Our fitting room is busy right now." }, { status: 503 });
  }
}
