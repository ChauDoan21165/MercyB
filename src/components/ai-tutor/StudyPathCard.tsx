import { useMemo, useState } from "react";
import {
  loadLearnerHistoryProfile,
  createEmptyLearnerHistoryProfile,
} from "@/lib/tutor/learnerHistoryProfile";
import { sequenceToStudyItems, type StudyPathItem } from "@/lib/ai-tutor/studyPath";
import type { TutorProduct } from "@/lib/ai-tutor/learningMemory";

type Props = {
  product?: TutorProduct;
  targetLanguage?: string;
  /** Injectable for tests; defaults to the real clock. */
  now?: number;
  /** How many patterns to surface as "work on first". */
  topCount?: number;
};

/**
 * Step-15 study path: an advisory, Vietnamese-first list of the interference
 * patterns the learner should work on next, ordered by the pure sequencer.
 * Device-local + empty-safe: with no history the sequencer falls back to the
 * default curriculum order, so the card always renders a useful plan.
 */
export default function StudyPathCard({
  product = "ai-tutor",
  targetLanguage = "en",
  now,
  topCount = 3,
}: Props) {
  const [showUpcoming, setShowUpcoming] = useState(false);

  const items = useMemo<StudyPathItem[]>(() => {
    const clock = typeof now === "number" ? now : Date.now();
    const profile =
      loadLearnerHistoryProfile(product, targetLanguage) ??
      createEmptyLearnerHistoryProfile(product, targetLanguage, clock);
    return sequenceToStudyItems(profile, clock);
  }, [product, targetLanguage, now]);

  if (items.length === 0) return null;

  const top = items.slice(0, topCount);
  const upcoming = items.slice(topCount);

  return (
    <section
      data-testid="study-path-card"
      className="rounded-2xl border border-indigo-100 bg-white/80 p-4 shadow-sm"
    >
      <h3 className="text-sm font-black text-indigo-900">Lộ trình học của bạn</h3>
      <p className="mt-0.5 text-xs font-bold text-slate-600">Ưu tiên luyện trước:</p>
      <ul className="mt-2 space-y-2">
        {top.map((item) => (
          <li key={item.patternId} data-testid="study-path-top-item" className="rounded-xl bg-indigo-50/60 p-2.5">
            <p className="text-sm font-black text-slate-900">{item.name}</p>
            <p className="mt-0.5 text-xs font-medium text-slate-600">{item.shortDescription}</p>
            <p className="mt-1 text-[11px] font-bold text-indigo-700" title={item.rationale}>
              {item.rationale}
            </p>
          </li>
        ))}
      </ul>

      {upcoming.length > 0 && (
        <div className="mt-2">
          <button
            type="button"
            data-testid="study-path-upcoming-toggle"
            onClick={() => setShowUpcoming((v) => !v)}
            className="text-xs font-black text-indigo-600 hover:text-indigo-800"
            aria-expanded={showUpcoming}
          >
            {showUpcoming ? "Ẩn phần sắp tới" : `Sắp tới (${upcoming.length})`}
          </button>
          {showUpcoming && (
            <ul className="mt-2 space-y-1">
              {upcoming.map((item) => (
                <li key={item.patternId} data-testid="study-path-upcoming-item" className="text-xs font-medium text-slate-600">
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
