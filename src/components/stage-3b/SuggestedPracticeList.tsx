// src/components/stage-3b/SuggestedPracticeList.tsx
//
// Stage 3B — Suggested Practice UI surface (Day 5 of Stage 3B).
//
// Consumes the deterministic 0–3 items from
// `selectSuggestedPractice(state)` and renders them as a Vietnamese-
// first mobile-first card list. Each row is a button that navigates
// to the practice surface for its weakness kind.
//
// Routing map (full rationale + slug coverage live in
// `practiceRoutes.ts` next to this component):
//
//   - l1            → /ai-tutor?focus=<sourceTag>
//   - placement     → /placement/results
//   - pronunciation → /practice/phoneme/<slug>
//                     (TH_T/R_L/ED_ENDINGS/S_PLURALS/STRESS only;
//                      INTONATION + unknown axes fall back to
//                      /weak-at?focus=pronunciation:<axis>)
//
// No new routes were introduced for this wiring — the engine fans out
// across surfaces that already exist in `src/router/AppRouter.tsx`.
//
// Hard invariants (inherited from Stage 3A boundaries):
//   - Pure read. Calls `aggregateLocalWeaknesses()` once on mount;
//     no writes. No Supabase. No fetch. No mercy_user_facts.
//     No localStorage.setItem / removeItem (read-only via the
//     aggregator's existing seam). Navigation is router-level — no
//     side-effecting handoff state is written anywhere.
//   - No gamification language in rendered output — no "streak",
//     "xp", "level", "badge", "score"; no shame words. Labels come
//     from the engine, which sources them from
//     `stage-3a/taxonomy.ts`.
//   - Vietnamese is primary; English is the subtitle.
//   - Mobile-first 375–414 px. Vertical flow; no horizontal scrolls.
//   - Empty list → calm VI message; never "you have no weaknesses".

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ClipboardList, Volume2, Sparkles } from "lucide-react";

import {
  aggregateLocalWeaknesses,
  type LocalWeaknessMap as LocalWeaknessMapData,
} from "@/lib/stage-3a/aggregator";
import {
  reportUiMountPerf,
  selectSuggestedPracticeInstrumented,
} from "@/stage-3b/perfInstrumentation";
import type {
  SuggestedPracticeItem,
  SuggestedPracticeKind,
} from "@/stage-3b/types";
import { recordSuggestedPracticeView } from "@/stage-3b/viewCount";

import { routeForSuggestedPractice } from "./practiceRoutes";
import { Bilingual } from "@/components/Bilingual";

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
  const navigate = useNavigate();
  const [state, setState] = useState<LocalWeaknessMapData | null>(
    initialState ?? null,
  );

  // Mount-to-first-paint start. Captured once during component
  // construction via useRef so re-renders don't reset it.
  const mountStartRef = useRef<number>(nowMs());

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

  // Items derived once per render. Computed before the early returns
  // below so the hooks that depend on `hasItems` stay above any
  // conditional return (Rules of Hooks).
  const items = state
    ? selectSuggestedPracticeInstrumented(state)
    : [];
  const hasItems = items.length > 0;

  // Diagnostic view counter — local-only, gated on a non-empty render.
  useEffect(() => {
    if (hasItems) recordSuggestedPracticeView();
  }, [hasItems]);

  // Mount-to-first-paint Sentry breadcrumb (only fires if slow).
  useEffect(() => {
    reportUiMountPerf(nowMs() - mountStartRef.current);
  }, []);

  if (!state) return <SkeletonLoading />;
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
          <Bilingual
            vi="Gợi ý luyện tập"
            en="Suggested practice"
            viAs="h3"
            enAs="p"
            viClassName="text-sm font-bold leading-tight text-slate-900"
            enClassName="text-[11px] leading-tight text-slate-500"
            viProps={{ id: "suggested-practice-heading" }}
          />
        </div>
      </div>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item) => (
          <SuggestedPracticeRow
            key={item.id}
            item={item}
            onSelect={() => navigate(routeForSuggestedPractice(item))}
          />
        ))}
      </ul>
    </section>
  );
}

function SuggestedPracticeRow({
  item,
  onSelect,
}: {
  item: SuggestedPracticeItem;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        data-testid={`suggested-practice-item-${item.kind}`}
        data-source-tag={item.sourceTag}
        data-route={routeForSuggestedPractice(item)}
        onClick={onSelect}
        className="flex w-full items-start gap-3 rounded-2xl border border-violet-100/70 bg-white/80 px-3 py-2.5 text-left transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
      >
        <KindChip kind={item.kind} />
        <div className="min-w-0 flex-1">
          <Bilingual
            vi={item.viLabel}
            en={item.enLabel}
            viClassName="text-sm font-semibold leading-snug text-slate-900"
            enClassName="mt-0.5 text-[12px] leading-snug text-slate-500"
          />
          <p lang="vi" className="mt-1 text-[11px] leading-snug text-slate-500">
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

function nowMs(): number {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }
  return Date.now();
}

function EmptyState() {
  return (
    <section
      data-testid="suggested-practice-empty"
      className="mx-auto w-full max-w-[420px] rounded-[20px] border border-slate-200/70 bg-gradient-to-br from-slate-50 to-white px-4 py-6 text-center shadow-[0_10px_28px_rgba(15,23,42,0.04)]"
    >
      <Bilingual
        vi="Chưa có gợi ý nào — luyện thêm vài bài để Mercy hiểu bạn rõ hơn."
        en="Suggestions appear after a few lessons."
        viClassName="text-sm font-semibold leading-snug text-slate-900"
        enClassName="mt-1 text-[12px] leading-snug text-slate-500"
      />
    </section>
  );
}
