#!/usr/bin/env node
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = resolve(scriptDir, "../..");
const factoryScript = join(REPO_ROOT, "scripts/tm-int/dp-int-factory.mjs");

export const DP_INT_V1_FAMILIES = [
  "DP-FOUNDATION",
  "DP-EVIDENCE",
  "DP-PRODUCT-ISSUE",
  "DP-LEARNER-SIGNAL",
  "DP-PED-BRIDGE",
  "DP-REPLAY-JUDGE",
];

const familyTests = {
  "DP-FOUNDATION": "npm test -- --run src/lib/tm-int/dp src/lib/tm-int/runtimeReadiness",
  "DP-EVIDENCE": "npm test -- --run src/lib/tm-int/runtimeReadiness src/lib/tm-int/runtime",
  "DP-PRODUCT-ISSUE": "npm test -- --run src/lib/tm-int src/components/placement",
  "DP-LEARNER-SIGNAL": "npm test -- --run src/lib/tm-int/learning-signals src/lib/tm-int",
  "DP-PED-BRIDGE": "npm test -- --run src/lib/tm-int src/lib/tm-int/runtimeReadiness",
  "DP-REPLAY-JUDGE": "npm test -- --run src/lib/tm-int/runtimeReadiness src/lib/tm-int",
};

export const DP_INT_V1_FAMILY_TARGETS = {
  "DP-FOUNDATION": 30,
  "DP-EVIDENCE": 50,
  "DP-PRODUCT-ISSUE": 45,
  "DP-LEARNER-SIGNAL": 45,
  "DP-PED-BRIDGE": 45,
  "DP-REPLAY-JUDGE": 45,
};

const expansionTracks = [
  ["coverage", "Add regression coverage for the cited DP invariant so unsupported edits fail before promotion."],
  ["negative-path", "Add a negative-path fixture for the cited DP invariant so unsafe learner claims are rejected."],
  ["replay", "Add replay evidence for the cited DP invariant so OBS to DP to PED behavior is reproducible."],
  ["contract", "Tighten the cited DP contract surface so downstream code cannot bypass the invariant."],
  ["reporting", "Expose the cited DP invariant in reviewable evidence so failures are actionable."],
  ["integration", "Connect the cited DP invariant through the runtime integration path used by placement or lessons."],
  ["fixture", "Add deterministic fixtures for the cited DP invariant so tests do not depend on hand-built samples."],
];

