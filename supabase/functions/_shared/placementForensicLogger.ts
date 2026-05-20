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
  "token",
  "access_token",
  "refresh_token",
  "password",
  "secret",
  "service_role",
  "supabase_service_role_key",
  "openai_api_key",
  "gemini_api_key",
];

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
  return sanitize(value, redactKeys, new WeakSet()) as T;
}

function sanitize(
  value: unknown,
  redactKeys: Set<string>,
  seen: WeakSet<object>,
): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === "string") return redactString(value);
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (typeof value === "bigint") return value.toString();
  if (typeof value === "function") return "[function]";
  if (typeof value !== "object") return String(value);

  if (seen.has(value)) return "[circular]";
  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((item) => sanitize(item, redactKeys, seen));
  }

  const record = value as Record<string, unknown>;
  const output: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(record)) {
    if (redactKeys.has(key.toLowerCase())) {
      output[key] = "[redacted]";
    } else {
      output[key] = sanitize(item, redactKeys, seen);
    }
  }
  return output;
}

function redactString(value: string): string {
  return value
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [redacted]")
    .replace(/sk-[A-Za-z0-9_-]{12,}/g, "sk-[redacted]")
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "[email-redacted]");
}
