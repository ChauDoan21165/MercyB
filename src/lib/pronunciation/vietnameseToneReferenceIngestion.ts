import { extractF0PitchContour } from "./f0PitchExtractor";
import {
  type VietnameseToneCalibrationReference,
  type SupportedVietnameseToneCalibrationContour,
} from "./vietnameseToneCalibration";
import {
  type ExtractedPitchContour,
  type VietnameseToneTarget,
  classifyVietnameseToneContour,
} from "./vietnameseToneScorer";

export type VietnameseReferenceToneId = "sac" | "huyen" | "ngang" | "hoi" | "nga" | "nang";
export type SupportedVietnameseReferenceToneId = "sac" | "huyen" | "ngang";
export type UnsupportedVietnameseReferenceToneId = "hoi" | "nga" | "nang";

export interface LabeledVietnameseToneRecording {
  id: string;
  speakerId: string;
  tone: VietnameseReferenceToneId;
  syllable: string;
  samples: Float32Array | readonly number[];
  sampleRate: number;
}

export type VietnameseToneReferenceDropReason =
  | "unsupported_low_quality"
  | "clipped"
  | "too_short"
  | "no_audio"
  | "extractor_rejected"
  | "missing_pitch"
  | "low_voicing"
  | "low_confidence"
  | "insufficient_samples"
  | "unexpected_contour";

export interface VietnameseToneReferenceIngestionPolicy {
  minDurationMs: number;
  maxClippedSampleRatio: number;
  minVoicedRatio: number;
  minExtractionConfidence: number;
  minUsableSamples: number;
  referenceSampleCount: number;
}

export interface DroppedVietnameseToneRecording {
  id: string;
  speakerId: string;
  tone: VietnameseReferenceToneId;
  reason: VietnameseToneReferenceDropReason;
}

export interface AcceptedVietnameseToneRecording {
  id: string;
  speakerId: string;
  tone: VietnameseReferenceToneId;
  target: VietnameseToneTarget;
  observedContour: ReturnType<typeof classifyVietnameseToneContour>;
  normalizedContour: ExtractedPitchContour;
}

export interface VietnameseToneReferenceIngestionResult {
  calibrationReferences: VietnameseToneCalibrationReference[];
  perToneReferenceContours: Partial<Record<SupportedVietnameseReferenceToneId, ExtractedPitchContour>>;
  acceptedRecordings: AcceptedVietnameseToneRecording[];
  droppedRecordings: DroppedVietnameseToneRecording[];
  speakerMedianF0Hz: Record<string, number>;
}

interface CandidateRecording {
  recording: LabeledVietnameseToneRecording;
  target: VietnameseToneTarget;
  contour: ExtractedPitchContour;
  expectedContour: SupportedVietnameseToneCalibrationContour | "unsupported";
  observedContour: ReturnType<typeof classifyVietnameseToneContour>;
}

const SUPPORTED_TONE_CONTOURS = {
  sac: "rising",
  huyen: "falling",
  ngang: "level",
} satisfies Record<SupportedVietnameseReferenceToneId, SupportedVietnameseToneCalibrationContour>;

const UNSUPPORTED_TONES = new Set<VietnameseReferenceToneId>(["hoi", "nga", "nang"]);

export const DEFAULT_VIETNAMESE_TONE_REFERENCE_INGESTION_POLICY: VietnameseToneReferenceIngestionPolicy = {
  minDurationMs: 180,
  maxClippedSampleRatio: 0.02,
  minVoicedRatio: 0.65,
  minExtractionConfidence: 0.72,
  minUsableSamples: 6,
  referenceSampleCount: 7,
};

