// src/components/home/FocusAreasCard.tsx
//
// "Your focus areas" Home card. Amber palette (third card; teal =
// library, pink = teacher). Matches libraryCard's secondary visual
// weight — left icon, centre content, chevron right. Renders three
// states driven by the useFocusAreas hook:
//
//   - no_placement  → "Take placement test" empty state
//   - no_weaknesses → "You're balanced across skills" positive state
//   - weaknesses    → top 2–3 tag pills, tap opens micro-lesson dialog
//
// Gated by FEATURE_FLAGS.FOCUS_AREAS_CARD_ENABLED. When flag is false
// the component returns null — Home renders as if the card doesn't
// exist.

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Target, Sparkles, ChevronRight } from "lucide-react";

import { FEATURE_FLAGS } from "@/lib/featureFlags";
import { useAuth } from "@/providers/AuthProvider";
import { useFocusAreas } from "@/hooks/useFocusAreas";
import type { WeaknessEntry } from "@/lib/weakness/weakness-catalog";
import { renderInlineBold } from "@/lib/weakness/renderInlineBold";
import {
  logFocusAreasCardViewed,
  logFocusAreasEmptyCtaTapped,
  logFocusAreasTagTapped,
} from "@/lib/weakness/focusAreasAnalytics";

import FocusAreasMicroLessonDialog from "./FocusAreasMicroLessonDialog";

// Shared shell style — mirrors libraryCard radius / padding / shadow but
// swaps teal → amber. Tailwind amber-50/500 range, no new tokens.
const shellBase =
  "w-full rounded-[20px] border border-amber-200/70 bg-gradient-to-br from-amber-50 to-white shadow-[0_10px_28px_rgba(217,119,6,0.08)] text-left";

const PLACEMENT_ROUTE = "/placement";

export default function FocusAreasCard() {
  if (!FEATURE_FLAGS.FOCUS_AREAS_CARD_ENABLED) return null;
  return <FocusAreasCardInner />;
}

function FocusAreasCardInner() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const focus = useFocusAreas(3);
  const [dialogEntry, setDialogEntry] = useState<WeaknessEntry | null>(null);

  // Log card-viewed once per mount per state (avoids spamming on
  // re-renders). Only fires when there's something to track — weaknesses
  // state with real entries.
  const viewedRef = useRef(false);
  useEffect(() => {
    if (!user?.id) return;
    if (viewedRef.current) return;
    if (focus.status !== "weaknesses") return;
    viewedRef.current = true;
    logFocusAreasCardViewed(
      user.id,
      focus.entries.map((e) => e.tag),
    );
  }, [focus, user?.id]);

  if (focus.status === "loading") {
    return <LoadingCard />;
  }

  if (focus.status === "no_placement") {
    return (
      <EmptyCard
        onCta={() => {
          if (user?.id) logFocusAreasEmptyCtaTapped(user.id);
          navigate(PLACEMENT_ROUTE);
        }}
      />
    );
  }

  if (focus.status === "no_weaknesses") {
    return <BalancedCard />;
  }

  // focus.status === "weaknesses"
  return (
    <>
      <button type="button" className={`${shellBase} cursor-default`} style={{ padding: "16px 18px" }}>
        <Header />
        <ul className="mt-3 flex flex-col gap-2">
          {focus.entries.map((entry) => (
            <li key={entry.tag}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (user?.id) {
                    logFocusAreasTagTapped(user.id, entry.tag, entry.roomId);
                  }
                  setDialogEntry(entry);
                }}
                className="group flex w-full items-center gap-3 rounded-[14px] border border-amber-200/60 bg-white/70 px-3 py-2.5 text-left transition hover:border-amber-300 hover:bg-amber-50/80"
                aria-label={`Open micro-lesson: ${entry.displayEn.replace(/\*\*/g, "")}`}
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                  <Target className="h-4 w-4" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-slate-800">
                    {renderInlineBold(entry.displayEn)}
                  </div>
                  <div className="truncate text-xs text-slate-500">
                    {renderInlineBold(entry.displayVi)}
                  </div>
                </div>
                <ChevronRight
                  className="h-4 w-4 flex-shrink-0 text-amber-500 transition group-hover:translate-x-0.5"
                  aria-hidden
                />
              </button>
            </li>
          ))}
        </ul>
      </button>

      <FocusAreasMicroLessonDialog
        entry={dialogEntry}
        onOpenChange={(open) => {
          if (!open) setDialogEntry(null);
        }}
        userId={user?.id ?? null}
      />
    </>
  );
}

