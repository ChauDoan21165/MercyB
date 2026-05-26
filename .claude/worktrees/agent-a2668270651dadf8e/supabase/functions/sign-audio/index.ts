// supabase/functions/sign-audio/index.ts
// MB-SAFE: returns signed URL for private audio objects after auth + entitlement checks

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Body = { path?: string };

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

Deno.serve(async (req: Request) => {
  try {
    if (req.method !== "POST") {
      return json({ error: "method not allowed" }, 405);
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !ANON_KEY || !SERVICE_ROLE_KEY) {
      return json({ error: "missing env" }, 500);
    }

    const authHeader = req.headers.get("authorization") || "";
    if (!authHeader.toLowerCase().startsWith("bearer ")) {
      return json({ error: "missing authorization" }, 401);
    }

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return json({ error: "unauthorized" }, 401);
    }

    const body = (await req.json().catch(() => ({}))) as Body;
    const p = String(body.path || "").trim().replace(/^\/+/, "");

    if (!p) {
      return json({ error: "missing path" }, 400);
    }

    if (p.includes("..") || p.includes("\\")) {
      return json({ error: "path not allowed" }, 403);
    }

    const levelMatch = p.match(/^(level1|level3|level9)\//);
    if (!levelMatch) {
      return json({ error: "path not allowed" }, 403);
    }

    const requestedLevel = levelMatch[1];

    const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("id, role, tier")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      return json({ error: "entitlement check failed" }, 500);
    }

    const role = String(profile?.role || "");
    const tier = String(profile?.tier || "");

    const isAdmin = role === "admin" || role === "owner";
    const canAccess =
      isAdmin ||
      requestedLevel === "level1" ||
      (requestedLevel === "level3" && ["level3", "level9", "premium", "pro"].includes(tier)) ||
      (requestedLevel === "level9" && ["level9", "premium", "pro"].includes(tier));

    if (!canAccess) {
      return json({ error: "audio access denied" }, 403);
    }

    const BUCKET = "audio-private";
    const expiresIn = 60 * 10;

    const { data, error } = await adminClient.storage
      .from(BUCKET)
      .createSignedUrl(p, expiresIn);

    if (error || !data?.signedUrl) {
      return json({ error: error?.message || "sign failed" }, 400);
    }

    return json({ url: data.signedUrl });
  } catch (e) {
    return json({ error: String((e as Error)?.message || e) }, 500);
  }
});