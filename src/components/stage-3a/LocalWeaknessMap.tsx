// src/components/stage-3a/LocalWeaknessMap.tsx
//
// Stage 3A — "What I'm Weak At" UI surface.
//
// Day 4 of the Stage 3A campaign. Renders the three buckets the
// aggregator (Day 3) produces — top L1 patterns, placement
// weaknesses, top pronunciation pain points — into a Vietnamese-first
// mobile-first read-only card stack.
//
// Hard invariants (per ROADMAP §3A + design doc §1):
//   - Pure read. Calls `aggregateLocalWeaknesses()` once on mount.
//     No writes. No Supabase. No analytics. No mercy_user_facts.
//   - No gamification language anywhere in rendered output —
//     no "streak", "XP", "level", "badge", "score", no shame words.
//     Strings come from `taxonomy.ts`'s learner-language vocabulary
//     plus a small set of section headings in this file.
//   - Vietnamese is primary; English is secondary.
//   - Mobile-first 375–414 px. Vertical flow; no horizontal scrolls.
//   - Section-level emptiness: a bucket with 0 entries is omitted
//     entirely (no empty heading). Global empty state fires only
//     when ALL three buckets are empty.
//
// Visual style cues from `FocusAreasCard.tsx`:
//   - `rounded-[20px]` shell + soft gradient + low-opacity shadow.
//   - Tailwind utility classes only — no new color tokens.
//   - Lucide icons for section headers.

