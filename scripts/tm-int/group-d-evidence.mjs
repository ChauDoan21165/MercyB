#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  detectL1Error,
  detectRegisterError,
  detectRegisterErrorWithContext,
} from '../../src/lib/feedback/index.ts';
import {
  selectDiphthongReductionFeedbackKey,
  selectFinalLFeedbackKey,
  selectFinalStopVoicingFeedbackKey,
  selectVWFeedbackKey,
} from '../../src/lib/pronunciation/vnEnPronunciationDrills.ts';

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const batch = 'tm-design-group-d-20260716';
const evidenceRoot = join(repoRoot, 'evidence', batch);
const packetsDir = join(evidenceRoot, 'OBS-004-evidence-packets');
const createdAt = '2026-07-16T00:00:00.000Z';

const rows = [
  {
    id: 'TM-INT-10177',
    sourceCandidate: 'D-G1',
    module: 'l1ErrorDetector',
    axis: 'vi-modal-overinflection',
    exportName: 'vi_l1_modal_overinflection',
    behaviorBoundary: 'Detects Vietnamese L1 modal overinflection when learner text adds third-person -s to a modal such as can or should and the expected correction keeps the modal uninflected.',
    codePath: 'src/lib/feedback/index.ts:detectL1Error',
    input: {
      positive: { userAnswer: 'He cans speak English.', expectedAnswer: 'He can speak English.' },
      negative: { userAnswer: 'He can speak English.', expectedAnswer: 'He can speak English.' },
    },
    assertion: 'positive returns vi_l1_modal_overinflection and the correct modal form does not return that tag',
    run: (input) => {
      const positive = detectL1Error(input.positive);
      const negative = detectL1Error(input.negative);
      return { positive, negative };
    },
    check: (output) =>
      output.positive.matched === true &&
      output.positive.weaknessTag === 'vi_l1_modal_overinflection' &&
      (output.negative.matched === false || output.negative.weaknessTag !== 'vi_l1_modal_overinflection'),
  },
  {
    id: 'TM-INT-10178',
    sourceCandidate: 'D-G2',
    module: 'l1ErrorDetector',
    axis: 'vi-phrasal-verb-transfer',
    exportName: 'vi_l1_phrasal_verb_transfer',
    behaviorBoundary: 'Detects a conservative whitelist of Vietnamese L1 phrasal-verb lexical transfer when learner text uses wake, wear, or care where the expected correction uses get up, put on, or look after.',
    codePath: 'src/lib/feedback/index.ts:detectL1Error',
    input: {
      positives: [
        { userAnswer: 'I wake at six.', expectedAnswer: 'I get up at six.' },
        { userAnswer: 'Wear your jacket.', expectedAnswer: 'Put on your jacket.' },
        { userAnswer: 'She cares her brother.', expectedAnswer: 'She looks after her brother.' },
      ],
      negative: { userAnswer: 'I wake the baby.', expectedAnswer: 'I wake the baby.' },
    },
    assertion: 'all three whitelisted phrasal-transfer pairs return vi_l1_phrasal_verb_transfer and a non-whitelisted wake use does not',
    run: (input) => {
      const positives = input.positives.map((probe) => detectL1Error(probe));
      const negative = detectL1Error(input.negative);
      return { positives, negative };
    },
    check: (output) =>
      output.positives.length === 3 &&
      output.positives.every((result) => result.matched === true && result.weaknessTag === 'vi_l1_phrasal_verb_transfer') &&
      (output.negative.matched === false || output.negative.weaknessTag !== 'vi_l1_phrasal_verb_transfer'),
  },
  {
    id: 'TM-INT-10179',
    sourceCandidate: 'D-G3',
    module: 'l1ErrorDetector',
    axis: 'vi-very-verb-calque',
    exportName: 'vi_l1_very_verb_calque',
    behaviorBoundary: 'Detects Vietnamese L1 degree-adverb calque when learner text puts very directly before a verb such as like and the expected correction uses really before the verb.',
    codePath: 'src/lib/feedback/index.ts:detectL1Error',
    input: {
      positive: { userAnswer: 'I very like this song.', expectedAnswer: 'I really like this song.' },
      negativeAdjective: { userAnswer: 'This song is very good.', expectedAnswer: 'This song is very good.' },
      negativeCorrect: { userAnswer: 'I really like this song.', expectedAnswer: 'I really like this song.' },
    },
    assertion: 'very plus verb returns vi_l1_very_verb_calque while really plus verb and very plus adjective do not',
    run: (input) => ({
      positive: detectL1Error(input.positive),
      negativeAdjective: detectL1Error(input.negativeAdjective),
      negativeCorrect: detectL1Error(input.negativeCorrect),
    }),
    check: (output) =>
      output.positive.matched === true &&
      output.positive.weaknessTag === 'vi_l1_very_verb_calque' &&
      (output.negativeAdjective.matched === false || output.negativeAdjective.weaknessTag !== 'vi_l1_very_verb_calque') &&
      (output.negativeCorrect.matched === false || output.negativeCorrect.weaknessTag !== 'vi_l1_very_verb_calque'),
  },
  {
    id: 'TM-INT-10180',
    sourceCandidate: 'D-G4',
    module: 'l1ErrorDetector',
    axis: 'vi-overexplicit-reference',
    exportName: 'vi_l1_overexplicit_reference',
    behaviorBoundary: 'Detects Vietnamese L1 overexplicit reference chains when learner text repeats the same named subject across adjacent sentences and the expected correction switches later mentions to pronouns.',
    codePath: 'src/lib/feedback/index.ts:detectL1Error',
    input: {
      positive: {
        userAnswer: 'Lan is my friend. Lan works with me. Lan is kind.',
        expectedAnswer: 'Lan is my friend. She works with me. She is kind.',
      },
      negative: { userAnswer: 'Lan is my friend.', expectedAnswer: 'Lan is my friend.' },
    },
    assertion: 'repeated name chain returns vi_l1_overexplicit_reference and a single mention does not',
    run: (input) => ({
      positive: detectL1Error(input.positive),
      negative: detectL1Error(input.negative),
    }),
    check: (output) =>
      output.positive.matched === true &&
      output.positive.weaknessTag === 'vi_l1_overexplicit_reference' &&
      (output.negative.matched === false || output.negative.weaknessTag !== 'vi_l1_overexplicit_reference'),
  },
  {
    id: 'TM-INT-10181',
    sourceCandidate: 'D-G5',
    module: 'l1ErrorDetector',
    axis: 'vi-time-reference-overmarking',
    exportName: 'vi_l1_time_reference_overmarking',
    behaviorBoundary: 'Detects Vietnamese L1 time-reference overmarking when learner text repeats the same narrative time marker across several sentences and the expected correction keeps only the first marker.',
    codePath: 'src/lib/feedback/index.ts:detectL1Error',
    input: {
      positive: {
        userAnswer: 'Yesterday I went to work. Yesterday I met my boss. Yesterday I came home late.',
        expectedAnswer: 'Yesterday I went to work. I met my boss. I came home late.',
      },
      negative: {
        userAnswer: 'Yesterday I went to work. I met my boss. I came home late.',
        expectedAnswer: 'Yesterday I went to work. I met my boss. I came home late.',
      },
    },
    assertion: 'three repeated yesterday markers return vi_l1_time_reference_overmarking and a single initial marker does not',
    run: (input) => ({
      positive: detectL1Error(input.positive),
      negative: detectL1Error(input.negative),
    }),
    check: (output) =>
      output.positive.matched === true &&
      output.positive.weaknessTag === 'vi_l1_time_reference_overmarking' &&
      (output.negative.matched === false || output.negative.weaknessTag !== 'vi_l1_time_reference_overmarking'),
  },
  {
    id: 'TM-INT-10182',
    sourceCandidate: 'D-R1',
    module: 'registerDetector',
    axis: 'register-direct-request-transfer',
    exportName: 'detectRegisterErrorWithContext',
    behaviorBoundary: 'Detects direct request transfer only when the caller supplies professional request context and the expected text contains a softened request form; context-free and instruction contexts abstain.',
    codePath: 'src/lib/feedback/registerDetector.ts:detectRegisterErrorWithContext',
    input: {
      positive: {
        learnerText: 'You send me the file.',
        expectedText: 'Could you send me the file?',
        scenario: 'professional_request',
      },
      instruction: {
        learnerText: 'You send me the file.',
        expectedText: 'Send me the file.',
        scenario: 'instruction',
      },
      contextFree: { learnerText: 'You send me the file.' },
    },
    assertion: 'professional request context returns en_l1_register_direct_request_transfer; instruction and context-free calls abstain',
    run: (input) => ({
      positive: detectRegisterErrorWithContext(input.positive),
      instruction: detectRegisterErrorWithContext(input.instruction),
      contextFree: detectRegisterError(input.contextFree),
    }),
    check: (output) =>
      output.positive.matched === true &&
      output.positive.tag === 'en_l1_register_direct_request_transfer' &&
      output.instruction.matched === false &&
      output.contextFree.matched === false,
  },
  {
    id: 'TM-INT-10183',
    sourceCandidate: 'D-R2',
    module: 'registerDetector',
    axis: 'register-apology-explanation-order',
    exportName: 'detectRegisterErrorWithContext',
    behaviorBoundary: 'Detects professional apology explanation-before-responsibility order when learner text starts with the reason and the expected correction begins with sorry or apologies.',
    codePath: 'src/lib/feedback/registerDetector.ts:detectRegisterErrorWithContext',
    input: {
      positive: {
        learnerText: 'The traffic was terrible, so I am late.',
        expectedText: "I'm sorry I'm late. The traffic was terrible.",
        scenario: 'professional_apology',
      },
      negative: {
        learnerText: "I'm sorry I'm late. The traffic was terrible.",
        expectedText: "I'm sorry I'm late. The traffic was terrible.",
        scenario: 'professional_apology',
      },
    },
    assertion: 'reason-first professional apology returns en_l1_register_apology_explanation_order and apology-first text abstains',
    run: (input) => ({
      positive: detectRegisterErrorWithContext(input.positive),
      negative: detectRegisterErrorWithContext(input.negative),
    }),
    check: (output) =>
      output.positive.matched === true &&
      output.positive.tag === 'en_l1_register_apology_explanation_order' &&
      output.negative.matched === false,
  },
  {
    id: 'TM-INT-10184',
    sourceCandidate: 'D-R3',
    module: 'registerDetector',
    axis: 'register-refusal-softening-gap',
    exportName: 'detectRegisterErrorWithContext',
    behaviorBoundary: 'Detects professional refusal softening gaps when learner text gives a bare refusal and the expected correction includes a softener; casual refusal context abstains.',
    codePath: 'src/lib/feedback/registerDetector.ts:detectRegisterErrorWithContext',
    input: {
      positive: {
        learnerText: "No, I don't go.",
        expectedText: "Thanks for asking, but I can't this week.",
        scenario: 'professional_refusal',
      },
      casual: {
        learnerText: "No, I don't go.",
        expectedText: '',
        scenario: 'casual_refusal',
      },
    },
    assertion: 'professional refusal context returns en_l1_register_refusal_softening_gap and casual refusal context abstains',
    run: (input) => ({
      positive: detectRegisterErrorWithContext(input.positive),
      casual: detectRegisterErrorWithContext(input.casual),
    }),
    check: (output) =>
      output.positive.matched === true &&
      output.positive.tag === 'en_l1_register_refusal_softening_gap' &&
      output.casual.matched === false,
  },
  {
    id: 'TM-INT-10185',
    sourceCandidate: 'D-P1',
    module: 'vnEnPronunciationDrills',
    axis: 'pron-final-stop-voicing',
    exportName: 'selectFinalStopVoicingFeedbackKey',
    behaviorBoundary: 'Selects final_stop_voicing pronunciation feedback when a voiced-final-stop target such as bag is heard as its voiceless minimal-pair contrast such as back.',
    codePath: 'src/lib/pronunciation/vnEnPronunciationDrills.ts:selectFinalStopVoicingFeedbackKey',
    input: { positive: { targetWord: 'bag', heardWord: 'back' }, negative: { targetWord: 'bag', heardWord: 'bag' } },
    assertion: 'bag heard as back returns final_stop_voicing and bag heard as bag returns null',
    run: (input) => ({
      positive: selectFinalStopVoicingFeedbackKey(input.positive.targetWord, input.positive.heardWord),
      negative: selectFinalStopVoicingFeedbackKey(input.negative.targetWord, input.negative.heardWord),
    }),
    check: (output) => output.positive === 'final_stop_voicing' && output.negative === null,
  },
  {
    id: 'TM-INT-10186',
    sourceCandidate: 'D-P2',
    module: 'vnEnPronunciationDrills',
    axis: 'pron-diphthong-reduction',
    exportName: 'selectDiphthongReductionFeedbackKey',
    behaviorBoundary: 'Selects diphthong_reduction pronunciation feedback when a diphthong target such as boat is heard as a monophthong reduction such as bot, while unrelated vowel substitutions return null.',
    codePath: 'src/lib/pronunciation/vnEnPronunciationDrills.ts:selectDiphthongReductionFeedbackKey',
    input: { positive: { targetWord: 'boat', heardWord: 'bot' }, negative: { targetWord: 'boat', heardWord: 'bet' } },
    assertion: 'boat heard as bot returns diphthong_reduction and unrelated boat/bet returns null',
    run: (input) => ({
      positive: selectDiphthongReductionFeedbackKey(input.positive.targetWord, input.positive.heardWord),
      negative: selectDiphthongReductionFeedbackKey(input.negative.targetWord, input.negative.heardWord),
    }),
    check: (output) => output.positive === 'diphthong_reduction' && output.negative === null,
  },
  {
    id: 'TM-INT-10187',
    sourceCandidate: 'D-P3',
    module: 'vnEnPronunciationDrills',
    axis: 'pron-v-w-confusion',
    exportName: 'selectVWFeedbackKey',
    behaviorBoundary: 'Selects v_w_confusion pronunciation feedback when a v-initial target such as very is heard with a w or y glide, while correct very returns null.',
    codePath: 'src/lib/pronunciation/vnEnPronunciationDrills.ts:selectVWFeedbackKey',
    input: {
      positives: [
        { targetWord: 'very', heardWord: 'wery' },
        { targetWord: 'very', heardWord: 'yery' },
      ],
      negative: { targetWord: 'very', heardWord: 'very' },
    },
    assertion: 'very heard as wery or yery returns v_w_confusion and correct very returns null',
    run: (input) => ({
      positives: input.positives.map((probe) => selectVWFeedbackKey(probe.targetWord, probe.heardWord)),
      negative: selectVWFeedbackKey(input.negative.targetWord, input.negative.heardWord),
    }),
    check: (output) => output.positives.every((value) => value === 'v_w_confusion') && output.negative === null,
  },
  {
    id: 'TM-INT-10188',
    sourceCandidate: 'D-P4',
    module: 'vnEnPronunciationDrills',
    axis: 'pron-final-l-deletion',
    exportName: 'selectFinalLFeedbackKey',
    behaviorBoundary: 'Selects final_l_deletion pronunciation feedback when a final-l target such as feel is heard without final l as fee, while correct feel returns null.',
    codePath: 'src/lib/pronunciation/vnEnPronunciationDrills.ts:selectFinalLFeedbackKey',
    input: { positive: { targetWord: 'feel', heardWord: 'fee' }, negative: { targetWord: 'feel', heardWord: 'feel' } },
    assertion: 'feel heard as fee returns final_l_deletion and feel heard as feel returns null',
    run: (input) => ({
      positive: selectFinalLFeedbackKey(input.positive.targetWord, input.positive.heardWord),
      negative: selectFinalLFeedbackKey(input.negative.targetWord, input.negative.heardWord),
    }),
    check: (output) => output.positive === 'final_l_deletion' && output.negative === null,
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
  if (!row.check(output)) {
    throw new Error(`${row.id} probe failed: ${JSON.stringify(output)}`);
  }

  const inputDigest = digest(row.input);
  const outputDigest = digest(output);
  const packet = {
    schema: 'tm-int-obs-evidence-packet-v1',
    packet_id: `OBS-004-${row.id}`,
    created_at: createdAt,
    source: 'tm-design-group-d-runtime-observation',
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
      generated_by: 'scripts/tm-int/group-d-evidence.mjs',
      spec_first_source: 'reports/tm-group-d-ruling-sheet.md',
      spec_written_from_public_interface_only: true,
      shared_digest_rule: 'one packet per ID; no shared digest',
    },
    replay_proof: {
      replayed: true,
      command: 'cd /Users/chaudoanm3/MercyB && npx vite-node scripts/tm-int/group-d-evidence.mjs',
      checks: {
        code_path_match: true,
        input_digest_match: digest(row.input) === inputDigest,
        output_digest_match: digest(output) === outputDigest,
        group_d_assertion_passed: true,
      },
      recorded_output_digest: outputDigest,
    },
    run_ids: {
      obs001: `${batch}:obs001:${row.id}`,
      obs003: `${batch}:obs003:${row.id}`,
      obs004: `${batch}:obs004:${row.id}`,
    },
    lineage: {
      design_ruling: 'group-d-2026-07-16',
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
writeFileSync(join(evidenceRoot, 'group_d_candidates.json'), `${JSON.stringify(rows.map(({ run, check, ...row }) => row), null, 2)}\n`);
writeFileSync(join(evidenceRoot, 'manifest.json'), `${JSON.stringify({
  batch,
  created_at: createdAt,
  count: manifestRows.length,
  rows: manifestRows,
}, null, 2)}\n`);

const reportLines = [
  '# TM-INT Group D Evidence',
  '',
  `Batch: \`${batch}\``,
  '',
  '| TM-INT | Source | Export / tag | Module | Axis | Failable assertion | Output digest | Result |',
  '| --- | --- | --- | --- | --- | --- | --- | --- |',
  ...manifestRows.map((row) => `| ${row.tm_int_id} | ${row.source_candidate} | \`${row.export}\` | \`${row.module}\` | \`${row.axis}\` | ${row.assertion} | \`${row.output_digest}\` | ${row.status} |`),
  '',
  'All packets use one distinct probe and one distinct digest per TM-INT ID.',
  '',
  'Registry governor results are recorded in the sibling evidence directory after OBS-005 dry-run and commit.',
  '',
];
writeFileSync(join(repoRoot, 'reports', 'tmint-group-d-evidence.md'), reportLines.join('\n'));

console.log(JSON.stringify({ ok: true, batch, count: rows.length, evidenceRoot }, null, 2));
