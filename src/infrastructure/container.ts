import "server-only";
import type { BookingRepository, FileStorage, TryOnService } from "@/application/ports";
import { PostgresBookingRepository } from "./postgres/booking-repository";
import { VercelBlobStorage } from "./blob/file-storage";
import { HuggingFaceTryOn } from "./tryon/huggingface-try-on";

/**
 * Composition root. Chooses an adapter for each port from the environment.
 * A missing variable switches that feature off instead of failing the site.
 */
export function bookingRepository(): BookingRepository | null {
  const url = process.env.DATABASE_URL;
  return url ? new PostgresBookingRepository(url) : null;
}

export function fileStorage(): FileStorage | null {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  return token ? new VercelBlobStorage(token) : null;
}

export function tryOnService(): TryOnService {
  return new HuggingFaceTryOn(process.env.TRYON_SPACE || undefined, process.env.HF_TOKEN || undefined);
}

export const features = {
  database: () => Boolean(process.env.DATABASE_URL),
  photoUploads: () => Boolean(process.env.BLOB_READ_WRITE_TOKEN),
};
