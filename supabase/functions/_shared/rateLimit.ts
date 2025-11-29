import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const WINDOW_MS = 60_000; // 1 minute window
const MAX_CALLS = 20; // Max 20 calls per minute

/**
 * Rate limit sensitive endpoints
 * Throws error if rate limit exceeded
 * 
 * @param key - Unique identifier for rate limit bucket (e.g., "paypal-payment:user-id" or "paypal-payment:ip")
 * @param maxCalls - Maximum calls allowed in window (default: 20)
 * @param windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 */
export async function rateLimit(
  key: string,
  maxCalls: number = MAX_CALLS,
  windowMs: number = WINDOW_MS
): Promise<void> {
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const now = Date.now();
  const bucketKey = `${key}:${Math.floor(now / windowMs)}`;

  // Check current count
  const { data, error } = await supabaseAdmin
    .from('rate_limits')
    .select('count')
    .eq('key', bucketKey)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    console.error('Rate limit check error:', error);
    // Don't block on error, just log
    return;
  }

  const count = data?.count ?? 0;

  if (count >= maxCalls) {
    throw new Error('RATE_LIMIT_EXCEEDED');
  }

  // Increment count
  await supabaseAdmin.from('rate_limits').upsert({
    key: bucketKey,
    count: count + 1,
    updated_at: new Date().toISOString(),
  });
}

/**
 * Get client IP address from request headers
 */
export function getClientIP(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}
