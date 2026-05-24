// Server-side minting endpoint for OpenAI Realtime WebRTC client secrets.
// The standard OPENAI_API_KEY is read only inside this edge function.

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const OPENAI_CLIENT_SECRETS_URL = "https://api.openai.com/v1/realtime/client_secrets";
const FEATURE_FLAG = "openai_realtime_voice";
const DEFAULT_MODEL = "gpt-realtime";
const DEFAULT_VOICE = "marin";
const DEFAULT_TTL_SECONDS = 600;

type RealtimeMode = "journey" | "speak";

type OpenAiClientSecretResponse = {
  value?: unknown;
  client_secret?: { value?: unknown; expires_at?: unknown };
  expires_at?: unknown;
  session?: { model?: unknown; audio?: { output?: { voice?: unknown } } };
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

function readEnv(key: string): string {
  try {
    return Deno.env.get(key) ?? "";
  } catch {
    return "";
  }
}

async function isFlagOn(
  client: {
    from: (table: string) => {
      select: (columns: string) => {
        eq: (column: string, value: string) => {
          maybeSingle: () => Promise<{
            data: { is_enabled: boolean | null; enabled_user_ids: string[] | null } | null;
            error: { message?: string } | null;
          }>;
        };
      };
    };
  },
  flagKey: string,
  userId?: string | null,
): Promise<boolean> {
  const { data, error } = await client
    .from("feature_flags")
    .select("is_enabled, enabled_user_ids")
    .eq("flag_key", flagKey)
    .maybeSingle();
  if (error || !data) return false;
  const cohort = Array.isArray(data.enabled_user_ids) ? data.enabled_user_ids : [];
  if (userId && cohort.includes(userId)) return true;
  return !!data.is_enabled;
}

function normalizeMode(value: unknown): RealtimeMode | null {
  return value === "journey" || value === "speak" ? value : null;
}

export function buildOpenAiRealtimeClientSecretRequest(args: {
  mode: RealtimeMode;
  targetLanguage?: string;
  explainLanguage?: string;
}): Record<string, unknown> {
  const targetLanguage = String(args.targetLanguage || "en").slice(0, 16);
  const explainLanguage = String(args.explainLanguage || "vi").slice(0, 16);
  return {
    expires_after: {
      anchor: "created_at",
      seconds: DEFAULT_TTL_SECONDS,
    },
    session: {
      type: "realtime",
      model: DEFAULT_MODEL,
      instructions: [
        "You are Teacher Mercy, a warm language tutor for MercyB AI Tutor.",
        `Mode: ${args.mode}. Target language: ${targetLanguage}. Explain language: ${explainLanguage}.`,
        "Have a short spoken practice conversation. Correct gently and keep responses concise.",
        "Do not request or store personal data. Do not produce full transcripts.",
      ].join(" "),
      audio: {
        output: {
          voice: DEFAULT_VOICE,
        },
      },
    },
  };
}

export function extractEphemeralClientSecret(data: OpenAiClientSecretResponse): {
  clientSecret: string;
  expiresAt: number | null;
  model: string;
  voice: string;
} | null {
  const value =
    typeof data?.client_secret?.value === "string"
      ? data.client_secret.value
      : typeof data?.value === "string"
        ? data.value
        : "";
  if (!value) return null;
  const expiresAt =
    typeof data?.client_secret?.expires_at === "number"
      ? data.client_secret.expires_at
      : typeof data?.expires_at === "number"
        ? data.expires_at
        : null;
  const model = typeof data?.session?.model === "string" ? data.session.model : DEFAULT_MODEL;
  const voice = typeof data?.session?.audio?.output?.voice === "string"
    ? data.session.audio.output.voice
    : DEFAULT_VOICE;
  return { clientSecret: value, expiresAt, model, voice };
}

export async function handleRequest(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = readEnv("SUPABASE_URL");
  const anonKey = readEnv("SUPABASE_ANON_KEY");
  const serviceRoleKey = readEnv("SUPABASE_SERVICE_ROLE_KEY");
  const openAiKey = readEnv("OPENAI_API_KEY");
  const authHeader = req.headers.get("Authorization");
  const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");

  const service = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let userId: string | null = null;
  if (authHeader) {
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    userId = user?.id ?? null;
  }

  const flagEnabled = await isFlagOn(service, FEATURE_FLAG, userId);
  if (!flagEnabled) {
    return jsonResponse({ error: "Realtime voice disabled", code: "flag_off" }, 503);
  }
  if (!openAiKey) {
    return jsonResponse({ error: "OpenAI Realtime not configured", code: "openai_key_missing" }, 503);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const mode = normalizeMode(body.mode);
  if (!mode) {
    return jsonResponse({ error: "mode must be journey or speak" }, 400);
  }

  const openAiResponse = await fetch(OPENAI_CLIENT_SECRETS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openAiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildOpenAiRealtimeClientSecretRequest({
      mode,
      targetLanguage: typeof body.targetLanguage === "string" ? body.targetLanguage : "en",
      explainLanguage: typeof body.explainLanguage === "string" ? body.explainLanguage : "vi",
    })),
  });

  if (!openAiResponse.ok) {
    return jsonResponse({ error: "OpenAI Realtime session failed", upstream_status: openAiResponse.status }, 502);
  }

  const secret = extractEphemeralClientSecret(await openAiResponse.json().catch(() => null));
  if (!secret) {
    return jsonResponse({ error: "OpenAI Realtime session missing client secret" }, 502);
  }

  return jsonResponse(secret);
}

if (typeof Deno !== "undefined") {
  const { serve } = await import("https://deno.land/std@0.224.0/http/server.ts");
  serve(handleRequest);
}
