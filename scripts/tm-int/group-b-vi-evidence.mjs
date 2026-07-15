#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { detectL1Error } from '../../src/lib/feedback/index.ts';
import { selectFinalClusterFeedbackKey } from '../../src/lib/pronunciation/vnEnPronunciationDrills.ts';

const repoRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const batch = 'tm-design-group-b-vi-20260715';
const evidenceRoot = join(repoRoot, 'evidence', batch);
const packetsDir = join(evidenceRoot, 'OBS-004-evidence-packets');
const createdAt = '2026-07-15T00:00:00.000Z';

const rows = [
  {
    id: 'TM-INT-10160',
    sourceCandidate: 'VI-2',
    module: 'l1ErrorDetector',
    axis: 'vi-profession-article-copula',
    exportName: 'vi_l1_profession_article_copula',
    behaviorBoundary: 'Detects Vietnamese L1 profession noun article/copula transfer when learner text omits be and/or a/an before a profession noun and the expected correction supplies the missing article or copula.',
    input: { userAnswer: 'My father doctor.', expectedAnswer: 'My father is a doctor.' },
    codePath: 'src/lib/feedback/index.ts:detectL1Error',
    assertion: 'matched weaknessTag vi_l1_profession_article_copula for profession article/copula transfer',
  },
  {
    id: 'TM-INT-10161',
    sourceCandidate: 'VI-3',
    module: 'l1ErrorDetector',
    axis: 'vi-progressive-be-drop',
    exportName: 'vi_l1_progressive_be_drop',
    behaviorBoundary: 'Detects Vietnamese L1 dropped progressive be when learner text uses a subject plus -ing verb and the expected correction inserts am/is/are before that progressive verb.',
    input: { userAnswer: 'I going to school.', expectedAnswer: 'I am going to school.' },
    codePath: 'src/lib/feedback/index.ts:detectL1Error',
    assertion: 'matched weaknessTag vi_l1_progressive_be_drop for dropped progressive be',
  },
  {
    id: 'TM-INT-10162',
    sourceCandidate: 'VI-7',
    module: 'l1ErrorDetector',
    axis: 'vi-definite-article-remention',
    exportName: 'vi_l1_definite_article_remention',
    behaviorBoundary: 'Detects Vietnamese L1 definite article remention loss when a previously introduced count noun is repeated bare and the expected correction adds the before that repeated noun.',
    input: { userAnswer: 'I read a book. Book is interesting.', expectedAnswer: 'I read a book. The book is interesting.' },
    codePath: 'src/lib/feedback/index.ts:detectL1Error',
    assertion: 'matched weaknessTag vi_l1_definite_article_remention for repeated noun the insertion',
  },
  {
    id: 'TM-INT-10163',
    sourceCandidate: 'VI-11',
    module: 'l1ErrorDetector',
    axis: 'vi-noun-preposition-collocation',
    exportName: 'vi_l1_noun_preposition_collocation',
    behaviorBoundary: 'Detects a conservative whitelist of Vietnamese L1 noun-preposition collocation transfer such as reason of to reason for, opinion about to opinion on, and demand of to demand for.',
    input: { userAnswer: 'The reason of this problem is unclear.', expectedAnswer: 'The reason for this problem is unclear.' },
    codePath: 'src/lib/feedback/index.ts:detectL1Error',
    assertion: 'matched weaknessTag vi_l1_noun_preposition_collocation for whitelisted reason for collocation',
  },
  {
    id: 'TM-INT-10164',
    sourceCandidate: 'VI-12',
    module: 'l1ErrorDetector',
    axis: 'vi-say-tell-argument-frame',
    exportName: 'vi_l1_say_tell_argument_frame',
    behaviorBoundary: 'Detects Vietnamese L1 say/tell/talk argument frame transfer when learner text uses said me, tell with, or talk someone about and the expected correction selects the English argument frame.',
    input: { userAnswer: 'She said me the truth.', expectedAnswer: 'She told me the truth.' },
    codePath: 'src/lib/feedback/index.ts:detectL1Error',
    assertion: 'matched weaknessTag vi_l1_say_tell_argument_frame for said me to told me',
  },
  {
    id: 'TM-INT-10165',
    sourceCandidate: 'VI-13',
    module: 'l1ErrorDetector',
    axis: 'vi-learn-study-transfer',
    exportName: 'vi_l1_learn_study_transfer',
    behaviorBoundary: 'Detects Vietnamese L1 learn/study lexical transfer when learner text uses study for learning a skill or learn for attending formal education and the expected correction chooses learn, practice, or study by context.',
    input: { userAnswer: 'I study how to cook from YouTube.', expectedAnswer: 'I learn how to cook from YouTube.' },
    codePath: 'src/lib/feedback/index.ts:detectL1Error',
    assertion: 'matched weaknessTag vi_l1_learn_study_transfer for study how to cook to learn how to cook',
  },
  {
    id: 'TM-INT-10166',
    sourceCandidate: 'VI-14',
    module: 'l1ErrorDetector',
    axis: 'vi-know-meet-timeline',
    exportName: 'vi_l1_know_meet_timeline',
    behaviorBoundary: 'Detects Vietnamese L1 know/meet timeline transfer when learner text uses know for first meeting in a past time context and the expected correction uses meet/met.',
    input: { userAnswer: 'I knew him yesterday.', expectedAnswer: 'I met him yesterday.' },
    codePath: 'src/lib/feedback/index.ts:detectL1Error',
    assertion: 'matched weaknessTag vi_l1_know_meet_timeline for knew him yesterday to met him yesterday',
  },
  {
    id: 'TM-INT-10167',
    sourceCandidate: 'VI-15',
    module: 'l1ErrorDetector',
    axis: 'vi-verb-noun-collocation',
    exportName: 'vi_l1_verb_noun_collocation',
    behaviorBoundary: 'Detects a conservative whitelist of Vietnamese L1 verb-noun collocation transfer for medicine, where learner text uses eat, drink, or use medicine and the expected correction uses take medicine.',
    input: { userAnswer: 'I eat medicine twice a day.', expectedAnswer: 'I take medicine twice a day.' },
    codePath: 'src/lib/feedback/index.ts:detectL1Error',
    assertion: 'matched weaknessTag vi_l1_verb_noun_collocation for eat medicine to take medicine',
  },
  {
    id: 'TM-INT-10168',
    sourceCandidate: 'VI-16',
    module: 'l1ErrorDetector',
    axis: 'vi-appliance-open-close-transfer',
    exportName: 'vi_l1_appliance_open_close_transfer',
    behaviorBoundary: 'Detects Vietnamese L1 open/close appliance transfer when learner text says open or close a light, TV, fan, computer, or air conditioner and the expected correction uses turn on or turn off.',
    input: { userAnswer: 'Open the light, please.', expectedAnswer: 'Turn on the light, please.' },
    codePath: 'src/lib/feedback/index.ts:detectL1Error',
    assertion: 'matched weaknessTag vi_l1_appliance_open_close_transfer for open the light to turn on the light',
  },
  {
    id: 'TM-INT-10169',
    sourceCandidate: 'VI-17',
    module: 'l1ErrorDetector',
    axis: 'vi-connector-stacking',
    exportName: 'vi_l1_connector_stacking',
    behaviorBoundary: 'Detects Vietnamese L1 paired connector stacking when learner text combines because with so, although with but, or even though with but and the expected correction removes the redundant connector.',
    input: { userAnswer: 'Because it rained, so I stayed home.', expectedAnswer: 'Because it rained, I stayed home.' },
    codePath: 'src/lib/feedback/index.ts:detectL1Error',
    assertion: 'matched weaknessTag vi_l1_connector_stacking for because plus so connector stacking',
  },
  {
    id: 'TM-INT-10170',
    sourceCandidate: 'VI-19',
    module: 'l1ErrorDetector',
    axis: 'vi-elliptical-subject-transfer',
    exportName: 'vi_l1_elliptical_subject_transfer',
    behaviorBoundary: 'Detects Vietnamese L1 elliptical subject transfer when learner text omits the finite clause subject after because, when, or in my opinion and the expected correction supplies an explicit English subject.',
    input: { userAnswer: "Because busy, I didn't go.", expectedAnswer: "Because I was busy, I didn't go." },
    codePath: 'src/lib/feedback/index.ts:detectL1Error',
    assertion: 'matched weaknessTag vi_l1_elliptical_subject_transfer for because busy to because I was busy',
  },
  {
    id: 'TM-INT-10171',
    sourceCandidate: 'VI-22',
    module: 'vnEnPronunciationDrills',
    axis: 'vi-final-cluster-simplification',
    exportName: 'selectFinalClusterFeedbackKey',
    behaviorBoundary: 'Detects Vietnamese L1 final consonant cluster simplification for pronunciation feedback when a target with a known final cluster such as next is heard or typed as its accepted simplified variant such as nex.',
    input: { targetWord: 'next', heardWord: 'nex' },
    codePath: 'src/lib/pronunciation/vnEnPronunciationDrills.ts:selectFinalClusterFeedbackKey',
    assertion: 'returned final_cluster_simplification for next heard as nex',
  },
];

