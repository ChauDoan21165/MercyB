/**
 * Path: src/utils/edgeFetch.ts
 * Central fetch wrapper for Supabase edge functions.
 * Handles 401/403 responses consistently across the app.
 *
 * 2026-03-02:
 * - 401 -> /signin (not /login)
 * - 403 -> /pricing (not /upgrade)
 * - include `next=` so user can come back after signing in
 */

const EDGE_FETCH_TIMEOUT_MS = 15000;

function currentPathWithQueryAndHash(): string {
  try {
    return `${window.location.pathname}${window.location.search}${window.location.hash}`;
  } catch {
    return "/";
  }
}

function hardRedirect(to: string) {
  // replace() prevents a back-button loop
  try {
    window.location.replace(to);
  } catch {
    window.location.href = to;
  }
}

export async function callEdge<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    EDGE_FETCH_TIMEOUT_MS,
  );

  let res: Response;
  try {
    res = await fetch(path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
      signal: controller.signal,
    });
  } catch (err) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    throw new Error(
      isAbort
        ? "Request timed out. Please try again."
        : "Unable to reach the server. Please check your connection.",
    );
  } finally {
    window.clearTimeout(timeoutId);
  }

  // Session expired or not authenticated
  if (res.status === 401) {
    const next = encodeURIComponent(currentPathWithQueryAndHash());
    hardRedirect(`/signin?reason=expired&next=${next}`);
    throw new Error("UNAUTHENTICATED");
  }

  // Forbidden — insufficient tier or permissions
  if (res.status === 403) {
    const next = encodeURIComponent(currentPathWithQueryAndHash());
    hardRedirect(`/pricing?reason=forbidden&next=${next}`);
    throw new Error("FORBIDDEN");
  }

  // Generic error — try to extract body text safely
  if (!res.ok) {
    let text = "";
    try {
      text = await res.text();
    } catch {
      // ignore body parse failure
    }
    throw new Error(text || `Request failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}

/**
 * Typed wrapper for supabase.functions.invoke() responses.
 * Handles auth and access errors consistently with callEdge.
 */
export function handleEdgeResponse<T>(
  data: unknown,
  error: unknown,
): T {
  if (error) {
    const msg = String(
      (error as Record<string, unknown>)?.message ?? "",
    );
    const status = Number(
      (error as Record<string, unknown>)?.status ?? 0,
    );

    if (msg.includes("401") || status === 401) {
      const next = encodeURIComponent(currentPathWithQueryAndHash());
      hardRedirect(`/signin?reason=expired&next=${next}`);
      throw new Error("UNAUTHENTICATED");
    }

    if (msg.includes("403") || status === 403) {
      const next = encodeURIComponent(currentPathWithQueryAndHash());
      hardRedirect(`/pricing?reason=forbidden&next=${next}`);
      throw new Error("FORBIDDEN");
    }

    throw error instanceof Error
      ? error
      : new Error(msg || "EDGE_FUNCTION_ERROR");
  }

  return data as T;
}