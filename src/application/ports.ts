/**
 * Ports: the interfaces the application layer needs from the outside world.
 * Infrastructure adapters implement them; use cases depend only on these.
 */

import type { BookingRequest, BookingStatus } from "@/domain/booking";

export type BookingRecord = BookingRequest & {
  id: number;
  reference: string;
  inspirationUrls: string[];
  status: BookingStatus;
  adminNotes: string | null;
  createdAt: Date;
};

export interface BookingRepository {
  save(reference: string, request: BookingRequest, inspirationUrls: readonly string[]): Promise<void>;
  list(limit: number): Promise<BookingRecord[]>;
  update(id: number, status: BookingStatus, adminNotes: string): Promise<void>;
}

export type StoredFile = { url: string; pathname: string; uploadedAt: Date };

export interface FileStorage {
  list(prefix: string): Promise<StoredFile[]>;
  put(pathname: string, file: Blob): Promise<StoredFile>;
  remove(url: string): Promise<void>;
}

export interface TryOnService {
  /** Returns the result image as a data URL. */
  tryOn(person: Blob, garment: Blob, description: string): Promise<string>;
}
