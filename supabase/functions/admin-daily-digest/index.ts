// supabase/functions/admin-daily-digest/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient } from "jsr:@supabase/supabase-js@2";
import { sendEmail } from "../_shared/sendEmail.ts";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

type InboxRow = {
  created_at: string;
  source: "chat" | "feedback" | string;
  room_id: string | null;
  user_email: string | null;
  kind: string | null;
  severity: number | null;
  is_important: boolean | null;
  importance_reason: string | null;
  admin_note: string | null;
  message: string | null;
};

function fmtDigest(rows: InboxRow[]) {
  if (!rows.length) return "No IMPORTANT items in the last 24 hours.";

  const lines: string[] = [];
  lines.push(`IMPORTANT items (last 24h): ${rows.length}`);
  lines.push("");

  for (const r of rows) {
    const when = r.created_at ?? "";
    const room = r.room_id ?? "";
    const email = r.user_email ?? "";
    const kind = r.kind ?? r.source ?? "";
    const sev = r.severity == null ? "" : `sev=${r.severity}`;
    const reason = (r.importance_reason ?? r.admin_note) ?? "";
    const msg = (r.message ?? "").replace(/\s+/g, " ").trim();
    const preview = msg.length > 220 ? msg.slice(0, 220) + "…" : msg;

    lines.push(`• ${when} | ${r.source} | ${kind} ${sev}`.trim());
    lines.push(`  room: ${room}`);
    lines.push(`  user: ${email}`);
    if (reason) lines.push(`  reason: ${reason}`);
    if (preview) lines.push(`  msg: ${preview}`);
    lines.push("");
  }

  return lines.join("\n");
}

function parseDryRun(v: unknown): boolean {
  // Avoid Boolean("false") === true
  if (v === true) return true;
  if (v === 1) return true;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    return s === "1" || s === "true" || s === "yes" || s === "y";
  }
  return false;
}

Deno.serve(async (req) => {
  try {
    // 1) Auth (cron secret)
    const expected = Deno.env.get("ADMIN_CRON_SECRET") ?? "";
    const got = req.headers.get("x-admin-cron-secret") ?? "";
    if (!expected || got !== expected) {
      return json({ ok: false, error: "unauthorized" }, 401);
    }

    // 2) tolerate empty body (optional future config)
    let body: any = {};
    try {
      const txt = await req.text();
      body = txt ? JSON.parse(txt) : {};
    } catch {
      body = {};
    }

    // Optional: allow dryRun to test DB fetch without email
    const dryRun = parseDryRun(body?.dryRun);

    // 3) Supabase service client (bypass RLS safely for admin job)
    const url = Deno.env.get("SUPABASE_URL") ?? Deno.env.get("SB_URL") ?? "";
    const serviceKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
      Deno.env.get("SB_SERVICE_ROLE_KEY") ??
      "";

    if (!url || !serviceKey) {
      return json(
        {
          ok: false,
          error:
            "Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY secrets for admin-daily-digest.",
        },
        500
      );
    }

    const supabase = createClient(url, serviceKey, {
      auth: { persistSession: false },
    });

    // 4) Fetch IMPORTANT items (last 24h)
    const sinceIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("admin_inbox")
      .select(
        "created_at, source, room_id, user_email, kind, severity, is_important, importance_reason, admin_note, message"
      )
      .gte("created_at", sinceIso)
      .eq("is_important", true)
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) throw error;

    const rows = (data ?? []) as InboxRow[];

    if (dryRun) {
      return json({
        ok: true,
        dryRun: true,
        count: rows.length,
        since: sinceIso,
        sample: rows.slice(0, 5),
      });
    }

    // 5) Email
    const to = Deno.env.get("ADMIN_DIGEST_TO") ?? "";
    if (!to) {
      return json({ ok: false, error: "Missing ADMIN_DIGEST_TO secret." }, 500);
    }

    const subject = `Mercy Admin Inbox — IMPORTANT (${rows.length}) — last 24h`;
    const text = fmtDigest(rows);

    try {
      await sendEmail({
        appKey: "mercy_blade",
        to,
        subject,
        text,
      } as any);
    } catch (e) {
      // Return a useful error payload (no secrets leaked)
      const envDiag = {
        has_ADMIN_DIGEST_TO: Boolean(Deno.env.get("ADMIN_DIGEST_TO")),
        has_SUPABASE_URL: Boolean(
          Deno.env.get("SUPABASE_URL") ?? Deno.env.get("SB_URL")
        ),
        has_SERVICE_ROLE: Boolean(
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
            Deno.env.get("SB_SERVICE_ROLE_KEY")
        ),
        // common email envs (presence only)
        has_EMAIL_PROVIDER: Boolean(Deno.env.get("EMAIL_PROVIDER")),
        has_POSTMARK_SERVER_TOKEN: Boolean(Deno.env.get("POSTMARK_SERVER_TOKEN")),
        has_SENDGRID_API_KEY: Boolean(Deno.env.get("SENDGRID_API_KEY")),
        has_SMTP_HOST: Boolean(Deno.env.get("SMTP_HOST")),
        has_SMTP_PORT: Boolean(Deno.env.get("SMTP_PORT")),
      };

      console.error("admin-daily-digest sendEmail failed:", e);

      const errDetails =
        e instanceof Error
          ? { name: e.name, message: e.message, stack: e.stack }
          : { message: String(e) };

      return json(
        {
          ok: false,
          sent: false,
          error: "sendEmail failed",
          details: errDetails,
          envDiag,
          hint:
            "If running in Supabase Edge (prod), local SMTP (inbucket/mailpit) is not reachable. Set EMAIL_PROVIDER + provider token (Postmark/SendGrid) in Supabase secrets.",
        },
        500
      );
    }

    return json({ ok: true, sent: true, count: rows.length, since: sinceIso });
  } catch (e) {
    console.error("admin-daily-digest error:", e);

    const errDetails =
      e instanceof Error
        ? { name: e.name, message: e.message, stack: e.stack }
        : { message: String(e) };

    return json(
      {
        ok: false,
        error: "admin-daily-digest failed",
        details: errDetails,
      },
      500
    );
  }
});
