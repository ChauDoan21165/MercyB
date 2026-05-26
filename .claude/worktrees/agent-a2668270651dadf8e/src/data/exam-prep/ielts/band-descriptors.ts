// src/data/exam-prep/ielts/band-descriptors.ts
//
// IELTS band scoring helpers. Bands run 0–9 in 0.5 increments.
//
// We model TWO conversions:
//   1. Listening / Reading: raw correct count out of 40 → band. The
//      official Cambridge conversion is small per-test variation in
//      cut scores; we use the canonical "average official conversion"
//      table that the public study sites publish. Treat as estimate;
//      a real test centre's cut scores can shift ±1 raw mark.
//   2. Writing / Speaking: 0–5 sub-criteria scores → band. We map our
//      existing rubric (0–5 per dimension) onto a 0–9 band by linear
//      interpolation and a small calibration constant — explained in
//      the helper. This is an estimator, not a marker.
//
// Overall band: average of the four section bands, rounded to the
// nearest 0.5 (IELTS rule: 0.25 rounds up, 0.75 rounds up, etc.).
//
// VN learner copy is the source of truth — the descriptors are written
// in Vietnamese teacher voice and translated to English for parity.

export type IELTSBand =
  | 0
  | 1
  | 1.5
  | 2
  | 2.5
  | 3
  | 3.5
  | 4
  | 4.5
  | 5
  | 5.5
  | 6
  | 6.5
  | 7
  | 7.5
  | 8
  | 8.5
  | 9;

export type BandDescriptor = {
  band: IELTSBand;
  label_en: string;
  label_vi: string;
  /** One-sentence Vietnamese summary of what this band typically demonstrates. */
  summary_vi: string;
};

export const BAND_DESCRIPTORS: ReadonlyArray<BandDescriptor> = [
  {
    band: 9,
    label_en: "Expert user",
    label_vi: "Sử dụng thành thạo như người bản xứ",
    summary_vi: "Sử dụng tiếng Anh trôi chảy, chính xác, tinh tế ở mọi tình huống.",
  },
  {
    band: 8,
    label_en: "Very good user",
    label_vi: "Rất tốt",
    summary_vi: "Hiểu và diễn đạt phức tạp; chỉ một vài lỗi nhỏ không hệ thống.",
  },
  {
    band: 7,
    label_en: "Good user",
    label_vi: "Tốt",
    summary_vi: "Diễn đạt rõ ràng, mắc một số lỗi trong tình huống lạ.",
  },
  {
    band: 6,
    label_en: "Competent user",
    label_vi: "Đủ năng lực",
    summary_vi: "Hiểu khá tốt trong các tình huống quen thuộc, có thể có một vài lỗi.",
  },
  {
    band: 5,
    label_en: "Modest user",
    label_vi: "Trung bình",
    summary_vi: "Giao tiếp được trong tình huống đơn giản; thường mắc lỗi.",
  },
  {
    band: 4,
    label_en: "Limited user",
    label_vi: "Hạn chế",
    summary_vi: "Chỉ giao tiếp được trong tình huống quen thuộc, gặp khó khăn rõ rệt.",
  },
  {
    band: 3,
    label_en: "Extremely limited user",
    label_vi: "Rất hạn chế",
    summary_vi: "Hiểu và diễn đạt được rất ít — gãy gập trong giao tiếp đơn giản.",
  },
  {
    band: 0,
    label_en: "Did not attempt",
    label_vi: "Không làm bài",
    summary_vi: "Không có thông tin để chấm điểm.",
  },
];

/**
 * Listening + Reading raw → band conversion (Academic).
 * Source: average of publicly published Cambridge conversion tables.
 * Treat as estimate; test-day cut scores vary ±1 raw mark.
 */
const LISTENING_BAND_TABLE: ReadonlyArray<{ minRaw: number; band: IELTSBand }> = [
  { minRaw: 39, band: 9 },
  { minRaw: 37, band: 8.5 },
  { minRaw: 35, band: 8 },
  { minRaw: 33, band: 7.5 },
  { minRaw: 30, band: 7 },
  { minRaw: 27, band: 6.5 },
  { minRaw: 23, band: 6 },
  { minRaw: 19, band: 5.5 },
  { minRaw: 16, band: 5 },
  { minRaw: 13, band: 4.5 },
  { minRaw: 10, band: 4 },
  { minRaw: 7, band: 3.5 },
  { minRaw: 5, band: 3 },
  { minRaw: 0, band: 0 },
];

