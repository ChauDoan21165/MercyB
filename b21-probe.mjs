// B21 — failed customer.subscription.deleted webhook events forensic.
// READ ONLY. No writes. Service-role key from argv[2]. Prod project hardcoded.
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://buemdfxyhxunzpgdoqin.supabase.co";
const KEY = process.argv[2];
if (!KEY) { console.error("missing service-role key arg"); process.exit(1); }

const db = createClient(SUPABASE_URL, KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const out = (label, v) => {
  console.log(`\n==================== ${label} ====================`);
  console.log(JSON.stringify(v, null, 2));
};

// Brief-named event IDs (some partial — match by prefix where partial).
const NAMED = [
  "evt_1TUxM52K1tPxy04udiaKvPJL",   // event 1 — A77 "unknowable"
  "evt_1TUz732K1tPxy04uz1zfCXKV",   // user 04c57155 (A94 cleanup)
  "evt_1TUzYp",                     // partial — user 397a6ab7 (A94 cleanup)
];
const KNOWN_USER_PREFIXES = ["04c57155", "397a6ab7"];

// 1) The 3 named events by exact id (+ prefix for the partial one).
for (const e of NAMED) {
  if (e.length >= 27) {
    const r = await db.from("stripe_webhook_events")
      .select("event_id,type,livemode,processed_at,error,created_at")
      .eq("event_id", e).maybeSingle();
    out(`stripe_webhook_events exact "${e}"`, { data: r.data, error: r.error });
  } else {
    const r = await db.from("stripe_webhook_events")
      .select("event_id,type,livemode,processed_at,error,created_at")
      .like("event_id", `${e}%`);
    out(`stripe_webhook_events prefix "${e}%"`, { count: r.data?.length ?? 0, rows: r.data, error: r.error });
  }
}

// 2) ALL stripe_webhook_events in the window 2026-05-06 .. 2026-05-12
//    (let the data reveal the full failed set; don't rely on partial ids).
{
  const r = await db.from("stripe_webhook_events")
    .select("event_id,type,livemode,processed_at,error,created_at")
    .gte("created_at", "2026-05-06T00:00:00Z")
    .lte("created_at", "2026-05-12T00:00:00Z")
    .order("created_at", { ascending: true });
  out("stripe_webhook_events ALL (2026-05-06 .. 2026-05-12)", {
    count: r.data?.length ?? 0, error: r.error, rows: r.data,
  });
}

// 2b) Every UNPROCESSED event since 2026-05-01 (processed_at IS NULL).
{
  const r = await db.from("stripe_webhook_events")
    .select("event_id,type,livemode,processed_at,error,created_at")
    .is("processed_at", null)
    .gte("created_at", "2026-05-01T00:00:00Z")
    .order("created_at", { ascending: true });
  out("stripe_webhook_events processed_at IS NULL (since 2026-05-01)", {
    count: r.data?.length ?? 0, error: r.error, rows: r.data,
  });
}

// 2c) Every event WITH an error since 2026-05-01.
{
  const r = await db.from("stripe_webhook_events")
    .select("event_id,type,livemode,processed_at,error,created_at")
    .not("error", "is", null)
    .gte("created_at", "2026-05-01T00:00:00Z")
    .order("created_at", { ascending: true });
  out("stripe_webhook_events error NOT NULL (since 2026-05-01)", {
    count: r.data?.length ?? 0, error: r.error, rows: r.data,
  });
}

// 2d) Only customer.subscription.deleted, wider window, all states.
{
  const r = await db.from("stripe_webhook_events")
    .select("event_id,type,livemode,processed_at,error,created_at")
    .eq("type", "customer.subscription.deleted")
    .gte("created_at", "2026-04-15T00:00:00Z")
    .order("created_at", { ascending: true });
  out("stripe_webhook_events type=customer.subscription.deleted (since 2026-04-15)", {
    count: r.data?.length ?? 0, error: r.error, rows: r.data,
  });
}

// 3) Known users (A77/A94) — profiles + their stripe subscriptions now.
for (const px of KNOWN_USER_PREFIXES) {
  const prof = await db.from("profiles")
    .select("id,email,tier,premium_status,premium_expires_at,premium_source,stripe_customer_id,created_at")
    .like("id", `${px}%`).maybeSingle();
  out(`profiles id like ${px}%`, { data: prof.data, error: prof.error });
  const uid = prof.data?.id;
  if (uid) {
    const subs = await db.from("subscriptions")
      .select("id,user_id,provider,status,provider_customer_id,provider_subscription_id,current_period_start,current_period_end,cancel_at_period_end,canceled_at,ended_at,created_at,updated_at")
      .eq("user_id", uid);
    out(`subscriptions for user ${uid}`, { count: subs.data?.length ?? 0, error: subs.error, rows: subs.data });
    const us = await db.from("user_subscriptions").select("*").eq("user_id", uid);
    out(`user_subscriptions (gift/manual) for ${uid}`, { count: us.data?.length ?? 0, error: us.error, rows: us.data });
  }
}

// 4) Candidate PHANTOM set: stripe subs still entitled-active whose lifecycle
//    touches the 2026-05-06..05-12 window. status still in the "live" set.
{
  const liveStatuses = ["active", "trialing", "past_due", "grace_period", "paused"];
  const r = await db.from("subscriptions")
    .select("id,user_id,provider,status,provider_customer_id,provider_subscription_id,current_period_start,current_period_end,cancel_at_period_end,canceled_at,ended_at,created_at,updated_at")
    .eq("provider", "stripe")
    .in("status", liveStatuses)
    .order("current_period_end", { ascending: true });
  // Slim: flag rows whose period/cancel/updated lands in the suspect window.
  const W0 = Date.parse("2026-05-01T00:00:00Z");
  const W1 = Date.parse("2026-05-15T00:00:00Z");
  const inWin = (ts) => { const t = ts ? Date.parse(ts) : NaN; return Number.isFinite(t) && t >= W0 && t <= W1; };
  const flagged = (r.data ?? []).map((s) => ({
    ...s,
    _suspect_window:
      inWin(s.current_period_end) || inWin(s.canceled_at) ||
      inWin(s.ended_at) || inWin(s.updated_at),
  }));
  out("subscriptions provider=stripe AND status in LIVE set (all)", {
    count: r.data?.length ?? 0, error: r.error,
    suspect_in_window: flagged.filter((x) => x._suspect_window),
    all_live_rows: flagged,
  });
}

// 5) entitlement_events around the window — audit trail of APPLIED events.
//    A failed sub.deleted will be ABSENT here; a preceding success may carry
//    the customer/subscription that lets us attribute by correlation.
{
  const r = await db.from("entitlement_events")
    .select("id,provider,event_type,event_id,user_id,created_at")
    .gte("created_at", "2026-05-05T00:00:00Z")
    .lte("created_at", "2026-05-12T00:00:00Z")
    .order("created_at", { ascending: true });
  out("entitlement_events APPLIED (2026-05-05 .. 2026-05-12)", {
    count: r.data?.length ?? 0, error: r.error, rows: r.data,
  });
}

// 5b) Does ANY entitlement_events row carry one of the named failed event_ids?
//     (proves the deletion was never applied if absent.)
{
  const names = ["evt_1TUxM52K1tPxy04udiaKvPJL", "evt_1TUz732K1tPxy04uz1zfCXKV"];
  const r = await db.from("entitlement_events")
    .select("id,provider,event_type,event_id,user_id,created_at")
    .in("event_id", names);
  out("entitlement_events matching named failed event_ids (expect 0)", {
    count: r.data?.length ?? 0, error: r.error, rows: r.data,
  });
  const r2 = await db.from("entitlement_events")
    .select("id,event_type,event_id,user_id,created_at")
    .like("event_id", "evt_1TUzYp%");
  out("entitlement_events event_id like evt_1TUzYp% (expect 0)", {
    count: r2.data?.length ?? 0, error: r2.error, rows: r2.data,
  });
}

// 6) Attribution attempt for the UNKNOWABLE event (evt_1TUxM5..., 05-08 22:58Z).
//    entitlement_events payload carries data.object.customer/subscription.
//    Pull every entitlement_events payload in a tight ±6h window around
//    2026-05-08T22:58Z and surface customer/subscription ids seen.
{
  const r = await db.from("entitlement_events")
    .select("id,event_type,event_id,user_id,created_at,payload")
    .gte("created_at", "2026-05-08T17:00:00Z")
    .lte("created_at", "2026-05-09T05:00:00Z")
    .order("created_at", { ascending: true });
  const slim = (r.data ?? []).map((row) => {
    const o = row.payload?.data?.object ?? {};
    return {
      created_at: row.created_at, event_type: row.event_type, event_id: row.event_id,
      user_id: row.user_id,
      cust: o.customer ?? o.customer_id ?? null,
      sub: o.subscription ?? (o.object === "subscription" ? o.id : null),
      status: o.status ?? null,
    };
  });
  out("entitlement_events ±6h around 2026-05-08T22:58Z (attribution)", {
    count: r.data?.length ?? 0, error: r.error, rows: slim,
  });
}

console.log("\n\n=== B21 read-only forensic complete — NO writes performed ===");