import { useEffect, useState } from "react";
import {
  BookOpen,
  ClipboardList,
  Volume2,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";

import { Bilingual } from "@/components/Bilingual";

import {
  aggregateLocalWeaknesses,
  type L1PatternSummary,
  type LocalWeaknessMap as LocalWeaknessMapData,
  type PlacementWeaknessSummary,
  type PronunciationPainPointSummary,
  type WeaknessSeverity,
} from "@/lib/stage-3a/aggregator";
import {
  describeL1Tag,
  describePhonemeAxis,
  describePlacementWeakness,
  type LearnerLanguage,
} from "@/lib/stage-3a/taxonomy";

// ──────────────────────────────────────────────────────────────────────────
// Public component
// ──────────────────────────────────────────────────────────────────────────

export interface LocalWeaknessMapProps {
  /**
   * Test seam — inject a pre-aggregated map instead of calling the
   * aggregator on mount. Production callers omit; the component
   * calls `aggregateLocalWeaknesses()` itself.
   */
  initialData?: LocalWeaknessMapData;
}

export default function LocalWeaknessMap({
  initialData,
}: LocalWeaknessMapProps = {}) {
  const [data, setData] = useState<LocalWeaknessMapData | null>(
    initialData ?? null,
  );

  useEffect(() => {
    if (initialData) return;
    // Pure synchronous read — wrapped in a try just in case a future
    // adapter throws. Aggregator already returns shape-safe defaults
    // on read failure (per its contract).
    try {
      setData(aggregateLocalWeaknesses());
    } catch {
      setData({
        topL1Patterns: [],
        placementWeaknesses: [],
        topPronunciationPainPoints: [],
        isEmpty: true,
        generatedAt: Date.now(),
      });
    }
  }, [initialData]);

  if (!data) return <SkeletonLoading />;
  if (data.isEmpty) return <GlobalEmptyState />;

  return (
    <div
      data-testid="local-weakness-map"
      className="mx-auto w-full max-w-[420px] space-y-4 px-4 py-4"
    >
      {data.topL1Patterns.length > 0 && (
        <L1Section patterns={data.topL1Patterns} />
      )}
      {data.placementWeaknesses.length > 0 && (
        <PlacementSection weaknesses={data.placementWeaknesses} />
      )}
      {data.topPronunciationPainPoints.length > 0 && (
        <PronunciationSection painPoints={data.topPronunciationPainPoints} />
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Section: Top L1 grammar patterns
// ──────────────────────────────────────────────────────────────────────────

function L1Section({ patterns }: { patterns: readonly L1PatternSummary[] }) {
  return (
    <section
      data-testid="local-weakness-l1"
      className="rounded-[20px] border border-indigo-200/70 bg-gradient-to-br from-indigo-50 to-white p-4 shadow-[0_10px_28px_rgba(79,70,229,0.08)]"
    >
      <SectionHeading
        icon={<BookOpen className="h-4 w-4 text-indigo-600" aria-hidden />}
        titleVi="Lỗi ngữ pháp hay gặp"
        titleEn="Common grammar patterns"
      />
      <ul className="mt-3 flex flex-col gap-2">
        {patterns.map((p) => (
          <L1Row key={p.tag} pattern={p} />
        ))}
      </ul>
    </section>
  );
}

function L1Row({ pattern }: { pattern: L1PatternSummary }) {
  const lang = describeL1Tag(pattern.tag);
  const [open, setOpen] = useState(false);
  const hasExample = Boolean(lang.exampleVi || lang.exampleEn);

  return (
    <li className="rounded-2xl border border-indigo-100/70 bg-white/80 px-3 py-2.5">
      <button
        type="button"
        onClick={() => hasExample && setOpen((v) => !v)}
        aria-expanded={hasExample ? open : undefined}
        className={`flex w-full items-start gap-2 text-left ${
          hasExample ? "cursor-pointer" : "cursor-default"
        }`}
      >
        <div className="min-w-0 flex-1">
          {/* Pilot migration to <Bilingual> — see docs/copy/bilingual-audit.md
              "Pilot migrations (Bilingual wrapper)". Other inline lang
              pairs in this file are scheduled for the follow-up sweep. */}
          <Bilingual
            vi={lang.shortVi}
            en={lang.shortEn}
            viClassName="text-sm font-semibold leading-snug text-slate-900"
            enClassName="mt-0.5 text-[12px] leading-snug text-slate-500"
          />
          <QuietMeta
            count={pattern.count}
            lastSeen={pattern.lastSeen}
          />
        </div>
        {hasExample && (
          <span aria-hidden className="mt-0.5 text-indigo-400">
            {open ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </span>
        )}
      </button>
      {open && hasExample && (
        <div
          data-testid={`l1-example-${pattern.tag}`}
          className="mt-2 rounded-xl border border-indigo-50 bg-indigo-50/40 px-3 py-2"
        >
          <Bilingual
            dropEmpty
            vi={lang.exampleVi}
            en={lang.exampleEn}
            viClassName="text-[12px] leading-snug text-slate-700"
            enClassName="mt-1 text-[12px] leading-snug text-slate-500"
          />
        </div>
      )}
    </li>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Section: Placement weaknesses
// ──────────────────────────────────────────────────────────────────────────

function PlacementSection({
  weaknesses,
}: {
  weaknesses: readonly PlacementWeaknessSummary[];
}) {
  return (
    <section
      data-testid="local-weakness-placement"
      className="rounded-[20px] border border-amber-200/70 bg-gradient-to-br from-amber-50 to-white p-4 shadow-[0_10px_28px_rgba(217,119,6,0.08)]"
    >
      <SectionHeading
        icon={<ClipboardList className="h-4 w-4 text-amber-600" aria-hidden />}
        titleVi="Kết quả kiểm tra trình độ"
        titleEn="From your placement"
      />
      <ul className="mt-3 flex flex-col gap-2">
        {weaknesses.map((w) => (
          <PlacementRow key={w.tag} weakness={w} />
        ))}
      </ul>
    </section>
  );
}

function PlacementRow({ weakness }: { weakness: PlacementWeaknessSummary }) {
  const lang = describePlacementWeakness(weakness.tag);
  return (
    <li className="flex items-start gap-2 rounded-2xl border border-amber-100/70 bg-white/80 px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <Bilingual
          vi={lang.shortVi}
          en={lang.shortEn}
          viClassName="text-sm font-semibold leading-snug text-slate-900"
          enClassName="mt-0.5 text-[12px] leading-snug text-slate-500"
        />
      </div>
      <SeverityDot severity={weakness.severity} />
    </li>
  );
}

function SeverityDot({ severity }: { severity: WeaknessSeverity }) {
  // Subtle visual cue only — no labels, no numbers, no "high/medium/
  // low" text. The dot's color hue matches its bucket's palette so the
  // overall card reads as one calm surface.
  const tone =
    severity === "high"
      ? "bg-amber-500"
      : severity === "medium"
        ? "bg-amber-300"
        : "bg-amber-200";
  return (
    <span
      data-testid="placement-severity-dot"
      data-severity={severity}
      aria-hidden
      className={`mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full ${tone}`}
    />
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Section: Pronunciation pain points
// ──────────────────────────────────────────────────────────────────────────

function PronunciationSection({
  painPoints,
}: {
  painPoints: readonly PronunciationPainPointSummary[];
}) {
  return (
    <section
      data-testid="local-weakness-pronunciation"
      className="rounded-[20px] border border-teal-200/70 bg-gradient-to-br from-teal-50 to-white p-4 shadow-[0_10px_28px_rgba(13,148,136,0.08)]"
    >
      <SectionHeading
        icon={<Volume2 className="h-4 w-4 text-teal-600" aria-hidden />}
        titleVi="Phát âm cần luyện"
        titleEn="Pronunciation to practice"
      />
      <ul className="mt-3 flex flex-col gap-2">
        {painPoints.map((pp) => (
          <PronunciationRow key={pp.axis} painPoint={pp} />
        ))}
      </ul>
    </section>
  );
}

function PronunciationRow({
  painPoint,
}: {
  painPoint: PronunciationPainPointSummary;
}) {
  const lang = describePhonemeAxis(painPoint.axis);
  // Round error rate to nearest 10% so the number feels approximate,
  // not clinical.
  const ratePct = Math.round((painPoint.errorRate * 100) / 10) * 10;
  return (
    <li className="flex items-start gap-2 rounded-2xl border border-teal-100/70 bg-white/80 px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <Bilingual
          vi={lang.shortVi}
          en={lang.shortEn}
          viClassName="text-sm font-semibold leading-snug text-slate-900"
          enClassName="mt-0.5 text-[12px] leading-snug text-slate-500"
        />
        <p
          data-testid="pronunciation-meta"
          lang="vi"
          className="mt-1 text-[11px] leading-snug text-slate-500"
        >
          ~{ratePct}% chưa chính xác · {painPoint.samples} lần luyện
        </p>
      </div>
    </li>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Shared chrome
// ──────────────────────────────────────────────────────────────────────────

function SectionHeading({
  icon,
  titleVi,
  titleEn,
}: {
  icon: React.ReactNode;
  titleVi: string;
  titleEn: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm">
        {icon}
      </span>
      <div className="min-w-0">
        <Bilingual
          vi={titleVi}
          en={titleEn}
          viAs="h3"
          enAs="p"
          viClassName="text-sm font-bold leading-tight text-slate-900"
          enClassName="text-[11px] leading-tight text-slate-500"
        />
      </div>
    </div>
  );
}

function QuietMeta({ count, lastSeen }: { count: number; lastSeen: number }) {
  // Quiet metadata — small, slate-500, not a focal point. No
  // "you-have-X" language; just facts.
  const ago = formatAgo(lastSeen);
  return (
    <p lang="vi" className="mt-1 text-[11px] leading-snug text-slate-500">
      {count} lần · {ago}
    </p>
  );
}

function formatAgo(epochMs: number): string {
  if (!Number.isFinite(epochMs) || epochMs <= 0) return "lần gần đây";
  const diff = Date.now() - epochMs;
  if (diff < 0) return "lần gần đây";
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ngày trước`;
  return "hơn 30 ngày trước";
}

// ──────────────────────────────────────────────────────────────────────────
// Loading + empty states
// ──────────────────────────────────────────────────────────────────────────

function SkeletonLoading() {
  // Three section-shaped skeletons. Matches the populated layout so
  // there's no shift when data lands.
  return (
    <div
      data-testid="local-weakness-loading"
      className="mx-auto w-full max-w-[420px] space-y-4 px-4 py-4"
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-28 animate-pulse rounded-[20px] bg-slate-100"
        />
      ))}
    </div>
  );
}

function GlobalEmptyState() {
  return (
    <section
      data-testid="local-weakness-empty"
      className="mx-auto w-full max-w-[420px] rounded-[20px] border border-slate-200/70 bg-gradient-to-br from-slate-50 to-white px-4 py-8 text-center shadow-[0_10px_28px_rgba(15,23,42,0.04)]"
    >
      <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
        <Sparkles className="h-6 w-6 text-indigo-400" aria-hidden />
      </div>
      <Bilingual
        vi="Chưa có dữ liệu — hãy hoàn thành vài bài để xem điểm yếu của bạn."
        en="Complete a few lessons to see your weakness map."
        viClassName="text-sm font-semibold leading-snug text-slate-900"
        enClassName="mt-1 text-[12px] leading-snug text-slate-500"
      />
    </section>
  );
}
