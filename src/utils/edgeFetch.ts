/**
 * Central fetch wrapper for Supabase edge functions
 * Handles 401/403 responses consistently across the app
 *
 * 2026-03-02:
 * - 401 -> /signin (not /login)
 * - 403 -> /pricing (not /upgrade)
 * - include `next=` so user can come back after signing in
 */

function currentPathWithQueryAndHash(): string {
  try {
    return `${window.location.pathname}${window.location.search}${window.location.hash}`;
  } catch {
    return "/";
  }
}

function hardRedirect(to: string) {
  // replace() prevents a "back button loop"
  try {
    window.location.replace(to);
  } catch {
    window.location.href = to;
  }
}

export async function callEdge<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  // Session expired or not authenticated
  if (res.status === 401) {
    console.warn("⚠️ Session expired (401), redirecting to /signin...");
    const next = encodeURIComponent(currentPathWithQueryAndHash());
    hardRedirect(`/signin?reason=expired&next=${next}`);
    throw new Error("UNAUTHENTICATED");
  }

  // Forbidden - insufficient tier/permissions
  if (res.status === 403) {
    console.warn("⚠️ Access forbidden (403), redirecting to /pricing...");
    const next = encodeURIComponent(currentPathWithQueryAndHash());
    hardRedirect(`/pricing?reason=forbidden&next=${next}`);
    throw new Error("FORBIDDEN");
  }

  // Generic error
  if (!res.ok) {
    const text = await res.text();
    console.error(`❌ Edge function error (${res.status}):`, text);
    throw new Error(text || "UNKNOWN_ERROR");
  }

  return res.json() as Promise<T>;
}

/**
 * Typed wrapper for Supabase Functions invoke pattern
 * Use this when calling via supabase.functions.invoke()
 */
export function handleEdgeResponse<T>(data: any, error: any): T {
  if (error) {
    const msg = String(error?.message || "");
    const status = Number(error?.status || 0);

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

    throw error;
  }

  return data as T;
}