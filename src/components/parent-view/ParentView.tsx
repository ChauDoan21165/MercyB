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
import { Link } from "react-router-dom";
import {
  BookOpen,
  ClipboardList,
  Volume2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Lock,
} from "lucide-react";

import { Bilingual } from "@/components/Bilingual";
import { useUserAccess } from "@/hooks/useUserAccess";
import { aggregateLocalWeaknesses } from "@/lib/stage-3a/aggregator";
import {
  buildParentSummary,
  type ParentCategory,
  type ParentSummary,
  type ParentSummaryItem,
} from "@/lib/parent-view/buildParentSummary";
import type { ParentCategoryId } from "@/lib/parent-view/categories";
import {
  resolveParentLocale,
  type ParentLocale,
} from "@/lib/parent-view/parentLocale";

export interface ParentViewProps {
  /** Learner display name for the headline. Optional. */
  learnerName?: string | null;
  /** Test seam — inject a pre-built summary instead of reading local. */
  initialSummary?: ParentSummary;
  /** Test seam — force a locale instead of resolving from signup/browser. */
  localeOverride?: ParentLocale;
}

const CATEGORY_ICON: Record<ParentCategoryId, React.ReactNode> = {
  grammar: <BookOpen className="h-4 w-4 text-indigo-600" aria-hidden />,
  placement: <ClipboardList className="h-4 w-4 text-amber-600" aria-hidden />,
  pronunciation: <Volume2 className="h-4 w-4 text-teal-600" aria-hidden />,
};

const CATEGORY_SHELL: Record<ParentCategoryId, string> = {
  grammar:
    "border-indigo-200/70 bg-gradient-to-br from-indigo-50 to-white shadow-[0_10px_28px_rgba(79,70,229,0.08)]",
  placement:
    "border-amber-200/70 bg-gradient-to-br from-amber-50 to-white shadow-[0_10px_28px_rgba(217,119,6,0.08)]",
  pronunciation:
    "border-teal-200/70 bg-gradient-to-br from-teal-50 to-white shadow-[0_10px_28px_rgba(13,148,136,0.08)]",
};

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
  if (access.isLoading) return <AccessSkeleton />;
  if (!access.hasPremium) return <PaywallGate />;
  if (!summary) return <DataSkeleton />;

  return (
    <div
      data-testid="parent-view"
      data-locale={locale}
      className="mx-auto w-full max-w-[560px] space-y-4 py-4"
    >
      <Headline summary={summary} locale={locale} />
      {summary.isEmpty ? (
        <EmptyState />
      ) : (
        summary.categories
          .filter((c) => !c.isEmpty)
          .map((category) => (
            <CategoryBucket
              key={category.config.id}
              category={category}
              locale={locale}
            />
          ))
      )}
      <AskMercyCta />
    </div>
  );
}

// ── Headline (descriptive, neutral) ──────────────────────────────────────

function Headline({
  summary,
  locale,
}: {
  summary: ParentSummary;
  locale: ParentLocale;
}) {
  return (
    <section
      data-testid="parent-headline"
      className="rounded-[20px] border border-slate-200/70 bg-white px-4 py-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)]"
    >
      <Bilingual
        primary={locale}
        vi={summary.headlineVi}
        en={summary.headlineEn}
        viAs="h2"
        enAs="p"
        viClassName="text-base font-bold leading-snug text-slate-900"
        enClassName="mt-1 text-[13px] leading-snug text-slate-500"
      />
      {/* L5-PENDING (Q9=A): attribution clause renders only once L4+L5
          ground it. Null today → nothing appended; the headline stays
          purely descriptive. */}
      {summary.attributionClauseVi && (
        <p
          data-testid="parent-attribution"
          lang="vi"
          className="mt-2 text-[13px] leading-snug text-emerald-700"
        >
          {locale === "en"
            ? summary.attributionClauseEn
            : summary.attributionClauseVi}
        </p>
      )}
    </section>
  );
}

// ── Category bucket ──────────────────────────────────────────────────────

