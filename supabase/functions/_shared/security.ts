import {
  createClient,
  type SupabaseClient,
} from 'https://esm.sh/@supabase/supabase-js@2';
import type { Database, Json } from './database.types.ts';

type DB = SupabaseClient<Database>;

let _supabaseAdmin: DB | null = null;

export const createSupabaseAdminClient = (): DB => {
  if (_supabaseAdmin) return _supabaseAdmin;

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  _supabaseAdmin = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  return _supabaseAdmin;
};

export const getUserFromAuthHeader = async (req: Request) => {
  const authHeader = req.headers.get('Authorization') || '';
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) return null;

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.auth.getUser(token);
  if (error) {
    console.error('getUserFromAuthHeader error', error);
    return null;
  }
  return data.user ?? null;
};

export const assertAdmin = async (userId: string) => {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.rpc('has_role', {
    _role: 'admin',
    _user_id: userId,
  });

  if (error || !data) {
    throw new Response(JSON.stringify({ error: 'FORBIDDEN' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const checkEndpointRateLimit = async (
  endpointName: string,
  userId: string
) => {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.rpc('check_endpoint_rate_limit', {
    endpoint_name: endpointName,
    user_uuid: userId,
  });

  if (error) {
    console.error('checkEndpointRateLimit error', error);
    // Fail-closed: if rate limit check fails, treat as blocked
    throw new Response(JSON.stringify({ error: 'RATE_LIMIT_CHECK_FAILED' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!data) {
    // function returns false when over limit
    throw new Response(JSON.stringify({ error: 'RATE_LIMIT_EXCEEDED' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const logAudit = async (params: {
  type: string;
  userId: string | null;
  metadata?: Json;
}) => {
  const { type, userId, metadata } = params;
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase.from('audit_logs').insert({
    type,
    user_id: userId,
    metadata: metadata ?? null,
  });

  if (error) {
    console.error('Failed to insert audit log', error);
  }
};

export const getClientIP = (req: Request): string => {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
};
