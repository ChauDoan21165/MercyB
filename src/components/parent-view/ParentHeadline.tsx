import { Bilingual } from "@/components/Bilingual";
import type { ParentSummary } from "@/lib/parent-view/buildParentSummary";
import type { ParentLocale } from "@/lib/parent-view/parentLocale";

export interface ParentHeadlineProps {
  summary: ParentSummary;
  locale: ParentLocale;
}

export function ParentHeadline({ summary, locale }: ParentHeadlineProps) {
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
        enClassName="mt-1 text-[13px] leading-snug text-slate-600"
      />
      {/* L5-PENDING (Q9=A): attribution clause renders only once L4+L5
          ground it. Null today -> nothing appended; the headline stays
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
