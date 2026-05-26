import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export type PlacementForensicEventInput = {
  id?: string;
  sessionId: string;
  correlationId: string;
  occurredAt?: string;
  sequence: number;
  type: string;
  severity: "debug" | "info" | "warn" | "error" | "fatal";
  step: string;
  message: string;
  featureFlags?: { source: string; flags: Record<string, unknown> };
  failureSnapshot?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
};

export type PlacementForensicLoggerOptions = {
  source: string;
  writeConsole?: boolean;
  redactKeys?: string[];
};

export type PlacementForensicLogger = {
  logEvent: (event: PlacementForensicEventInput) => Promise<PlacementForensicEventInput>;
  logFailureSnapshot: (
    event: PlacementForensicEventInput,
    failure: Record<string, unknown>,
  ) => Promise<PlacementForensicEventInput>;
  logPartialSessionRecovery: (
    input: Omit<PlacementForensicEventInput, "type" | "severity" | "message"> & {
      message?: string;
      recovered: boolean;
    },
  ) => Promise<PlacementForensicEventInput>;
};

const DEFAULT_REDACT_KEYS = [
  "authorization",
  "apikey",
  "api_key",
  "apiKey",
  "token",
  "access_token",
  "refresh_token",
  "password",
  "secret",
  "service_role",
  "serviceRoleKey",
  "supabase_service_role_key",
  "openai_api_key",
  "gemini_api_key",
];

const MAX_SANITIZE_DEPTH = 50;

export function createPlacementForensicLogger(
  client: SupabaseClient | null,
  options: PlacementForensicLoggerOptions,
): PlacementForensicLogger {
  const redactKeys = new Set(
    [...DEFAULT_REDACT_KEYS, ...(options.redactKeys ?? [])].map((key) =>
      key.toLowerCase()
    ),
  );

  async function logEvent(
    event: PlacementForensicEventInput,
  ): Promise<PlacementForensicEventInput> {
    const serialized = replaySafeSerialize({
      ...event,
      id: event.id ?? crypto.randomUUID(),
      occurredAt: event.occurredAt ?? new Date().toISOString(),
      metadata: {
        ...(event.metadata ?? {}),
        source: options.source,
      },
    }, redactKeys);

    if (options.writeConsole ?? true) {
      console.info("[placement-forensics]", JSON.stringify(serialized));
    }

    if (client) {
      try {
        const { error } = await client.from("placement_v3_forensic_events").insert({
          id: serialized.id,
          session_id: serialized.sessionId,
          correlation_id: serialized.correlationId,
          occurred_at: serialized.occurredAt,
          sequence: serialized.sequence,
          event_type: serialized.type,
          severity: serialized.severity,
          step: serialized.step,
          message: serialized.message,
          feature_flags: serialized.featureFlags ?? {},
          failure_snapshot: serialized.failureSnapshot ?? {},
          event: serialized,
        });
        if (error) {
          console.warn("[placement-forensics] persist failed", error.message);
        }
      } catch (err) {
        console.warn("[placement-forensics] persist threw", err);
      }
    }

    return serialized;
  }

  return {
    logEvent,
    logFailureSnapshot(event, failure) {
      return logEvent({
        ...event,
        failureSnapshot: failure,
        severity: event.severity === "debug" || event.severity === "info"
          ? "error"
          : event.severity,
      });
    },
    logPartialSessionRecovery(input) {
      return logEvent({
        ...input,
        type: "recoverability_state",
        severity: input.recovered ? "info" : "warn",
        message: input.message ??
          (input.recovered
            ? "Partial placement session recovered."
            : "Partial placement session could not be recovered."),
        metadata: {
          ...(input.metadata ?? {}),
          recovered: input.recovered,
        },
      });
    },
  };
}

export function replaySafeSerialize<T>(
  value: T,
  redactKeys: Set<string> = new Set(DEFAULT_REDACT_KEYS),
): T {
  return sanitize(value, redactKeys, new WeakSet(), 0) as T;
}

function sanitize(
  value: unknown,
  redactKeys: Set<string>,
  seen: WeakSet<object>,
  depth: number,
): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === "string") return redactString(value);
  if (typeof value === "number") return Number.isFinite(value) ? value : `[${String(value)}]`;
  if (typeof value === "boolean") return value;
  if (typeof value === "bigint") return `${String(value)}n`;
  if (typeof value === "function") return "[function]";
  if (typeof value !== "object") return String(value);
  if (depth >= MAX_SANITIZE_DEPTH) return "[max-depth]";

  if (value instanceof Date) {
    return {
      $type: "Date",
      value: Number.isNaN(value.getTime()) ? "[invalid-date]" : value.toISOString(),
    };
  }
  if (value instanceof URL) {
    return { $type: "URL", value: redactString(value.toString()) };
  }
  if (value instanceof RegExp) {
    return { $type: "RegExp", value: value.toString() };
  }

  if (seen.has(value)) return "[circular]";
  seen.add(value);

  if (Array.isArray(value)) {
    const output = Array.from({ length: value.length }, (_, index) =>
      Object.prototype.hasOwnProperty.call(value, index)
        ? value[index] === undefined
          ? "[undefined]"
          : sanitize(value[index], redactKeys, seen, depth + 1)
        : "[sparse]"
    );
    seen.delete(value);
    return output;
  }

  if (value instanceof Map) {
    const entries = [...value.entries()]
      .map(([key, item]) => [
        sanitize(key, redactKeys, seen, depth + 1),
        sanitize(item, redactKeys, seen, depth + 1),
      ])
      .sort(([a], [b]) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
    seen.delete(value);
    return { $type: "Map", entries };
  }

  if (value instanceof Set) {
    const values = [...value.values()]
      .map((item) => sanitize(item, redactKeys, seen, depth + 1))
      .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
    seen.delete(value);
    return { $type: "Set", values };
  }

  const record = value as Record<string, unknown>;
  const output: Record<string, unknown> = Object.create(null);
  for (const key of Object.keys(record).sort()) {
    const item = record[key];
    if (shouldRedactKey(key, redactKeys)) {
      output[key] = "[redacted]";
    } else {
      output[key] = item === undefined
        ? "[undefined]"
        : sanitize(item, redactKeys, seen, depth + 1);
    }
  }
  seen.delete(value);
  return output;
}

function shouldRedactKey(key: string, redactKeys: Set<string>): boolean {
  const normalized = normalizeKey(key);
  if (redactKeys.has(key.toLowerCase()) || redactKeys.has(normalized)) return true;
  return [...redactKeys].some((redactKey) => normalized.includes(normalizeKey(redactKey)));
}

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function redactString(value: string): string {
  return value
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [redacted]")
    .replace(/sk-[A-Za-z0-9_-]{12,}/g, "sk-[redacted]")
    .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, "[jwt-redacted]")
    .replace(/https?:\/\/[^\s"']*(?:token|signature|expires|X-Amz-Signature|access_token)[^\s"']*/gi, "[url-redacted]")
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "[email-redacted]");
}
