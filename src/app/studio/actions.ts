"use server";

import { cookies } from "next/headers";
import { refresh } from "next/cache";
import { COOKIE, checkPassword, isSignedIn, sessionToken } from "@/lib/studio-auth";
import { ensureSchema, hasDatabase, sql } from "@/lib/db";
import { STATUSES } from "@/lib/booking";

export async function signIn(_prev: { error?: string }, fd: FormData): Promise<{ error?: string }> {
  // Slow down guessing.
  await new Promise((r) => setTimeout(r, 600));
  if (!checkPassword(String(fd.get("password") ?? ""))) return { error: "That password isn't right." };
  (await cookies()).set(COOKIE, sessionToken()!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/studio",
    maxAge: 60 * 60 * 24 * 14,
  });
  refresh();
  return {};
}

export async function signOut() {
  (await cookies()).delete({ name: COOKIE, path: "/studio" });
  refresh();
}

export async function updateBooking(fd: FormData) {
  if (!(await isSignedIn()) || !hasDatabase()) return;
  const id = Number(fd.get("id"));
  const status = String(fd.get("status") ?? "");
  const notes = String(fd.get("admin_notes") ?? "").slice(0, 2000);
  if (!Number.isInteger(id) || !(STATUSES as readonly string[]).includes(status)) return;
  await ensureSchema();
  await sql()`update bookings set status = ${status}, admin_notes = ${notes} where id = ${id}`;
  refresh();
}