export function ingestVietnameseToneReferenceRecordings(
  recordings: LabeledVietnameseToneRecording[],
  policy = DEFAULT_VIETNAMESE_TONE_REFERENCE_INGESTION_POLICY,
): VietnameseToneReferenceIngestionResult {
  const candidates: CandidateRecording[] = [];
  const droppedRecordings: DroppedVietnameseToneRecording[] = [];

  for (const recording of recordings) {
    const candidate = extractCandidate(recording, policy);
    if ("reason" in candidate) {
      droppedRecordings.push(candidate);
    } else {
      candidates.push(candidate);
    }
  }

  const speakerMedianF0Hz = speakerBaselinesFor(candidates);
  const acceptedRecordings = candidates
    .map((candidate) => normalizeAcceptedRecording(candidate, speakerMedianF0Hz[candidate.recording.speakerId]))
    .filter((accepted): accepted is AcceptedVietnameseToneRecording => accepted !== null);
  const perToneReferenceContours = buildPerToneReferenceContours(acceptedRecordings, policy);
  const calibrationReferences = buildCalibrationReferences(acceptedRecordings, perToneReferenceContours);

  return {
    calibrationReferences,
    perToneReferenceContours,
    acceptedRecordings,
    droppedRecordings,
    speakerMedianF0Hz,
  };
}

function extractCandidate(
  recording: LabeledVietnameseToneRecording,
  policy: VietnameseToneReferenceIngestionPolicy,
): CandidateRecording | DroppedVietnameseToneRecording {
  const durationMs = durationMsFor(recording);
  if (durationMs < policy.minDurationMs) {
    return drop(recording, "too_short");
  }

  if (clippedSampleRatio(recording.samples) > policy.maxClippedSampleRatio) {
    return drop(recording, "clipped");
  }

  const target = targetForRecording(recording);
  const contour = extractF0PitchContour({
    enabled: true,
    sampleRate: recording.sampleRate,
    samples: recording.samples,
  });
  const expectedContour = target.expectedContour;
  const observedContour = classifyVietnameseToneContour(contour);
  const qualityDrop = qualityDropReason(contour, policy);
  if (qualityDrop !== null) {
    return drop(recording, UNSUPPORTED_TONES.has(recording.tone) ? "unsupported_low_quality" : qualityDrop);
  }

  if (expectedContour !== "unsupported" && observedContour !== expectedContour) {
    return drop(recording, "unexpected_contour");
  }

  return {
    recording,
    target,
    contour,
    expectedContour,
    observedContour,
  };
}

function normalizeAcceptedRecording(
  candidate: CandidateRecording,
  speakerMedianF0Hz: number | undefined,
): AcceptedVietnameseToneRecording | null {
  if (!speakerMedianF0Hz || speakerMedianF0Hz <= 0) return null;

  return {
    id: candidate.recording.id,
    speakerId: candidate.recording.speakerId,
    tone: candidate.recording.tone,
    target: candidate.target,
    observedContour: candidate.observedContour,
    normalizedContour: normalizeContourBySpeaker(candidate.contour, speakerMedianF0Hz),
  };
}

function buildPerToneReferenceContours(
  acceptedRecordings: AcceptedVietnameseToneRecording[],
  policy: VietnameseToneReferenceIngestionPolicy,
): Partial<Record<SupportedVietnameseReferenceToneId, ExtractedPitchContour>> {
  const perToneReferenceContours: Partial<Record<SupportedVietnameseReferenceToneId, ExtractedPitchContour>> = {};

  for (const tone of Object.keys(SUPPORTED_TONE_CONTOURS) as SupportedVietnameseReferenceToneId[]) {
    const recordingsForTone = acceptedRecordings.filter((recording) => recording.tone === tone);
    if (recordingsForTone.length === 0) continue;
    const referenceContour = averageReferenceContour(
      recordingsForTone.map((recording) => recording.normalizedContour),
      policy.referenceSampleCount,
    );
    if (referenceContour !== null) {
      perToneReferenceContours[tone] = referenceContour;
    }
  }

  return perToneReferenceContours;
}