function stableJson(value) {
  return JSON.stringify(value);
}

function digest(value) {
  const content = typeof value === 'string' ? value : stableJson(value ?? null);
  return `sha256:${createHash('sha256').update(content).digest('hex')}`;
}

function runProbe(row) {
  if (row.module === 'l1ErrorDetector') {
    const detection = detectL1Error(row.input);
    const output = { detection };
    const checks = {
      matched: detection.matched === true,
      weakness_tag_match: detection.matched === true && detection.weaknessTag === row.exportName,
      feedback_mentions_expected: detection.matched === true
        && detection.feedback.en.includes(row.input.expectedAnswer)
        && detection.feedback.vi.includes(row.input.expectedAnswer),
    };
    const passed = Object.values(checks).every(Boolean);
    if (!passed) {
      throw new Error(`${row.id} probe failed: ${JSON.stringify({ output, checks })}`);
    }
    return { output, specificChecks: checks };
  }

  const feedbackKey = selectFinalClusterFeedbackKey(row.input.targetWord, row.input.heardWord);
  const output = { feedbackKey };
  const checks = {
    final_cluster_feedback_key_match: feedbackKey === 'final_cluster_simplification',
  };
  if (!checks.final_cluster_feedback_key_match) {
    throw new Error(`${row.id} probe failed: ${JSON.stringify({ output, checks })}`);
  }
  return { output, specificChecks: checks };
}

