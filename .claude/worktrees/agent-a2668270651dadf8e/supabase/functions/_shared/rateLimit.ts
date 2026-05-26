import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const WINDOW_MS = 60_000; // 1 minute window
const MAX_CALLS = 20; // Max 20 calls per minute

// In-memory rate limit store for lightweight limiting
const inMemoryStore = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds?: number;
}

/**
 * Simple in-memory rate limiting (no database)
 * Use for public endpoints where DB overhead is undesirable
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const entry = inMemoryStore.get(identifier);

  // Clean up expired entries periodically
  if (inMemoryStore.size > 1000) {
    for (const [key, value] of inMemoryStore.entries()) {
      if (value.resetTime < now) {
        inMemoryStore.delete(key);
      }
    }
  }

  // No entry or expired - create new window
  if (!entry || entry.resetTime < now) {
    inMemoryStore.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return { allowed: true, remaining: config.maxRequests - 1 };
  }

  // Check if over limit
  if (entry.count >= config.maxRequests) {
    const retryAfterSeconds = Math.ceil((entry.resetTime - now) / 1000);
    return { 
      allowed: false, 
      remaining: 0, 
      retryAfterSeconds 
    };
  }

  // Increment count
  entry.count++;
  inMemoryStore.set(identifier, entry);
  
  return { 
    allowed: true, 
    remaining: config.maxRequests - entry.count 
  };
}

/**
 * Create rate limit error response
 */
export function rateLimitResponse(
  retryAfterSeconds: number,
  corsHeaders: Record<string, string>
): Response {
  return new Response(
    JSON.stringify({ 
      ok: false, 
      error: 'Too many requests. Please try again later.',
      retryAfter: retryAfterSeconds
    }),
    { 
      status: 429, 
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfterSeconds)
      } 
    }
  );
}

/**
 * Rate limit sensitive endpoints using database
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
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    req.headers.get('cf-connecting-ip') ||
    'unknown'
  );
}