// ── Sub-views ───────────────────────────────────────────────────────────────

function Header() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-amber-400 to-amber-500 shadow-[0_8px_20px_rgba(217,119,6,0.20)]">
        <Target className="h-6 w-6 text-white" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[18px] font-black tracking-tight text-amber-900">
          Your focus areas
        </div>
        <div className="mt-0.5 text-[12px] font-semibold text-amber-700/70">
          Trọng tâm cần luyện
        </div>
        <div className="mt-1.5 text-[13px] font-semibold leading-snug text-slate-600">
          Based on your placement test — tap any area to see a quick lesson.
        </div>
        <div className="mt-0.5 text-[12px] font-medium leading-snug text-slate-400">
          Dựa trên bài kiểm tra xếp lớp — chạm vào một mục để xem bài giảng ngắn.
        </div>
      </div>
    </div>
  );
}

function LoadingCard() {
  return (
    <div
      className={`${shellBase} animate-pulse`}
      style={{ padding: "16px 18px", minHeight: 92 }}
      aria-busy="true"
      aria-label="Loading focus areas"
    />
  );
}

function EmptyCard({ onCta }: { onCta: () => void }) {
  return (
    <button type="button" onClick={onCta} className={`${shellBase} cursor-pointer`} style={{ padding: "16px 18px" }}>
      <div className="flex items-center gap-4">
        <div className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-amber-400 to-amber-500 shadow-[0_8px_20px_rgba(217,119,6,0.20)]">
          <Target className="h-6 w-6 text-white" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[18px] font-black tracking-tight text-amber-900">
            Unlock your focus areas
          </div>
          <div className="mt-0.5 text-[12px] font-semibold text-amber-700/70">
            Mở trọng tâm luyện tập
          </div>
          <div className="mt-1.5 text-[13px] font-semibold leading-snug text-slate-600">
            Take the placement test to see where to focus first.
          </div>
          <div className="mt-0.5 text-[12px] font-medium leading-snug text-slate-400">
            Làm bài kiểm tra xếp lớp để biết cần tập trung vào đâu.
          </div>
        </div>
        <ChevronRight className="h-5 w-5 flex-shrink-0 text-amber-500" aria-hidden />
      </div>
    </button>
  );
}

function BalancedCard() {
  return (
    <div className={`${shellBase} cursor-default`} style={{ padding: "16px 18px" }}>
      <div className="flex items-center gap-4">
        <div className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-emerald-400 to-emerald-500 shadow-[0_8px_20px_rgba(5,150,105,0.20)]">
          <Sparkles className="h-6 w-6 text-white" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[18px] font-black tracking-tight text-emerald-900">
            You're balanced across skills
          </div>
          <div className="mt-0.5 text-[12px] font-semibold text-emerald-700/70">
            Kỹ năng của bạn đã cân đối
          </div>
          <div className="mt-1.5 text-[13px] font-semibold leading-snug text-slate-600">
            No weak spots jumped out on your placement. Keep practising.
          </div>
          <div className="mt-0.5 text-[12px] font-medium leading-snug text-slate-400">
            Bài kiểm tra không phát hiện điểm yếu rõ rệt. Tiếp tục luyện tập nhé.
          </div>
        </div>
      </div>
    </div>
  );
}
