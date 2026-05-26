// supabase/functions/account-convert/index.ts
//
// Day-of Deno entry. Wires production deps and delegates to
// `handleRequest`. Auth resolution uses the standard JWT verifier
// (the JWT in the Authorization header IS the anon user's JWT).

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import { wrapHandler } from "../_shared/sentry.ts";
import {
  handleRequest,
  type AnonUserContext,
  type Deps,
} from "./core.ts";
import type {
  AdminAuthSurface,
  ConversionSource,
  ConversionStatus,
  TelemetryWriter,
} from "../_shared/accountConversion.ts";
import type { MergeRpcSurface } from "../_shared/accountConversionOAuth.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey);

async function resolveAnonContext(req: Request): Promise<AnonUserContext | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) return null;

  // Decode the JWT to get the user; verify against the anon key.
  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data, error } = await userClient.auth.getUser(token);
  if (error || !data?.user) return null;

  // Pull is_anonymous + created_at from the admin row.
  const adminLookup = await adminClient.auth.admin.getUserById(data.user.id);
  if (adminLookup.error || !adminLookup.data?.user) return null;

  const u = adminLookup.data.user as {
    id: string;
    is_anonymous?: boolean | null;
    created_at?: string | null;
  };

  const sessionAgeSeconds = u.created_at
    ? Math.max(
        0,
        Math.floor((Date.now() - new Date(u.created_at).getTime()) / 1000),
      )
    : 0;

  return {
    userId: u.id,
    isAnonymous: u.is_anonymous === true,
    sessionAgeSeconds,
  };
}

const admin: AdminAuthSurface = {
  getUserById: async (userId) => {
    const res = await adminClient.auth.admin.getUserById(userId);
    return {
      data: {
        user: res.data?.user
          ? {
              id: res.data.user.id,
              is_anonymous: (res.data.user as { is_anonymous?: boolean | null }).is_anonymous ?? null,
              email: res.data.user.email ?? null,
            }
          : null,
      },
      error: res.error
        ? { message: res.error.message, status: res.error.status }
        : null,
    };
  },
  updateUserById: async (userId, attrs) => {
    const res = await adminClient.auth.admin.updateUserById(userId, attrs);
    return {
      data: { user: res.data?.user ? { id: res.data.user.id } : null },
      error: res.error
        ? {
            message: res.error.message,
            status: (res.error as { status?: number }).status,
            code: (res.error as { code?: string }).code,
          }
        : null,
    };
  },
};

const rpc: MergeRpcSurface = {
  mergeAnonIntoPermanent: async (anonUserId, permanentUserId) => {
    const res = await adminClient.rpc("merge_anon_user_into_permanent", {
      p_anon_id: anonUserId,
      p_permanent_id: permanentUserId,
    });
    if (res.error) {
      return {
        data: null,
        error: {
          message: res.error.message,
          code: (res.error as { code?: string }).code,
        },
      };
    }
    const row = Array.isArray(res.data) ? res.data[0] : res.data;
    return {
      data: row
        ? { rows_migrated_total: Number((row as { rows_migrated_total: number }).rows_migrated_total ?? 0) }
        : null,
      error: null,
    };
  },
};

const telemetry: TelemetryWriter = {
  recordConversion: async (input) => {
    try {
      await adminClient.from("account_conversions").insert({
        anon_user_id: input.anonUserId,
        permanent_user_id: input.permanentUserId ?? null,
        conversion_source: input.source as ConversionSource,
        status: input.status as ConversionStatus,
        error_code: input.errorCode ?? null,
        anon_session_age_seconds: input.anonSessionAgeSeconds ?? null,
        completed_at: input.status === "success" ? new Date().toISOString() : null,
      });
    } catch (err) {
      console.warn("[account-convert] telemetry insert failed:", err);
    }
  },
};

const productionDeps: Deps = {
  resolveAnonContext,
  admin,
  rpc,
  telemetry,
};

serve(wrapHandler("account-convert", (req) => handleRequest(req, productionDeps)));
