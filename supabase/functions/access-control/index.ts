import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Cache-Control': 'public, max-age=300, s-maxage=300',
};

const getRoomSchema = z.object({
  roomId: z.string().min(1, 'Room ID is required').max(100),
});

type SubscriptionRow = {
  tier_id?: string | null;
  status?: string | null;
  subscription_tiers?: {
    name?: string | null;
  } | null;
};

type UserRoleRow = {
  role?: string | null;
};

type RoomRow = {
  id: string;
  tier?: string | null;
  [key: string]: unknown;
};

function normalizeTier(value: unknown): string {
  return String(value ?? '').trim().toLowerCase();
}

function isPaidBillingTier(tier: string): boolean {
  return tier === 'premium_month' || tier === 'premium_year';
}

function isLegacyVipTier(tier: string): boolean {
  return /^vip[1-9]$/.test(tier);
}

function isKidsTier(tier: string): boolean {
  return /^kids(?:_\d+)?$/.test(tier);
}

function normalizeRoomTier(rawRoomTier: unknown, roomId: unknown): string {
  const direct = normalizeTier(rawRoomTier);
  if (direct) return direct;

  const rid = String(roomId ?? '').trim().toLowerCase();

  if (/_free$/.test(rid) || /(^|_)free($|_)/.test(rid)) return 'free';
  if (/_vip[1-9]$/.test(rid)) {
    const m = rid.match(/_(vip[1-9])$/);
    if (m?.[1]) return m[1];
  }
  if (/_kids(?:_\d+)?$/.test(rid)) {
    const m = rid.match(/_(kids(?:_\d+)?)$/);
    if (m?.[1]) return m[1];
  }

  return 'free';
}

function resolveUserTier(subscription: SubscriptionRow | null): string {
  const tierName = normalizeTier(subscription?.subscription_tiers?.name);
  const tierId = normalizeTier(subscription?.tier_id);

  if (tierName) return tierName;
  if (tierId) return tierId;
  return 'free';
}

/**
 * New business rule:
 * - free room => open to all authenticated users
 * - vip1..vip9 => curriculum labels only
 * - any paid monthly/yearly user gets all adult VIP rooms
 * - admins bypass all checks
 * - legacy VIP user tiers remain allowed for backward compatibility
 * - kids tiers remain isolated from adult VIP content
 */
function canAccessRoom(params: {
  userTier: string;
  roomTier: string;
  isAdmin: boolean;
}): { allowed: boolean; reason?: string } {
  const userTier = normalizeTier(params.userTier);
  const roomTier = normalizeTier(params.roomTier);
  const isAdmin = Boolean(params.isAdmin);

  if (isAdmin) {
    return { allowed: true };
  }

  // Free rooms are open to all authenticated users
  if (roomTier === 'free' || roomTier === '') {
    return { allowed: true };
  }

  // Kids content handling
  if (isKidsTier(roomTier)) {
    if (userTier === 'free') {
      return { allowed: false, reason: 'Kids content requires an eligible kids or adult paid plan.' };
    }
    return { allowed: true };
  }

  // Adult VIP curriculum rooms
  if (isLegacyVipTier(roomTier)) {
    // paid monthly/yearly unlocks all VIP rooms
    if (isPaidBillingTier(userTier)) {
      return { allowed: true };
    }

    // keep legacy VIP accounts working
    if (isLegacyVipTier(userTier)) {
      return { allowed: true };
    }

    return {
      allowed: false,
      reason: 'This room is part of the paid app. Monthly or yearly paid users can access all VIP rooms.',
    };
  }

  // Unknown adult non-free tiers: treat paid users/admin as allowed, free as denied
  if (isPaidBillingTier(userTier) || isLegacyVipTier(userTier)) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: 'This room requires paid access.',
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization') ?? '';

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: authHeader ? { Authorization: authHeader } : {},
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const body = await req.json();
    const validation = getRoomSchema.safeParse(body);

    if (!validation.success) {
      console.error('Validation failed:', validation.error);
      return new Response(
        JSON.stringify({
          error: 'Invalid request',
          details: validation.error.errors,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { roomId } = validation.data;
    console.log(`User ${user.id} requesting room: ${roomId}`);

    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select(`
        tier_id,
        status,
        subscription_tiers (
          name
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle<SubscriptionRow>();

    const { data: adminRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle<UserRoleRow>();

    const isAdmin = !!adminRole;
    const userTier = resolveUserTier(subscription);

    console.log(`Resolved user tier: ${userTier}, isAdmin: ${isAdmin}`);

    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .maybeSingle<RoomRow>();

    if (roomError || !room) {
      console.error('Room not found:', roomError);
      return new Response(
        JSON.stringify({ error: 'Room not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const roomTier = normalizeRoomTier(room.tier, room.id);
    const access = canAccessRoom({
      userTier,
      roomTier,
      isAdmin,
    });

    if (!access.allowed) {
      console.log(`Access denied: userTier=${userTier}, roomTier=${roomTier}, reason=${access.reason ?? 'unknown'}`);
      return new Response(
        JSON.stringify({
          error: 'Insufficient tier access',
          reason: access.reason ?? 'Access denied',
          requiredTier: roomTier,
          userTier,
        }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    try {
      await supabase.from('room_usage_analytics').insert({
        user_id: user.id,
        room_id: roomId,
        session_start: new Date().toISOString(),
      });
    } catch (analyticsError) {
      console.warn('Analytics insert failed:', analyticsError);
    }

    console.log(`Access granted to room ${roomId}`);

    return new Response(
      JSON.stringify({
        success: true,
        room,
        access: {
          granted: true,
          userTier,
          roomTier,
          isAdmin,
          paidAccessModel: 'monthly_or_yearly_unlocks_all_vip_rooms',
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in get-room:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});