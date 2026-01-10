// PATH: supabase/functions/_shared/emailTemplates.ts
// VERSION: v2026-01-06.templates.2 (registry + per-app branding + ecosystem footer + builder templates)

export type EmailTemplateRender = {
  subject: string;
  html: string;
};

export type EmailTemplateContext = {
  appKey: string;
  templateKey: string;
  variables: Record<string, string>;
};

function env(name: string) {
  return (Deno.env.get(name) ?? "").trim();
}

function escapeHtml(s: string) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function nowIso() {
  return new Date().toISOString();
}

function pick(v: Record<string, string>, k: string, fallback = "") {
  const x = v?.[k];
  return typeof x === "string" ? x : fallback;
}

function appKeyToEnvSuffix(appKey: string) {
  return String(appKey ?? "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "_");
}

function resolveAppDisplayName(appKey: string) {
  // Example:
  // APP_NAME_MERCY_BLADE="Mercy Blade"
  // APP_NAME_MERCY_AI_BUILDER="Mercy AI Builder"
  const suffix = appKeyToEnvSuffix(appKey);
  const v = env(`APP_NAME_${suffix}`);
  return v || "Mercy";
}

function resolveEcosystemName() {
  return env("ECOSYSTEM_NAME") || "Mercy — Serving Humanity App Ecosystem";
}

function parseEcosystemLinks() {
  // Comma-separated list of "Label|https://url"
  const linksRaw = env("ECOSYSTEM_APPS") || "";
  return linksRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((pair) => {
      const [label, url] = pair.split("|").map((x) => (x ?? "").trim());
      return { label, url };
    })
    .filter((x) => x.label && x.url);
}

function ecosystemFooterHtml(appKey: string) {
  const ecosystemName = resolveEcosystemName();
  const links = parseEcosystemLinks();

  const linksHtml = links.length
    ? `
      <p style="margin:10px 0 0 0; font-size:12px; color:#666;">
        ${links
          .map(
            (x) =>
              `<a href="${escapeHtml(x.url)}" style="color:#0b57d0; text-decoration:none;">${escapeHtml(x.label)}</a>`,
          )
          .join(" · ")}
      </p>
    `
    : "";

  return `
    <hr style="border:none; border-top:1px solid #eee; margin:16px 0;" />
    <p style="margin:0; font-size:12px; color:#666;">
      ${escapeHtml(ecosystemName)}
    </p>
    <p style="margin:6px 0 0 0; font-size:12px; color:#999;">
      App: <code>${escapeHtml(appKey)}</code>
    </p>
    ${linksHtml}
  `;
}

function wrapHtml(appKey: string, innerHtml: string) {
  return `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; line-height:1.4">
      ${innerHtml}
      ${ecosystemFooterHtml(appKey)}
    </div>
  `;
}

type TemplateFn = (ctx: EmailTemplateContext) => EmailTemplateRender;

const templates: Record<string, TemplateFn> = {
  receipt_subscription: ({ appKey, variables }) => {
    const appName = resolveAppDisplayName(appKey);

    const amount = escapeHtml(pick(variables, "amount", ""));
    const period = escapeHtml(pick(variables, "period", "Monthly"));
    const tier = escapeHtml(pick(variables, "tier", ""));
    const sessionId = escapeHtml(pick(variables, "stripe_session_id", ""));
    const subId = escapeHtml(pick(variables, "stripe_subscription_id", ""));

    const subject = `${appName} – Receipt`;

    const inner = `
      <h2 style="margin:0 0 12px 0;">Payment receipt</h2>
      <p style="margin:0 0 10px 0;">Thanks for your subscription.</p>

      <table style="border-collapse:collapse; margin:12px 0;">
        <tr><td style="padding:4px 12px 4px 0;"><b>Tier</b></td><td style="padding:4px 0;">${tier || "-"}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;"><b>Amount</b></td><td style="padding:4px 0;">${amount || "-"}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;"><b>Period</b></td><td style="padding:4px 0;">${period}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;"><b>Date</b></td><td style="padding:4px 0;">${escapeHtml(nowIso())}</td></tr>
      </table>

      ${
        sessionId || subId
          ? `<p style="margin:12px 0 0 0; color:#666; font-size:12px;">
               ${sessionId ? `Session: <code>${sessionId}</code><br/>` : ""}
               ${subId ? `Subscription: <code>${subId}</code>` : ""}
             </p>`
          : ""
      }
    `;

    return { subject, html: wrapHtml(appKey, inner) };
  },

  welcome_vip: ({ appKey, variables }) => {
    const appName = resolveAppDisplayName(appKey);
    const tier = escapeHtml(pick(variables, "tier", "VIP"));
    const subject = `${appName} – Welcome ${tier}`;

    const inner = `
      <h2 style="margin:0 0 12px 0;">Welcome to ${tier}</h2>
      <p style="margin:0 0 10px 0;">
        Your access is now active. Open the app and start.
      </p>

      <ul style="margin:8px 0 0 18px;">
        <li>If something looks locked, refresh once (server-truth)</li>
        <li>Use the app daily — short sessions win</li>
      </ul>
    `;

    return { subject, html: wrapHtml(appKey, inner) };
  },

  // ---------------------------
  // Mercy AI Builder
  // ---------------------------
  builder_finished: ({ appKey, variables }) => {
    const appName = resolveAppDisplayName(appKey);

    const jobIdRaw = pick(variables, "job_id", "unknown");
    const outputUrlRaw = pick(variables, "output_url", "");

    const jobId = escapeHtml(jobIdRaw);
    const outputUrl = outputUrlRaw.trim();
    const safeUrl = outputUrl ? escapeHtml(outputUrl) : "";

    const subject = `${appName} — Builder finished (job ${jobId})`;

    const inner = `
      <h2 style="margin:0 0 12px 0;">✅ Builder finished</h2>
      <p style="margin:0 0 10px 0;"><b>Job ID:</b> <code>${jobId}</code></p>

      ${
        safeUrl
          ? `
            <p style="margin:12px 0 0 0;">
              <a href="${safeUrl}" target="_blank" rel="noopener noreferrer"
                 style="display:inline-block;padding:10px 14px;border-radius:8px;text-decoration:none;border:1px solid #111;">
                 Open output
              </a>
            </p>
            <p style="margin:10px 0 0 0; font-size:13px; color:#666;">
              If the button does not work, copy/paste:
            </p>
            <pre style="white-space:pre-wrap;">${safeUrl}</pre>
          `
          : `<p style="margin:12px 0 0 0;"><i>No output URL was provided.</i></p>`
      }
    `;

    return { subject, html: wrapHtml(appKey, inner) };
  },

  builder_failed: ({ appKey, variables }) => {
    const appName = resolveAppDisplayName(appKey);

    const jobIdRaw = pick(variables, "job_id", "unknown");
    const errRaw = pick(variables, "error", "Unknown error");
    const logsUrlRaw = pick(variables, "logs_url", ""); // optional

    const jobId = escapeHtml(jobIdRaw);
    const err = escapeHtml(errRaw);
    const logsUrl = logsUrlRaw.trim();
    const safeLogsUrl = logsUrl ? escapeHtml(logsUrl) : "";

    const subject = `${appName} — Builder failed (job ${jobId})`;

    const inner = `
      <h2 style="margin:0 0 12px 0;">❌ Builder failed</h2>
      <p style="margin:0 0 10px 0;"><b>Job ID:</b> <code>${jobId}</code></p>

      <p style="margin:12px 0 6px 0;"><b>Error:</b></p>
      <pre style="white-space:pre-wrap;">${err}</pre>

      ${
        safeLogsUrl
          ? `
            <p style="margin:12px 0 0 0;">
              <a href="${safeLogsUrl}" target="_blank" rel="noopener noreferrer"
                 style="display:inline-block;padding:10px 14px;border-radius:8px;text-decoration:none;border:1px solid #111;">
                 View logs
              </a>
            </p>
            <pre style="white-space:pre-wrap;">${safeLogsUrl}</pre>
          `
          : ``
      }
    `;

    return { subject, html: wrapHtml(appKey, inner) };
  },
};

export function renderEmailTemplate(
  appKey: string,
  templateKey?: string,
  variables: Record<string, string> = {},
): EmailTemplateRender {
  const key = (templateKey ?? "notification").trim();
  const fn = templates[key];

  if (fn) {
    return fn({ appKey, templateKey: key, variables });
  }

  const appName = resolveAppDisplayName(appKey);
  const subject = `${appName} – ${templateKey ?? "Notification"}`;

  const inner = `
    <h2>${escapeHtml(templateKey ?? "Notification")}</h2>
    <pre>${escapeHtml(JSON.stringify(variables ?? {}, null, 2))}</pre>
  `;

  return { subject, html: wrapHtml(appKey, inner) };
}
