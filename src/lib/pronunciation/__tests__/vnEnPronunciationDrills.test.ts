// src/lib/pronunciation/__tests__/vnEnPronunciationDrills.test.ts
//
// Covers the namespaced VN→EN English-pronunciation drill bank. Content-only:
// asserts every bank is non-empty, every entry is well-formed (non-empty
// target/contrast/phoneme/vnWhyConfused, target !== contrast), targets are
// unique within each bank, audio keys are null (TTS fallback), and the grouped
// map matches the exported banks. Mirrors soundPairDrills.test.ts style.
//
// Does NOT touch the live scorer, thresholds, or vn-phoneme-map.ts.

import { describe, it, expect } from 'vitest';

import type { ProblemPair } from '../vn-phoneme-map';
import {
  TH_VOICED_DRILLS,
  R_DRILLS,
  L_DRILLS,
  FINAL_CONSONANT_DRILLS,
  STRESS_DRILLS,
  VN_EN_PRONUNCIATION_DRILL_BANKS,
  selectDiphthongReductionFeedbackKey,
  selectFinalClusterFeedbackKey,
  selectFinalLFeedbackKey,
  selectFinalStopVoicingFeedbackKey,
  selectVWFeedbackKey,
} from '../vnEnPronunciationDrills';

const BANKS: Record<string, ProblemPair[]> = {
  TH_VOICED_DRILLS,
  R_DRILLS,
  L_DRILLS,
  FINAL_CONSONANT_DRILLS,
  STRESS_DRILLS,
};

describe('vnEnPronunciationDrills — banks', () => {
  it('every bank is a non-empty array', () => {
    for (const [name, bank] of Object.entries(BANKS)) {
      expect(Array.isArray(bank), `${name} is an array`).toBe(true);
      expect(bank.length, `${name} non-empty`).toBeGreaterThan(0);
    }
  });

  it('every entry has non-empty target/contrast/phoneme/vnWhyConfused', () => {
    for (const [name, bank] of Object.entries(BANKS)) {
      for (const p of bank) {
        expect(p.target.trim().length, `${name} target`).toBeGreaterThan(0);
        expect(p.contrast.trim().length, `${name} contrast`).toBeGreaterThan(0);
        expect(p.phoneme.trim().length, `${name} phoneme`).toBeGreaterThan(0);
        expect(p.vnWhyConfused.trim().length, `${name} vnWhyConfused`).toBeGreaterThan(0);
      }
    }
  });

  it('target and contrast differ in every entry (case-insensitive)', () => {
    for (const [name, bank] of Object.entries(BANKS)) {
      for (const p of bank) {
        expect(p.target.toLowerCase(), `${name} pair distinct`).not.toBe(
          p.contrast.toLowerCase(),
        );
      }
    }
  });

  it('targets are unique within each bank', () => {
    for (const [name, bank] of Object.entries(BANKS)) {
      const targets = bank.map((p) => p.target.toLowerCase());
      expect(new Set(targets).size, `${name} unique targets`).toBe(targets.length);
    }
  });

  it('audioTarget and audioContrast are null (TTS fallback)', () => {
    for (const [name, bank] of Object.entries(BANKS)) {
      for (const p of bank) {
        expect(p.audioTarget, `${name} audioTarget`).toBeNull();
        expect(p.audioContrast, `${name} audioContrast`).toBeNull();
      }
    }
  });
});

