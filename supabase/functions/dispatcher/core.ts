export type DispatcherSeverity = "critical" | "high" | "medium" | "low" | "info";

export type DispatcherPayload = {
  robot?: unknown;
  severity?: unknown;
  signature?: unknown;
  summary?: unknown;
  evidence_url?: unknown;
  evidenceUrl?: unknown;
  occurred_at?: unknown;
  occurredAt?: unknown;
  metadata?: unknown;
};

export type NormalizedAlert = {
  robot: string;
  severity: DispatcherSeverity;
  signature: string;
  incidentKey: string;
  summary: string;
  evidenceUrl: string | null;
  occurredAt: string;
  metadata: Record<string, unknown>;
};

const SEVERITY_RANK: Record<DispatcherSeverity, number> = {
  critical: 5,
  high: 4,
  medium: 3,
  low: 2,
  info: 1,
};

const ROBOT_ALIASES: Record<string, string> = {
  r0: "R0 WALKER",
  walker: "R0 WALKER",
  ci: "R0 WALKER",
  "r0 walker": "R0 WALKER",
  r1: "R1 SENTINEL",
  sentinel: "R1 SENTINEL",
  "client error alert": "R1 SENTINEL",
  "r1 sentinel": "R1 SENTINEL",
  r2: "R2 LOGWATCH",
  logwatch: "R2 LOGWATCH",
  "r2 logwatch": "R2 LOGWATCH",
  r3: "R3 EXPLORER",
  explorer: "R3 EXPLORER",
  "r3 explorer": "R3 EXPLORER",
  r4: "R4 EXAMINER",
  examiner: "R4 EXAMINER",
  "r4 examiner": "R4 EXAMINER",
};

