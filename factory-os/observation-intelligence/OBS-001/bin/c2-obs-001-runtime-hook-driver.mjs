#!/usr/bin/env node
/**
 * C2-OBS-INT-PHASE2-001 / OBS-001 — Runtime Hook Driver (top group: promptAssembly)
 *
 * Drives the TM INT observation hook over the highest-unlock code path
 * (promptAssembly, 61 report_only-behavioral IDs). For each TM INT ID it
 * invokes the REAL MercyB promptAssembly function that exercises that
 * behavior area, captures the genuine input/output, and emits an
 * append-only JSONL observation via tmIntObservationHook.emitTmIntObservation.
 *
 * MUST be run with MercyB as cwd so the `@/` alias + tsx loader resolve:
 *   cd ~/MercyB && node --import tsx \
 *     ~/ai-tutor-factory/bin/c2-obs-001-runtime-hook-driver.mjs [runId]
 *
 * It does NOT mutate the registry, coverage counters, or product behavior.
 * It only READS the report_only ID list (passed in via a hookmap JSON) and
 * WRITES the append-only evidence log.
 */
import { readFileSync } from "node:fs";

const HOME = process.env.HOME;
const MERCYB = `${HOME}/MercyB`;

// Absolute dynamic imports: the driver lives in the factory bin/ but must load
// the hook + real product code from the MercyB repo (relative ESM specifiers
// would resolve against bin/, not MercyB).
const { emitTmIntObservation, DEFAULT_OBS_LOG } = await import(
  `${MERCYB}/factory-os/product-intelligence/tmIntObservationHook.mjs`
);
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

const FACTORY_ROOT = `${HOME}/ai-tutor-factory`;
const HOOKMAP = `${FACTORY_ROOT}/state/observations/OBS-001-promptAssembly-hookmap.json`;
const CODE = "src/lib/ai-tutor/promptAssembly.ts";

const runId = process.argv[2] || `obs001-${new Date().toISOString().replace(/[:.]/g, "-")}`;
const ts = () => new Date().toISOString();

// Representative, real inputs used to exercise each promptAssembly function.
const PATTERNS = getHighSeverityL1Patterns("A2");

// probeId -> { codePath, run() -> real output }. Every run() calls genuine
// product code; nothing is simulated.
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

// axis -> probeId. Each mapping ties a behavior axis to the real promptAssembly
// code path that exercises it. `confidence` lets OBS-002/Judge weight the link.
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

function loadHookmap() {
  return JSON.parse(readFileSync(HOOKMAP, "utf8"));
}

function main() {
  const map = loadHookmap();
  const targets = map.tm_int_ids; // [{tm_int_id, axis}]
  const anchors = map.covered_anchors || []; // [{tm_int_id, probe}]

  const emitted = [];
  const skipped = [];

  // 1) Covered anchors — prove the hook names a KNOWN-COVERED TM INT ID.
  for (const a of anchors) {
    const probe = PROBES[a.probe];
    if (!probe) {
      skipped.push({ tm_int_id: a.tm_int_id, reason: `no probe ${a.probe}` });
      continue;
    }
    try {
      const output = probe.run();
      const ev = emitTmIntObservation({
        tmIntId: a.tm_int_id,
        codePath: probe.codePath,
        input: probe.input,
        output,
        runId,
        ts: ts(),
      });
      emitted.push({ ...ev, kind: "covered_anchor" });
    } catch (e) {
      skipped.push({ tm_int_id: a.tm_int_id, reason: `probe_error: ${e.message}` });
    }
  }

  // 2) Previously-unobservable report_only-behavioral IDs for promptAssembly.
  for (const t of targets) {
    const mapping = AXIS_PROBE[t.axis];
    if (!mapping) {
      skipped.push({ tm_int_id: t.tm_int_id, reason: `no probe for axis ${t.axis}` });
      continue;
    }
    const [probeId] = mapping;
    const probe = PROBES[probeId];
    try {
      const output = probe.run();
      const ev = emitTmIntObservation({
        tmIntId: t.tm_int_id,
        codePath: probe.codePath,
        input: probe.input,
        output,
        runId,
        ts: ts(),
      });
      emitted.push({ ...ev, kind: "previously_unobservable", axis: t.axis });
    } catch (e) {
      skipped.push({ tm_int_id: t.tm_int_id, reason: `probe_error: ${e.message}` });
    }
  }

  const summary = {
    run_id: runId,
    log: DEFAULT_OBS_LOG,
    emitted_count: emitted.length,
    skipped_count: skipped.length,
    covered_anchor_events: emitted.filter((e) => e.kind === "covered_anchor").length,
    previously_unobservable_events: emitted.filter(
      (e) => e.kind === "previously_unobservable",
    ).length,
  };
  console.log(JSON.stringify({ summary, emitted, skipped }, null, 2));
}

main();
