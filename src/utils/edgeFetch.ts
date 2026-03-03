/**
 * Central fetch wrapper for Supabase edge functions
 * Handles 401/403 responses consistently across the app
 *
 * ROUTES (canonical):
 * - Sign-in:  /signin
 * - Pricing:  /pricing
 * - Legacy:   /upgrade (should redirect to /pricing at router level)
 */
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
    try {
      window.location.assign("/signin?reason=expired");
    } catch {
      window.location.href = "/signin?reason=expired";
    }
    throw new Error("UNAUTHENTICATED");
  }

  // Forbidden - insufficient tier/permissions
  if (res.status === 403) {
    console.warn("⚠️ Access forbidden (403), redirecting to /pricing...");
    try {
      window.location.assign("/pricing?reason=forbidden");
    } catch {
      window.location.href = "/pricing?reason=forbidden";
    }
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
    // Normalize status if available
    const status = (error?.status ?? error?.code) as number | undefined;
    const msg = String(error?.message || "");

    if (msg.includes("401") || status === 401) {
      console.warn("⚠️ Session expired (401), redirecting to /signin...");
      try {
        window.location.assign("/signin?reason=expired");
      } catch {
        window.location.href = "/signin?reason=expired";
      }
      throw new Error("UNAUTHENTICATED");
    }

    if (msg.includes("403") || status === 403) {
      console.warn("⚠️ Access forbidden (403), redirecting to /pricing...");
      try {
        window.location.assign("/pricing?reason=forbidden");
      } catch {
        window.location.href = "/pricing?reason=forbidden";
      }
      throw new Error("FORBIDDEN");
    }

    throw error;
  }

  return data as T;
}