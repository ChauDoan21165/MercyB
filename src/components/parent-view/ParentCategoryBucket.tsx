import { useState } from "react";
import type { ReactNode } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Volume2,
} from "lucide-react";

import { Bilingual } from "@/components/Bilingual";
import type {
  ParentCategory,
  ParentSummaryItem,
} from "@/lib/parent-view/buildParentSummary";
import type { ParentCategoryId } from "@/lib/parent-view/categories";
import type { ParentLocale } from "@/lib/parent-view/parentLocale";

export interface ParentCategoryBucketProps {
  category: ParentCategory;
  locale: ParentLocale;
}

const CATEGORY_ICON: Record<ParentCategoryId, ReactNode> = {
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

export function ParentCategoryBucket({
  category,
  locale,
}: ParentCategoryBucketProps) {
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
