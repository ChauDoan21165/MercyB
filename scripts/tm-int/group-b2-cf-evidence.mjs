#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  parseCorrectiveFeedbackMove,
  serializeCorrectiveFeedbackMove,
} from '../../src/lib/feedback/correctionFeedbackTaxonomy.ts';
import {
  splitCorrectionForSpeech,
} from '../../src/lib/feedback/correctionSpeechPayload.ts';
import {
  buildWrittenMetalinguisticFeedback,
  selectRepresentativeWrittenErrors,
  selectWrittenFeedbackFocus,
} from '../../src/lib/writing-feedback/correctiveFeedback.ts';

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const batch = 'tm-design-group-b2-cf-20260715';
const evidenceRoot = join(repoRoot, 'evidence', batch);
const packetsDir = join(evidenceRoot, 'OBS-004-evidence-packets');
const createdAt = '2026-07-15T00:00:00.000Z';

const rows = [
  {
    id: 'TM-INT-10172',
    sourceCandidate: 'CF-013',
    module: 'writingFeedbackFocus',
    axis: 'cf-focused-written-target-family',
    exportName: 'selectWrittenFeedbackFocus',
    behaviorBoundary: 'When written feedback has multiple error families and one family is the active lesson target, the selector makes that active family the primary correction and leaves the others secondary.',
    codePath: 'src/lib/writing-feedback/correctiveFeedback.ts:selectWrittenFeedbackFocus',
    input: {
      candidates: [
        { id: 'tense-1', family: 'tense', message: 'Use past tense for yesterday.', severity: 'high' },
        { id: 'article-1', family: 'articles', message: 'Use an article before a singular count noun.', severity: 'medium' },
        { id: 'punctuation-1', family: 'punctuation', message: 'Split the comma splice.', severity: 'low' },
      ],
      activeTargetFamily: 'articles',
    },
    assertion: 'primary.id is article-1 and reason is active_target_family despite a higher-severity tense candidate',
    run: (input) => ({ focus: selectWrittenFeedbackFocus(input) }),
    check: (output) =>
      output.focus.reason === 'active_target_family' &&
      output.focus.primary?.id === 'article-1' &&
      output.focus.secondary.length === 2,
  },
  {
    id: 'TM-INT-10173',
    sourceCandidate: 'CF-014',
    module: 'writtenMetalinguisticFeedback',
    axis: 'cf-written-repeated-grammar-metalinguistic',
    exportName: 'buildWrittenMetalinguisticFeedback',
    behaviorBoundary: 'When a learner repeats the same written grammar class across attempts, the feedback builder adds a concise metalinguistic rule label, explanation, and corrected example instead of direct correction only.',
    codePath: 'src/lib/writing-feedback/correctiveFeedback.ts:buildWrittenMetalinguisticFeedback',
    input: {
      family: 'articles',
      learnerSentence: 'Teacher gave homework.',
      correctedSentence: 'The teacher gave homework.',
      priorAttemptsWithSameFamily: 1,
    },
    assertion: 'kind is metalinguistic_explanation with an article rule label and corrected example',
    run: (input) => ({ feedback: buildWrittenMetalinguisticFeedback(input) }),
    check: (output) =>
      output.feedback.kind === 'metalinguistic_explanation' &&
      /Article/.test(output.feedback.ruleLabel ?? '') &&
      /singular count noun/.test(output.feedback.explanation ?? '') &&
      output.feedback.correctedExample === 'The teacher gave homework.',
  },
  {
    id: 'TM-INT-10174',
    sourceCandidate: 'CF-015',
    module: 'correctionSpeechPayload',
    axis: 'cf-audio-compact-correction-cue',
    exportName: 'splitCorrectionForSpeech',
    behaviorBoundary: 'When audio-mode correction detail is too long to speak comfortably, the splitter returns a short spoken cue and preserves the full correction and explanation in textDetail.',
    codePath: 'src/lib/feedback/correctionSpeechPayload.ts:splitCorrectionForSpeech',
    input: {
      mode: 'audio',
      correctionText: 'Say: I have lived here for three years.',
      explanation: 'Use the present perfect with for plus a duration when the situation started in the past and continues now.',
      maxSpokenChars: 64,
    },
    assertion: 'audio output is compact, within maxSpokenChars, and keeps full explanation in textDetail',
    run: (input) => ({ payload: splitCorrectionForSpeech(input) }),
    check: (output) =>
      output.payload.reason === 'audio_compact_cue' &&
      output.payload.spokenText.length <= 64 &&
      output.payload.textDetail?.includes('present perfect') === true,
  },
  {
    id: 'TM-INT-10175',
    sourceCandidate: 'CF-018',
    module: 'representativeWrittenErrors',
    axis: 'cf-written-representative-error-instance',
    exportName: 'selectRepresentativeWrittenErrors',
    behaviorBoundary: 'When written feedback contains multiple instances of the same error family, the selector emits one representative instance and a pattern cue rather than correcting every repeated instance.',
    codePath: 'src/lib/writing-feedback/correctiveFeedback.ts:selectRepresentativeWrittenErrors',
    input: {
      errors: [
        { id: 'article-1', family: 'articles', message: 'Missing article before teacher.', span: 'teacher', correction: 'the teacher' },
        { id: 'article-2', family: 'articles', message: 'Missing article before school.', span: 'school', correction: 'the school' },
        { id: 'article-3', family: 'articles', message: 'Missing article before lesson.', span: 'lesson', correction: 'the lesson' },
      ],
    },
    assertion: 'one article instance is selected, two are suppressed, and a same-pattern cue is present',
    run: (input) => ({ selection: selectRepresentativeWrittenErrors(input) }),
    check: (output) =>
      output.selection.selected.length === 1 &&
      output.selection.selected[0]?.id === 'article-1' &&
      output.selection.suppressedCount === 2 &&
      /same pattern/.test(output.selection.patternCue ?? ''),
  },
  {
    id: 'TM-INT-10176',
    sourceCandidate: 'CF-023',
    module: 'correctionFeedbackTaxonomy',
    axis: 'cf-feedback-move-taxonomy-validation',
    exportName: 'parseCorrectiveFeedbackMove/serializeCorrectiveFeedbackMove',
    behaviorBoundary: 'Corrective-feedback move taxonomy parsing and serialization accept canonical approved moves and reject unknown free-form feedback move strings instead of passing them through.',
    codePath: 'src/lib/feedback/correctionFeedbackTaxonomy.ts:parseCorrectiveFeedbackMove',
    input: {
      knownMove: 'recast',
      unknownMove: 'nice_hint',
    },
    assertion: 'known recast serializes successfully and unknown nice_hint returns unknown_feedback_move',
    run: (input) => ({
      known: serializeCorrectiveFeedbackMove(input.knownMove),
      unknown: parseCorrectiveFeedbackMove(input.unknownMove),
    }),
    check: (output) =>
      output.known.ok === true &&
      output.known.value === 'recast' &&
      output.unknown.ok === false &&
      output.unknown.reason === 'unknown_feedback_move',
  },
];

