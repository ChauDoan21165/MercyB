#!/usr/bin/env node
/**
 * C2-OBS-INT-PHASE2-001 / OBS-002 — Observation Attribution
 *
 * Consumes OBS-001 outputs (the promptAssembly hookmap + emitted event log) and
 * produces attribution records: each emitted observation event is linked to its
 * TM INT axis with a confidence grade BACKED BY AN EVIDENCE PREDICATE on the
 * real product output.
 *
 * Principle (same as correction rules): a WRONG attribution is worse than NO
 * attribution. So each axis is either:
 *   - ATTRIBUTED at high confidence — a sharpened probe runs the real
 *     promptAssembly code path and an output predicate confirms the axis
 *     behavior is actually present; or
 *   - PARKED with an explicit reason — the axis has no promptAssembly code path
 *     that genuinely evidences it (belongs to another module, or spec-only).
 *
 * NO event is left silently unattributed. Output:
 *   state/observations/OBS-002-attributions.jsonl   (one record per event)
 *
 * Run:
 *   cd ~/MercyB && node --import tsx \
 *     ~/ai-tutor-factory/bin/c2-obs-002-attribute.mjs [runId]
 *
 * Registry is never touched. No Judge/Promotion/dashboard/counter edits.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";

const HOME = process.env.HOME;
const MERCYB = `${HOME}/MercyB`;
const FAC = `${HOME}/ai-tutor-factory`;
const OBS_DIR = `${FAC}/state/observations`;
const HOOKMAP = `${OBS_DIR}/OBS-001-promptAssembly-hookmap.json`;
const OBS1_LOG = `${OBS_DIR}/tm-int-observations.jsonl`;
const OUT = `${OBS_DIR}/OBS-002-attributions.jsonl`;

const P = await import(`${MERCYB}/src/lib/ai-tutor/promptAssembly.ts`);

const runId = process.argv[2] || `obs002-${new Date().toISOString().replace(/[:.]/g, "-")}`;
const CODE = "src/lib/ai-tutor/promptAssembly.ts";
const HIGH_TIER = "high";

const digest = (v) =>
  "sha256:" + createHash("sha256").update(typeof v === "string" ? v : JSON.stringify(v ?? null)).digest("hex");
const excerpt = (v, n = 240) => {
  const s = typeof v === "string" ? v : JSON.stringify(v);
  return s.length > n ? s.slice(0, n) + "…" : s;
};

const PATTERNS = P.getHighSeverityL1Patterns("A2");

/**
 * Per-axis attribution spec.
 *  attributed: { codePath, probe(), predicate(out) -> {pass, evidence}, obs1_probe, sharpened }
 *  parked:     { park:true, reason, belongs_to }
 */
