// PATH: supabase/functions/access-control/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const requestSchema = z
  .object({
    roomId: z.string().min(1).max(100).optional(),
    roomTier: z.string().min(1).max(50).optional(),
  })
  .refine((data) => Boolean(data.roomId || data.roomTier), {
    message: 'Either roomId or roomTier is required',
  });

type SubscriptionTierRow = {
  name?: string | null;
};

type SubscriptionRow = {
  tier_id?: string | null;
  status?: string | null;
  subscription_tiers?: SubscriptionTierRow | SubscriptionTierRow[] | null;
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

function normalizeRoomId(value: unknown): string {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\.json$/i, '')
    .replace(/["'`]+/g, '')
    .replace(/[^\w\s-]+/g, '_')
    .replace(/[\s]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/-+/g, '-')
    .replace(/^[_-]+|[_-]+$/g, '');
}

function hyphenVariant(input: string): string {
  return String(input || '').replace(/_+/g, '-').replace(/-+/g, '-');
}

function underscoreVariant(input: string): string {
  return String(input || '').replace(/-+/g, '_').replace(/_+/g, '_');
}

function coreRoomIdVariant(input: string): string {
  return String(input || '').replace(
    /(?:[_-](?:vip[1-9]|level0|kids[_-]?[123]|kidslevel[123]|kids_l[123]|level3[_-]?ii))$/i,
    '',
  );
}

function buildRoomIdCandidates(input: string): string[] {
  const raw = String(input || '').trim().replace(/\.json$/i, '');
  const normalized = normalizeRoomId(raw);
  const hyphen = hyphenVariant(normalized);
  const underscore = underscoreVariant(normalized);

  const ordered = [
    raw,
    raw.toLowerCase(),
    normalized,
    hyphen,
    underscore,
    coreRoomIdVariant(normalized),
    coreRoomIdVariant(hyphen),
    coreRoomIdVariant(underscore),
    underscoreVariant(coreRoomIdVariant(hyphen)),
    hyphenVariant(coreRoomIdVariant(underscore)),
  ];

  const seen = new Set<string>();
  const out: string[] = [];

  for (const value of ordered) {
    const v = String(value || '').trim();
    if (!v) continue;
    if (seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }

  return out;
}

function pickSubscriptionTierData(subscription: SubscriptionRow | null): SubscriptionTierRow | null {
  const raw = subscription?.subscription_tiers ?? null;
  if (!raw) return null;
  if (Array.isArray(raw)) return raw[0] ?? null;
  return raw;
}

function resolveUserTier(subscription: SubscriptionRow | null): string {
  const tierData = pickSubscriptionTierData(subscription);
  const tierName = normalizeTier(tierData?.name);
  const tierId = normalizeTier(subscription?.tier_id);

  if (tierName) return tierName;
  if (tierId) return tierId;
  return 'level0';
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

  if (/_free$/.test(rid) || /(^|[_-])level0($|[_-])/.test(rid)) return 'level0';

  {
    const m = rid.match(/(?:^|[_-])(vip[1-9])(?:$|[_-])/);
    if (m?.[1]) return m[1];
  }

  {
    const m = rid.match(/(?:^|[_-])(kids(?:[_-]?\d+)?)(?:$|[_-])/);
    if (m?.[1]) return m[1].replace(/-/g, '_');
  }

  return 'level0';
}

/**
 * Access policy:
 * - level0 room => open to all authenticated users
 * - level1..level9 => curriculum labels only
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

  if (roomTier === 'level0' || roomTier === '') {
    return { allowed: true };
  }

  if (isKidsTier(roomTier)) {
    if (userTier === 'level0') {
      return {
        allowed: false,
        reason: 'Kids content requires an eligible kids or adult paid plan.',
      };
    }
    return { allowed: true };
  }

  if (isLegacyVipTier(roomTier)) {
    if (isPaidBillingTier(userTier)) {
      return { allowed: true };
    }

    if (isLegacyVipTier(userTier)) {
      return { allowed: true };
    }

    return {
      allowed: false,
      reason: 'This room is part of the paid app. Monthly or yearly paid users can access all VIP rooms.',
    };
  }

  if (isPaidBillingTier(userTier) || isLegacyVipTier(userTier)) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: 'This room requires paid access.',
  };
}

async function findRoomByCandidates(
  supabase: ReturnType<typeof createClient>,
  roomIdRaw: string,
): Promise<{ room: RoomRow | null; matchedId: string | null; error: unknown }> {
  const candidates = buildRoomIdCandidates(roomIdRaw);

  for (const candidate of candidates) {
    const { data, error } = await supabase
      .from('rooms')
      .select('id, tier')
      .eq('id', candidate)
      .maybeSingle<RoomRow>();

    if (data && !error) {
      return { room: data, matchedId: candidate, error: null };
    }
  }

  return { room: null, matchedId: null, error: null };
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
      },
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    const body = await req.json();
    const validation = requestSchema.safeParse(body);

    if (!validation.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid request',
          details: validation.error.errors,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    const { roomId, roomTier: requestedRoomTier } = validation.data;

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

    let resolvedRoomId: string | null = null;
    let resolvedRoomTier = normalizeTier(requestedRoomTier);

    if (roomId) {
      const { room, matchedId, error } = await findRoomByCandidates(supabase, roomId);

      if (error || !room) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Room not found',
            roomId,
          }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        );
      }

      resolvedRoomId = String(room.id || matchedId || roomId);
      resolvedRoomTier = normalizeRoomTier(room.tier, room.id);
    }

    const access = canAccessRoom({
      userTier,
      roomTier: resolvedRoomTier || 'level0',
      isAdmin,
    });

    return new Response(
      JSON.stringify({
        success: true,
        access: {
          granted: access.allowed,
          reason: access.reason,
          userTier,
          roomTier: resolvedRoomTier || 'level0',
          roomId: resolvedRoomId,
          isAdmin,
          paidAccessModel: 'monthly_or_yearly_unlocks_all_vip_rooms',
        },
      }),
      {
        status: access.allowed ? 200 : 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error: any) {
    console.error('Error in access-control:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message || 'Internal server error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});