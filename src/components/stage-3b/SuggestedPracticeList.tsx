// src/components/stage-3b/SuggestedPracticeList.tsx
//
// Stage 3B — Suggested Practice UI surface (Day 5 of Stage 3B).
//
// Consumes the deterministic 0–3 items from
// `selectSuggestedPractice(state)` and renders them as a Vietnamese-
// first mobile-first card list. Each row is a button — onClick is a
// stub for now (next brick wires the actual practice handoff).
//
// Hard invariants (inherited from Stage 3A boundaries):
//   - Pure read. Calls `aggregateLocalWeaknesses()` once on mount;
//     no writes. No Supabase. No fetch. No mercy_user_facts.
//     No localStorage.setItem / removeItem (read-only via the
//     aggregator's existing seam).
//   - No gamification language in rendered output — no "streak",
//     "xp", "level", "badge", "score"; no shame words. Labels come
//     from the engine, which sources them from
//     `stage-3a/taxonomy.ts`.
//   - Vietnamese is primary; English is the subtitle.
//   - Mobile-first 375–414 px. Vertical flow; no horizontal scrolls.
//   - Empty list → calm VI message; never "you have no weaknesses".

import { useEffect, useState } from "react";
import { BookOpen, ClipboardList, Volume2, Sparkles } from "lucide-react";

import {
  aggregateLocalWeaknesses,
  type LocalWeaknessMap as LocalWeaknessMapData,
} from "@/lib/stage-3a/aggregator";
import { selectSuggestedPractice } from "@/stage-3b/suggestedPractice";
import type {
  SuggestedPracticeItem,
  SuggestedPracticeKind,
} from "@/stage-3b/types";

export interface SuggestedPracticeListProps {
  /**
   * Test seam — inject pre-aggregated state instead of calling the
   * aggregator on mount. Production callers omit.
   */
  initialState?: LocalWeaknessMapData;
}

export default function SuggestedPracticeList({
  initialState,
}: SuggestedPracticeListProps = {}) {
  const [state, setState] = useState<LocalWeaknessMapData | null>(
    initialState ?? null,
  );

  useEffect(() => {
    if (initialState) return;
    try {
      setState(aggregateLocalWeaknesses());
    } catch {
      setState({
        topL1Patterns: [],
        placementWeaknesses: [],
        topPronunciationPainPoints: [],
        isEmpty: true,
        generatedAt: Date.now(),
      });
    }
  }, [initialState]);

  if (!state) return <SkeletonLoading />;

  const items = selectSuggestedPractice(state);
  if (items.length === 0) return <EmptyState />;

  return (
    <section
      data-testid="suggested-practice-list"
      aria-labelledby="suggested-practice-heading"
      className="mx-auto w-full max-w-[420px] rounded-[20px] border border-violet-200/70 bg-gradient-to-br from-violet-50 to-white p-4 shadow-[0_10px_28px_rgba(124,58,237,0.08)]"
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm">
          <Sparkles className="h-4 w-4 text-violet-600" aria-hidden />
        </span>
        <div className="min-w-0">
          <h3
            id="suggested-practice-heading"
            className="text-sm font-bold leading-tight text-slate-900"
          >
            Gợi ý luyện tập
          </h3>
          <p className="text-[11px] leading-tight text-slate-500">
            Suggested practice
          </p>
        </div>
      </div>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item) => (
          <SuggestedPracticeRow key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}

function SuggestedPracticeRow({ item }: { item: SuggestedPracticeItem }) {
  return (
    <li>
      <button
        type="button"
        data-testid={`suggested-practice-item-${item.kind}`}
        data-source-tag={item.sourceTag}
        onClick={() => {
          // Stub: real wiring (route to a focused drill) ships in the
          // next brick. Logging gives the next contributor a breadcrumb.
          // eslint-disable-next-line no-console
          console.log("[suggested-practice] selected", item.id);
        }}
        className="flex w-full items-start gap-3 rounded-2xl border border-violet-100/70 bg-white/80 px-3 py-2.5 text-left transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
      >
        <KindChip kind={item.kind} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug text-slate-900">
            {item.viLabel}
          </p>
          <p className="mt-0.5 text-[12px] leading-snug text-slate-500">
            {item.enLabel}
          </p>
          <p className="mt-1 text-[11px] leading-snug text-slate-400">
            {item.rationale}
          </p>
        </div>
      </button>
    </li>
  );
}

function KindChip({ kind }: { kind: SuggestedPracticeKind }) {
  const { Icon, tone, label } = kindPresentation(kind);
  return (
    <span
      aria-label={label}
      data-testid={`suggested-practice-kind-${kind}`}
      className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${tone}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
    </span>
  );
}

function kindPresentation(kind: SuggestedPracticeKind): {
  Icon: typeof BookOpen;
  tone: string;
  label: string;
} {
  switch (kind) {
    case "l1":
      return {
        Icon: BookOpen,
        tone: "bg-indigo-50 text-indigo-600",
        label: "Ngữ pháp",
      };
    case "placement":
      return {
        Icon: ClipboardList,
        tone: "bg-amber-50 text-amber-600",
        label: "Trình độ",
      };
    case "pronunciation":
      return {
        Icon: Volume2,
        tone: "bg-teal-50 text-teal-600",
        label: "Phát âm",
      };
  }
}

function SkeletonLoading() {
  return (
    <div
      data-testid="suggested-practice-loading"
      className="mx-auto w-full max-w-[420px] px-4 py-4"
    >
      <div className="h-36 animate-pulse rounded-[20px] bg-slate-100" />
    </div>
  );
}

function EmptyState() {
  return (
    <section
      data-testid="suggested-practice-empty"
      className="mx-auto w-full max-w-[420px] rounded-[20px] border border-slate-200/70 bg-gradient-to-br from-slate-50 to-white px-4 py-6 text-center shadow-[0_10px_28px_rgba(15,23,42,0.04)]"
    >
      <p className="text-sm font-semibold leading-snug text-slate-900">
        Chưa có gợi ý nào — luyện thêm vài bài để Mercy hiểu bạn rõ hơn.
      </p>
      <p className="mt-1 text-[12px] leading-snug text-slate-500">
        Suggestions appear after a few lessons.
      </p>
    </section>
  );
}
