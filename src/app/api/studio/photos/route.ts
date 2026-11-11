import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isCategoryId } from "@/domain/catalog";
import { addStudioPhoto } from "@/application/portfolio";
import { checkPassword } from "@/infrastructure/auth/studio-session";
import { fileStorage } from "@/infrastructure/container";
import { PORTFOLIO_TAG } from "@/infrastructure/portfolio-query";

/**
 * Scripted portfolio upload (bulk imports and automation).
 * Authenticated with the studio password in the "x-studio-key" header.
 */
export async function POST(request: Request) {
  if (!checkPassword(request.headers.get("x-studio-key") ?? "")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const files = fileStorage();
  if (!files) return NextResponse.json({ error: "storage not connected" }, { status: 503 });

  const form = await request.formData();
  const photo = form.get("photo");
  const category = String(form.get("category") ?? "");
  const title = String(form.get("title") ?? "Outfit").slice(0, 60);
  if (!(photo instanceof File) || !isCategoryId(category)) return NextResponse.json({ error: "photo and a valid category are required" }, { status: 400 });

  const saved = await addStudioPhoto(files, photo, category, title);
  revalidateTag(PORTFOLIO_TAG, { expire: 0 });
  return NextResponse.json({ url: saved.url, pathname: saved.pathname });
}