function buildCalibrationReferences(
  acceptedRecordings: AcceptedVietnameseToneRecording[],
  perToneReferenceContours: Partial<Record<SupportedVietnameseReferenceToneId, ExtractedPitchContour>>,
): VietnameseToneCalibrationReference[] {
  const references: VietnameseToneCalibrationReference[] = [];

  for (const tone of Object.keys(SUPPORTED_TONE_CONTOURS) as SupportedVietnameseReferenceToneId[]) {
    const contour = perToneReferenceContours[tone];
    if (!contour) continue;
    const source = acceptedRecordings.find((recording) => recording.tone === tone);
    if (!source) continue;
    references.push({
      id: `reference-${tone}`,
      kind: "clean_supported",
      target: source.target,
      expectedContour: SUPPORTED_TONE_CONTOURS[tone],
      contour,
    });
  }

  for (const tone of ["hoi", "nga", "nang"] as UnsupportedVietnameseReferenceToneId[]) {
    const source = acceptedRecordings.find((recording) => recording.tone === tone);
    if (!source) continue;
    references.push({
      id: `unsupported-${tone}`,
      kind: "unsupported",
      target: source.target,
      contour: source.normalizedContour,
    });
  }

  return references;
}

function qualityDropReason(
  contour: ExtractedPitchContour,
  policy: VietnameseToneReferenceIngestionPolicy,
): VietnameseToneReferenceDropReason | null {
  if (contour.reason === "no-audio") return "no_audio";
  if (contour.reason === "too-short") return "too_short";
  if (contour.reason !== "ok") return "extractor_rejected";
  if (contour.medianF0Hz === null || contour.medianF0Hz <= 0) return "missing_pitch";
  if (contour.voicedRatio < policy.minVoicedRatio) return "low_voicing";
  if (contour.extractionConfidence < policy.minExtractionConfidence) return "low_confidence";
  if (usableSampleCount(contour) < policy.minUsableSamples) return "insufficient_samples";
  return null;
}

function averageReferenceContour(contours: ExtractedPitchContour[], sampleCount: number): ExtractedPitchContour | null {
  if (contours.length === 0 || sampleCount < 2) return null;

  const resampled = contours.map((contour) => resampleContour(contour, sampleCount));
  if (resampled.some((samples) => samples === null)) return null;
  const contourSamples = resampled as number[][];
  const samples = Array.from({ length: sampleCount }, (_, index) => {
    const f0HzValues = contourSamples.map((sampleValues) => sampleValues[index]);
    return {
      timeMs: index * 70,
      f0Hz: round(average(f0HzValues)),
      confidence: roundToTwoDecimals(
        average(
          contours.map((contour) =>
            average(
              contour.samples
                .filter((sample) => sample.f0Hz !== null)
                .map((sample) => sample.confidence),
            ),
          ),
        ),
      ),
    };
  });
  const f0HzValues = samples.map((sample) => sample.f0Hz).filter((f0Hz): f0Hz is number => f0Hz !== null);

  return {
    samples,
    durationMs: samples[samples.length - 1]?.timeMs ?? 0,
    voicedRatio: roundToTwoDecimals(average(contours.map((contour) => contour.voicedRatio))),
    medianF0Hz: round(median(f0HzValues)),
    extractionConfidence: roundToTwoDecimals(average(contours.map((contour) => contour.extractionConfidence))),
    reason: "ok",
  };
}

function resampleContour(contour: ExtractedPitchContour, sampleCount: number): number[] | null {
  const voicedSamples = contour.samples
    .filter((sample): sample is ExtractedPitchContour["samples"][number] & { f0Hz: number } => sample.f0Hz !== null)
    .sort((left, right) => left.timeMs - right.timeMs);
  if (voicedSamples.length < 2) return null;

  const startTimeMs = voicedSamples[0].timeMs;
  const endTimeMs = voicedSamples[voicedSamples.length - 1].timeMs;
  const durationMs = endTimeMs - startTimeMs;
  if (durationMs <= 0) return null;

  return Array.from({ length: sampleCount }, (_, index) => {
    const progress = sampleCount === 1 ? 0 : index / (sampleCount - 1);
    const targetTimeMs = startTimeMs + durationMs * progress;
    return interpolateF0AtTime(voicedSamples, targetTimeMs);
  });
}

