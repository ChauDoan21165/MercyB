// src/components/parent-view/ParentView.tsx
//
// L6 — Parent / Family layer. The parent-facing weakness summary.
//
// SCOPE (docs/architecture/L6-parent-teacher-family-layer.md § First-build
// scope + Decisions recorded):
//   • PARENT-ONLY this build (Q6=C). The Persona-C teacher / class-roster
//     view is a NAMED FUTURE PHASE — do NOT add a class/per-student
//     surface here; it carries its own RLS + roster design. When it
//     lands it gets its own component, not a branch in this one.
//   • Paywall-implied access (Q1=B) bundled in Premium (Q7=A) — gated on
//     useUserAccess().hasPremium only. This component does NOT touch
//     src/billing/* (regression-locked); it only READS the entitlement.
//   • Q3=B phased — category buckets with a null-safe explainer-video
//     slot per category.
//   • Q4=B — NO time-on-task anywhere in this view.
//   • Q5=C — qualitative by default; numbers behind a per-bucket drill-in.
//   • Q9=A — descriptive framing; no "Mercy helped" attribution yet.
//   • Q10=C — NEUTRAL / factual voice in-app. Mercy's warmer voice lives
//     only in the weekly digest email, never here.
//   • Read-only (doc § What L6 is NOT): no parent→learner writes, no
//     streaks/XP/leaderboard, no raw learner input.
//
// Data: reads the SAME local L3 aggregate that powers /weak-at
// (aggregateLocalWeaknesses) and shapes it via buildParentSummary. v1 is a
// device-local read (no server snapshot sync yet — see doc § Data flow,
// "the first time L1's local-only posture is loosened" is future work).

import { useEffect, useMemo, useState } from "react";

import { useUserAccess } from "@/hooks/useUserAccess";
import { aggregateLocalWeaknesses } from "@/lib/stage-3a/aggregator";
import {
  buildParentSummary,
  type ParentCategory,
  type ParentSummary,
} from "@/lib/parent-view/buildParentSummary";
import {
  resolveParentLocale,
  type ParentLocale,
} from "@/lib/parent-view/parentLocale";
import { ParentAskMercyCta } from "./ParentAskMercyCta";
import { ParentInviteFamilyCta } from "./ParentInviteFamilyCta";
import { ParentCategoryBucket } from "./ParentCategoryBucket";
import { ParentFamilyBridgeSection } from "./ParentFamilyBridgeSection";
import { ParentHeadline } from "./ParentHeadline";
import {
  ParentAccessSkeleton,
  ParentDataSkeleton,
  ParentEmptyState,
  ParentPaywallGate,
} from "./ParentViewStates";

export interface ParentViewProps {
  /** Learner display name for the headline. Optional. */
  learnerName?: string | null;
  /** Test seam — inject a pre-built summary instead of reading local. */
  initialSummary?: ParentSummary;
  /** Test seam — force a locale instead of resolving from signup/browser. */
  localeOverride?: ParentLocale;
}

export default function ParentView({
  learnerName,
  initialSummary,
  localeOverride,
}: ParentViewProps = {}) {
  const access = useUserAccess();
  const locale = useMemo(
    () => resolveParentLocale(localeOverride),
    [localeOverride],
  );
  const [summary, setSummary] = useState<ParentSummary | null>(
    initialSummary ?? null,
  );

  useEffect(() => {
    if (initialSummary) return;
    // Pure synchronous local read — same posture as LocalWeaknessMap.
    try {
      setSummary(buildParentSummary(aggregateLocalWeaknesses(), { learnerName }));
    } catch {
      setSummary(
        buildParentSummary(
          {
            topL1Patterns: [],
            placementWeaknesses: [],
            topPronunciationPainPoints: [],
            isEmpty: true,
            generatedAt: 0,
          },
          { learnerName },
        ),
      );
    }
  }, [initialSummary, learnerName]);

  // Fail closed while entitlement is resolving (matches the room paywall).
  if (access.isLoading) return <ParentAccessSkeleton />;
  if (!access.hasPremium) return <ParentPaywallGate />;
  if (!summary) return <ParentDataSkeleton />;

  const visibleCategories = getRenderableCategories(summary);
  const isEmpty = summary.isEmpty || visibleCategories.length === 0;

  return (
    <div
      data-testid="parent-view"
      data-locale={locale}
      className="mx-auto w-full max-w-[560px] space-y-4 py-4"
    >
      <ParentHeadline summary={summary} locale={locale} />
      {isEmpty ? (
        <ParentEmptyState />
      ) : (
        visibleCategories.map((category) => (
          <ParentCategoryBucket
            key={category.config.id}
            category={category}
            locale={locale}
          />
        ))
      )}
      <ParentAskMercyCta />
      <ParentInviteFamilyCta />
      <ParentFamilyBridgeSection />
    </div>
  );
}

function getRenderableCategories(summary: ParentSummary): ParentCategory[] {
  if (!Array.isArray(summary.categories)) return [];
  return summary.categories.filter((category): category is ParentCategory => {
    return Boolean(
      category &&
        !category.isEmpty &&
        category.config &&
        category.config.id &&
        Array.isArray(category.items),
    );
  });
}