const baseFamilyDefinitions = {
  "DP-FOUNDATION": [
    ["teacher-context-ref", "src/lib/tm-int/dp/decisionContract.ts", "sourceTeacherContextRef", "src/lib/tm-int/dp/__tests__/dpValidator.test.ts", "Require every DP decision to cite the Teacher Context packet it consumed before PED can act.", "Teacher Mercy decides from the same Teacher Context that runtime used, preventing free-floating recommendations."],
    ["observation-citations", "src/lib/tm-int/dp/decisionContract.ts", "citedObservationIds", "src/lib/tm-int/dp/__tests__/dpValidator.test.ts", "Require DP decisions to carry observation citations for each product issue or validity claim.", "Teacher Mercy can trace why a decision changed back to observed facts instead of accepting uncited claims."],
    ["signal-citations", "src/lib/tm-int/dp/decisionContract.ts", "citedLearningSignalIds", "src/lib/tm-int/dp/__tests__/dpValidator.test.ts", "Require DP decisions to cite learning signals when learning behavior influences the recommendation.", "Teacher Mercy separates observed learning signals from assumptions when deciding follow-up actions."],
    ["product-issue-handling", "src/lib/tm-int/dp/decisionContract.ts", "DpProductIssueHandling", "src/lib/tm-int/dp/__tests__/dpValidator.test.ts", "Make product issue handling an explicit DP field so audio, mic, and runtime failures cannot be hidden in learner claims.", "Teacher Mercy handles system failures as system failures before scoring or pedagogy decisions are made."],
    ["learner-performance-claim", "src/lib/tm-int/dp/decisionContract.ts", "DpLearnerPerformanceClaim", "src/lib/tm-int/dp/__tests__/dpValidator.test.ts", "Constrain learner performance claims to typed, cited, supported statements.", "Teacher Mercy only uses learner claims when evidence supports them and the claim type is explicit."],
    ["confidence-level", "src/lib/tm-int/dp/decisionContract.ts", "DpDecisionConfidenceLevel", "src/lib/tm-int/dp/__tests__/dpValidator.test.ts", "Keep DP confidence levels within the shared low, medium, high contract.", "Teacher Mercy can compare DP recommendations consistently across placement and lesson flows."],
    ["ped-act-gate", "src/lib/tm-int/dp/decisionContract.ts", "pedAllowedToAct", "src/lib/tm-int/dp/__tests__/dpValidator.test.ts", "Gate PED action on a DP decision that explicitly allows the bridge to act.", "Teacher Mercy avoids teacher actions that bypass evidence review."],
    ["rationale-required", "src/lib/tm-int/dp/decisionContract.ts", "DpRecommendation", "src/lib/tm-int/dp/__tests__/dpValidator.test.ts", "Require each DP recommendation to include rationale text tied to its cited evidence.", "Teacher Mercy can explain why the next action is retest, fallback, follow-up, or continue."],
    ["validator-entrypoint", "src/lib/tm-int/dp/dpValidator.ts", "validateDpDecision", "src/lib/tm-int/dp/__tests__/dpValidator.test.ts", "Keep a single validator entrypoint for evidence-based DP decisions.", "Teacher Mercy gets one consistent pass/fail gate before DP output influences PED."],
    ["public-dp-exports", "src/lib/tm-int/dp/index.ts", "decisionContract", "src/lib/tm-int/dp/__tests__/dpValidator.test.ts", "Expose DP decision contract and validator through the DP public index.", "Teacher Mercy runtime and Judge code can import the same DP rules without deep-copying logic."],
  ],
  "DP-EVIDENCE": [
    ["runtime-bundle", "src/lib/tm-int/runtimeReadiness/evidenceBundle.ts", "RuntimeEvidenceBundle", "src/lib/tm-int/runtimeReadiness/__tests__/judgeRubric.test.ts", "Use the runtime evidence bundle as the canonical DP input evidence envelope.", "Teacher Mercy decides better because DP sees the same OBS, signals, context, decisions, replay, and Judge reproduction evidence."],
    ["observation-id-set", "src/lib/tm-int/runtimeReadiness/evidenceBundle.ts", "observationIdsFromBundle", "src/lib/tm-int/runtimeReadiness/__tests__/teacherContextValidator.test.ts", "Normalize observation identifiers before DP validates citations.", "Teacher Mercy can reject decisions that cite observations not present in the runtime evidence."],
    ["signal-key-set", "src/lib/tm-int/runtimeReadiness/evidenceBundle.ts", "signalKeysFromBundle", "src/lib/tm-int/runtimeReadiness/__tests__/teacherContextValidator.test.ts", "Normalize learning signal keys before DP validates signal citations.", "Teacher Mercy can reject decisions that cite learning signals not produced by the learning signal engine."],
    ["teacher-context-validator", "src/lib/tm-int/runtimeReadiness/teacherContextValidator.ts", "validateTeacherContext", "src/lib/tm-int/runtimeReadiness/__tests__/teacherContextValidator.test.ts", "Require DP evidence intake to pass Teacher Context validation first.", "Teacher Mercy uses complete context with observation summary, product issues, retests, recommendations, confidence, and replay trace."],
    ["context-builder", "src/lib/tm-int/runtime/contextBuilder.ts", "buildTeacherContext", "src/lib/tm-int/runtime/__tests__/teacherContextPipeline.test.ts", "Anchor DP evidence intake to the runtime Teacher Context builder.", "Teacher Mercy decisions stay aligned with the runtime context generated from OBS packets."],
    ["signal-aggregator", "src/lib/tm-int/runtime/signalAggregator.ts", "aggregateLearningSignals", "src/lib/tm-int/runtime/__tests__/teacherContextPipeline.test.ts", "Require DP evidence to preserve aggregated learning signals from the runtime pipeline.", "Teacher Mercy can weigh observed learning behavior without inventing psychological conclusions."],
    ["obs-packet-type", "src/lib/tm-int/obs/types.ts", "ObservationPacket", "src/lib/tm-int/obs/__tests__/observationPacket.test.ts", "Make ObservationPacket the source evidence shape for DP citations.", "Teacher Mercy grounds DP decisions in recorded facts rather than UI-only state."],
    ["runtime-fixture-builder", "src/lib/tm-int/runtimeReadiness/fixtureBuilder.ts", "createValidRuntimeEvidenceBundle", "src/lib/tm-int/runtimeReadiness/__tests__/fixtureBuilder.test.ts", "Use deterministic runtime evidence fixtures for DP validator regression tests.", "Teacher Mercy DP checks can be reproduced without hand-written sample drift."],
    ["placement-runtime-source", "src/lib/placement/v3/runtimeIntegration.ts", "buildPlacementTeacherContext", "src/components/placement/v3/__tests__/runtimeIntegration.test.ts", "Treat placement runtime integration as a real DP evidence source.", "Teacher Mercy placement decisions reflect actual placement OBS timelines and Teacher Context output."],
    ["readiness-contracts", "src/lib/tm-int/runtimeReadiness/contracts.ts", "RuntimeGateId", "src/lib/tm-int/runtimeReadiness/__tests__/judgeRubric.test.ts", "Tie DP evidence validation to known runtime gate contracts.", "Teacher Mercy can distinguish verified runtime gates from unreviewed future flows."],
  ],
  "DP-PRODUCT-ISSUE": [
    ["audio-unavailable", "src/lib/tm-int/dp/audio.ts", "product_failure_audio", "src/lib/tm-int/__tests__/tc000001PlacementAudioUnavailable.test.ts", "Ensure unavailable audio produces a product-failure DP reason and invalid listening validity only.", "Teacher Mercy excludes listening score and offers retest without blaming learner listening ability."],
    ["audio-duration-zero", "src/lib/tm-int/obs/detectors/audio.ts", "AudioDurationZero", "src/lib/tm-int/obs/__tests__/audioObservation.test.ts", "Preserve zero-duration audio as product evidence for DP handling.", "Teacher Mercy recognizes silent or empty media as assessment-invalid product failure."],
    ["audio-playback-failed", "src/lib/tm-int/obs/detectors/audio.ts", "AudioPlaybackFailed", "src/lib/tm-int/obs/__tests__/audioObservation.test.ts", "Route playback failure observations into product issue DP decisions.", "Teacher Mercy can offer listening retest instead of scoring a failed media attempt."],
    ["mic-permission-denied", "src/lib/tm-int/dp/speech.ts", "product_or_permission_block", "src/lib/tm-int/__tests__/tc000002MicrophoneDenied.test.ts", "Ensure microphone denial produces permission-block DP output and invalid speaking validity only.", "Teacher Mercy excludes speaking score while offering retry and text fallback."],
    ["speech-timeout", "src/lib/tm-int/obs/detectors/speech.ts", "SpeechTimeout", "src/lib/tm-int/obs/__tests__/observationPacket.test.ts", "Preserve speech timeout observations as possible product or device blocks.", "Teacher Mercy avoids lowering speaking ability when capture failed or timed out."],
    ["runtime-product-issues", "src/lib/tm-int/runtime/decisionPipeline.ts", "productIssues", "src/lib/tm-int/runtime/__tests__/teacherContextPipeline.test.ts", "Keep runtime product issues visible to DP instead of mixing them into learner performance.", "Teacher Mercy can separate validity failures from learning behavior."],
    ["placement-score-exclusion", "src/lib/placement/v3/runtimeIntegration.ts", "runtimeExclusionReason", "src/components/placement/v3/__tests__/runtimeIntegration.test.ts", "Verify DP product-failure output reaches placement score exclusion reasons.", "Teacher Mercy changes placement scoring only when product evidence supports exclusion."],
    ["teacher-context-product-issues", "src/lib/tm-int/runtime/types.ts", "productIssues", "src/lib/tm-int/runtime/__tests__/teacherContextPipeline.test.ts", "Require Teacher Context product issue fields to remain available for DP.", "Teacher Mercy can audit product issue handling before recommendations are used."],
    ["product-failure-guard", "src/lib/tm-int/dp/dpValidator.ts", "product_failure_as_learner_weakness", "src/lib/tm-int/dp/__tests__/dpValidator.test.ts", "Block any DP decision that converts product failure into learner weakness.", "Teacher Mercy protects learners from unfair scoring after system or device failures."],
    ["readiness-learner-weakness", "src/lib/tm-int/runtimeReadiness/judgeRubric.ts", "product_failure_as_learner_weakness", "src/lib/tm-int/runtimeReadiness/__tests__/judgeRubric.test.ts", "Reuse runtime readiness product-failure invariant in DP review packages.", "Teacher Mercy Judge evidence catches regressions where product issues become learner blame."],
  ],
  "DP-LEARNER-SIGNAL": [
    ["productive-hesitation", "src/lib/tm-int/learning-signals/engine.ts", "ProductiveHesitation", "src/lib/tm-int/learning-signals/__tests__/learningSignalEngine.test.ts", "Map pause plus final correct without hint into a DP-safe learning behavior signal.", "Teacher Mercy can recognize thoughtful delay without treating it as weakness."],
    ["healthy-self-correction", "src/lib/tm-int/learning-signals/engine.ts", "HealthySelfCorrection", "src/lib/tm-int/learning-signals/__tests__/learningSignalEngine.test.ts", "Map wrong revised correct sequences into a DP-safe self-correction signal.", "Teacher Mercy can reinforce repair behavior without over-penalizing the first error."],
    ["hint-dependency", "src/lib/tm-int/learning-signals/engine.ts", "HintDependency", "src/lib/tm-int/learning-signals/__tests__/learningSignalEngine.test.ts", "Map repeated hint usage into a DP signal that preserves alternatives.", "Teacher Mercy can offer scaffolded support without making a one-event ability conclusion."],
    ["misconception-recurrence", "src/lib/tm-int/learning-signals/engine.ts", "MisconceptionRecurrence", "src/lib/tm-int/learning-signals/__tests__/learningSignalEngine.test.ts", "Map repeated same-concept wrong answers into a DP signal requiring follow-up evidence.", "Teacher Mercy can investigate a pattern while avoiding premature mastery reduction."],
    ["retrieval-success", "src/lib/tm-int/learning-signals/engine.ts", "RetrievalSuccess", "src/lib/tm-int/learning-signals/__tests__/learningSignalEngine.test.ts", "Map correct after delay into a retrieval success signal.", "Teacher Mercy can distinguish successful recall from random fast answering."],
    ["productive-struggle", "src/lib/tm-int/learning-signals/engine.ts", "productive_struggle", "src/lib/tm-int/__tests__/learningBehaviorFamilyV1.test.ts", "Keep productive struggle as a DP interpretation that preserves alternatives.", "Teacher Mercy can encourage persistence without labeling the learner as weak."],
    ["sustained-attention", "src/lib/tm-int/learning-signals/engine.ts", "sustained_attention", "src/lib/tm-int/__tests__/learningBehaviorFamilyV1.test.ts", "Keep sustained attention as evidence-based DP behavior interpretation.", "Teacher Mercy can pace lessons based on observed attention evidence."],
    ["confidence-calibration", "src/lib/tm-int/learning-signals/engine.ts", "confidence_calibration", "src/lib/tm-int/__tests__/learningBehaviorFamilyV1.test.ts", "Keep confidence calibration as a DP interpretation tied to explicit confidence evidence.", "Teacher Mercy can ask follow-up checks when confidence and correctness diverge."],
    ["cognitive-overload", "src/lib/tm-int/learning-signals/engine.ts", "cognitive_overload", "src/lib/tm-int/__tests__/learningBehaviorFamilyV1.test.ts", "Keep cognitive overload as a needs-followup signal with alternatives intact.", "Teacher Mercy can slow pacing without reducing skill mastery from one event."],
    ["transfer-success", "src/lib/tm-int/learning-signals/engine.ts", "transfer_success", "src/lib/tm-int/__tests__/learningBehaviorFamilyV1.test.ts", "Keep transfer success as a DP signal requiring cross-context evidence.", "Teacher Mercy can recognize applied learning across tasks when evidence supports it."],
  ],
  "DP-PED-BRIDGE": [
    ["audio-ped-bridge", "src/lib/tm-int/ped/audio.ts", "exclude_listening_score", "src/lib/tm-int/__tests__/tc000001PlacementAudioUnavailable.test.ts", "Bridge DP audio product-failure evidence to PED actions that exclude listening score and offer retest.", "Teacher Mercy converts invalid listening evidence into fair teacher action."],
    ["speech-ped-bridge", "src/lib/tm-int/ped/speech.ts", "offer_text_fallback", "src/lib/tm-int/__tests__/tc000002MicrophoneDenied.test.ts", "Bridge DP microphone block evidence to PED actions that offer fallback and retry.", "Teacher Mercy keeps speaking assessment usable when device permission blocks capture."],
    ["rapid-guessing-ped", "src/lib/tm-int/ped/learning.ts", "ask_confidence_check", "src/lib/tm-int/__tests__/tc000003RapidGuessing.test.ts", "Bridge DP rapid-guessing evidence to a confidence check without lowering placement.", "Teacher Mercy responds to questionable validity with follow-up instead of punishment."],
    ["learning-family-ped", "src/lib/tm-int/ped/learningBehaviorFamily.ts", "TEACHER_ACTION_BY_SIGNAL", "src/lib/tm-int/__tests__/learningBehaviorFamilyV1.test.ts", "Bridge learning behavior DP signals to bounded teacher actions.", "Teacher Mercy uses learning signals for support actions that remain explainable and safe."],
    ["runtime-decision-pipeline", "src/lib/tm-int/runtime/decisionPipeline.ts", "runRuntimeDecisionPipeline", "src/lib/tm-int/runtime/__tests__/teacherContextPipeline.test.ts", "Ensure runtime decisions receive DP output before PED actions are assembled.", "Teacher Mercy keeps the DP before PED invariant in live context generation."],
    ["runtime-hooks", "src/lib/tm-int/runtime/runtimeHooks.ts", "observationPacketFromAudio", "src/lib/tm-int/runtime/__tests__/runtimeReplay.test.ts", "Expose runtime hooks that build context through the verified pipeline.", "Teacher Mercy integrations can call one hook instead of bypassing hasDpBeforePed."],
    ["teacher-context-recommendations", "src/lib/tm-int/runtime/types.ts", "recommendations", "src/lib/tm-int/runtime/__tests__/teacherContextPipeline.test.ts", "Keep PED-facing recommendations inside Teacher Context.", "Teacher Mercy can show actions that are traceable to context and verified capability sources."],
    ["decision-trace-stage", "src/lib/tm-int/runtimeReadiness/decisionTrace.ts", "PED", "src/lib/tm-int/runtimeReadiness/__tests__/decisionTrace.test.ts", "Represent the PED stage in readiness decision traces.", "Teacher Mercy Judge reports can prove PED did not act before DP."],
    ["readiness-report-dp-ped", "src/lib/tm-int/runtimeReadiness/readinessReport.ts", "hasDpBeforePed", "src/lib/tm-int/runtimeReadiness/__tests__/readinessReport.test.ts", "Report hasDpBeforePed results in readiness summaries.", "Teacher Mercy reviewers can see whether runtime teacher action followed evidence order."],
    ["ped-allowed-validator", "src/lib/tm-int/dp/dpValidator.ts", "pedAllowedToAct", "src/lib/tm-int/dp/__tests__/dpValidator.test.ts", "Validate PED action allowance before any bridge uses a DP recommendation.", "Teacher Mercy blocks teacher actions from unsupported DP recommendations."],
  ],
  "DP-REPLAY-JUDGE": [
    ["dp-validator-tests", "src/lib/tm-int/dp/__tests__/dpValidator.test.ts", "PASS valid DP decision", "src/lib/tm-int/dp/__tests__/dpValidator.test.ts", "Keep DP contract behavior covered by explicit pass and fail tests.", "Teacher Mercy DP changes remain regression-tested before Judge review."],
    ["judge-replay", "src/lib/tm-int/judge/replay.ts", "replay", "src/lib/tm-int/__tests__/tc000001PlacementAudioUnavailable.test.ts", "Anchor DP replay expectations to the Judge replay utilities.", "Teacher Mercy can reproduce OBS to DP to PED to LM outcomes before promotion."],
    ["judge-types", "src/lib/tm-int/judge/types.ts", "Judge", "src/lib/tm-int/runtimeReadiness/__tests__/judgeRubric.test.ts", "Keep Judge result types separate from F workpack status.", "Teacher Mercy verification remains independent from factory execution."],
    ["verified-registry", "src/lib/tm-int/judge/verifiedRegistry.ts", "verified", "src/lib/tm-int/runtimeReadiness/__tests__/judgeRubric.test.ts", "Require DP work to reference verified registry status through Judge-owned code only.", "Teacher Mercy recommendations are influenced only by independently verified capabilities."],
    ["replay-determinism", "src/lib/tm-int/runtimeReadiness/replayDeterminism.ts", "checkReplayDeterminism", "src/lib/tm-int/runtimeReadiness/__tests__/replayDeterminism.test.ts", "Use replay determinism checks when judging DP workpack evidence.", "Teacher Mercy DP outcomes must reproduce under the same evidence bundle."],
    ["judge-explanation", "src/lib/tm-int/runtimeReadiness/judgeExplanation.ts", "explainRuntimeReadinessJudge", "src/lib/tm-int/runtimeReadiness/__tests__/judgeExplanation.test.ts", "Generate Judge explanations that name the exact failed DP invariant or replay stage.", "Teacher Mercy reviewers can reject unsafe DP changes with actionable evidence."],
    ["regression-pack", "src/lib/tm-int/runtimeReadiness/regressionPack.ts", "Regression", "src/lib/tm-int/runtimeReadiness/__tests__/regressionPack.test.ts", "Package DP runtime evidence as reusable regression cases.", "Teacher Mercy keeps verified DP behavior from regressing across future runtime gates."],
    ["cross-flow-replay", "src/lib/tm-int/runtimeReadiness/crossFlowReplay.ts", "CrossFlowReplayPackage", "src/lib/tm-int/runtimeReadiness/__tests__/crossFlowReplay.test.ts", "Support DP evidence across placement, tutor, speaking, and listening flows.", "Teacher Mercy can compare decisions across flows without carrying over product failures as learner weakness."],
    ["readiness-report", "src/lib/tm-int/runtimeReadiness/readinessReport.ts", "generateRuntimeReadinessReport", "src/lib/tm-int/runtimeReadiness/__tests__/readinessReport.test.ts", "Require DP Judge packages to produce machine and Markdown readiness reports.", "Teacher Mercy gets reviewable evidence instead of report-only claims."],
    ["factory-ledger", "scripts/tm-int/dp-int-factory.mjs", "dp_int_judge_results", "scripts/__tests__/dp-int-factory.test.mjs", "Keep DP workpack Judge promotion in a separate ledger from F queue rows.", "Teacher Mercy prevents F from verifying its own DP work."],
  ],
};

