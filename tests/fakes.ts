import type { BookingRecord, BookingRepository, FileStorage, StoredFile } from "@/application/ports";
import type { BookingRequest } from "@/domain/booking";

/** In-memory adapters for testing use cases without a database or network. */
export class MemoryFileStorage implements FileStorage {
  files = new Map<string, StoredFile>();
  failPuts = false;
  async list(prefix: string) {
    return [...this.files.values()].filter((f) => f.pathname.startsWith(prefix));
  }
  async put(pathname: string) {
    if (this.failPuts) throw new Error("storage down");
    const file = { url: `https://store.public.blob.vercel-storage.com/${pathname}`, pathname, uploadedAt: new Date() };
    this.files.set(pathname, file);
    return file;
  }
  async remove(url: string) {
    for (const [k, f] of this.files) if (f.url === url) this.files.delete(k);
  }
}

export class MemoryBookingRepository implements BookingRepository {
  saved: { reference: string; request: BookingRequest; inspirationUrls: readonly string[] }[] = [];
  failSaves = false;
  async save(reference: string, request: BookingRequest, inspirationUrls: readonly string[]) {
    if (this.failSaves) throw new Error("db down");
    this.saved.push({ reference, request, inspirationUrls });
  }
  async list(): Promise<BookingRecord[]> {
    return [];
  }
  async update(): Promise<void> {}
}

export function form(fields: Record<string, string>) {
  const data = new FormData();
  for (const [k, v] of Object.entries(fields)) data.set(k, v);
  return data;
}

export function image(bytes = 1000, type = "image/jpeg") {
  return new Blob([new Uint8Array(bytes)], { type });
}
