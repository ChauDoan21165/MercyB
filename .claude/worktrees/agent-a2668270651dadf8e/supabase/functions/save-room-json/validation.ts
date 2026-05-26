// Pure-logic helpers for save-room-json. Extracted into a standalone
// module so vitest can run the validation paths without booting Deno.
//
// NONE of these helpers touch the network or the filesystem. All I/O
// (auth check, RPC, file write, audit log) lives in index.ts.

/**
 * Filenames that are explicitly allowed for write.
 *
 * IMPORTANT: starting list is empty by design. The pre-fix function
 * accepted any filename and was unused by current client code (no
 * callers found in src/ or scripts/ during the fix audit). Until
 * Chau confirms a real use case, the function is effectively
 * inert — every request gets a 400 "filename not allowed" response.
 *
 * To re-enable a specific file, add it to this array AND to the
 * caller-list in reports/a2-c1-save-room-json-fix.md so the audit
 * trail stays in sync.
 */
export const ALLOWED_FILES: readonly string[] = [];

/** Maximum content size accepted, in bytes. 1 MB. */
export const MAX_CONTENT_BYTES = 1_000_000;

/**
 * Filename safety pattern. Defence-in-depth: even if a filename ends
 * up on the allowlist, it must still match this pattern. Blocks path
 * traversal (`..`, `/`, `\`), Unicode tricks, control characters, and
 * non-JSON extensions.
 */
const SAFE_FILENAME_RE = /^[a-z0-9][a-z0-9_-]{0,79}\.json$/;

export type ValidationFailure = {
  ok: false;
  status: number;
  error: string;
};

export type ValidationOk<T> = {
  ok: true;
  value: T;
};

export function rejectContentType(headerValue: string | null): ValidationFailure | null {
  // Accept "application/json" with optional ;charset=...
  const ct = (headerValue ?? "").toLowerCase().trim();
  if (!ct) {
    return {
      ok: false,
      status: 400,
      error: "Content-Type required: application/json",
    };
  }
  const base = ct.split(";")[0].trim();
  if (base !== "application/json") {
    return {
      ok: false,
      status: 400,
      error: "Content-Type must be application/json",
    };
  }
  return null;
}

export function rejectFilename(filename: unknown): ValidationFailure | null {
  if (typeof filename !== "string" || filename.length === 0) {
    return { ok: false, status: 400, error: "Missing filename" };
  }
  // Pattern check first — cheap and catches path traversal even if the
  // allowlist is somehow stale or wrong.
  if (!SAFE_FILENAME_RE.test(filename)) {
    return {
      ok: false,
      status: 400,
      error: "Invalid filename: must match ^[a-z0-9][a-z0-9_-]{0,79}\\.json$",
    };
  }
  // Allowlist gate.
  if (!ALLOWED_FILES.includes(filename)) {
    return {
      ok: false,
      status: 400,
      error: "Filename not allowed",
    };
  }
  return null;
}

export function rejectSize(content: unknown): ValidationFailure | null {
  if (typeof content !== "string") {
    return { ok: false, status: 400, error: "Missing content (must be a string)" };
  }
  // UTF-8 byte length, not character length.
  const bytes = new TextEncoder().encode(content).byteLength;
  if (bytes === 0) {
    return { ok: false, status: 400, error: "Empty content" };
  }
  if (bytes > MAX_CONTENT_BYTES) {
    return {
      ok: false,
      status: 413,
      error: `Content too large: ${bytes} bytes (max ${MAX_CONTENT_BYTES})`,
    };
  }
  return null;
}

/**
 * One-shot orchestrator that runs every check and returns the first
 * failure (or `{ ok: true }`). Order matters — content-type fails
 * fastest, filename next, size last (so we don't spend a TextEncoder
 * pass on a request we'd reject for headers anyway).
 */
export function validatePayload(input: {
  contentType: string | null;
  filename: unknown;
  content: unknown;
}): ValidationFailure | ValidationOk<{ filename: string; content: string }> {
  const ct = rejectContentType(input.contentType);
  if (ct) return ct;
  const fn = rejectFilename(input.filename);
  if (fn) return fn;
  const sz = rejectSize(input.content);
  if (sz) return sz;
  return {
    ok: true,
    value: {
      filename: input.filename as string,
      content: input.content as string,
    },
  };
}