const READING_ACADEMIC_BAND_TABLE: ReadonlyArray<{ minRaw: number; band: IELTSBand }> = [
  { minRaw: 39, band: 9 },
  { minRaw: 37, band: 8.5 },
  { minRaw: 35, band: 8 },
  { minRaw: 33, band: 7.5 },
  { minRaw: 30, band: 7 },
  { minRaw: 27, band: 6.5 },
  { minRaw: 23, band: 6 },
  { minRaw: 19, band: 5.5 },
  { minRaw: 15, band: 5 },
  { minRaw: 13, band: 4.5 },
  { minRaw: 10, band: 4 },
  { minRaw: 8, band: 3.5 },
  { minRaw: 6, band: 3 },
  { minRaw: 0, band: 0 },
];

function rawToBand(
  table: ReadonlyArray<{ minRaw: number; band: IELTSBand }>,
  raw: number,
): IELTSBand {
  const clamped = Math.max(0, Math.min(40, Math.round(raw)));
  for (const row of table) {
    if (clamped >= row.minRaw) return row.band;
  }
  return 0;
}

/** Listening section: raw out of 40 → band. */
export function listeningRawToBand(raw: number): IELTSBand {
  return rawToBand(LISTENING_BAND_TABLE, raw);
}

/** Reading (Academic) section: raw out of 40 → band. */
export function readingRawToBand(raw: number): IELTSBand {
  return rawToBand(READING_ACADEMIC_BAND_TABLE, raw);
}

/**
 * Writing/Speaking estimator: take 0–5 dimension scores from our
 * existing rubric (or the speaking self-rating) and produce an IELTS
 * band. Mapping rationale:
 *   - 0/5  → band 0
 *   - 5/5  → band 9
 *   - linear interpolation in between, then snapped to nearest 0.5.
 *
 * Tightening this against published descriptors is daytime work;
 * the linear estimator is documented in the UI as "estimate."
 */
export function rubricToBand(scoreOutOf5: number): IELTSBand {
  if (!Number.isFinite(scoreOutOf5)) return 0;
  const clamped = Math.max(0, Math.min(5, scoreOutOf5));
  const raw = (clamped / 5) * 9;
  return snapToBand(raw);
}

/** Snap an arbitrary numeric band to the canonical 0.5-step ladder. */
export function snapToBand(value: number): IELTSBand {
  const valid: IELTSBand[] = [
    0,
    1,
    1.5,
    2,
    2.5,
    3,
    3.5,
    4,
    4.5,
    5,
    5.5,
    6,
    6.5,
    7,
    7.5,
    8,
    8.5,
    9,
  ];
  let best: IELTSBand = 0;
  let bestDelta = Infinity;
  for (const v of valid) {
    const d = Math.abs(value - v);
    if (d < bestDelta) {
      bestDelta = d;
      best = v;
    }
  }
  return best;
}

/**
 * Combine four section bands into the overall band.
 *
 * IELTS rounding rule (canonical):
 *   - Compute the four-section average.
 *   - If the fractional part is < 0.25, round DOWN to the whole.
 *   - If the fractional part is in [0.25, 0.75), round to the .5 of
 *     that whole.
 *   - If the fractional part is >= 0.75, round UP to the next whole.
 *
 * Examples (covered in tests):
 *   6.125 → 6.0    (frac 0.125 < 0.25 → down)
 *   6.25  → 6.5    (frac 0.25 in band → .5)
 *   6.375 → 6.5
 *   6.625 → 6.5    (frac 0.625 < 0.75 → .5)
 *   6.75  → 7.0    (frac 0.75 >= 0.75 → up)
 */
export function overallBand(parts: {
  listening: IELTSBand;
  reading: IELTSBand;
  writing: IELTSBand;
  speaking: IELTSBand;
}): IELTSBand {
  const sum = parts.listening + parts.reading + parts.writing + parts.speaking;
  const avg = sum / 4;
  const whole = Math.floor(avg);
  const frac = avg - whole;
  // Use a tiny epsilon so floating-point doesn't push 0.25 below the
  // boundary (e.g., 6.25 stored as 6.249999…).
  const eps = 1e-9;
  if (frac < 0.25 - eps) return snapToBand(whole);
  if (frac < 0.75 - eps) return snapToBand(whole + 0.5);
  return snapToBand(whole + 1);
}

/** Lookup the canonical descriptor for a snapped band. */
export function descriptorForBand(band: IELTSBand): BandDescriptor | undefined {
  // Descriptors only exist on whole bands; round down 0.5 steps for lookup.
  const floor = Math.floor(band) as IELTSBand;
  return BAND_DESCRIPTORS.find((d) => d.band === floor) ?? BAND_DESCRIPTORS[BAND_DESCRIPTORS.length - 1];
}
