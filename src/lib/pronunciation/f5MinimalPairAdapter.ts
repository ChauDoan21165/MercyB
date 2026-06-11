/**
 * Adapter for the F5 minimal-pairs corpus (wave1 + wave2, 100 pairs).
 *
 * Converts the raw JSON shape (pair/ipa/examples/difficulty) into
 * F5DrillItem — a ProblemPair superset that carries IPA, per-word
 * example sentences, and difficulty for the picker.
 *
 * Consumers: f5MinimalPairPicker.ts, soundPairDrills.ts (f5-* categories),
 * SoundPairDrillCard.tsx (renders the extended fields when present).
 */

import type { ProblemPair } from './vn-phoneme-map';
import wave1Data from '@/content-factory/f5-minimal-pairs/wave1-50.json';
import wave2Data from '@/content-factory/f5-minimal-pairs/wave2-50.json';

export type F5Difficulty = 'easy' | 'medium' | 'hard';

/** ProblemPair extended with the IPA, example sentences, and difficulty tag from F5 corpus. */
export interface F5DrillItem extends ProblemPair {
  /** Corpus entry id, e.g. "f5w1-001". Stable; append-only. */
  f5Id: string;
  /** Phonological category label from the corpus, e.g. "final_consonants". */
  f5Category: string;
  /** IPA transcription of the target word, e.g. "/bɪt/". */
  ipaTarget: string;
  /** IPA transcription of the contrast word, e.g. "/bɪd/". */
  ipaContrast: string;
  /** Example sentence using the target word. */
  exampleTarget: string;
  /** Example sentence using the contrast word. */
  exampleContrast: string;
  difficulty: F5Difficulty;
}

// Raw JSON shapes — kept internal; callers use F5DrillItem.
interface F5RawPair {
  id: string;
  category: string;
  pair: { target: string; contrast: string };
  ipa: { target: string; contrast: string };
  vi: string;
  examples: { target: string; contrast: string };
  difficulty: string;
}

interface F5WaveFile {
  minimalPairs: F5RawPair[];
}

export function adaptF5Pair(raw: F5RawPair): F5DrillItem {
  return {
    // ProblemPair base fields
    target: raw.pair.target,
    contrast: raw.pair.contrast,
    phoneme: raw.category,
    audioTarget: null,
    audioContrast: null,
    vnWhyConfused: raw.vi,
    // F5 extensions
    f5Id: raw.id,
    f5Category: raw.category,
    ipaTarget: raw.ipa.target,
    ipaContrast: raw.ipa.contrast,
    exampleTarget: raw.examples.target,
    exampleContrast: raw.examples.contrast,
    difficulty: raw.difficulty as F5Difficulty,
  };
}

let _corpus: F5DrillItem[] | null = null;

/** Load + adapt both waves. Result is cached for the session lifetime. */
export function loadF5Corpus(): F5DrillItem[] {
  if (_corpus) return _corpus;
  const w1 = (wave1Data as F5WaveFile).minimalPairs.map(adaptF5Pair);
  const w2 = (wave2Data as F5WaveFile).minimalPairs.map(adaptF5Pair);
  _corpus = [...w1, ...w2];
  return _corpus;
}

/** Type guard — true when a ProblemPair carries the F5 extensions. */
export function isF5DrillItem(pair: ProblemPair): pair is F5DrillItem {
  return 'f5Id' in pair;
}