const familyDefinitions = Object.fromEntries(
  DP_INT_V1_FAMILIES.map((family) => {
    const baseEntries = baseFamilyDefinitions[family];
    const target = DP_INT_V1_FAMILY_TARGETS[family];
    const entries = [...baseEntries];

    for (let index = baseEntries.length; index < target; index += 1) {
      const base = baseEntries[index % baseEntries.length];
      const track = expansionTracks[(index - baseEntries.length) % expansionTracks.length];
      const cycle = Math.floor((index - baseEntries.length) / expansionTracks.length) + 1;
      const [slug, sourceFile, anchor, relatedFile, objective, productValue] = base;
      const suffix = `${track[0]}-${String(cycle).padStart(2, "0")}`;
      entries.push([
        `${slug}-${suffix}`,
        sourceFile,
        anchor,
        relatedFile,
        `${track[1]} Base invariant: ${objective}`,
        `${productValue} This added workpack makes the behavior harder to regress under DP INT v1.`,
      ]);
    }

    return [family, entries];
  }),
);

function factoryDbPath() {
  return process.env.DP_INT_FACTORY_DB || join(REPO_ROOT, "state/dp_int_factory.sqlite3");
}

function sourceLine(sourceFile, anchor, root = REPO_ROOT) {
  const absolute = join(root, sourceFile);
  const lines = readFileSync(absolute, "utf8").split(/\r?\n/);
  const lineIndex = lines.findIndex((line) => line.includes(anchor));
  if (lineIndex === -1) {
    throw new Error(`Anchor ${anchor} not found in ${sourceFile}`);
  }
  return String(lineIndex + 1);
}

