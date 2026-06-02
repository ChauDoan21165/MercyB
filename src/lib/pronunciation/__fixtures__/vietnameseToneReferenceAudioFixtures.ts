import type { VietnameseToneTarget } from "../vietnameseToneScorer";

export const VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE = 16_000;
export const VIETNAMESE_TONE_REFERENCE_DURATION_SECONDS = 0.72;

export type SupportedVietnameseToneReferenceId = "sac" | "huyen" | "ngang";
export type UnsupportedVietnameseToneReferenceId = "hoi" | "nga" | "nang";
export type ReferenceContourBucket = "rising" | "falling" | "level";

export interface GeneratedVietnameseToneReference {
  id: string;
  tone: SupportedVietnameseToneReferenceId;
  expectedContour: ReferenceContourBucket;
  target: VietnameseToneTarget;
  startHz: number;
  endHz: number;
}

export interface AmbiguousVietnameseToneReference {
  id: string;
  samples: Float32Array;
  target: VietnameseToneTarget;
}

export const generatedVietnameseToneTargets = {
  sac: {
    syllable: "ma",
    tone: "sac",
    expectedContour: "rising",
  },
  huyen: {
    syllable: "ma",
    tone: "huyen",
    expectedContour: "falling",
  },
  ngang: {
    syllable: "ma",
    tone: "ngang",
    expectedContour: "level",
  },
  hoi: {
    syllable: "ma",
    tone: "hoi",
    expectedContour: "unsupported",
  },
  nga: {
    syllable: "ma",
    tone: "nga",
    expectedContour: "unsupported",
  },
  nang: {
    syllable: "ma",
    tone: "nang",
    expectedContour: "unsupported",
  },
} satisfies Record<SupportedVietnameseToneReferenceId | UnsupportedVietnameseToneReferenceId, VietnameseToneTarget>;

export const generatedCleanSupportedToneReferences: GeneratedVietnameseToneReference[] = [
  {
    id: "sac-rising-185-230",
    tone: "sac",
    expectedContour: "rising",
    target: generatedVietnameseToneTargets.sac,
    startHz: 185,
    endHz: 230,
  },
  {
    id: "sac-rising-170-214",
    tone: "sac",
    expectedContour: "rising",
    target: generatedVietnameseToneTargets.sac,
    startHz: 170,
    endHz: 214,
  },
  {
    id: "sac-rising-210-258",
    tone: "sac",
    expectedContour: "rising",
    target: generatedVietnameseToneTargets.sac,
    startHz: 210,
    endHz: 258,
  },
  {
    id: "huyen-falling-230-185",
    tone: "huyen",
    expectedContour: "falling",
    target: generatedVietnameseToneTargets.huyen,
    startHz: 230,
    endHz: 185,
  },
  {
    id: "huyen-falling-214-170",
    tone: "huyen",
    expectedContour: "falling",
    target: generatedVietnameseToneTargets.huyen,
    startHz: 214,
    endHz: 170,
  },
  {
    id: "huyen-falling-258-210",
    tone: "huyen",
    expectedContour: "falling",
    target: generatedVietnameseToneTargets.huyen,
    startHz: 258,
    endHz: 210,
  },
  {
    id: "ngang-level-180",
    tone: "ngang",
    expectedContour: "level",
    target: generatedVietnameseToneTargets.ngang,
    startHz: 180,
    endHz: 181,
  },
  {
    id: "ngang-level-205",
    tone: "ngang",
    expectedContour: "level",
    target: generatedVietnameseToneTargets.ngang,
    startHz: 205,
    endHz: 206,
  },
  {
    id: "ngang-level-235",
    tone: "ngang",
    expectedContour: "level",
    target: generatedVietnameseToneTargets.ngang,
    startHz: 235,
    endHz: 234,
  },
];

export function generatedUnsupportedToneReferences(): Array<{
  tone: UnsupportedVietnameseToneReferenceId;
  target: VietnameseToneTarget;
  samples: Float32Array;
}> {
  return (["hoi", "nga", "nang"] as const).map((tone) => ({
    tone,
    target: generatedVietnameseToneTargets[tone],
    samples: generateToneReferenceAudio({ startHz: 185, endHz: 230 }),
  }));
}

export function generatedAmbiguousToneReferences(): AmbiguousVietnameseToneReference[] {
  return [
    {
      id: "silence",
      samples: new Float32Array(Math.round(VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE * VIETNAMESE_TONE_REFERENCE_DURATION_SECONDS)),
      target: generatedVietnameseToneTargets.sac,
    },
    {
      id: "too-short-rising",
      samples: generateToneReferenceAudio({ startHz: 185, endHz: 230, durationSeconds: 0.08 }),
      target: generatedVietnameseToneTargets.sac,
    },
    {
      id: "low-amplitude-rising",
      samples: generateToneReferenceAudio({ startHz: 185, endHz: 230, amplitude: 0.004 }),
      target: generatedVietnameseToneTargets.sac,
    },
  ];
}

export function generateToneReferenceAudio({
  startHz,
  endHz,
  durationSeconds = VIETNAMESE_TONE_REFERENCE_DURATION_SECONDS,
  amplitude = 0.45,
}: {
  startHz: number;
  endHz: number;
  durationSeconds?: number;
  amplitude?: number;
}): Float32Array {
  const totalSamples = Math.max(1, Math.round(VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE * durationSeconds));
  const samples = new Float32Array(totalSamples);
  let phase = 0;

  for (let index = 0; index < totalSamples; index += 1) {
    const progress = totalSamples <= 1 ? 0 : index / (totalSamples - 1);
    const f0Hz = startHz + (endHz - startHz) * progress;
    phase += (2 * Math.PI * f0Hz) / VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE;
    const envelope = 0.25 + 0.75 * Math.sin(Math.PI * progress);
    samples[index] = Math.sin(phase) * amplitude * envelope;
  }

  return samples;
}
