// PATH: supabase/functions/_shared/sendEmail.ts
// VERSION: v2026-01-06.prod.3+patch1 (DB schema compatible: email_outbox has to_email/template_key/variables/attempts/last_error/sent_at/error_message; no provider column)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { renderEmailTemplate } from "./emailTemplates.ts";

export type SendEmailArgs = {
  to: string;
  templateKey?: string;
  variables?: Record<string, string>;
  appKey?: string;
  correlationId?: string;
};

type Provider = "local_smtp" | "postmark" | "sendgrid";

// ---------------------------
// env helpers
// ---------------------------
function getEnv(name: string): string | undefined {
  const v = Deno.env.get(name);
  const t = v?.trim();
  return t && t.length ? t : undefined;
}

function env(name: string) {
  return (Deno.env.get(name) ?? "").trim();
}

function nowIso() {
  return new Date().toISOString();
}

function norm(x: unknown) {
  return String(x ?? "").trim();
}

function escapeHtml(s: string) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function resolveProvider(): Provider {
  const p = (getEnv("EMAIL_PROVIDER") ?? "").toLowerCase();
  if (p === "postmark") return "postmark";
  if (p === "sendgrid") return "sendgrid";
  return "local_smtp";
}

function resolveFrom(_appKey: string) {
  // PATCH: support your actual secret names
  const fromEmail = env("EMAIL_FROM") || env("POSTMARK_FROM") || "no-reply@mercyblade.com";
  const fromLabel = env("EMAIL_FROM_LABEL") || "Mercy";
  return { fromEmail, fromLabel };
}

function subjectWithPrefix(subject: string, localPort: number) {
  const cfg = getEnv("EMAIL_SUBJECT_PREFIX");
  const prefix = (cfg && cfg.trim()) || (localPort === 1025 ? "[LOCAL] " : "");
  if (!prefix) return subject;
  if (subject.startsWith(prefix)) return subject;
  return `${prefix}${subject}`;
}

// ---------------------------
// Outbox (best-effort) — matches CURRENT DB schema
// ---------------------------
function getSupabaseAdminForOutbox() {
  const url = env("SUPABASE_URL");
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

async function outboxInsertBestEffort(payload: Record<string, unknown>) {
  try {
    const sb = getSupabaseAdminForOutbox();
    if (!sb) return null;

    const { data, error } = await sb
      .from("email_outbox")
      .insert(payload)
      .select("id")
      .maybeSingle();

    if (error) {
      console.warn("[sendEmail] email_outbox insert failed (ignored):", error.message);
      return null;
    }
    return (data as any)?.id ?? null;
  } catch (e) {
    console.warn("[sendEmail] email_outbox insert threw (ignored):", e);
    return null;
  }
}

async function outboxUpdateBestEffort(id: unknown, patch: Record<string, unknown>) {
  try {
    const outboxId = typeof id === "string" ? id : null;
    if (!outboxId) return;

    const sb = getSupabaseAdminForOutbox();
    if (!sb) return;

    const { error } = await sb.from("email_outbox").update(patch).eq("id", outboxId);
    if (error) console.warn("[sendEmail] email_outbox update failed (ignored):", error.message);
  } catch (e) {
    console.warn("[sendEmail] email_outbox update threw (ignored):", e);
  }
}

// ---------------------------
// Provider: Postmark
// ---------------------------
async function sendViaPostmark(args: {
  to: string;
  subject: string;
  html: string;
  fromEmail: string;
  fromLabel: string;
  headers: Record<string, string>;
}) {
  // PATCH: support POSTMARK_API_KEY (your secret name) + fallback POSTMARK_TOKEN
  const token = getEnv("POSTMARK_API_KEY") || getEnv("POSTMARK_TOKEN");
  if (!token) throw new Error("Missing POSTMARK_API_KEY (or POSTMARK_TOKEN)");

  const resp = await fetch("https://api.postmarkapp.com/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Postmark-Server-Token": token,
    },
    body: JSON.stringify({
      From: `${args.fromLabel} <${args.fromEmail}>`,
      To: args.to,
      Subject: args.subject,
      HtmlBody: args.html,
      MessageStream: env("POSTMARK_MESSAGE_STREAM") || "outbound",
      Headers: Object.entries(args.headers).map(([Name, Value]) => ({ Name, Value })),
    }),
  });

  if (!resp.ok) {
    const t = await resp.text().catch(() => "");
    throw new Error(`Postmark failed: ${resp.status} ${t}`.trim());
  }
}

