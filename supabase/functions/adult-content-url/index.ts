import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const key = url.searchParams.get("key"); // e.g. "vip3/sacred_body_curious_self_vip3_sub2_sex.json"
    if (!key) return new Response("Missing key", { status: 400 });

    // Create Supabase client as the logged-in user (RLS applies)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    });

    // 1) Require logged in
    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authData?.user) return new Response("Unauthorized", { status: 401 });
    const userId = authData.user.id;

    // 2) Check adult-confirmed
    const { data: profile, error: profErr } = await supabase
      .from("profiles")
      .select("is_adult_confirmed")
      .eq("id", userId)
      .single();

    if (profErr) return new Response("Profile lookup failed", { status: 500 });
    if (!profile?.is_adult_confirmed) {
      return new Response(JSON.stringify({ error: "adult_not_confirmed" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3) Check subscription/tier (example: subscriptions table)
    const { data: sub, error: subErr } = await supabase
      .from("subscriptions")
      .select("status, tier")
      .eq("user_id", userId)
      .single();

    // Decide your rule here:
    const hasAccess =
      !subErr &&
      sub &&
      (sub.status === "active" || sub.status === "trialing") &&
      (sub.tier === "vip3" || sub.tier === "vip9");

    if (!hasAccess) {
      return new Response(JSON.stringify({ error: "not_entitled" }), {
        status: 402,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 4) Generate signed URL to private bucket object
    const admin = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: signed, error: signErr } = await admin.storage
      .from("adult-content")
      .createSignedUrl(key, 60); // 60 seconds

    if (signErr || !signed?.signedUrl) {
      return new Response("Signing failed", { status: 500 });
    }

    return new Response(JSON.stringify({ signedUrl: signed.signedUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response("Server error", { status: 500 });
  }
});