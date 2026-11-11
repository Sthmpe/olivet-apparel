import "server-only";
import { del, list, put } from "@vercel/blob";
import type { FileStorage, StoredFile } from "@/application/ports";

/**
 * FileStorage backed by Vercel Blob. Used for studio portfolio uploads and
 * clients' inspiration photos. Requires BLOB_READ_WRITE_TOKEN, which Vercel
 * adds automatically when a Blob store is connected to the project.
 */
export class VercelBlobStorage implements FileStorage {
  constructor(private readonly token: string) {}

  async list(prefix: string): Promise<StoredFile[]> {
    const files: StoredFile[] = [];
    let cursor: string | undefined;
    do {
      const page = await list({ prefix, cursor, limit: 1000, token: this.token });
      files.push(...page.blobs.map((b) => ({ url: b.url, pathname: b.pathname, uploadedAt: new Date(b.uploadedAt) })));
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    return files;
  }

  async put(pathname: string, file: Blob): Promise<StoredFile> {
    const result = await put(pathname, file, {
      access: "public",
      token: this.token,
      contentType: file.type || "image/jpeg",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return { url: result.url, pathname: result.pathname, uploadedAt: new Date() };
  }

  async remove(url: string): Promise<void> {
    await del(url, { token: this.token });
  }
}
