/**
 * C2-OBS-INT-PHASE2-001 / OBS-001 — TM INT Runtime Observation Hook
 *
 * Completes the Product Intelligence observation system (observationBus.mjs,
 * runtimeEventObserver.mjs) by adding the missing two pieces the Judge needs:
 *
 *   1. TM INT ID ATTRIBUTION  — every observation names the exact TM INT ID
 *      whose behavior was executed.
 *   2. APPEND-ONLY PERSISTENCE — observations are written to an append-only
 *      JSONL evidence log the Evidence Packet Builder (OBS-004) can replay.
 *
 * The runtimeEventObserver produced flow/capability-keyed ProductObservations
 * that lived only in memory. This hook is the durable, attributable sink that
 * makes TM behavior observable to the Judge lane.
 *
 * Structured event schema (one JSONL line per observation):
 *   { tm_int_id, ts, input_digest, output_digest, code_path, run_id }
 *
 * The log is append-only: this module NEVER truncates or rewrites it.
 */
import { createHash } from "node:crypto";
import { appendFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const FACTORY_ROOT = `${process.env.HOME}/ai-tutor-factory`;
export const DEFAULT_OBS_LOG =
  process.env.TM_INT_OBS_LOG ||
  `${FACTORY_ROOT}/state/observations/tm-int-observations.jsonl`;

/**
 * Deterministic content digest. Strings hash verbatim; anything else is
 * JSON-serialized first so the digest is stable across runs.
 */
export function digest(value) {
  const s = typeof value === "string" ? value : JSON.stringify(value ?? null);
  return "sha256:" + createHash("sha256").update(s, "utf8").digest("hex");
}

/**
 * Emit one structured observation event for a TM INT ID and append it to the
 * evidence log. Returns the event object that was written.
 *
 * Required: tmIntId, codePath, runId, ts. input/output may be any value
 * (they are reduced to digests — raw learner content is never persisted).
 */
export function emitTmIntObservation({
  tmIntId,
  codePath,
  input,
  output,
  runId,
  ts,
  logPath,
}) {
  if (!tmIntId) throw new Error("emitTmIntObservation: tmIntId required");
  if (!codePath) throw new Error("emitTmIntObservation: codePath required");
  if (!runId) throw new Error("emitTmIntObservation: runId required");
  if (!ts) throw new Error("emitTmIntObservation: ts required");

  const event = {
    tm_int_id: tmIntId,
    ts,
    input_digest: digest(input),
    output_digest: digest(output),
    code_path: codePath,
    run_id: runId,
  };

  const path = logPath || DEFAULT_OBS_LOG;
  mkdirSync(dirname(path), { recursive: true });
  appendFileSync(path, JSON.stringify(event) + "\n", "utf8");
  return event;
}

/**
 * Observe a real code path: invoke `fn(...args)`, capture its actual output,
 * emit an attributable observation, and return the real output. This is the
 * runtime hook — it wraps genuine TM execution, it does not simulate it.
 */
export function observeTmInt({ tmIntId, codePath, runId, ts, fn, args = [], logPath }) {
  const output = fn(...args);
  const event = emitTmIntObservation({
    tmIntId,
    codePath,
    input: args,
    output,
    runId,
    ts,
    logPath,
  });
  return { output, event };
}