function asText(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function truncate(value: string, max: number): string {
  return value.length <= max ? value : value.slice(0, max - 1).trimEnd();
}

function normalizeRobot(robot: unknown): string {
  const raw = asText(robot, "unknown");
  const normalized = raw.toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  return ROBOT_ALIASES[normalized] ?? truncate(raw || "unknown", 80);
}

export function normalizeSeverity(value: unknown): DispatcherSeverity {
  const normalized = asText(value, "medium").toLowerCase();
  if (normalized === "p0" || normalized === "sev0") return "critical";
  if (normalized === "p1" || normalized === "sev1") return "high";
  if (normalized === "p2" || normalized === "sev2" || normalized === "warn" || normalized === "warning") {
    return "medium";
  }
  if (normalized === "p3" || normalized === "sev3") return "low";
  if (normalized === "critical" || normalized === "high" || normalized === "medium" || normalized === "low" || normalized === "info") {
    return normalized;
  }
  return "medium";
}

export function normalizeSignature(signature: unknown): string {
  const text = asText(signature);
  if (!text) throw new Error("signature is required");
  return truncate(text.toLowerCase().replace(/\s+/g, " ").trim(), 240);
}

export function incidentKeyFor(signature: string): string {
  return signature;
}

function normalizeEvidenceUrl(value: unknown): string | null {
  const text = asText(value);
  if (!text) return null;
  try {
    const url = new URL(text);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return truncate(url.toString(), 500);
  } catch {
    return truncate(text, 500);
  }
}

function normalizeMetadata(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

export function normalizeAlert(payload: DispatcherPayload, now = new Date()): NormalizedAlert {
  const signature = normalizeSignature(payload.signature);
  const summary = asText(payload.summary);
  if (!summary) throw new Error("summary is required");

  const occurredAtText = asText(payload.occurred_at ?? payload.occurredAt);
  const occurredAt = occurredAtText && !Number.isNaN(Date.parse(occurredAtText))
    ? new Date(occurredAtText).toISOString()
    : now.toISOString();

  return {
    robot: normalizeRobot(payload.robot),
    severity: normalizeSeverity(payload.severity),
    signature,
    incidentKey: incidentKeyFor(signature),
    summary: truncate(summary, 1000),
    evidenceUrl: normalizeEvidenceUrl(payload.evidence_url ?? payload.evidenceUrl),
    occurredAt,
    metadata: normalizeMetadata(payload.metadata),
  };
}

export function shouldAlert(severity: DispatcherSeverity, minSeverity: DispatcherSeverity = "high"): boolean {
  return SEVERITY_RANK[severity] >= SEVERITY_RANK[minSeverity];
}

export function highestSeverity(a: DispatcherSeverity, b: DispatcherSeverity): DispatcherSeverity {
  return SEVERITY_RANK[a] >= SEVERITY_RANK[b] ? a : b;
}

export function buildIncidentEmail(args: {
  incidentId: string;
  alert: NormalizedAlert;
  eventCount: number;
  robots: string[];
  firstSeenAt: string;
  lastSeenAt: string;
}): { subject: string; text: string } {
  const subject = `MercyBlade ${args.alert.robot}: ${args.alert.summary}`;
  const text = [
    `MercyBlade ${args.alert.robot} incident`,
    "",
    `Incident: ${args.incidentId}`,
    `Severity: ${args.alert.severity}`,
    `Signature: ${args.alert.signature}`,
    `Robots: ${args.robots.join(", ")}`,
    `Events: ${args.eventCount}`,
    `First seen: ${args.firstSeenAt}`,
    `Last seen: ${args.lastSeenAt}`,
    `Summary: ${args.alert.summary}`,
    `Evidence: ${args.alert.evidenceUrl ?? "none"}`,
    "",
    `Diagnosis: ${diagnose(args.alert)}`,
    "Ruled out: duplicate robot emails for the same signature; Dispatcher deduped by normalized signature across robots.",
    "Next action: inspect the evidence URL or source robot artifact, then acknowledge or resolve the dispatcher incident row.",
  ].join("\n");
  return { subject, text };
}

export function buildDigestEmail(args: {
  events: NormalizedAlert[];
  since: string;
  until: string;
}): { subject: string; text: string } {
  const bySignature = new Map<string, { count: number; robots: Set<string>; sample: NormalizedAlert }>();
  for (const event of args.events) {
    const existing = bySignature.get(event.signature);
    if (existing) {
      existing.count += 1;
      existing.robots.add(event.robot);
    } else {
      bySignature.set(event.signature, { count: 1, robots: new Set([event.robot]), sample: event });
    }
  }

  const lines = [
    "MercyBlade Dispatcher daily below-threshold digest",
    "",
    `Window: ${args.since} - ${args.until}`,
    `Events: ${args.events.length}`,
    `Signatures: ${bySignature.size}`,
    "",
  ];

  for (const { count, robots, sample } of bySignature.values()) {
    lines.push(
      `Signature: ${sample.signature}`,
      `Severity: ${sample.severity}`,
      `Robots: ${[...robots].join(", ")}`,
      `Count: ${count}`,
      `Summary: ${sample.summary}`,
      `Evidence: ${sample.evidenceUrl ?? "none"}`,
      "",
    );
  }

  return {
    subject: `MercyBlade Dispatcher digest: ${args.events.length} below-threshold event${args.events.length === 1 ? "" : "s"}`,
    text: lines.join("\n"),
  };
}

export function diagnose(alert: NormalizedAlert): string {
  if (alert.signature.includes("/api/mercy-ai")) {
    return "Mercy AI endpoint is implicated. Correlate R1 client failures with R2 server logs before changing UI code.";
  }
  if (alert.robot.startsWith("R2")) {
    return "Server-side logs reported this signature. Inspect the owning function, scheduled job, or provider path.";
  }
  if (alert.robot.startsWith("R1")) {
    return "Real-user browser telemetry reported this signature. Check route, build hash, endpoint, and matching server traces.";
  }
  if (alert.robot.startsWith("R0")) {
    return "Synthetic happy-path runner failed. Treat as product heartbeat break until the journey artifact says otherwise.";
  }
  return "Dispatcher received a normalized robot alert. Inspect the cited evidence and owning surface.";
}