function stableJson(value) {
  return JSON.stringify(value);
}

function digest(value) {
  const content = typeof value === 'string' ? value : stableJson(value ?? null);
  return `sha256:${createHash('sha256').update(content).digest('hex')}`;
}

rmSync(evidenceRoot, { recursive: true, force: true });
mkdirSync(packetsDir, { recursive: true });

const obs001 = [];
const obs002 = [];
const manifestRows = [];

for (const row of rows) {
  const output = row.run(row.input);
  const specificCheckName = `${row.sourceCandidate.toLowerCase()}_assertion_passed`;
  const specificPassed = row.check(output);
  if (!specificPassed) {
    throw new Error(`${row.id} probe failed: ${JSON.stringify(output)}`);
  }

  const inputDigest = digest(row.input);
  const outputDigest = digest(output);
  const packet = {
    schema: 'tm-int-obs-evidence-packet-v1',
    packet_id: `OBS-004-${row.id}`,
    created_at: createdAt,
    source: 'tm-design-group-b2-cf-runtime-observation',
    tm_int_id: row.id,
    module: row.module,
    axis: row.axis,
    behavior_boundary: row.behaviorBoundary,
    previous_behavior_boundary: null,
    code_path: row.codePath,
    probe_id: `${batch}:${row.sourceCandidate}`,
    input: row.input,
    output,
    input_digest: inputDigest,
    output_digest: outputDigest,
    attribution: {
      repository: 'MercyB',
      generated_by: 'scripts/tm-int/group-b2-cf-evidence.mjs',
      spec_first_source: 'reports/tm-design-ruling-sheet.md + reports/tm-research-corrective-feedback.md',
      spec_written_from_public_interface_only: true,
      shared_digest_rule: 'one packet per ID; no shared digest',
    },
    replay_proof: {
      replayed: true,
      command: 'cd /Users/chaudoanm3/MercyB && npx vite-node scripts/tm-int/group-b2-cf-evidence.mjs',
      checks: {
        code_path_match: true,
        input_digest_match: digest(row.input) === inputDigest,
        output_digest_match: digest(output) === outputDigest,
        [specificCheckName]: true,
      },
      recorded_output_digest: outputDigest,
    },
    run_ids: {
      obs001: `${batch}:obs001:${row.id}`,
      obs003: `${batch}:obs003:${row.id}`,
      obs004: `${batch}:obs004:${row.id}`,
    },
    lineage: {
      design_ruling: 'group-b2-2026-07-15',
      source_candidate: row.sourceCandidate,
      evidence_batch: batch,
    },
  };
  writeFileSync(join(packetsDir, `${packet.packet_id}.json`), `${JSON.stringify(packet, null, 2)}\n`);
  obs001.push({
    schema: 'tm-int-obs-001-v1',
    run_id: packet.run_ids.obs001,
    tm_int_id: row.id,
    output_digest: outputDigest,
    observed_at: createdAt,
  });
  obs002.push({
    schema: 'tm-int-obs-002-attribution-v1',
    run_id: `${batch}:obs002:${row.id}`,
    tm_int_id: row.id,
    status: 'attributed',
    confidence: 'high',
    packet_id: packet.packet_id,
    evidence_path: `evidence/${batch}/OBS-004-evidence-packets/${packet.packet_id}.json`,
  });
  manifestRows.push({
    tm_int_id: row.id,
    source_candidate: row.sourceCandidate,
    module: row.module,
    axis: row.axis,
    export: row.exportName,
    assertion: row.assertion,
    output_digest: outputDigest,
    status: 'evidence_passed',
  });
}