function CategoryBucket({
  category,
  locale,
}: {
  category: ParentCategory;
  locale: ParentLocale;
}) {
  const { config, items } = category;
  const [showNumbers, setShowNumbers] = useState(false);

  return (
    <section
      data-testid={`parent-category-${config.id}`}
      className={`rounded-[20px] border p-4 ${CATEGORY_SHELL[config.id]}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm">
            {CATEGORY_ICON[config.id]}
          </span>
          <Bilingual
            primary={locale}
            vi={config.titleVi}
            en={config.titleEn}
            viAs="h3"
            enAs="p"
            viClassName="text-sm font-bold leading-tight text-slate-900"
            enClassName="text-[11px] leading-tight text-slate-500"
          />
        </div>
        {/* Q5=C — qualitative is the default; numbers are an explicit
            drill-in toggle, scoped per bucket. */}
        <button
          type="button"
          data-testid={`parent-numbers-toggle-${config.id}`}
          onClick={() => setShowNumbers((v) => !v)}
          aria-pressed={showNumbers}
          aria-label={
            showNumbers
              ? locale === "en"
                ? `Hide numbers for ${config.titleEn}`
                : `Ẩn số liệu cho ${config.titleVi}`
              : locale === "en"
                ? `Show numbers for ${config.titleEn}`
                : `Xem số liệu cho ${config.titleVi}`
          }
          className="shrink-0 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-[11px] font-medium text-slate-600"
        >
          {showNumbers
            ? locale === "en"
              ? "Hide numbers"
              : "Ẩn số liệu"
            : locale === "en"
              ? "Show numbers"
              : "Xem số liệu"}
        </button>
      </div>

      <ExplainerVideoSlot category={category} locale={locale} />

      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item) => (
          <CategoryItem
            key={item.key}
            item={item}
            locale={locale}
            showNumbers={showNumbers}
          />
        ))}
      </ul>
    </section>
  );
}

/**
 * Q3=B PHASED — null-safe explainer-video slot. Renders nothing until the
 * content workstream backfills `config.videoUrl`. The structure ships now;
 * the video later. Never blocks the bucket.
 */
function ExplainerVideoSlot({
  category,
  locale,
}: {
  category: ParentCategory;
  locale: ParentLocale;
}) {
  const url = category.config.videoUrl;
  if (!url) return null; // null-safe: no slot rendered when absent.
  return (
    <div
      data-testid={`parent-video-${category.config.id}`}
      className="mt-3 overflow-hidden rounded-2xl border border-black/5 bg-black/5"
    >
      <video
        src={url}
        controls
        preload="none"
        className="w-full"
        aria-label={
          locale === "en"
            ? `${category.config.titleEn} — 90-second explainer`
            : `${category.config.titleVi} — video giải thích 90 giây`
        }
      />
    </div>
  );
}

function CategoryItem({
  item,
  locale,
  showNumbers,
}: {
  item: ParentSummaryItem;
  locale: ParentLocale;
  showNumbers: boolean;
}) {
  const [open, setOpen] = useState(false);
  const hasExample = Boolean(item.exampleVi || item.exampleEn);

  return (
    <li className="rounded-2xl border border-black/5 bg-white/80 px-3 py-2.5">
      <button
        type="button"
        onClick={() => hasExample && setOpen((v) => !v)}
        aria-expanded={hasExample ? open : undefined}
        className={`flex w-full items-start gap-2 text-left ${
          hasExample ? "cursor-pointer" : "cursor-default"
        }`}
      >
        <div className="min-w-0 flex-1">
          <Bilingual
            primary={locale}
            vi={item.qualitativeVi}
            en={item.qualitativeEn}
            viClassName="text-sm font-semibold leading-snug text-slate-900"
            enClassName="mt-0.5 text-[12px] leading-snug text-slate-500"
          />
          {showNumbers && <NumericDrillIn item={item} locale={locale} />}
          {hasExample && (
            <span className="mt-1 block text-[11px] font-medium text-indigo-600">
              {locale === "en" ? "View example" : "Xem ví dụ"}
            </span>
          )}
        </div>
        {hasExample && (
          <span aria-hidden className="mt-0.5 text-slate-400">
            {open ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </span>
        )}
      </button>
      {open && hasExample && (
        <div className="mt-2 rounded-xl border border-black/5 bg-slate-50/60 px-3 py-2">
          <Bilingual
            primary={locale}
            dropEmpty
            vi={item.exampleVi}
            en={item.exampleEn}
            viClassName="text-[12px] leading-snug text-slate-700"
            enClassName="mt-1 text-[12px] leading-snug text-slate-500"
          />
        </div>
      )}
    </li>
  );
}

/** Numeric payload — drill-in only (Q5=C). No time-on-task (Q4=B): only
 *  firing counts, error %, and CEFR appear here. */
function NumericDrillIn({
  item,
  locale,
}: {
  item: ParentSummaryItem;
  locale: ParentLocale;
}) {
  const parts: string[] = [];
  const { numeric } = item;
  if (typeof numeric.count === "number") {
    parts.push(
      locale === "en" ? `${numeric.count}×` : `${numeric.count} lần`,
    );
  }
  if (typeof numeric.errorRatePct === "number") {
    parts.push(
      locale === "en"
        ? `~${numeric.errorRatePct}% off`
        : `~${numeric.errorRatePct}% chưa chính xác`,
    );
  }
  if (numeric.cefr) parts.push(`CEFR ${numeric.cefr}`);
  if (parts.length === 0) return null;
  return (
    <p
      data-testid={`parent-numeric-${item.key}`}
      lang={locale}
      className="mt-1 text-[11px] leading-snug text-slate-500"
    >
      {parts.join(" · ")}
    </p>
  );
}

// ── CTA (reading-only, no admin actions) ─────────────────────────────────

function AskMercyCta() {
  // Subtle CTA per doc § First-build scope #4. Links into the existing
  // reading-only tutor surface — NOT a parent→learner write.
  return (
    <Link
      to="/weak-at"
      data-testid="parent-ask-mercy"
      aria-label="Mở bản đồ điểm cần luyện"
      className="block rounded-[20px] border border-slate-200/70 bg-white px-4 py-3 text-center text-sm font-semibold text-indigo-700 shadow-[0_10px_28px_rgba(15,23,42,0.04)]"
    >
      <Bilingual
        primary="vi"
        vi="Xem bản đồ điểm cần luyện"
        en="Open practice map"
        viClassName="text-sm font-semibold text-indigo-700"
        enClassName="text-[12px] text-slate-500"
      />
    </Link>
  );
}

// ── Gate / loading / empty states ────────────────────────────────────────

function PaywallGate() {
  return (
    <section
      data-testid="parent-paywall"
      className="mx-auto w-full max-w-[560px] rounded-[20px] border border-emerald-200/70 bg-gradient-to-br from-emerald-50 to-white px-5 py-8 text-center shadow-[0_10px_28px_rgba(16,185,129,0.08)]"
    >
      <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
        <Lock className="h-6 w-6 text-emerald-500" aria-hidden />
      </div>
      <Bilingual
        primary="vi"
        vi="Trang dành cho phụ huynh có trong gói Premium."
        en="The parent view is included with Premium."
        viClassName="text-base font-bold leading-snug text-slate-900"
        enClassName="mt-1 text-[13px] leading-snug text-slate-500"
      />
      <Link
        to="/pricing"
        className="mt-4 inline-block rounded-full bg-emerald-600 px-6 py-2 text-sm font-bold text-white"
      >
        <Bilingual
          primary="vi"
          vi="Xem gói Premium"
          en="See Premium"
          viAs="span"
          enAs="span"
          viClassName="text-sm font-bold text-white"
          enClassName="ml-1 text-[12px] text-white/80"
        />
      </Link>
    </section>
  );
}

function AccessSkeleton() {
  return (
    <div
      data-testid="parent-access-loading"
      role="status"
      aria-live="polite"
      className="mx-auto w-full max-w-[560px] px-4 py-8 text-center text-sm text-slate-500"
    >
      <span lang="vi">Đang kiểm tra quyền truy cập…</span>
    </div>
  );
}

function DataSkeleton() {
  return (
    <div
      data-testid="parent-data-loading"
      role="status"
      aria-live="polite"
      aria-label="Đang tải tóm tắt tiến bộ"
      className="mx-auto w-full max-w-[560px] space-y-4 py-4"
    >
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-28 animate-pulse rounded-[20px] bg-slate-100" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <section
      data-testid="parent-empty"
      className="rounded-[20px] border border-slate-200/70 bg-gradient-to-br from-slate-50 to-white px-4 py-8 text-center shadow-[0_10px_28px_rgba(15,23,42,0.04)]"
    >
      <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
        <Sparkles className="h-6 w-6 text-indigo-400" aria-hidden />
      </div>
      <Bilingual
        primary="vi"
        vi="Chưa có tóm tắt tuần này. Hãy luyện thêm vài buổi để phần này hiện rõ hơn."
        en="A few more practice sessions will fill this summary in."
        viClassName="text-sm font-semibold leading-snug text-slate-900"
        enClassName="mt-1 text-[12px] leading-snug text-slate-500"
      />
    </section>
  );
}