// ---------------------------
// Provider: SendGrid
// ---------------------------
async function sendViaSendGrid(args: {
  to: string;
  subject: string;
  html: string;
  fromEmail: string;
  fromLabel: string;
  headers: Record<string, string>;
}) {
  const key = getEnv("SENDGRID_API_KEY");
  if (!key) throw new Error("Missing SENDGRID_API_KEY");

  const resp = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: args.to }] }],
      from: { email: args.fromEmail, name: args.fromLabel },
      subject: args.subject,
      content: [{ type: "text/html", value: args.html }],
      headers: args.headers,
    }),
  });

  if (!resp.ok) {
    const t = await resp.text().catch(() => "");
    throw new Error(`SendGrid failed: ${resp.status} ${t}`.trim());
  }
}

// ---------------------------
// Local SMTP (RAW) — NO AUTH / NO TLS
// ---------------------------
function encodeSMTPData(s: string) {
  const crlf = s.replace(/\r?\n/g, "\r\n");
  return crlf.replace(/^\./gm, "..");
}

async function readLine(conn: Deno.TcpConn): Promise<string> {
  const buf = new Uint8Array(4096);
  let out = "";
  while (true) {
    const n = await conn.read(buf);
    if (n === null) break;

    out += new TextDecoder().decode(buf.subarray(0, n));
    const idx = out.indexOf("\r\n");
    if (idx !== -1) return out.slice(0, idx);

    if (out.length > 100_000) throw new Error("SMTP read overflow");
  }
  return out;
}

async function expect2xx3xx(conn: Deno.TcpConn, context: string) {
  let line = await readLine(conn);
  if (!line) throw new Error(`${context}: empty SMTP response`);

  const code = Number(line.slice(0, 3));
  if (Number.isNaN(code)) throw new Error(`${context}: invalid SMTP code: ${line}`);

  while (line.length >= 4 && line[3] === "-") line = await readLine(conn);
  if (code < 200 || code >= 400) throw new Error(`${context}: ${line}`);
}

async function sendCmd(conn: Deno.TcpConn, cmd: string) {
  await conn.write(new TextEncoder().encode(cmd + "\r\n"));
}

async function sendViaLocalRawSmtp(args: {
  host: string;
  port: number;
  to: string;
  subject: string;
  html: string;
  fromEmail: string;
  fromLabel: string;
  extraHeaders: string[];
}) {
  // Intentionally ignore SMTP_USER / SMTP_PASS for LOCAL
  if (getEnv("SMTP_USER") || getEnv("SMTP_PASS")) {
    console.log("[sendEmail] SMTP_USER / SMTP_PASS detected but intentionally ignored");
  }

  const fromHeader = `${args.fromLabel} <${args.fromEmail}>`;
  const message = [
    `From: ${fromHeader}`,
    `To: <${args.to}>`,
    ...args.extraHeaders,
    `Subject: ${args.subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=utf-8`,
    `Content-Transfer-Encoding: 8bit`,
    ``,
    encodeSMTPData(args.html),
    ``,
  ].join("\r\n");

  const conn = await Deno.connect({ hostname: args.host, port: args.port });
  try {
    await expect2xx3xx(conn, "SMTP greeting");
    await sendCmd(conn, "HELO localhost");
    await expect2xx3xx(conn, "HELO");
    await sendCmd(conn, `MAIL FROM:<${args.fromEmail}>`);
    await expect2xx3xx(conn, "MAIL FROM");
    await sendCmd(conn, `RCPT TO:<${args.to}>`);
    await expect2xx3xx(conn, "RCPT TO");
    await sendCmd(conn, "DATA");
    await expect2xx3xx(conn, "DATA");
    await sendCmd(conn, message + "\r\n.");
    await expect2xx3xx(conn, "Message body");
    await sendCmd(conn, "QUIT");
    try {
      await expect2xx3xx(conn, "QUIT");
    } catch {
      // mailpit/inbucket may close early
    }
  } finally {
    try {
      conn.close();
    } catch {
      // ignore
    }
  }
}