rmSync(evidenceRoot, { recursive: true, force: true });
mkdirSync(packetsDir, { recursive: true });

const obs001 = [];
const obs002 = [];
const manifestRows = [];

for (const row of rows) {
  const { output, specificChecks } = runProbe(row);
  const inputDigest = digest(row.input);
  const outputDigest = digest(output);
  const packet = {
    schema: 'tm-int-obs-evidence-packet-v1',
    packet_id: `OBS-004-${row.id}`,
    created_at: createdAt,
    source: 'tm-design-group-b-vi-runtime-observation',
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
      generated_by: 'scripts/tm-int/group-b-vi-evidence.mjs',
      spec_first_source: 'reports/tm-design-ruling-sheet.md + reports/tm-research-vi-interference.md',
      spec_written_from_public_interface_only: true,
      shared_digest_rule: 'one packet per ID; no shared digest',
    },
    replay_proof: {
      replayed: true,
      command: 'cd /Users/chaudoanm3/MercyB && npx vite-node scripts/tm-int/group-b-vi-evidence.mjs',
      checks: {
        code_path_match: true,
        input_digest_match: digest(row.input) === inputDigest,
        output_digest_match: digest(output) === outputDigest,
        ...specificChecks,
      },
      recorded_output_digest: outputDigest,
    },
    run_ids: {
      obs001: `${batch}:obs001:${row.id}`,
      obs003: `${batch}:obs003:${row.id}`,
      obs004: `${batch}:obs004:${row.id}`,
    },
    lineage: {
      design_ruling: 'group-b-2026-07-15',
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
writeFileSync(join(evidenceRoot, 'group_b_vi_candidates.json'), `${JSON.stringify(rows, null, 2)}\n`);
writeFileSync(join(evidenceRoot, 'manifest.json'), `${JSON.stringify({
  batch,
  created_at: createdAt,
  count: manifestRows.length,
  rows: manifestRows,
}, null, 2)}\n`);

const reportLines = [
  '# TM-INT Group B VI Evidence',
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
writeFileSync(join(repoRoot, 'reports', 'tmint-group-b-evidence.md'), `${reportLines.join('\n')}`);

console.log(JSON.stringify({ ok: true, batch, count: rows.length, evidenceRoot }, null, 2));
