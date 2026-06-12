export const READ_BACK_WORD_ACCURACY_CONFIDENCE_FLOOR = 50;

export function hasDisplayableReadBackWordAccuracy(score: unknown): score is number {
  return (
    typeof score === "number" &&
    Number.isFinite(score) &&
    score >= READ_BACK_WORD_ACCURACY_CONFIDENCE_FLOOR
  );
}
