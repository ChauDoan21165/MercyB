// supabase/functions/sign-audio/index.ts
// MB-SAFE: returns signed URL for private audio objects

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Body = { path?: string };

Deno.serve(async (req: Request) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "method not allowed" }), {
        status: 405,
        headers: { "content-type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: "missing env" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const body = (await req.json().catch(() => ({}))) as Body;
    const p = String(body.path || "").trim().replace(/^\/+/, "");
    if (!p) {
      return new Response(JSON.stringify({ error: "missing path" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    // HARDEN: keep signing scoped to one prefix (adjust if you want)
    // Example allowed: "vip3/xxx.mp3" or "vip9/yyy.mp3"
    if (!/^(vip1|vip3|vip9)\//.test(p)) {
      return new Response(JSON.stringify({ error: "path not allowed" }), {
        status: 403,
        headers: { "content-type": "application/json" },
      });
    }

    const BUCKET = "audio-private"; // create this private bucket in Supabase Storage
    const expiresIn = 60 * 10; // 10 minutes

    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(p, expiresIn);
    if (error || !data?.signedUrl) {
      return new Response(JSON.stringify({ error: error?.message || "sign failed" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ url: data.signedUrl }), {
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error)?.message || e) }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
});
