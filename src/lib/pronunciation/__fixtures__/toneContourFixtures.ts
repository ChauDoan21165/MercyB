import type { PitchSample } from "../toneContourScorer";

function samples(values: number[]): PitchSample[] {
  return values.map((pitchHz, index) => ({ t: index * 0.1, pitchHz }));
}

export const risingPitchSamples = samples([180, 184, 190, 198, 207, 218]);

export const fallingPitchSamples = samples([220, 211, 203, 194, 186, 178]);

export const flatPitchSamples = samples([198, 200, 199, 201, 200, 199]);

export const sparsePitchSamples: PitchSample[] = [
  { t: 0, pitchHz: null },
  { t: 0.1, pitchHz: 190 },
  { t: 0.2, pitchHz: null },
  { t: 0.3, pitchHz: 202 },
];

export const noisyRisingPitchSamples = samples([178, 185, 182, 196, 191, 205, 201, 219]);