function interpolateF0AtTime(
  samples: Array<ExtractedPitchContour["samples"][number] & { f0Hz: number }>,
  targetTimeMs: number,
): number {
  if (targetTimeMs <= samples[0].timeMs) return samples[0].f0Hz;
  const last = samples[samples.length - 1];
  if (targetTimeMs >= last.timeMs) return last.f0Hz;

  for (let index = 1; index < samples.length; index += 1) {
    const previous = samples[index - 1];
    const current = samples[index];
    if (targetTimeMs > current.timeMs) continue;
    const span = current.timeMs - previous.timeMs;
    const progress = span <= 0 ? 0 : (targetTimeMs - previous.timeMs) / span;
    return previous.f0Hz + (current.f0Hz - previous.f0Hz) * progress;
  }

  return last.f0Hz;
}

function normalizeContourBySpeaker(contour: ExtractedPitchContour, speakerMedianF0Hz: number): ExtractedPitchContour {
  const samples = contour.samples.map((sample) => ({
    ...sample,
    f0Hz: sample.f0Hz === null ? null : round(sample.f0Hz / speakerMedianF0Hz),
  }));
  const normalizedMedian = contour.medianF0Hz === null ? null : round(contour.medianF0Hz / speakerMedianF0Hz);

  return {
    ...contour,
    samples,
    medianF0Hz: normalizedMedian,
  };
}

function speakerBaselinesFor(candidates: CandidateRecording[]): Record<string, number> {
  const valuesBySpeaker = new Map<string, number[]>();
  for (const candidate of candidates) {
    const medianF0Hz = candidate.contour.medianF0Hz;
    if (medianF0Hz === null || medianF0Hz <= 0) continue;
    const values = valuesBySpeaker.get(candidate.recording.speakerId) ?? [];
    values.push(medianF0Hz);
    valuesBySpeaker.set(candidate.recording.speakerId, values);
  }

  return Object.fromEntries(
    [...valuesBySpeaker.entries()].map(([speakerId, values]) => [speakerId, round(median(values))]),
  );
}

function targetForRecording(recording: LabeledVietnameseToneRecording): VietnameseToneTarget {
  return {
    syllable: recording.syllable,
    tone: recording.tone,
    expectedContour: SUPPORTED_TONE_CONTOURS[recording.tone as SupportedVietnameseReferenceToneId] ?? "unsupported",
  };
}

function drop(
  recording: LabeledVietnameseToneRecording,
  reason: VietnameseToneReferenceDropReason,
): DroppedVietnameseToneRecording {
  return {
    id: recording.id,
    speakerId: recording.speakerId,
    tone: recording.tone,
    reason,
  };
}

function durationMsFor(recording: LabeledVietnameseToneRecording): number {
  return recording.sampleRate <= 0 ? 0 : (recording.samples.length / recording.sampleRate) * 1000;
}

function clippedSampleRatio(samples: Float32Array | readonly number[]): number {
  if (samples.length === 0) return 0;
  let clipped = 0;
  for (const sample of samples) {
    if (Math.abs(sample ?? 0) >= 0.985) clipped += 1;
  }
  return clipped / samples.length;
}

function usableSampleCount(contour: ExtractedPitchContour): number {
  return contour.samples.filter((sample) => sample.f0Hz !== null && sample.confidence >= 0.45).length;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function median(values: number[]): number {
  const sorted = [...values].sort((left, right) => left - right);
  const midpoint = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[midpoint - 1] + sorted[midpoint]) / 2;
  }
  return sorted[midpoint];
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}