function lineList(...items) {
  return items;
}

export function createDpIntV1Workpacks(root = REPO_ROOT) {
  const workpacks = [];
  for (const family of DP_INT_V1_FAMILIES) {
    const entries = familyDefinitions[family];
    entries.forEach(([slug, sourceFile, anchor, relatedFile, objective, productValue], index) => {
      const number = String(index + 1).padStart(6, "0");
      const familyKey = family.toLowerCase().replaceAll("-", ".");
      workpacks.push({
        wp_id: `${family}-WP-${number}`,
        semantic_key: `dp.${familyKey}.${slug.replaceAll("-", "_")}`,
        tm_int_id: "DP-INT-v1",
        source_file: sourceFile,
        source_line: sourceLine(sourceFile, anchor, root),
        source_anchor_excerpt: anchor,
        related_test_or_replay_file: relatedFile,
        objective,
        expected_product_value: productValue,
        acceptance_tests: lineList(
          familyTests[family],
          "npm run typecheck",
          "npm exec eslint -- scripts src --format json",
        ),
        judge_checks: lineList(
          "Confirm the workpack cites real OBS, Teacher Context, or learning-signal evidence before DP output changes.",
          "Confirm DP preserves alternatives and does not infer learner weakness from a single unsupported event.",
          "Confirm F queue verified remains 0 and Judge evidence is separate from the workpack row.",
        ),
        anti_fake_checks: lineList(
          "Reject report-only artifacts without source diff, test evidence, and replay or validator evidence.",
          "Reject skipped tests, mocked pass claims, or fixture-only changes that do not exercise the cited source anchor.",
          "Reject any change that marks F verified, writes Judge status into the workpack row, or bypasses DP before PED.",
        ),
        status: "workpack_ready",
        verified: 0,
      });
    });
  }
  return workpacks;
}

