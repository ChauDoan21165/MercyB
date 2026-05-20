import { fallbackAssessment } from "./graderClient.ts";
import type { GraderInput, GraderResult, PlacementV3Session, SessionError } from "./types.ts";

export type FailureMode =
  | "grader_timeout"
  | "grader_malformed_json"
  | "grader_rate_limited"
  | "db_write_failed"
  | "auth_failed"
  | "response_too_long"
  | "wrong_language"
  | "duplicate_submit";

export interface RecoveryDecision {
  mode: FailureMode;
  recoverable: boolean;
  retry: boolean;
  continueSession: boolean;
  status: number;
  code: string;
  message: string;
}

export function classifyFailure(mode: FailureMode, attempt = 1): RecoveryDecision {
  switch (mode) {
    case "grader_timeout":
      return decision(mode, true, attempt < 2, true, 200, "timeout", "Grader timed out; fallback scoring can continue.");
    case "grader_malformed_json":
      return decision(mode, true, false, true, 200, "malformed_json", "Grader returned malformed JSON; fallback scoring can continue.");
    case "grader_rate_limited":
      return decision(mode, true, false, true, 200, "rate_limited", "Grader is rate limited; fallback scoring can continue.");
    case "db_write_failed":
      return decision(mode, false, false, false, 500, "db_write_failed", "Database write failed; do not advance client state.");
    case "auth_failed":
      return decision(mode, false, false, false, 401, "auth_required", "User authentication failed.");
    case "response_too_long":
      return decision(mode, false, false, false, 413, "response_too_long", "Response is too long for placement.");
    case "wrong_language":
      return decision(mode, false, false, false, 400, "wrong_language", "Response is not primarily English.");
    case "duplicate_submit":
      return decision(mode, true, false, true, 200, "duplicate_submit", "Duplicate response replay should return current state.");
  }
}

export function recoverGraderFailure(
  input: GraderInput,
  mode: Extract<FailureMode, "grader_timeout" | "grader_malformed_json" | "grader_rate_limited">,
): GraderResult {
  const d = classifyFailure(mode);
  return fallbackAssessment(input, d.code, d.message);
}

export function sessionErrorFromDecision(
  decision: RecoveryDecision,
  at: string,
): SessionError {
  return {
    at,
    code: decision.code,
    message: decision.message,
    recoverable: decision.recoverable,
  };
}

export function canClientRetry(session: PlacementV3Session, mode: FailureMode): boolean {
  if (session.flow_state !== "in_progress") return false;
  return classifyFailure(mode).retry;
}

function decision(
  mode: FailureMode,
  recoverable: boolean,
  retry: boolean,
  continueSession: boolean,
  status: number,
  code: string,
  message: string,
): RecoveryDecision {
  return { mode, recoverable, retry, continueSession, status, code, message };
}
