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

export type HardToneCase =
  | "short_utterance"
  | "low_gain"
  | "mild_background_noise"
  | "pitch_instability"
  | "clipped_input"
  | "sparse_voicing"
  | "borderline_confidence";

export interface HardVietnameseToneReference {
  id: string;
  tone: SupportedVietnameseToneReferenceId | UnsupportedVietnameseToneReferenceId;
  hardCase: HardToneCase;
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

export function generatedHardToneReferences(): HardVietnameseToneReference[] {
  return [
    {
      id: "sac-short-lowgain-noise",
      tone: "sac",
      hardCase: "short_utterance",
      samples: generateToneReferenceAudio({
        startHz: 184,
        endHz: 229,
        durationSeconds: 0.1,
        amplitude: 0.08,
        noiseAmplitude: 0.01,
      }),
      target: generatedVietnameseToneTargets.sac,
    },
    {
      id: "huyen-clipped-nearbreak",
      tone: "huyen",
      hardCase: "clipped_input",
      samples: generateToneReferenceAudio({
        startHz: 230,
        endHz: 185,
        amplitude: 1.15,
        noiseAmplitude: 0.01,
        pitchWobbleCents: 18,
        clip: true,
      }),
      target: generatedVietnameseToneTargets.huyen,
    },
    {
      id: "ngang-sparse-borderline",
      tone: "ngang",
      hardCase: "sparse_voicing",
      samples: generateToneReferenceAudio({
        startHz: 205,
        endHz: 206,
        amplitude: 0.03,
        voicedGaps: [
          { startMs: 0, durationMs: 150 },
          { startMs: 165, durationMs: 120 },
          { startMs: 300, durationMs: 140 },
        ],
      }),
      target: generatedVietnameseToneTargets.ngang,
    },
    {
      id: "hoi-clipped-break",
      tone: "hoi",
      hardCase: "clipped_input",
      samples: generateToneReferenceAudio({
        startHz: 192,
        endHz: 168,
        amplitude: 1.05,
        clip: true,
      }),
      target: generatedVietnameseToneTargets.hoi,
    },
    {
      id: "nga-pitch-instability",
      tone: "nga",
      hardCase: "pitch_instability",
      samples: generateToneReferenceAudio({
        startHz: 188,
        endHz: 227,
        amplitude: 0.2,
        noiseAmplitude: 0.006,
        pitchWobbleCents: 24,
      }),
      target: generatedVietnameseToneTargets.nga,
    },
    {
      id: "nang-borderline-lowgain",
      tone: "nang",
      hardCase: "borderline_confidence",
      samples: generateToneReferenceAudio({
        startHz: 184,
        endHz: 172,
        amplitude: 0.07,
        noiseAmplitude: 0.006,
        voicedGaps: [
          { startMs: 80, durationMs: 60 },
          { startMs: 230, durationMs: 50 },
        ],
      }),
      target: generatedVietnameseToneTargets.nang,
    },
  ];
}

export function generateToneReferenceAudio({
  startHz,
  endHz,
  durationSeconds = VIETNAMESE_TONE_REFERENCE_DURATION_SECONDS,
  amplitude = 0.45,
  noiseAmplitude = 0,
  pitchWobbleCents = 0,
  clip = false,
  voicedGaps = [],
}: {
  startHz: number;
  endHz: number;
  durationSeconds?: number;
  amplitude?: number;
  noiseAmplitude?: number;
  pitchWobbleCents?: number;
  clip?: boolean;
  voicedGaps?: Array<{ startMs: number; durationMs: number }>;
}): Float32Array {
  const totalSamples = Math.max(1, Math.round(VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE * durationSeconds));
  const samples = new Float32Array(totalSamples);
  let phase = 0;

  for (let index = 0; index < totalSamples; index += 1) {
    const progress = totalSamples <= 1 ? 0 : index / (totalSamples - 1);
    const wobble = pitchWobbleCents === 0 ? 0 : Math.sin(progress * Math.PI * 4) * pitchWobbleCents;
    const wobbleRatio = wobble === 0 ? 1 : Math.pow(2, wobble / 1200);
    const f0Hz = (startHz + (endHz - startHz) * progress) * wobbleRatio;
    phase += (2 * Math.PI * f0Hz) / VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE;
    const envelope = 0.25 + 0.75 * Math.sin(Math.PI * progress);
    let sample = Math.sin(phase) * amplitude * envelope;
    if (noiseAmplitude > 0) {
      sample += deterministicNoise(index) * noiseAmplitude;
    }
    if (isMutedSample(index, voicedGaps)) {
      sample *= 0.05;
    }
    if (clip) {
      sample = Math.max(-0.985, Math.min(0.985, sample));
    }
    samples[index] = sample;
  }

  return samples;
}

function deterministicNoise(index: number): number {
  const value = Math.sin((index + 1) * 12.9898 + 78.233) * 43758.5453;
  return (value - Math.floor(value)) * 2 - 1;
}

function isMutedSample(
  index: number,
  voicedGaps: Array<{ startMs: number; durationMs: number }>,
): boolean {
  if (voicedGaps.length === 0) return false;
  const timeMs = (index / VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE) * 1000;
  return voicedGaps.some((gap) => timeMs >= gap.startMs && timeMs <= gap.startMs + gap.durationMs);
}