export const DP_INT_V1_WORKPACKS = createDpIntV1Workpacks();

export function validateDpIntV1Workpacks(workpacks, root = REPO_ROOT) {
  const errors = [];
  const semanticKeys = new Set();
  const familyCounts = new Map(DP_INT_V1_FAMILIES.map((family) => [family, 0]));

  for (const [index, workpack] of workpacks.entries()) {
    for (const field of [
      "wp_id",
      "semantic_key",
      "tm_int_id",
      "source_file",
      "source_line",
      "source_anchor_excerpt",
      "related_test_or_replay_file",
      "objective",
      "expected_product_value",
      "acceptance_tests",
      "judge_checks",
      "anti_fake_checks",
    ]) {
      const value = workpack[field];
      if (Array.isArray(value) ? value.length === 0 : String(value ?? "").trim().length === 0) {
        errors.push(`workpacks[${index}].${field} is required`);
      }
    }

    if (semanticKeys.has(workpack.semantic_key)) errors.push(`duplicate semantic_key: ${workpack.semantic_key}`);
    semanticKeys.add(workpack.semantic_key);

    const family = DP_INT_V1_FAMILIES.find((candidate) => workpack.wp_id.startsWith(`${candidate}-WP-`));
    if (!family) {
      errors.push(`workpacks[${index}].wp_id has unknown family: ${workpack.wp_id}`);
    } else {
      familyCounts.set(family, (familyCounts.get(family) ?? 0) + 1);
    }

    if (workpack.status !== "workpack_ready") errors.push(`${workpack.wp_id} status must be workpack_ready`);
    if (workpack.verified !== 0) errors.push(`${workpack.wp_id} verified must be 0`);
    if (!String(workpack.expected_product_value).includes("Teacher Mercy")) {
      errors.push(`${workpack.wp_id} expected_product_value must answer how Teacher Mercy decides better`);
    }
    if (/^improve dp$/i.test(String(workpack.objective).trim())) {
      errors.push(`${workpack.wp_id} objective is too broad`);
    }

    const sourcePath = join(root, workpack.source_file);
    if (!existsSync(sourcePath)) {
      errors.push(`${workpack.wp_id} source_file does not exist: ${workpack.source_file}`);
    } else if (!readFileSync(sourcePath, "utf8").includes(workpack.source_anchor_excerpt)) {
      errors.push(`${workpack.wp_id} source_anchor_excerpt not found in ${workpack.source_file}`);
    }

    const relatedPath = join(root, workpack.related_test_or_replay_file);
    if (!existsSync(relatedPath)) {
      errors.push(`${workpack.wp_id} related_test_or_replay_file does not exist: ${workpack.related_test_or_replay_file}`);
    }
  }

  for (const [family, count] of familyCounts.entries()) {
    const expected = DP_INT_V1_FAMILY_TARGETS[family];
    if (count !== expected) errors.push(`${family} expected ${expected} workpacks, found ${count}`);
  }

  return {
    pass: errors.length === 0,
    errors,
    count: workpacks.length,
    familyCounts: Object.fromEntries(familyCounts),
    duplicateSemanticKeys: workpacks.length - semanticKeys.size,
  };
}

