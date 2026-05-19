// B21 probe 2 — full subscription history + profile + gift-guard for the
// three implicated users; confirm there's no second (expired) row.
// READ ONLY. argv[2] = service-role key.
import { createClient } from "@supabase/supabase-js";
const db = createClient("https://buemdfxyhxunzpgdoqin.supabase.co", process.argv[2],
  { auth: { persistSession: false, autoRefreshToken: false } });
const out = (l, v) => { console.log(`\n===== ${l} =====`); console.log(JSON.stringify(v, null, 2)); };

const USERS = {
  "U1 (04c57155 — evt_1TUz73, period_end 05-09T00:50:36Z)": "04c57155-b479-4615-bb78-d036bb91dbf2",
  "U2 (397a6ab7 — evt_1TUzYp, period_end 05-09T01:19:27Z)": "397a6ab7-1d3a-480f-9f02-9021a438d02a",
  "U3 (cd9b889c — B5/mylinh, renewed 05-09T07:18, control)": "cd9b889c-eb9f-428f-9462-de66d4f92c04",
};

for (const [label, uid] of Object.entries(USERS)) {
  const prof = await db.from("profiles")
    .select("id,email,tier,premium_status,premium_expires_at,premium_source,plan_type,access_expires_at,stripe_customer_id,created_at")
    .eq("id", uid).maybeSingle();
  out(`PROFILE ${label}`, { data: prof.data, error: prof.error });

  const subs = await db.from("subscriptions")
    .select("id,user_id,provider,status,provider_customer_id,provider_subscription_id,current_period_start,current_period_end,cancel_at_period_end,canceled_at,ended_at,created_at,updated_at")
    .eq("user_id", uid).order("created_at", { ascending: true });
  out(`ALL subscriptions (any status/provider) ${label}`, { count: subs.data?.length ?? 0, error: subs.error, rows: subs.data });

  const us = await db.from("user_subscriptions").select("*").eq("user_id", uid);
  out(`user_subscriptions GIFT/MANUAL guard ${label}`, { count: us.data?.length ?? 0, error: us.error, rows: us.data });

  const ee = await db.from("entitlement_events")
    .select("id,provider,event_type,event_id,created_at")
    .eq("user_id", uid).order("created_at", { ascending: true });
  out(`entitlement_events full audit ${label}`, { count: ee.data?.length ?? 0, error: ee.error, rows: ee.data });
}

// Re-confirm: total population of failed customer.subscription.deleted ever.
{
  const r = await db.from("stripe_webhook_events")
    .select("event_id,type,processed_at,error,created_at")
    .eq("type", "customer.subscription.deleted")
    .order("created_at", { ascending: true });
  out("ALL customer.subscription.deleted events EVER (full table scan)", {
    count: r.data?.length ?? 0, error: r.error, rows: r.data,
  });
}
// And: any event_id starting evt_1TUxM5 / evt_1TUz73 anywhere (sanity).
{
  for (const p of ["evt_1TUxM5", "evt_1TUz73", "evt_1TUzYp"]) {
    const r = await db.from("stripe_webhook_events")
      .select("event_id,type,processed_at,error,created_at").like("event_id", `${p}%`);
    out(`stripe_webhook_events like ${p}%`, { count: r.data?.length ?? 0, rows: r.data, error: r.error });
  }
}
console.log("\n=== B21 probe2 complete — NO writes ===");
