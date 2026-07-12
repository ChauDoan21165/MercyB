export const SYNTHETIC_USER_ID_PREFIX = "63e289e1-";

export type R2Source =
  | "function_failure_logs"
  | "cron.job_run_details"
  | "net._http_response"
  | "supabase_mgmt_logs";

export type R2Event = {
  source: R2Source;
  id: string;
  occurredAt: string;
  provider: string;
  route: string | null;
  mode: string | null;
  status: number | null;
  errorClass: string;
  message: string | null;
  requestId: string | null;
  userId: string | null;
  detail?: Record<string, unknown> | null;
};

export type R2Group = {
  signatureKey: string;
  source: R2Source;
  provider: string;
  route: string | null;
  mode: string | null;
  status: number | null;
  errorClass: string;
  count: number;
  firstSeenAt: string;
  lastSeenAt: string;
  requestIds: string[];
  sampleMessage: string | null;
};

function truncate(value: string, max = 120): string {
  return value.length <= max ? value : `${value.slice(0, max - 1)}...`;
}

export function normalizeSignaturePart(value: string | number | null | undefined): string {
  const text = String(value ?? "unknown").trim().toLowerCase();
  return truncate(text.replace(/\s+/g, " "), 120);
}

export function signatureKeyFor(event: R2Event): string {
  return [
    normalizeSignaturePart(event.source),
    normalizeSignaturePart(event.provider),
    normalizeSignaturePart(event.route),
    normalizeSignaturePart(event.mode),
    normalizeSignaturePart(event.status),
    normalizeSignaturePart(event.errorClass),
  ].join("|");
}

export function groupEvents(
  events: R2Event[],
  syntheticUserIdPrefix = SYNTHETIC_USER_ID_PREFIX,
): R2Group[] {
  const groups = new Map<string, R2Group>();
  for (const event of events) {
    if (event.userId && event.userId.startsWith(syntheticUserIdPrefix)) continue;

    const signatureKey = signatureKeyFor(event);
    const requestId = event.requestId ? [event.requestId] : [];
    const existing = groups.get(signatureKey);
    if (!existing) {
      groups.set(signatureKey, {
        signatureKey,
        source: event.source,
        provider: event.provider,
        route: event.route,
        mode: event.mode,
        status: event.status,
        errorClass: event.errorClass,
        count: 1,
        firstSeenAt: event.occurredAt,
        lastSeenAt: event.occurredAt,
        requestIds: requestId,
        sampleMessage: event.message ? truncate(event.message, 240) : null,
      });
      continue;
    }

    existing.count += 1;
    if (new Date(event.occurredAt) < new Date(existing.firstSeenAt)) {
      existing.firstSeenAt = event.occurredAt;
    }
    if (new Date(event.occurredAt) > new Date(existing.lastSeenAt)) {
      existing.lastSeenAt = event.occurredAt;
    }
    if (event.requestId && !existing.requestIds.includes(event.requestId)) {
      existing.requestIds.push(event.requestId);
      existing.requestIds = existing.requestIds.slice(0, 10);
    }
  }

  return [...groups.values()].sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.signatureKey.localeCompare(b.signatureKey);
  });
}

export function diagnose(group: R2Group): string {
  if (group.source === "cron.job_run_details") {
    return `A pg_cron job failed in the scan window. Inspect cron.job_run_details for the command and return_message before changing application code.`;
  }
  if (group.source === "net._http_response") {
    return `A pg_net HTTP call returned ${group.status ?? "a non-2xx result"} in the scan window. This points at scheduled HTTP invocation or downstream endpoint health.`;
  }
  if (group.route?.includes("/api/mercy-ai")) {
    return `Server-side failures were recorded for /api/mercy-ai. This is on the Pages function or upstream AI/provider path; client retries alone will not fix it.`;
  }
  if (group.source === "supabase_mgmt_logs") {
    return `Supabase platform logs reported an error signature. Inspect the matching Log Explorer rows for edge/API/DB ownership.`;
  }
  return `Server-side failures were recorded for ${group.route ?? group.provider}. Inspect the owning function or scheduled job for this signature.`;
}

export function formatEmailText(groups: R2Group[], since: Date, now: Date): string {
  const lines = [
    "MercyBlade R2 LOGWATCH server failure scan",
    "",
    "Robot: R2 LOGWATCH",
    `Window: ${since.toISOString()} - ${now.toISOString()}`,
    `Impact: ${groups.reduce((total, group) => total + group.count, 0)} server-side failure events across ${groups.length} signature(s)`,
    `Signatures: ${groups.length}`,
    "",
  ];

  for (const group of groups) {
    lines.push(
      `Signature: ${group.signatureKey}`,
      `Source: ${group.source}`,
      `Provider: ${group.provider}`,
      `Route: ${group.route ?? "unknown"}`,
      `Mode: ${group.mode ?? "unknown"}`,
      `Status: ${group.status ?? "unknown"}`,
      `Error: ${group.errorClass}`,
      `Count: ${group.count}`,
      `First seen: ${group.firstSeenAt}`,
      `Last seen: ${group.lastSeenAt}`,
      `Request IDs: ${group.requestIds.length ? group.requestIds.join(", ") : "none"}`,
      `Evidence: ${group.source} grouped by provider/route/mode/status/error_class`,
      `Diagnosis: ${diagnose(group)}`,
      "",
    );
  }

  lines.push("Next action: inspect the source-specific rows above and recent deploys before changing client code.");
  return lines.join("\n");
}