// ---------------------------
// Public API
// ---------------------------
export async function sendEmail({
  to,
  templateKey,
  variables = {},
  appKey = "mercy_blade",
  correlationId,
}: SendEmailArgs) {
  const provider = resolveProvider();

  // Safety: force all emails if configured
  const forceTo = getEnv("EMAIL_FORCE_TO");
  const originalTo = to;
  const finalTo = forceTo && forceTo.trim() ? forceTo.trim() : to;

  const rendered = renderEmailTemplate({
    appKey,
    templateKey,
    variables,
    env,
  });

  const localPort = Number(getEnv("SMTP_PORT") ?? "1025");
  const subject = subjectWithPrefix(rendered.subject, localPort);

  const { fromEmail, fromLabel } = resolveFrom(appKey);

  const headersObj: Record<string, string> = {
    "X-App-Key": norm(appKey) || "mercy_blade",
    "X-Template-Key": norm(templateKey ?? "notification"),
  };
  if (correlationId && correlationId.trim()) headersObj["X-Correlation-Id"] = correlationId.trim();
  if (forceTo && forceTo.trim() && originalTo && originalTo !== forceTo.trim()) {
    headersObj["X-Original-To"] = originalTo;
  }

  const bodyHtml =
    forceTo && forceTo.trim() && originalTo && originalTo !== forceTo.trim()
      ? `
        <div style="padding:10px; background:#fff3cd; border:1px solid #ffeeba; margin:0 0 12px 0;">
          <b>LOCAL SAFETY:</b> Email was forced to <code>${escapeHtml(forceTo)}</code><br/>
          Original recipient: <code>${escapeHtml(originalTo)}</code>
        </div>
      ` + rendered.html
      : rendered.html;

  console.log(
    "[sendEmail] provider=%s app=%s template=%s to=%s%s",
    provider,
    appKey,
    templateKey ?? "",
    finalTo,
    forceTo ? ` (forced; original=${originalTo})` : "",
  );

  // Insert row using ONLY existing DB columns
  const outboxId = await outboxInsertBestEffort({
    created_at: nowIso(),
    status: "sending",
    to_email: finalTo,
    template_key: templateKey ?? "notification",
    variables,
    attempts: 0,
    last_error: null,
    error_message: null,
    sent_at: null,
  });

  try {
    if (provider === "postmark") {
      await sendViaPostmark({
        to: finalTo,
        subject,
        html: bodyHtml,
        fromEmail,
        fromLabel,
        headers: headersObj,
      });
    } else if (provider === "sendgrid") {
      await sendViaSendGrid({
        to: finalTo,
        subject,
        html: bodyHtml,
        fromEmail,
        fromLabel,
        headers: headersObj,
      });
    } else {
      const host = getEnv("SMTP_HOST") ?? "inbucket";
      const port = Number(getEnv("SMTP_PORT") ?? "1025");

      const extraHeaders: string[] = [];
      extraHeaders.push(`X-App-Key: ${headersObj["X-App-Key"]}`);
      extraHeaders.push(`X-Template-Key: ${headersObj["X-Template-Key"]}`);
      if (headersObj["X-Correlation-Id"]) extraHeaders.push(`X-Correlation-Id: ${headersObj["X-Correlation-Id"]}`);
      if (headersObj["X-Original-To"]) extraHeaders.push(`X-Original-To: <${headersObj["X-Original-To"]}>`);

      await sendViaLocalRawSmtp({
        host,
        port,
        to: finalTo,
        subject,
        html: bodyHtml,
        fromEmail: "no-reply@mercyblade.local",
        fromLabel: "Mercy Blade",
        extraHeaders,
      });
    }

    await outboxUpdateBestEffort(outboxId, {
      status: "sent",
      sent_at: nowIso(),
      last_error: null,
      error_message: null,
    });

    return { ok: true, emailed: true, forced_to: forceTo ?? null, outbox_id: outboxId, provider };
  } catch (e: any) {
    const msg = e?.message ?? String(e);

    await outboxUpdateBestEffort(outboxId, {
      status: "failed",
      sent_at: null,
      last_error: msg,
      error_message: msg,
      attempts: 1,
    });

    throw e;
  }
}