function importWorkpacks(workpacks) {
  if (workpacks.length === 0) return;
  const root = mkdtempSync(join(tmpdir(), "dp-int-v1-seed-"));
  const file = join(root, "dp-int-v1-workpacks.json");
  writeFileSync(file, JSON.stringify({ workpacks }, null, 2));
  try {
    const result = spawnSync(process.execPath, [factoryScript, "import-workpacks", file], {
      cwd: REPO_ROOT,
      encoding: "utf8",
      env: process.env,
    });
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    if (result.status !== 0) {
      throw new Error(`dp-int-factory import-workpacks failed with status ${result.status}`);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function existingWorkpackIds() {
  const db = factoryDbPath();
  if (!existsSync(db)) return new Set();
  const result = spawnSync("sqlite3", [db, "SELECT wp_id FROM dp_int_workpacks;"], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
  if (result.status !== 0) return new Set();
  return new Set(result.stdout.split(/\r?\n/).filter(Boolean));
}

export function main() {
  const validation = validateDpIntV1Workpacks(DP_INT_V1_WORKPACKS);
  if (!validation.pass) {
    throw new Error(validation.errors.join("\n"));
  }
  const existing = existingWorkpackIds();
  const missingWorkpacks = DP_INT_V1_WORKPACKS.filter((workpack) => !existing.has(workpack.wp_id));
  importWorkpacks(missingWorkpacks);
  console.log(`validated=${validation.count}`);
  console.log(`seeded=${missingWorkpacks.length}`);
  for (const family of DP_INT_V1_FAMILIES) {
    console.log(`${family}=${validation.familyCounts[family]}`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
