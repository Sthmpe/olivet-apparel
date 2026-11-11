import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/** Single-user admin auth for /studio. Env: STUDIO_PASSWORD (required), STUDIO_SECRET (optional extra key). */

export const COOKIE = "olivet_studio";

function token() {
  const pw = process.env.STUDIO_PASSWORD;
  if (!pw) return null;
  return createHmac("sha256", (process.env.STUDIO_SECRET ?? "") + pw)
    .update("olivet-studio-v1")
    .digest("hex");
}

export function studioConfigured() {
  return Boolean(process.env.STUDIO_PASSWORD);
}

export function checkPassword(input: string) {
  const pw = process.env.STUDIO_PASSWORD;
  if (!pw) return false;
  const a = Buffer.from(createHmac("sha256", "cmp").update(input).digest("hex"));
  const b = Buffer.from(createHmac("sha256", "cmp").update(pw).digest("hex"));
  return timingSafeEqual(a, b);
}

export function sessionToken() {
  return token();
}

export async function isSignedIn() {
  const t = token();
  if (!t) return false;
  const c = (await cookies()).get(COOKIE)?.value ?? "";
  if (c.length !== t.length) return false;
  return timingSafeEqual(Buffer.from(c), Buffer.from(t));
}
