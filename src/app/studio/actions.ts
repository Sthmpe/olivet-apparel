"use server";

import { cookies } from "next/headers";
import { refresh, updateTag } from "next/cache";
import { BOOKING_STATUSES, type BookingStatus } from "@/domain/booking";
import { isCategoryId } from "@/domain/catalog";
import { addStudioPhoto, removeStudioPhoto } from "@/application/portfolio";
import { COOKIE, checkPassword, isSignedIn, sessionToken } from "@/infrastructure/auth/studio-session";
import { bookingRepository, fileStorage } from "@/infrastructure/container";
import { PORTFOLIO_TAG } from "@/infrastructure/portfolio-query";

export type StudioActionState = { error?: string; message?: string };

export async function signIn(_previous: StudioActionState, form: FormData): Promise<StudioActionState> {
  await new Promise((r) => setTimeout(r, 600)); // slows down password guessing
  if (!checkPassword(String(form.get("password") ?? ""))) return { error: "That password is not right." };
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

export async function uploadPhotos(_previous: StudioActionState, form: FormData): Promise<StudioActionState> {
  if (!(await isSignedIn())) return { error: "Please sign in again." };
  const files = fileStorage();
  if (!files) return { error: "Photo storage is not connected." };

  const category = String(form.get("category") ?? "");
  const title = String(form.get("title") ?? "").trim().slice(0, 60);
  const photos = form.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  if (!isCategoryId(category)) return { error: "Please choose a category." };
  if (!photos.length) return { error: "Please choose at least one photo." };

  const now = Date.now();
  for (const [i, photo] of photos.entries()) {
    const name = title ? (photos.length > 1 ? `${title} ${i + 1}` : title) : "Outfit";
    await addStudioPhoto(files, photo, category, name, now + i);
  }
  updateTag(PORTFOLIO_TAG);
  return { message: `${photos.length} photo${photos.length > 1 ? "s" : ""} added.` };
}

export async function deletePhoto(form: FormData) {
  if (!(await isSignedIn())) return;
  const files = fileStorage();
  if (!files) return;
  await removeStudioPhoto(files, String(form.get("url")), String(form.get("pathname")));
  updateTag(PORTFOLIO_TAG);
}

export async function updateRequest(form: FormData) {
  if (!(await isSignedIn())) return;
  const bookings = bookingRepository();
  const id = Number(form.get("id"));
  const status = String(form.get("status")) as BookingStatus;
  if (!bookings || !Number.isInteger(id) || !BOOKING_STATUSES.includes(status)) return;
  await bookings.update(id, status, String(form.get("adminNotes") ?? "").slice(0, 2000));
  refresh();
}
