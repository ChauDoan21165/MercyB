/**
 * Central fetch wrapper for Supabase edge functions
 * Handles 401/403 responses consistently across the app
 */
export async function callEdge<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  // Session expired or not authenticated
  if (res.status === 401) {
    console.warn('⚠️ Session expired (401), redirecting to login...');
    window.location.href = '/login?reason=expired';
    throw new Error('UNAUTHENTICATED');
  }

  // Forbidden - insufficient tier/permissions
  if (res.status === 403) {
    console.warn('⚠️ Access forbidden (403), redirecting to upgrade...');
    window.location.href = '/upgrade';
    throw new Error('FORBIDDEN');
  }

  // Generic error
  if (!res.ok) {
    const text = await res.text();
    console.error(`❌ Edge function error (${res.status}):`, text);
    throw new Error(text || 'UNKNOWN_ERROR');
  }

  return res.json() as Promise<T>;
}

/**
 * Typed wrapper for Supabase Functions invoke pattern
 * Use this when calling via supabase.functions.invoke()
 */
export function handleEdgeResponse<T>(
  data: any,
  error: any
): T {
  if (error) {
    if (error.message?.includes('401') || error.status === 401) {
      window.location.href = '/login?reason=expired';
      throw new Error('UNAUTHENTICATED');
    }

    if (error.message?.includes('403') || error.status === 403) {
      window.location.href = '/upgrade';
      throw new Error('FORBIDDEN');
    }

    throw error;
  }

  return data as T;
}
