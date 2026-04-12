// PATH: supabase/functions/secure-room-loader/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { rateLimit, getClientIP } from "../_shared/rateLimit.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOADER_VERSION = 'secure-room-loader-2026-04-11-rf11-open-library-expanded-debug';

const requestSchema = z.object({
  roomId: z.string().min(1),
});

type RoomRow = {
  id: string;
  slug?: string | null;
  tier?: string | null;
  [key: string]: unknown;
};

function jsonHeaders(extra?: Record<string, string>) {
  return {
    ...corsHeaders,
    'Content-Type': 'application/json',
    'X-MB-Loader-Version': LOADER_VERSION,
    ...(extra ?? {}),
  };
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
    /(?:[_-](?:vip[1-9]|free|kids[_-]?[123]|kidslevel[123]|kids_l[123]|vip3[_-]?ii))$/i,
    '',
  );
}

function uniqueStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  for (const value of values) {
    const v = String(value || '').trim();
    if (!v) continue;
    if (seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }

  return out;
}

function buildTierSuffixVariants(): string[] {
  const raw = [
    'free',
    'vip1',
    'vip2',
    'vip3',
    'vip4',
    'vip5',
    'vip6',
    'vip7',
    'vip8',
    'vip9',
    'vip3_ii',
    'vip3-ii',
    'kids_1',
    'kids_2',
    'kids_3',
    'kids-1',
    'kids-2',
    'kids-3',
    'kids1',
    'kids2',
    'kids3',
    'kidslevel1',
    'kidslevel2',
    'kidslevel3',
    'kids_l1',
    'kids_l2',
    'kids_l3',
  ];

  return uniqueStrings(raw.map((x) => normalizeRoomId(x)));
}

function expandCoreToTieredCandidates(core: string): string[] {
  const cleanCore = normalizeRoomId(core);
  if (!cleanCore) return [];

  const suffixes = buildTierSuffixVariants();
  const out: string[] = [];

  for (const suffix of suffixes) {
    const underscored = `${underscoreVariant(cleanCore)}_${underscoreVariant(suffix)}`;
    const hyphenated = `${hyphenVariant(cleanCore)}-${hyphenVariant(suffix)}`;

    out.push(underscored);
    out.push(hyphenated);
    out.push(normalizeRoomId(underscored));
    out.push(normalizeRoomId(hyphenated));
  }

  return uniqueStrings(out);
}

/**
 * OPEN LIBRARY MODE:
 * - vip1..vip9 are curriculum labels only
 * - users should be able to open the library after auth
 * - restore broad family candidate expansion so older/free/vip routes can
 *   still resolve to whatever real room row exists in DB for that family
 */
function buildRoomIdCandidates(input: string): string[] {
  const raw = String(input || '').trim();
  const normalized = normalizeRoomId(input);
  const hyphen = hyphenVariant(normalized);
  const underscore = underscoreVariant(normalized);

  const coreNormalized = coreRoomIdVariant(normalized);
  const coreHyphen = coreRoomIdVariant(hyphen);
  const coreUnderscore = coreRoomIdVariant(underscore);

  const direct = [
    raw,
    normalized,
    hyphen,
    underscore,
    coreNormalized,
    coreHyphen,
    coreUnderscore,
    underscoreVariant(coreHyphen),
    hyphenVariant(coreUnderscore),
  ];

  const expanded = [
    ...expandCoreToTieredCandidates(coreNormalized),
    ...expandCoreToTieredCandidates(coreHyphen),
    ...expandCoreToTieredCandidates(coreUnderscore),
  ];

  return uniqueStrings([...direct, ...expanded]);
}

function createAuthClient(accessToken: string) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });
}

function createDbClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseServiceRoleKey =
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ??
    Deno.env.get('SERVICE_ROLE_KEY') ??
    '';
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

  const key = supabaseServiceRoleKey || supabaseAnonKey;

  return createClient(supabaseUrl, key);
}

function pickBestMatchedValue(
  candidates: string[],
  rows: RoomRow[],
  key: 'id' | 'slug',
): string | null {
  const rowValues = new Set(
    rows.map((row) => String(row[key] || '').trim()).filter(Boolean),
  );

  for (const candidate of candidates) {
    if (rowValues.has(candidate)) return candidate;
  }

  return String(rows[0]?.[key] || '').trim() || null;
}

