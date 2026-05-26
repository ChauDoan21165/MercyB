// src/components/home/WritingPromptCard.tsx
//
// Home-page CTA for the real-life writing practice. Self-gates: only
// renders when the signed-in user has at least one un-completed writing
// prompt and hasn't dismissed the card in the last 7 days.
//
// Goal-targeting: the brief specifies "if user has goal=career" but
// the profiles row doesn't expose a primary_goal column today. The
// closest signal we have is "has un-completed workplace_email or
// job_application prompts" — i.e. the user has not yet done all the
// career-track scenarios. That covers the spirit of the brief while
// also showing the card to anyone who has not yet engaged with the
// writing surface at all.

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "@/providers/AuthProvider";
import { listCompletedPromptIds } from "@/lib/writing/submissions";
import { WRITING_PROMPTS } from "@/data/writing-prompts/prompts";

const DISMISS_KEY = "mb_writing_prompt_card_dismissed_at";
const DISMISS_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

const CAREER_CATEGORIES = new Set(["workplace_email", "job_application"]);

function recentlyDismissed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    if (!Number.isFinite(ts)) return false;
    return Date.now() - ts < DISMISS_WINDOW_MS;
  } catch {
    return false;
  }
}

function recordDismiss(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    /* no-op */
  }
}

export default function WritingPromptCard(): React.ReactElement | null {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [show, setShow] = useState(false);
  const [suggested, setSuggested] = useState<(typeof WRITING_PROMPTS)[number] | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!userId) {
      setShow(false);
      return;
    }
    if (recentlyDismissed()) {
      setShow(false);
      return;
    }

    void listCompletedPromptIds(userId).then((completed) => {
      if (cancelled) return;

      // Pick the first un-completed career prompt; if none, fall back
      // to any un-completed prompt; if all 40 are done, hide the card.
      const careerPrompt = WRITING_PROMPTS.find(
        (p) => CAREER_CATEGORIES.has(p.category) && !completed.has(p.id),
      );
      const anyPrompt = careerPrompt
        ? careerPrompt
        : WRITING_PROMPTS.find((p) => !completed.has(p.id));

      if (!anyPrompt) {
        setShow(false);
        return;
      }
      setSuggested(anyPrompt);
      setShow(true);
    });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  function dismiss(): void {
    recordDismiss();
    setDismissed(true);
  }

  if (!show || dismissed || !suggested) return null;

  return (
    <section
      aria-label="Writing practice prompt"
      className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-4 shadow-sm"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
        Luyện viết hôm nay · Practice writing today
      </p>
      <h3 className="mt-1 text-base font-semibold text-slate-900">
        {suggested.title_vi}
      </h3>
      <p className="mt-0.5 text-[12px] italic text-slate-500">
        {suggested.title_en}
      </p>
      <p className="mt-2 line-clamp-3 text-sm leading-snug text-slate-700">
        {suggested.scenario_vi}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          to={`/writing/${suggested.id}`}
          className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
        >
          Luyện ngay
        </Link>
        <Link
          to="/writing"
          className="rounded-full border border-emerald-300 bg-white px-4 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50"
        >
          Xem tất cả đề
        </Link>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
        >
          Để sau
        </button>
      </div>
    </section>
  );
}
