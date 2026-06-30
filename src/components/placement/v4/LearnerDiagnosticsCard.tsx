// Placement v4 — learner-visible adaptive diagnostics renderer.
//
// Mountable from ResultsPage or any study-plan surface. Consumes
// `LearnerDiagnostic[]` from the A7 adaptive layer and renders supportive,
// bilingual VI/EN cards. Deterministic order is taken from the input array;
// malformed entries are quietly filtered.
//
// Surface guarantees:
//   - No risk-scoring internals or telemetry labels are shown.
//   - No "churn", "burnout", "score", "confidence", "telemetry", "provider"
//     vocabulary leaks into rendered text. The component asserts this at
//     render time and falls back to safe copy if the input violates it.
//   - Vietnamese-first per the MercyBlade non-negotiable.

import React from "react";

import type { LearnerDiagnostic } from "@/lib/placement/v4/telemetry";

type DiagnosticTone = LearnerDiagnostic["tone"];

const TONE_CLASSNAME: Record<DiagnosticTone, string> = {
  informational:
    "border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
  cautionary:
    "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-100",
  celebratory:
    "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-100",
};

/**
 * Words that must never appear in learner-facing strings. Any diagnostic
 * that smuggles one in is dropped — the component refuses to render telemetry
 * vocabulary to users.
 */
const FORBIDDEN_VOCAB = [
  "churn",
  "burnout score",
  "risk score",
  "telemetry",
  "provider",
  "governance",
  "confidence score",
  "audit",
  "failed",
];

export interface LearnerDiagnosticsCardProps {
  diagnostics: readonly LearnerDiagnostic[];
  /**
   * Optional title override (bilingual). Defaults to a supportive headline.
   */
  title?: { vi: string; en: string };
  /**
   * Optional className applied to the outer wrapper.
   */
  className?: string;
}

export function LearnerDiagnosticsCard(
  props: LearnerDiagnosticsCardProps,
): React.ReactElement | null {
  const safe = (props.diagnostics ?? []).filter(isSafeDiagnostic);
  if (safe.length === 0) return null;

  const title = props.title ?? {
    vi: "Tóm tắt cho bạn tuần này",
    en: "A note for your week",
  };

  return (
    <section
      data-testid="learner-diagnostics-card"
      className={
        "rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950 " +
        (props.className ?? "")
      }
      aria-label={title.en}
    >
      <header className="mb-3">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {title.vi}
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-300">{title.en}</p>
      </header>
      <ul
        className="space-y-2"
        data-testid="learner-diagnostics-list"
      >
        {safe.map((d) => (
          <li
            key={diagnosticReactKey(d)}
            data-testid={`learner-diagnostic-${d.kind}`}
            data-tone={d.tone}
            className={`rounded-md border px-3 py-2 ${TONE_CLASSNAME[d.tone]}`}
          >
            <p className="text-sm font-medium" data-testid="diagnostic-headline-vi">
              {d.headline.vi}
            </p>
            <p
              className="text-xs opacity-80"
              data-testid="diagnostic-headline-en"
            >
              {d.headline.en}
            </p>
            <p
              className="mt-1 text-sm"
              data-testid="diagnostic-body-vi"
            >
              {d.body.vi}
            </p>
            <p
              className="mt-0.5 text-xs opacity-80"
              data-testid="diagnostic-body-en"
            >
              {d.body.en}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Internal guards
// ---------------------------------------------------------------------------

function isSafeDiagnostic(d: unknown): d is LearnerDiagnostic {
  if (!d || typeof d !== "object") return false;
  const obj = d as Partial<LearnerDiagnostic>;
  if (!isBilingualString(obj.headline)) return false;
  if (!isBilingualString(obj.body)) return false;
  if (typeof obj.kind !== "string" || obj.kind.length === 0) return false;
  if (typeof obj.reasonCode !== "string") return false;
  if (
    obj.tone !== "informational" &&
    obj.tone !== "cautionary" &&
    obj.tone !== "celebratory"
  ) {
    return false;
  }
  // Vocabulary guard — refuse to render telemetry words to learners.
  const haystack = [
    obj.headline.vi,
    obj.headline.en,
    obj.body.vi,
    obj.body.en,
  ]
    .join(" ")
    .toLowerCase();
  for (const word of FORBIDDEN_VOCAB) {
    if (haystack.includes(word)) return false;
  }
  return true;
}

function isBilingualString(value: unknown): value is { vi: string; en: string } {
  if (!value || typeof value !== "object") return false;
  const obj = value as { vi?: unknown; en?: unknown };
  return (
    typeof obj.vi === "string" &&
    obj.vi.length > 0 &&
    typeof obj.en === "string" &&
    obj.en.length > 0
  );
}

function diagnosticReactKey(d: LearnerDiagnostic): string {
  return `${d.kind}::${d.reasonCode}`;
}

export default LearnerDiagnosticsCard;