async function findRoomByCandidates(
  supabase: ReturnType<typeof createClient>,
  roomIdRaw: string,
): Promise<{
  room: RoomRow | null;
  matchedId: string | null;
  matchedBy: 'id' | 'slug' | null;
  candidatesTried: string[];
  error: unknown;
}> {
  const candidates = buildRoomIdCandidates(roomIdRaw);

  if (candidates.length === 0) {
    return {
      room: null,
      matchedId: null,
      matchedBy: null,
      candidatesTried: [],
      error: null,
    };
  }

  const { data: idData, error: idError } = await supabase
    .from('rooms')
    .select('*')
    .in('id', candidates);

  if (idError) {
    return {
      room: null,
      matchedId: null,
      matchedBy: null,
      candidatesTried: candidates,
      error: idError,
    };
  }

  const idRows = Array.isArray(idData) ? (idData as RoomRow[]) : [];
  if (idRows.length > 0) {
    const matchedId = pickBestMatchedValue(candidates, idRows, 'id');
    const room =
      idRows.find((row) => String(row.id || '').trim() === String(matchedId || '').trim()) ??
      idRows[0] ??
      null;

    return {
      room,
      matchedId,
      matchedBy: 'id',
      candidatesTried: candidates,
      error: null,
    };
  }

  const { data: slugData, error: slugError } = await supabase
    .from('rooms')
    .select('*')
    .in('slug', candidates);

  if (slugError) {
    return {
      room: null,
      matchedId: null,
      matchedBy: null,
      candidatesTried: candidates,
      error: slugError,
    };
  }

  const slugRows = Array.isArray(slugData) ? (slugData as RoomRow[]) : [];
  if (slugRows.length > 0) {
    const matchedId = pickBestMatchedValue(candidates, slugRows, 'slug');
    const room =
      slugRows.find((row) => String(row.slug || '').trim() === String(matchedId || '').trim()) ??
      slugRows[0] ??
      null;

    return {
      room,
      matchedId,
      matchedBy: 'slug',
      candidatesTried: candidates,
      error: null,
    };
  }

  return {
    room: null,
    matchedId: null,
    matchedBy: null,
    candidatesTried: candidates,
    error: null,
  };
}

/**
 * Secure Room Loader Edge Function
 *
 * Serves room JSON files for any authenticated user.
 *
 * CURRENT ACCESS MODEL:
 * - library access is no longer controlled by vip1..vip9
 * - vip1..vip9 are curriculum labels only
 * - signed-in users should be able to open the library
 *
 * IMPORTANT:
 * - Return the raw room JSON object directly on success.
 * - The web app expects room JSON, not a wrapped envelope.
 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: jsonHeaders() });
  }

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const accessToken = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (!accessToken) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Unauthorized',
          authMessage: 'Missing bearer token',
          loaderVersion: LOADER_VERSION,
        }),
        { status: 401, headers: jsonHeaders() }
      );
    }

    const authClient = createAuthClient(accessToken);
    const dbClient = createDbClient();

    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser(accessToken);

    if (authError || !user) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Unauthorized',
          authMessage: authError?.message ?? null,
          loaderVersion: LOADER_VERSION,
        }),
        { status: 401, headers: jsonHeaders() }
      );
    }

    try {
      const clientIP = getClientIP(req);
      await rateLimit(`secure-room-loader:${user.id}:${clientIP}`, 60, 60_000);
    } catch (error) {
      if (error instanceof Error && error.message === 'RATE_LIMIT_EXCEEDED') {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Too many requests. Please slow down.',
            loaderVersion: LOADER_VERSION,
          }),
          { status: 429, headers: jsonHeaders() }
        );
      }
    }

    const body = await req.json();
    const validation = requestSchema.safeParse(body);

    if (!validation.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid request',
          details: validation.error.errors,
          loaderVersion: LOADER_VERSION,
        }),
        { status: 400, headers: jsonHeaders() }
      );
    }

    const { roomId } = validation.data;

    const {
      room,
      matchedId,
      matchedBy,
      candidatesTried,
      error: roomError,
    } = await findRoomByCandidates(dbClient, roomId);

    if (roomError || !room) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Room not found',
          requestedRoomId: roomId,
          candidatesTried,
          matchedBy,
          loaderVersion: LOADER_VERSION,
        }),
        { status: 404, headers: jsonHeaders() }
      );
    }

    const { data: entryData, error: entryError } = await dbClient
      .from('room_entries')
      .select('*')
      .eq('room_id', room.id)
      .order('index', { ascending: true });

    if (entryError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: entryError.message || 'Failed to load room entries',
          matchedId,
          matchedBy,
          requestedRoomId: roomId,
          loaderVersion: LOADER_VERSION,
        }),
        { status: 500, headers: jsonHeaders() }
      );
    }

    const roomWithEntries = {
      ...room,
      entries: Array.isArray(entryData) ? entryData : [],
    };

    return new Response(
      JSON.stringify(roomWithEntries),
      { headers: jsonHeaders() }
    );
  } catch (error: any) {
    console.error('Error in secure-room-loader:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message || 'Internal server error',
        loaderVersion: LOADER_VERSION,
      }),
      { status: 500, headers: jsonHeaders() }
    );
  }
});