describe('VN_EN_PRONUNCIATION_DRILL_BANKS — grouped map', () => {
  it('exposes the five expected category slugs', () => {
    expect(Object.keys(VN_EN_PRONUNCIATION_DRILL_BANKS).sort()).toEqual(
      ['final-consonant', 'l', 'r', 'stress', 'th-voiced'],
    );
  });

  it('maps each slug to its exported bank by reference', () => {
    expect(VN_EN_PRONUNCIATION_DRILL_BANKS['th-voiced']).toBe(TH_VOICED_DRILLS);
    expect(VN_EN_PRONUNCIATION_DRILL_BANKS['r']).toBe(R_DRILLS);
    expect(VN_EN_PRONUNCIATION_DRILL_BANKS['l']).toBe(L_DRILLS);
    expect(VN_EN_PRONUNCIATION_DRILL_BANKS['final-consonant']).toBe(
      FINAL_CONSONANT_DRILLS,
    );
    expect(VN_EN_PRONUNCIATION_DRILL_BANKS['stress']).toBe(STRESS_DRILLS);
  });

  it('every grouped-map value is a non-empty ProblemPair[]', () => {
    for (const [slug, bank] of Object.entries(VN_EN_PRONUNCIATION_DRILL_BANKS)) {
      expect(Array.isArray(bank), `${slug} is an array`).toBe(true);
      expect(bank.length, `${slug} non-empty`).toBeGreaterThan(0);
    }
  });
});

describe('selectFinalClusterFeedbackKey', () => {
  it('returns the final-cluster key for accepted Vietnamese simplification variants', () => {
    expect(selectFinalClusterFeedbackKey('next', 'nex')).toBe('final_cluster_simplification');
    expect(selectFinalClusterFeedbackKey('first', 'firs')).toBe('final_cluster_simplification');
    expect(selectFinalClusterFeedbackKey('friend', 'frien')).toBe('final_cluster_simplification');
  });

  it('returns the final-cluster key from target context when no heard word is available', () => {
    expect(selectFinalClusterFeedbackKey('next')).toBe('final_cluster_simplification');
  });

  it('does not fire for non-cluster words or non-matching heard variants', () => {
    expect(selectFinalClusterFeedbackKey('book', 'boo')).toBeNull();
    expect(selectFinalClusterFeedbackKey('next', 'net')).toBeNull();
    expect(selectFinalClusterFeedbackKey('apple')).toBeNull();
  });
});

describe('Group D pronunciation selectors', () => {
  it('selects final stop voicing feedback only for known voiced-to-voiceless coda pairs', () => {
    expect(selectFinalStopVoicingFeedbackKey('bag', 'back')).toBe('final_stop_voicing');
    expect(selectFinalStopVoicingFeedbackKey('bad', 'bat')).toBe('final_stop_voicing');
    expect(selectFinalStopVoicingFeedbackKey('bag', 'bag')).toBeNull();
    expect(selectFinalStopVoicingFeedbackKey('bag', 'bog')).toBeNull();
  });

  it('selects diphthong reduction feedback only for known monophthong reductions', () => {
    expect(selectDiphthongReductionFeedbackKey('boat', 'bot')).toBe('diphthong_reduction');
    expect(selectDiphthongReductionFeedbackKey('late', 'let')).toBe('diphthong_reduction');
    expect(selectDiphthongReductionFeedbackKey('boat', 'bet')).toBeNull();
    expect(selectDiphthongReductionFeedbackKey('boat', 'boat')).toBeNull();
  });

  it('selects v/w feedback for very -> wery/yery and not for correct speech', () => {
    expect(selectVWFeedbackKey('very', 'wery')).toBe('v_w_confusion');
    expect(selectVWFeedbackKey('very', 'yery')).toBe('v_w_confusion');
    expect(selectVWFeedbackKey('very', 'very')).toBeNull();
    expect(selectVWFeedbackKey('very', 'berry')).toBeNull();
  });

  it('selects final-l deletion feedback only for known final-l omissions', () => {
    expect(selectFinalLFeedbackKey('feel', 'fee')).toBe('final_l_deletion');
    expect(selectFinalLFeedbackKey('sail', 'say')).toBe('final_l_deletion');
    expect(selectFinalLFeedbackKey('feel', 'feel')).toBeNull();
    expect(selectFinalLFeedbackKey('feel', 'fell')).toBeNull();
  });
});
