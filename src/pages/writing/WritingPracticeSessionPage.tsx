// src/pages/writing/WritingPracticeSessionPage.tsx
//
// /writing/:promptId — single writing practice session.
// Layout (top → bottom):
//   1. Scenario (VN primary, EN below)
//   2. Word-count target
//   3. Textarea with auto-save to localStorage every 5s
//   4. Submit → calls writing-feedback edge fn
//   5. Feedback panel: score, summary, corrections, vocab, grammar,
//      cultural notes, "Try again" / "Next prompt" buttons.

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import { getWritingPromptById, WRITING_PROMPTS } from "@/data/writing-prompts/prompts";
import {
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
  type WritingFeedback,
} from "@/lib/writing/types";
import {
  clearDraft,
  countWords,
  loadDraft,
  saveDraft,
} from "@/lib/writing/draftStorage";
import {
  requestWritingFeedback,
  WritingFeedbackError,
} from "@/lib/writing/feedbackClient";
import { recordSubmission } from "@/lib/writing/submissions";

const AUTO_SAVE_INTERVAL_MS = 5_000;

export default function WritingPracticeSessionPage() {
  const { promptId = "" } = useParams<{ promptId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const prompt = useMemo(() => getWritingPromptById(promptId), [promptId]);

  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Time spent (cumulative seconds the user has had the page focused).
  const startedAtRef = useRef<number>(Date.now());
  const baseSecondsRef = useRef<number>(0);

  // Hydrate the draft + cumulative time from localStorage on mount.
  useEffect(() => {
    if (!promptId) return;
    const draft = loadDraft(promptId);
    if (draft) {
      setText(draft.text);
      baseSecondsRef.current = draft.timeSpentSeconds;
    } else {
      baseSecondsRef.current = 0;
    }
    startedAtRef.current = Date.now();
  }, [promptId]);

  // Auto-save the draft every 5s while there's something to save.
  useEffect(() => {
    if (!promptId) return;
    const id = window.setInterval(() => {
      if (!text) return;
      const elapsedThisSession = Math.round(
        (Date.now() - startedAtRef.current) / 1000,
      );
      saveDraft(promptId, {
        text,
        updatedAt: Date.now(),
        timeSpentSeconds: baseSecondsRef.current + elapsedThisSession,
      });
    }, AUTO_SAVE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [promptId, text]);

  if (!prompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8F3] via-[#FFFDFC] to-[#F7FAFF]">
        <div className="mx-auto max-w-2xl px-4 py-10 text-center">
          <h1 className="text-xl font-semibold text-slate-900">
            Đề bài không tồn tại · Prompt not found
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            <Link to="/writing" className="text-emerald-700 underline">
              ← Quay lại danh sách đề bài
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const wordCount = countWords(text);
  const inRange =
    wordCount >= prompt.target_words_min &&
    wordCount <= prompt.target_words_max;
  const tooShort = wordCount < prompt.target_words_min;

  const handleSubmit = async () => {
    if (!userId) {
      setErrorMsg(
        "Bạn cần đăng nhập để gửi bài. · Sign in to submit your writing.",
      );
      return;
    }
    if (!text.trim()) return;
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const jwt = sessionData?.session?.access_token;
      if (!jwt) {
        setErrorMsg(
          "Phiên đăng nhập đã hết hạn. · Your session expired.",
        );
        setSubmitting(false);
        return;
      }
      const elapsedThisSession = Math.round(
        (Date.now() - startedAtRef.current) / 1000,
      );
      const totalTime = baseSecondsRef.current + elapsedThisSession;
      const result = await requestWritingFeedback({
        promptId: prompt.id,
        submissionText: text,
        timeSpentSeconds: totalTime,
        userJwt: jwt,
      });
      setFeedback(result);
      // Persist to Supabase. Fire and forget — UI shouldn't block on this.
      void recordSubmission({
        userId,
        promptId: prompt.id,
        submissionText: text,
        feedback: result,
        timeSpentSeconds: totalTime,
      });
      // Clear the draft now that it's been submitted.
      clearDraft(prompt.id);
    } catch (err) {
      if (err instanceof WritingFeedbackError) {
        const messages: Record<typeof err.reason, string> = {
          auth_required:
            "Vui lòng đăng nhập lại. · Please sign in again.",
          rate_limited:
            "Bạn đã gửi quá nhiều bài. Thử lại sau 1 giờ. · Too many requests — try again in an hour.",
          timeout:
            "Hệ thống phản hồi chậm. Vui lòng thử lại. · Server timed out — please try again.",
          server_error:
            "Lỗi máy chủ. Vui lòng thử lại sau. · Server error — please try again.",
          bad_response:
            "Phản hồi không hợp lệ. · Invalid response from server.",
          network_error:
            "Lỗi mạng. Kiểm tra kết nối và thử lại. · Network error — check your connection.",
        };
        setErrorMsg(messages[err.reason]);
      } else {
        setErrorMsg(
          "Đã có lỗi xảy ra. Vui lòng thử lại. · Something went wrong.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleTryAgain = () => {
    setFeedback(null);
    setErrorMsg(null);
    setText("");
    baseSecondsRef.current = 0;
    startedAtRef.current = Date.now();
  };

  const handleNextPrompt = () => {
    const idx = WRITING_PROMPTS.findIndex((p) => p.id === prompt.id);
    if (idx < 0) {
      navigate("/writing");
      return;
    }
    const next = WRITING_PROMPTS[(idx + 1) % WRITING_PROMPTS.length];
    navigate(`/writing/${next.id}`);
  };

  const cat = CATEGORY_LABELS[prompt.category];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F3] via-[#FFFDFC] to-[#F7FAFF]">
      <div className="mx-auto max-w-3xl px-4 py-6 md:py-8">
        <div className="mb-3 text-[12px]">
          <Link to="/writing" className="text-emerald-700 hover:underline">
            ← Tất cả đề bài · All prompts
          </Link>
        </div>

        {/* Scenario */}
        <header className="mb-4 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-sm md:p-5">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
              <span aria-hidden="true">{cat.emoji}</span>
              <span>{cat.vi}</span>
            </span>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
              {DIFFICULTY_LABELS[prompt.difficulty].vi}
            </span>
          </div>
          <h1 className="text-xl font-semibold text-slate-900 md:text-2xl">
            {prompt.title_vi}
          </h1>
          <p className="mt-0.5 text-sm italic text-slate-500">
            {prompt.title_en}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-800">
            {prompt.scenario_vi}
          </p>
          <p className="mt-2 text-[12px] italic leading-5 text-slate-600">
            {prompt.scenario_en}
          </p>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Mục tiêu · Target: {prompt.target_words_min}–
            {prompt.target_words_max} từ
          </p>
        </header>

        {/* Editor */}
        <div className="mb-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={submitting || !!feedback}
            placeholder="Viết bài của bạn ở đây... · Write your draft here..."
            className="min-h-[220px] w-full resize-y rounded-2xl border border-[#E5CDB9] bg-white p-4 text-base leading-7 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#EFA98B] focus:ring-2 focus:ring-[#FFD3BF] disabled:bg-slate-50 disabled:text-slate-700 md:min-h-[280px]"
            aria-label="Writing submission"
          />
          <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span
              className={`font-semibold ${
                inRange
                  ? "text-emerald-700"
                  : tooShort
                    ? "text-slate-500"
                    : "text-amber-700"
              }`}
            >
              {wordCount} / {prompt.target_words_min}–
              {prompt.target_words_max} từ
            </span>
            <span className="italic text-slate-400">
              Tự động lưu nháp · Drafts auto-saved
            </span>
          </div>
        </div>

        {/* Submit */}
        {!feedback ? (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || tooShort || !userId}
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-gradient-to-r from-[#147A53] to-[#0F6242] px-5 text-sm font-semibold text-white shadow-md transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Đang chấm bài..." : "Gửi bài · Submit"}
            </button>
            {tooShort ? (
              <span className="text-[12px] text-slate-500">
                Cần thêm{" "}
                <strong>{prompt.target_words_min - wordCount}</strong> từ nữa
              </span>
            ) : null}
            {!userId ? (
              <span className="text-[12px] text-amber-700">
                Đăng nhập để nhận phản hồi · Sign in to get feedback
              </span>
            ) : null}
          </div>
        ) : null}

        {errorMsg ? (
          <div
            role="alert"
            className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
          >
            {errorMsg}
          </div>
        ) : null}

        {/* Feedback */}
        {feedback ? (
          <FeedbackPanel
            feedback={feedback}
            submissionText={text}
            onTryAgain={handleTryAgain}
            onNextPrompt={handleNextPrompt}
          />
        ) : null}
      </div>
    </div>
  );
}

// ── Feedback panel ────────────────────────────────────────────────────

function FeedbackPanel({
  feedback,
  submissionText,
  onTryAgain,
  onNextPrompt,
}: {
  feedback: WritingFeedback;
  submissionText: string;
  onTryAgain: () => void;
  onNextPrompt: () => void;
}) {
  const scoreTone =
    feedback.score >= 85
      ? { ring: "border-emerald-300 bg-emerald-50", text: "text-emerald-800" }
      : feedback.score >= 65
        ? { ring: "border-amber-300 bg-amber-50", text: "text-amber-800" }
        : { ring: "border-rose-300 bg-rose-50", text: "text-rose-800" };

  return (
    <section
      aria-label="Feedback"
      className="space-y-4 rounded-2xl border border-white/80 bg-white p-4 shadow-md md:p-5"
    >
      {/* Score + summary */}
      <div className={`rounded-2xl border p-4 ${scoreTone.ring}`}>
        <div className="flex items-baseline justify-between gap-3">
          <p className={`text-3xl font-bold tabular-nums ${scoreTone.text}`}>
            {feedback.score}
            <span className="text-sm font-medium text-slate-500"> / 100</span>
          </p>
          <span className={`text-[11px] font-semibold uppercase tracking-wide ${scoreTone.text}`}>
            Điểm · Score
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-900">
          {feedback.summary_vi}
        </p>
        <p className="mt-1 text-[12px] italic leading-5 text-slate-600">
          {feedback.summary_en}
        </p>
      </div>

      {/* Inline corrections — render them as a list with the original
          highlighted and the suggested replacement next to it. We don't
          re-render the user's full text with inline highlights because
          string-matching across an LLM-generated `original` substring
          inside the user's text is fragile (whitespace, punctuation, etc.). */}
      {feedback.corrections.length > 0 ? (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-900">
            Sửa lỗi cụ thể · Specific corrections
          </h3>
          <ul className="space-y-2">
            {feedback.corrections.map((c, idx) => (
              <li
                key={idx}
                className="rounded-xl border border-rose-100 bg-rose-50/40 p-3 text-[13px]"
              >
                <p>
                  <span className="font-semibold text-rose-700 line-through decoration-rose-400">
                    {c.original}
                  </span>{" "}
                  <span className="text-slate-400">→</span>{" "}
                  <span className="font-semibold text-emerald-700">
                    {c.suggested}
                  </span>
                </p>
                {c.reason_vi ? (
                  <p className="mt-1 text-[12px] text-slate-700">
                    {c.reason_vi}
                  </p>
                ) : null}
                {c.reason_en ? (
                  <p className="mt-0.5 text-[11px] italic text-slate-500">
                    {c.reason_en}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Vocabulary upgrades */}
      {feedback.vocabulary.length > 0 ? (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-900">
            Từ vựng nâng cao · Vocabulary upgrades
          </h3>
          <ul className="space-y-2">
            {feedback.vocabulary.map((v, idx) => (
              <li
                key={idx}
                className="rounded-xl border border-sky-100 bg-sky-50/40 p-3 text-[13px]"
              >
                <p>
                  <span className="font-semibold text-slate-700">
                    {v.user_word}
                  </span>{" "}
                  <span className="text-slate-400">→</span>{" "}
                  <span className="font-semibold text-sky-800">
                    {v.better}
                  </span>
                </p>
                {v.context_vi ? (
                  <p className="mt-1 text-[12px] text-slate-700">
                    {v.context_vi}
                  </p>
                ) : null}
                {v.context_en ? (
                  <p className="mt-0.5 text-[11px] italic text-slate-500">
                    {v.context_en}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Grammar */}
      {feedback.grammar.length > 0 ? (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-900">
            Ngữ pháp · Grammar
          </h3>
          <ul className="space-y-2">
            {feedback.grammar.map((g, idx) => (
              <li
                key={idx}
                className="rounded-xl border border-amber-100 bg-amber-50/40 p-3 text-[13px]"
              >
                <p className="text-slate-700">
                  <span className="italic text-slate-500">"</span>
                  {g.snippet}
                  <span className="italic text-slate-500">"</span>
                </p>
                <p className="mt-1 text-emerald-700">
                  → <span className="font-semibold">{g.corrected}</span>
                </p>
                {g.rule_vi ? (
                  <p className="mt-1 text-[12px] text-slate-700">{g.rule_vi}</p>
                ) : null}
                {g.rule_en ? (
                  <p className="mt-0.5 text-[11px] italic text-slate-500">
                    {g.rule_en}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Cultural notes */}
      {feedback.cultural_notes_vi.length + feedback.cultural_notes_en.length > 0 ? (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-900">
            Lưu ý văn hóa · Cultural notes
          </h3>
          <ul className="space-y-1.5 text-[13px]">
            {feedback.cultural_notes_vi.map((note, idx) => (
              <li
                key={`vi-${idx}`}
                className="rounded-xl border border-violet-100 bg-violet-50/40 p-2.5 text-slate-800"
              >
                {note}
              </li>
            ))}
            {feedback.cultural_notes_en.map((note, idx) => (
              <li
                key={`en-${idx}`}
                className="rounded-xl border border-violet-100 bg-violet-50/40 p-2.5 italic text-slate-600"
              >
                {note}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* What you wrote — read-only echo so the user can compare against
          the corrections without scrolling back up. */}
      <details className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
        <summary className="cursor-pointer text-[12px] font-semibold text-slate-700">
          Xem lại bài viết · Review your submission
        </summary>
        <p className="mt-2 whitespace-pre-wrap text-[13px] leading-6 text-slate-800">
          {submissionText}
        </p>
      </details>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-2">
        <button
          type="button"
          onClick={onTryAgain}
          className="inline-flex h-10 items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 text-[13px] font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
        >
          Viết lại · Try again
        </button>
        <button
          type="button"
          onClick={onNextPrompt}
          className="inline-flex h-10 items-center justify-center rounded-2xl bg-gradient-to-r from-[#147A53] to-[#0F6242] px-4 text-[13px] font-semibold text-white shadow-sm transition hover:brightness-105"
        >
          Đề tiếp theo · Next prompt
        </button>
      </div>
    </section>
  );
}
