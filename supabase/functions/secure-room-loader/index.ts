/**
 * Path: supabase/functions/secure-room-loader/index.ts
 * File: index.ts
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { rateLimit, getClientIP } from "../_shared/rateLimit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const jsonHeaders = {
  ...corsHeaders,
  'Content-Type': 'application/json',
};

const tierMap: Record<string, number> = {
  level0: 0,
  level1: 1,
  level2: 2,
  level3: 3,
  level4: 4,
  level5: 5,
  level6: 6,
  level7: 7,
  level8: 8,
  level9: 9,
};

const requestSchema = z.object({
  roomId: z.string().min(1),
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders,
  });
}

/**
 * Secure Room Loader Edge Function
 *
 * Speed-focused hardening:
 * - fast-fail when Authorization header is missing
 * - parse request body once with a clean 400 on invalid JSON
 * - run subscription lookup, admin-role lookup, and room lookup in parallel
 * - move static maps/headers outside the request handler
 *
 * Access behavior is preserved.
 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }

    // Rate limit room loading (prevent abuse)
    try {
      const clientIP = getClientIP(req);
      await rateLimit(`secure-room-loader:${user.id}:${clientIP}`, 60, 60_000);
    } catch (error) {
      if (error instanceof Error && error.message === 'RATE_LIMIT_EXCEEDED') {
        return jsonResponse(
          { success: false, error: 'Too many requests. Please slow down.' },
          429,
        );
      }
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ success: false, error: 'Invalid JSON body' }, 400);
    }

    const validation = requestSchema.safeParse(body);
    if (!validation.success) {
      return jsonResponse(
        {
          success: false,
          error: 'Invalid request',
          details: validation.error.errors,
        },
        400,
      );
    }

    const { roomId } = validation.data;

    const [subscriptionResult, adminRoleResult, roomResult] = await Promise.all([
      supabase
        .from('user_subscriptions')
        .select(`
          status,
          subscription_tiers!inner (
            name,
            display_order
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle(),

      supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle(),

      supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .maybeSingle(),
    ]);

    const { data: room, error: roomError } = roomResult;
    if (roomError || !room) {
      return jsonResponse({ success: false, error: 'Room not found' }, 404);
    }

    const isAdmin = !!adminRoleResult.data;

    const tierData = subscriptionResult.data?.subscription_tiers as
      | { name?: string | null; display_order?: number | null }
      | null
      | undefined;

    const userTier = String(tierData?.name ?? 'level0').toLowerCase();
    const userTierLevel = Number(tierData?.display_order ?? 0);

    const roomTier = String(room.tier ?? 'level0').toLowerCase();
    const roomTierLevel = tierMap[roomTier] ?? 0;

    if (!isAdmin && userTierLevel < roomTierLevel) {
      return jsonResponse(
        {
          success: false,
          error: 'ACCESS_DENIED: insufficient tier',
          requiredTier: roomTier,
          userTier,
        },
        403,
      );
    }

    return jsonResponse({
      success: true,
      room,
    });
  } catch (error: unknown) {
    console.error('Error in secure-room-loader:', error);

    const message =
      error instanceof Error ? error.message : 'Internal server error';

    return jsonResponse(
      { success: false, error: message || 'Internal server error' },
      500,
    );
  }
});