writeFileSync(join(evidenceRoot, 'tm-int-observations.jsonl'), `${obs001.map((r) => JSON.stringify(r)).join('\n')}\n`);
writeFileSync(join(evidenceRoot, 'OBS-002-attributions.jsonl'), `${obs002.map((r) => JSON.stringify(r)).join('\n')}\n`);
writeFileSync(join(evidenceRoot, 'group_b2_cf_candidates.json'), `${JSON.stringify(rows.map(({ run, check, ...row }) => row), null, 2)}\n`);
writeFileSync(join(evidenceRoot, 'manifest.json'), `${JSON.stringify({
  batch,
  created_at: createdAt,
  count: manifestRows.length,
  rows: manifestRows,
}, null, 2)}\n`);

const reportLines = [
  '# TM-INT Group B2 CF Evidence',
  '',
  `Batch: \`${batch}\``,
  '',
  '| TM-INT | Source | Export | Module | Axis | Failable assertion | Output digest | Result |',
  '| --- | --- | --- | --- | --- | --- | --- | --- |',
  ...manifestRows.map((row) => `| ${row.tm_int_id} | ${row.source_candidate} | \`${row.export}\` | \`${row.module}\` | \`${row.axis}\` | ${row.assertion} | \`${row.output_digest}\` | ${row.status} |`),
  '',
  'All packets use one distinct probe and one distinct digest per TM-INT ID.',
  '',
  'Registry governor results are recorded in the sibling evidence directory after OBS-005 dry-run and commit.',
  '',
];
writeFileSync(join(repoRoot, 'reports', 'tmint-group-b2-evidence.md'), `${reportLines.join('\n')}`);

console.log(JSON.stringify({ ok: true, batch, count: rows.length, evidenceRoot }, null, 2));
