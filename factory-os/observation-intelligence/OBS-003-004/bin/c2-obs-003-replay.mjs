#!/usr/bin/env node
/**
 * C2-OBS-INT-PHASE2 / OBS-003 — Deterministic Replay (promptAssembly vertical slice)
 *
 * For each of the 35 status=attributed / confidence=high OBS-002 records, this
 * script RECONSTRUCTS the exact OBS-001 driver probe binding (same hookmap,
 * same AXIS_PROBE, same real inputs), re-invokes the REAL MercyB promptAssembly
 * function, re-derives output_digest with the SAME digest fn OBS-001 used, and
 * compares byte-for-byte to OBS-001's recorded output_digest for that TM INT ID.
 *
 *   match  -> replay pass
 *   diff   -> replay fail (recorded vs replayed digests both emitted)
 *
 * It is READ-ONLY w.r.t. all inputs. It NEVER appends to the append-only
 * OBS-001 observation log; it computes digests in-memory and writes a fresh
 * OBS-003-replays.jsonl. No registry / counter / Judge mutation.
 *
 * Run with MercyB reachable so the tsx loader + real .ts import resolve:
 *   cd ~/MercyB && node --import tsx \
 *     ~/ai-tutor-factory/bin/c2-obs-003-replay.mjs [runId]
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const HOME = process.env.HOME;
const MERCYB = `${HOME}/MercyB`;
const FACTORY = `${HOME}/ai-tutor-factory`;
const OBS_DIR = `${FACTORY}/state/observations`;

const ATTRIB = `${OBS_DIR}/OBS-002-attributions.jsonl`;
const OBS1 = `${OBS_DIR}/tm-int-observations.jsonl`;
const HOOKMAP = `${OBS_DIR}/OBS-001-promptAssembly-hookmap.json`;
const OUT = `${OBS_DIR}/OBS-003-replays.jsonl`;

const RUN_ID = process.argv[2] || "obs003-proof-run-001";
const TS = "2026-07-07T00:00:00.000Z"; // fixed; determinism must not depend on wall clock

const CODE = "src/lib/ai-tutor/promptAssembly.ts";

// SAME digest as tmIntObservationHook.mjs: strings verbatim, else JSON.stringify(x ?? null).
function digest(value) {
  const s = typeof value === "string" ? value : JSON.stringify(value ?? null);
  return "sha256:" + createHash("sha256").update(s, "utf8").digest("hex");
}

// Real MercyB promptAssembly functions (identical import set to OBS-001 driver).
const {
  assembleCefrConstraint,
  assembleContextBlock,
  assembleSystemPrompt,
  getHighSeverityL1Patterns,
  applyForbiddenVocabFilter,
  buildRefusalResponse,
  buildFallbackResponse,
  buildInvalidInputResponse,
  parseResponse,
  enforceTokenBudget,
} = await import(`${MERCYB}/src/lib/ai-tutor/promptAssembly.ts`);

// PATTERNS + PROBES + AXIS_PROBE reproduced VERBATIM from
// bin/c2-obs-001-runtime-hook-driver.mjs so replay inputs are byte-identical
// to what OBS-001 recorded.
const PATTERNS = getHighSeverityL1Patterns("A2");

const PROBES = {
  assembleCefrConstraint: {
    codePath: `${CODE}:assembleCefrConstraint`,
    input: ["A2"],
    run: () => assembleCefrConstraint("A2"),
  },
  assembleSystemPrompt: {
    codePath: `${CODE}:assembleSystemPrompt`,
    input: ["general_chat", "A2", "Minh"],
    run: () => assembleSystemPrompt("general_chat", "A2", "Minh"),
  },
  assembleSystemPromptNullCefr: {
    codePath: `${CODE}:assembleSystemPrompt`,
    input: ["general_chat", null, "Minh"],
    run: () => assembleSystemPrompt("general_chat", null, "Minh"),
  },
  assembleContextBlock: {
    codePath: `${CODE}:assembleContextBlock`,
    input: [null, "A2", "Minh", "3", "thì quá khứ", "mạo từ, thì quá khứ", PATTERNS],
    run: () =>
      assembleContextBlock(
        null,
        "A2",
        "Minh",
        "3",
        "thì quá khứ",
        "mạo từ, thì quá khứ",
        PATTERNS,
      ),
  },
  getHighSeverityL1Patterns: {
    codePath: `${CODE}:getHighSeverityL1Patterns`,
    input: ["A2"],
    run: () => getHighSeverityL1Patterns("A2"),
  },
  applyForbiddenVocabFilter: {
    codePath: `${CODE}:applyForbiddenVocabFilter`,
    input: ["Bạn giỏi tuyệt vời, xuất sắc nhất!"],
    run: () => applyForbiddenVocabFilter("Bạn giỏi tuyệt vời, xuất sắc nhất!"),
  },
  buildRefusalResponse: {
    codePath: `${CODE}:buildRefusalResponse`,
    input: ["self_harm"],
    run: () => buildRefusalResponse("self_harm"),
  },
  buildFallbackResponse: {
    codePath: `${CODE}:buildFallbackResponse`,
    input: [2],
    run: () => buildFallbackResponse(2),
  },
  buildInvalidInputEmpty: {
    codePath: `${CODE}:buildInvalidInputResponse`,
    input: ["empty"],
    run: () => buildInvalidInputResponse("empty"),
  },
  buildInvalidInputNonLanguage: {
    codePath: `${CODE}:buildInvalidInputResponse`,
    input: ["non_language"],
    run: () => buildInvalidInputResponse("non_language"),
  },
  parseResponse: {
    codePath: `${CODE}:parseResponse`,
    input: ['{"en":"I went to the market","vi":"Tôi đã đi chợ"}'],
    run: () => parseResponse('{"en":"I went to the market","vi":"Tôi đã đi chợ"}'),
  },
  enforceTokenBudget: {
    codePath: `${CODE}:enforceTokenBudget`,
    input: ["SYSTEM", [{ role: "user", content: "hello teacher" }], 4000],
    run: () =>
      enforceTokenBudget("SYSTEM", [{ role: "user", content: "hello teacher" }], 4000),
  },
};

const AXIS_PROBE = {
  "weakness-memory-continuity": ["assembleContextBlock", "high"],
  "session-memory-recall": ["assembleContextBlock", "high"],
  "practice-topic-carryover": ["assembleContextBlock", "high"],
  "lesson-recommendation-explanation": ["assembleContextBlock", "medium"],
  "student-state-transition": ["assembleContextBlock", "medium"],
  "edge-case-stale-memory": ["assembleContextBlock", "medium"],
  "anti-placeholder-output": ["assembleContextBlock", "high"],
  "learner-state-routing": ["assembleSystemPrompt", "medium"],
  "testable-public-contract": ["assembleSystemPrompt", "high"],
  "conversation-turn-normalization": ["assembleSystemPrompt", "medium"],
  "follow-up-intelligence-continuity": ["assembleSystemPrompt", "low"],
  "speak-follow-up-replacement": ["assembleSystemPrompt", "low"],
  "readiness-policy-boundary": ["assembleCefrConstraint", "high"],
  "deterministic-output-shape": ["assembleCefrConstraint", "high"],
  "no-fake-confidence": ["applyForbiddenVocabFilter", "high"],
  "overclaim-prevention": ["applyForbiddenVocabFilter", "high"],
  "tone-safety-no-overwarmth": ["applyForbiddenVocabFilter", "high"],
  "suppression-rule-correctness": ["applyForbiddenVocabFilter", "medium"],
  "vietlish-curated-behavior": ["getHighSeverityL1Patterns", "high"],
  "hint-ladder-escalation": ["getHighSeverityL1Patterns", "medium"],
  "teacher-mercy-minimal-hint": ["getHighSeverityL1Patterns", "medium"],
  "high-stakes-pause-pivot": ["buildRefusalResponse", "high"],
  "provider-fallback-boundary": ["buildFallbackResponse", "high"],
  "error-recovery-strategy": ["parseResponse", "high"],
  "self-correction-loop-continuity": ["parseResponse", "medium"],
  "rubric-signal-preservation": ["parseResponse", "medium"],
  "edge-case-repeated-answer": ["parseResponse", "medium"],
  "retry-deduplication-boundary": ["enforceTokenBudget", "medium"],
  "safe-serialization-boundary": ["enforceTokenBudget", "high"],
  "edge-case-empty-input": ["buildInvalidInputEmpty", "high"],
  "edge-case-mixed-language": ["buildInvalidInputNonLanguage", "high"],
  "ui-copy-source-of-truth": ["buildInvalidInputEmpty", "low"],
};

function readJsonl(path) {
  return readFileSync(path, "utf8")
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l));
}

function main() {
  const attributions = readJsonl(ATTRIB);
  const attributed = attributions.filter(
    (r) => r.status === "attributed" && r.confidence === "high",
  );

  const obs1 = readJsonl(OBS1);
  const obs1ById = new Map(obs1.map((o) => [o.tm_int_id, o]));

  const hookmap = JSON.parse(readFileSync(HOOKMAP, "utf8"));
  const anchorProbe = new Map(
    (hookmap.covered_anchors || []).map((a) => [a.tm_int_id, a.probe]),
  );

  // Resolve the probe the OBS-001 driver used for a TM INT ID:
  // covered anchors use their explicit probe; targets use AXIS_PROBE[axis][0].
  function resolveProbeId(rec) {
    if (anchorProbe.has(rec.tm_int_id)) return anchorProbe.get(rec.tm_int_id);
    const mapping = AXIS_PROBE[rec.axis];
    return mapping ? mapping[0] : null;
  }

  const lines = [];
  let pass = 0;
  let fail = 0;

  for (const rec of attributed) {
    const obs = obs1ById.get(rec.tm_int_id);
    const probeId = resolveProbeId(rec);
    const probe = probeId ? PROBES[probeId] : null;

    const base = {
      tm_int_id: rec.tm_int_id,
      axis: rec.axis,
      module: rec.module,
      run_id: RUN_ID,
      ts: TS,
      obs001_run_id: obs ? obs.run_id : null,
      obs002_run_id: rec.run_id,
      probe_id: probeId,
      code_path: rec.code_path,
    };

    if (!obs) {
      fail++;
      lines.push(
        JSON.stringify({
          ...base,
          replay: "fail",
          reason: "no OBS-001 observation for tm_int_id",
        }),
      );
      continue;
    }
    if (!probe) {
      fail++;
      lines.push(
        JSON.stringify({
          ...base,
          replay: "fail",
          reason: `no probe resolvable (axis=${rec.axis})`,
        }),
      );
      continue;
    }

    let output;
    let replayInputDigest;
    let replayOutputDigest;
    try {
      output = probe.run();
      replayInputDigest = digest(probe.input);
      replayOutputDigest = digest(output);
    } catch (e) {
      fail++;
      lines.push(
        JSON.stringify({
          ...base,
          replay: "fail",
          reason: `probe_error: ${e.message}`,
        }),
      );
      continue;
    }

    const codePathMatch = probe.codePath === obs.code_path;
    const inputMatch = replayInputDigest === obs.input_digest;
    const outputMatch = replayOutputDigest === obs.output_digest;
    const ok = codePathMatch && inputMatch && outputMatch;

    if (ok) pass++;
    else fail++;

    lines.push(
      JSON.stringify({
        ...base,
        resolved_code_path: probe.codePath,
        recorded_input_digest: obs.input_digest,
        replayed_input_digest: replayInputDigest,
        recorded_output_digest: obs.output_digest,
        replayed_output_digest: replayOutputDigest,
        checks: {
          code_path_match: codePathMatch,
          input_digest_match: inputMatch,
          output_digest_match: outputMatch,
        },
        replay: ok ? "pass" : "fail",
        ...(ok
          ? {}
          : {
              diff: {
                code_path: codePathMatch
                  ? null
                  : { recorded: obs.code_path, replayed: probe.codePath },
                input_digest: inputMatch
                  ? null
                  : { recorded: obs.input_digest, replayed: replayInputDigest },
                output_digest: outputMatch
                  ? null
                  : { recorded: obs.output_digest, replayed: replayOutputDigest },
              },
            }),
      }),
    );
  }

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, lines.join("\n") + "\n", "utf8");

  const summary = {
    run_id: RUN_ID,
    input: ATTRIB,
    obs001: OBS1,
    out: OUT,
    total_attributed: attributed.length,
    replay_pass: pass,
    replay_fail: fail,
  };
  console.log(JSON.stringify(summary, null, 2));
}

main();