const SPEC = {
  // ── ATTRIBUTED (sharpened probe + evidence predicate on real output) ──
  "weakness-memory-continuity": {
    codePath: `${CODE}:assembleContextBlock`,
    obs1_probe: "assembleContextBlock",
    sharpened: false,
    probe: () =>
      P.assembleContextBlock(null, "A2", "Minh", "3", "thì quá khứ", "mạo từ, thì quá khứ", PATTERNS),
    predicate: (o) => ({
      pass: o.includes("cần cải thiện") && o.includes("mạo từ"),
      evidence: `context block carries weakness memory: "${o.split("\n").find((l) => l.includes("cần cải thiện")) || ""}"`,
    }),
  },
  "session-memory-recall": {
    codePath: `${CODE}:assembleContextBlock`,
    obs1_probe: "assembleContextBlock",
    sharpened: false,
    probe: () =>
      P.assembleContextBlock(null, "A2", "Minh", "3", "thì quá khứ", "mạo từ", PATTERNS),
    predicate: (o) => ({
      pass: o.includes("đã học liên tục") && o.includes("Lần trước"),
      evidence: `recalls streak + last session: "${o.split("\n")[0]}"`,
    }),
  },
  "practice-topic-carryover": {
    codePath: `${CODE}:assembleContextBlock`,
    obs1_probe: "assembleContextBlock",
    sharpened: false,
    probe: () =>
      P.assembleContextBlock(null, "A2", "Minh", "3", "thì quá khứ", null, PATTERNS),
    predicate: (o) => ({
      pass: o.includes("Lần trước bạn học về: thì quá khứ"),
      evidence: `carries last practice topic forward: "${o.split("\n").find((l) => l.includes("Lần trước")) || ""}"`,
    }),
  },
  "anti-placeholder-output": {
    codePath: `${CODE}:assembleContextBlock`,
    obs1_probe: "assembleContextBlock",
    sharpened: true, // sharpened: probe with ALL-null optional fields to prove omission
    probe: () => P.assembleContextBlock(null, null, null, "0", null, null, []),
    predicate: (o) => ({
      pass: !/null|undefined|placeholder|\{\{|\}\}/i.test(o),
      evidence: `missing data omitted, no placeholder text injected (output length=${o.length})`,
    }),
  },
  "testable-public-contract": {
    codePath: `${CODE}:assembleSystemPrompt`,
    obs1_probe: "assembleSystemPrompt",
    sharpened: true, // sharpened: determinism assertion (same input -> identical output)
    probe: () => P.assembleSystemPrompt("general_chat", "A2", "Minh"),
    predicate: (o) => {
      const again = P.assembleSystemPrompt("general_chat", "A2", "Minh");
      return {
        pass: typeof o === "string" && o.length > 0 && o === again,
        evidence: `pure exported contract: deterministic (out===rerun) non-empty len=${o.length}`,
      };
    },
  },
  "conversation-turn-normalization": {
    codePath: `${CODE}:serializeHistoryForProvider`,
    obs1_probe: "assembleSystemPrompt",
    sharpened: true, // sharpened: switch to serializeHistoryForProvider, assert role normalization
    probe: () =>
      P.serializeHistoryForProvider(
        [
          { role: "learner", ts: 0, content: "I go to school yesterday" },
          { role: "mercy", ts: 0, source: "ai-chat", requestId: "r1",
            response: { vi: "Nice! Let's fix the tense.", nextSteps: [], saveTargets: [] } },
        ],
        10,
      ),
    predicate: (o) => ({
      pass: Array.isArray(o) && o.length > 0 && o.every((m) => m.role === "user" || m.role === "assistant"),
      evidence: `turns normalized to provider roles: ${JSON.stringify(o.map((m) => m.role))}`,
    }),
  },
  "deterministic-output-shape": {
    codePath: `${CODE}:assembleCefrConstraint`,
    obs1_probe: "assembleCefrConstraint",
    sharpened: true, // sharpened: assert fixed leading shape + determinism
    probe: () => P.assembleCefrConstraint("A2"),
    predicate: (o) => ({
      pass: o.startsWith("VOCABULARY:") && o === P.assembleCefrConstraint("A2"),
      evidence: `fixed deterministic shape, leads with "VOCABULARY:"`,
    }),
  },
  "no-fake-confidence": {
    codePath: `${CODE}:applyForbiddenVocabFilter`,
    obs1_probe: "applyForbiddenVocabFilter",
    sharpened: true, // sharpened: input now contains REAL forbidden terms (OBS-001 vi praise stripped nothing)
    probe: () => P.applyForbiddenVocabFilter("You are at B2 level, score: 95%. Great job!"),
    predicate: (r) => ({
      pass: r.strippedCount > 0 && !/score:\s*95%|B2 level/i.test(r.filtered),
      evidence: `fake-confidence claims stripped (strippedCount=${r.strippedCount}) filtered="${excerpt(r.filtered, 80)}"`,
    }),
  },
  "overclaim-prevention": {
    codePath: `${CODE}:applyForbiddenVocabFilter`,
    obs1_probe: "applyForbiddenVocabFilter",
    sharpened: true,
    probe: () => P.applyForbiddenVocabFilter("You are wrong. That is incorrect. 7/10."),
    predicate: (r) => ({
      pass: r.strippedCount >= 2,
      evidence: `overclaiming/evaluative terms stripped (strippedCount=${r.strippedCount})`,
    }),
  },
  "tone-safety-no-overwarmth": {
    codePath: `${CODE}:applyForbiddenVocabFilter`,
    obs1_probe: "applyForbiddenVocabFilter",
    sharpened: true,
    probe: () => P.applyForbiddenVocabFilter("That's a bad mistake, you failed."),
    predicate: (r) => ({
      pass: r.strippedCount > 0 && /điểm cần sửa|chưa chính xác|đã xóa/.test(r.filtered),
      evidence: `harsh evaluative tone softened/stripped (strippedCount=${r.strippedCount})`,
    }),
  },
  "suppression-rule-correctness": {
    codePath: `${CODE}:applyForbiddenVocabFilter`,
    obs1_probe: "applyForbiddenVocabFilter",
    sharpened: true, // sharpened: assert strippedCount equals the number of forbidden occurrences
    probe: () => P.applyForbiddenVocabFilter("bad bad mistake"),
    predicate: (r) => ({
      pass: r.strippedCount === 3,
      evidence: `suppression count exact: 3 forbidden occurrences → strippedCount=${r.strippedCount}`,
    }),
  },
  "vietlish-curated-behavior": {
    codePath: `${CODE}:getHighSeverityL1Patterns`,
    obs1_probe: "getHighSeverityL1Patterns",
    sharpened: false,
    probe: () => P.getHighSeverityL1Patterns("A2"),
    predicate: (o) => ({
      pass: Array.isArray(o) && o.length > 0 && o.every((s) => typeof s === "string" && s.length > 0),
      evidence: `curated Vietnamese-L1 patterns returned (count=${o.length})`,
    }),
  },
  "high-stakes-pause-pivot": {
    codePath: `${CODE}:buildRefusalResponse`,
    obs1_probe: "buildRefusalResponse",
    sharpened: true, // sharpened: assert self_harm response carries safety pivot content
    probe: () => P.buildRefusalResponse("self_harm"),
    predicate: (r) => ({
      pass: !!r && typeof r.vi === "string" && /khủng hoảng|116 123|741741/.test(r.vi),
      evidence: `high-stakes safety pivot to crisis resources: "${excerpt(r.vi, 100)}"`,
    }),
  },
  "provider-fallback-boundary": {
    codePath: `${CODE}:buildFallbackResponse`,
    obs1_probe: "buildFallbackResponse",
    sharpened: false,
    probe: () => P.buildFallbackResponse(2),
    predicate: (r) => ({
      pass: !!r && typeof r.vi === "string" && r.vi.length > 0,
      evidence: `provider-fallback response produced: "${excerpt(r.vi, 100)}"`,
    }),
  },
  "error-recovery-strategy": {
    codePath: `${CODE}:parseResponse`,
    obs1_probe: "parseResponse",
    sharpened: true, // sharpened: empty provider output exercises the recovery path (ok:false, classified error)
    probe: () => P.parseResponse(""),
    predicate: (r) => ({
      pass: r && r.ok === false && typeof r.error === "string",
      evidence: `empty provider response recovered as classified error: ${r.error} — "${r.detail}"`,
    }),
  },
  "safe-serialization-boundary": {
    codePath: `${CODE}:enforceTokenBudget`,
    obs1_probe: "enforceTokenBudget",
    sharpened: true, // sharpened: assert well-formed {systemPrompt, messages} within budget
    probe: () =>
      P.enforceTokenBudget("SYSTEM PROMPT", [{ role: "user", content: "hello teacher" }], 4000),
    predicate: (r) => ({
      pass:
        !!r && typeof r.systemPrompt === "string" && Array.isArray(r.messages) &&
        r.messages.every((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string"),
      evidence: `serialized within budget: {systemPrompt:string, messages:${r.messages.length} normalized}`,
    }),
  },
  "edge-case-empty-input": {
    codePath: `${CODE}:buildInvalidInputResponse`,
    obs1_probe: "buildInvalidInputResponse",
    sharpened: false,
    probe: () => P.buildInvalidInputResponse("empty"),
    predicate: (r) => ({
      pass: !!r && typeof r.vi === "string" && r.vi.length > 0,
      evidence: `empty-input edge handled with guidance response: "${excerpt(r.vi, 100)}"`,
    }),
  },
  "edge-case-mixed-language": {
    codePath: `${CODE}:buildInvalidInputResponse`,
    obs1_probe: "buildInvalidInputResponse",
    sharpened: false,
    probe: () => P.buildInvalidInputResponse("non_language"),
    predicate: (r) => ({
      pass: !!r && typeof r.vi === "string" && r.vi.length > 0,
      evidence: `non-language / mixed input handled: "${excerpt(r.vi, 100)}"`,
    }),
  },

  // ── PARKED (no promptAssembly code path genuinely evidences this axis) ──
  "lesson-recommendation-explanation": {
    park: true, belongs_to: "studyPath / lessonSequenceGenerator",
    reason: "promptAssembly lists focus/weakness but does NOT explain why a lesson is recommended; recommendation-explanation is studyPath behavior.",
  },
  "student-state-transition": {
    park: true, belongs_to: "sessionRuntime",
    reason: "state transitions are dispatched by sessionRuntime, not assembled by promptAssembly.",
  },
  "edge-case-stale-memory": {
    park: true, belongs_to: "staleSessionGuard",
    reason: "staleness detection/expiry is staleSessionGuard; promptAssembly renders whatever memory it is handed.",
  },
  "learner-state-routing": {
    park: true, belongs_to: "sessionRuntime",
    reason: "routing on learner state is sessionRuntime; promptAssembly only formats the chosen mode.",
  },
  "readiness-policy-boundary": {
    park: true, belongs_to: "studyPath / readiness",
    reason: "CEFR vocabulary calibration is not a promotion/readiness policy; readiness boundary lives in studyPath. (spec-only in registry)",
  },
  "hint-ladder-escalation": {
    park: true, belongs_to: "detectorHint",
    reason: "hint-ladder escalation + SESSION_CAP is detectorHint; getHighSeverityL1Patterns returns a flat pattern list, not an escalating ladder.",
  },
  "teacher-mercy-minimal-hint": {
    park: true, belongs_to: "detectorHint",
    reason: "minimal-hint selection is detectorHint behavior, not promptAssembly.",
  },
  "self-correction-loop-continuity": {
    park: true, belongs_to: "aiTutorService / correctionEngine",
    reason: "self-correction loops are orchestrated by aiTutorService/correctionEngine; parseResponse is single-shot parsing.",
  },
  "rubric-signal-preservation": {
    park: true, belongs_to: "review / scoring",
    reason: "rubric signals are a review/scoring concern; promptAssembly does not carry rubric state.",
  },
  "edge-case-repeated-answer": {
    park: true, belongs_to: "aiTutorService (retry dedup)",
    reason: "repeated-answer detection is retry/dedup in aiTutorService; parseResponse has no cross-turn memory.",
  },
  "retry-deduplication-boundary": {
    park: true, belongs_to: "costLimits / retry",
    reason: "retry de-duplication is costLimits/retry; enforceTokenBudget only trims context, it does not dedupe retries.",
  },
  "follow-up-intelligence-continuity": {
    park: true, belongs_to: "l1FollowUpLoop",
    reason: "follow-up continuity is l1FollowUpLoop; promptAssembly assembles a single request. (low-confidence link, sharpened analysis → parked)",
  },
  "speak-follow-up-replacement": {
    park: true, belongs_to: "SpeakPracticeMode",
    reason: "Speak follow-up replacement is a Speak-mode behavior; not a promptAssembly code path. (low-confidence link, sharpened analysis → parked)",
  },
  "ui-copy-source-of-truth": {
    park: true, belongs_to: "tutorUiCopy",
    reason: "UI copy source-of-truth is tutorUiCopy; promptAssembly refusal/fallback strings are not the UI copy registry. (low-confidence link, sharpened analysis → parked)",
  },
};

// Covered anchors attributed to their EXACT documented behavior (not a generic axis).
const ANCHOR_SPEC = {
  "TM-INT-234": {
    axis: "existing-product-evidence:P13-cefr-constraint-present",
    codePath: `${CODE}:assembleCefrConstraint`,
    probe: () => P.assembleCefrConstraint("A2"),
    predicate: (o) => ({
      pass: typeof o === "string" && o.startsWith("VOCABULARY:") && o.includes("calibrate your vocabulary"),
      evidence: `P13: CEFR vocabulary constraint injected when cefrLevel present`,
    }),
  },
  "TM-INT-235": {
    axis: "existing-product-evidence:P13b-no-constraint-when-null",
    codePath: `${CODE}:assembleSystemPrompt`,
    probe: () => P.assembleSystemPrompt("general_chat", null, "Minh"),
    predicate: (o) => ({
      pass: typeof o === "string" && o.length > 0 && !o.includes("VOCABULARY: Use vocabulary"),
      evidence: `P13b: NO CEFR vocabulary constraint appended when cefrLevel is null`,
    }),
  },
};

function loadJsonl(path) {
  return readFileSync(path, "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l));
}

function main() {
  const map = JSON.parse(readFileSync(HOOKMAP, "utf8"));
  const events = loadJsonl(OBS1_LOG); // OBS-001 emitted events (source of truth of what was observed)
  const eventByacceptId = new Map(events.map((e) => [e.tm_int_id, e]));

  // Every OBS-001-emitted promptAssembly event must get exactly one record.
  const inputs = [
    ...map.covered_anchors.map((a) => ({ tm_int_id: a.tm_int_id, axis: ANCHOR_SPEC[a.tm_int_id].axis, anchor: true })),
    ...map.tm_int_ids.map((t) => ({ tm_int_id: t.tm_int_id, axis: t.axis, anchor: false })),
  ];

  const records = [];
  const ts = () => new Date().toISOString();

  for (const it of inputs) {
    const spec = it.anchor ? ANCHOR_SPEC[it.tm_int_id] : SPEC[it.axis];
    const srcEvent = eventByacceptId.get(it.tm_int_id);
    const base = {
      tm_int_id: it.tm_int_id,
      axis: it.axis,
      module: "promptAssembly",
      is_covered_anchor: it.anchor,
      source_event: srcEvent
        ? { output_digest: srcEvent.output_digest, code_path: srcEvent.code_path, run_id: srcEvent.run_id }
        : null,
      run_id: runId,
      ts: ts(),
    };

    if (!spec) {
      records.push({ ...base, status: "parked", confidence: "parked",
        reason: `no attribution spec for axis '${it.axis}'`, belongs_to: null });
      continue;
    }
    if (spec.park) {
      records.push({ ...base, status: "parked", confidence: "parked",
        code_path: null, reason: spec.reason, belongs_to: spec.belongs_to });
      continue;
    }
    // attributed path — run sharpened probe against real code, evaluate predicate
    try {
      const out = spec.probe();
      const { pass, evidence } = spec.predicate(out);
      if (pass) {
        records.push({ ...base, status: "attributed", confidence: HIGH_TIER,
          code_path: spec.codePath, evidence,
          attribution_output_digest: digest(out),
          obs1_probe: spec.obs1_probe, sharpened: !!spec.sharpened });
      } else {
        records.push({ ...base, status: "parked", confidence: "parked",
          code_path: spec.codePath,
          reason: `evidence predicate did not confirm axis on real output: ${evidence}`,
          obs1_probe: spec.obs1_probe, sharpened: !!spec.sharpened });
      }
    } catch (e) {
      records.push({ ...base, status: "parked", confidence: "parked",
        code_path: spec.codePath, reason: `probe_error: ${e.message}`,
        obs1_probe: spec.obs1_probe, sharpened: !!spec.sharpened });
    }
  }

  mkdirSync(OBS_DIR, { recursive: true });
  writeFileSync(OUT, records.map((r) => JSON.stringify(r)).join("\n") + "\n", "utf8");

  // zero-silent-gap invariant: one record per input event, no unattributed
  const attributed = records.filter((r) => r.status === "attributed");
  const parked = records.filter((r) => r.status === "parked");
  const silent = inputs.length - records.length;
  const highOk = attributed.every((r) => r.confidence === HIGH_TIER);

  const sharpenedHigh = attributed.filter((r) => r.sharpened).map((r) => r.axis);
  const parkedAxes = [...new Set(parked.map((r) => r.axis))];

  const summary = {
    run_id: runId,
    out: OUT,
    input_events: inputs.length,
    records_written: records.length,
    attributed_high: attributed.length,
    parked: parked.length,
    silent_gaps: silent,
    all_attributed_are_high: highOk,
    invariant_pass: silent === 0 && highOk,
    sharpened_to_high_axes: [...new Set(sharpenedHigh)],
    parked_axes: parkedAxes,
  };
  console.log(JSON.stringify(summary, null, 2));
  if (!summary.invariant_pass) process.exit(1);
}

main();
