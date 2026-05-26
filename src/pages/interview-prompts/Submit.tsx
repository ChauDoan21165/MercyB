// /mock-interview/submit-prompt — community-prompt submission form.
// Auth-required (route wrapper enforces it; we double-check on mount
// so the eligibility fetch never fires for an anon user).
//
// Bilingual VI primary. The English labels appear as a small italic
// secondary line so the page reads as a Vietnamese form first.
//
// On submit we INSERT a `pending` row. Admin moderates from
// /admin/interview-prompts. There is no auto-publish path.

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";
import {
  canSubmitInterviewPrompt,
  type SubmitEligibility,
} from "@/lib/interviewPrompts/eligibility";
import { trackPromptSubmitted } from "@/lib/interviewPrompts/telemetry";
import {
  DIFFICULTY_LABELS_VI,
  INTERVIEW_PROMPT_DIFFICULTIES,
  INTERVIEW_PROMPT_PROFESSIONS,
  INTERVIEW_PROMPT_QUESTION_TYPES,
  PROFESSION_LABELS_EN,
  PROFESSION_LABELS_VI,
  QUESTION_TYPE_LABELS_VI,
  type InterviewPromptDifficulty,
  type InterviewPromptProfession,
  type InterviewPromptQuestionType,
} from "@/lib/interviewPrompts/types";

const MIN_EN = 5;
const MAX_EN = 500;
const MAX_VI = 500;
const MAX_CONTEXT = 200;

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "done" }
  | { kind: "error"; message: string };

export default function SubmitInterviewPrompt(): React.ReactElement {
  const { user } = useAuth();

  const [eligibility, setEligibility] = useState<SubmitEligibility | null>(
    null,
  );

  const [questionEn, setQuestionEn] = useState("");
  const [questionVi, setQuestionVi] = useState("");
  const [profession, setProfession] = useState<InterviewPromptProfession>(
    "nail-tech",
  );
  const [context, setContext] = useState("");
  const [difficulty, setDifficulty] = useState<InterviewPromptDifficulty>(
    "medium",
  );
  const [questionType, setQuestionType] =
    useState<InterviewPromptQuestionType>("behavioral");
  const [anonymous, setAnonymous] = useState(true);

  const [submit, setSubmit] = useState<SubmitState>({ kind: "idle" });

  useEffect(() => {
    if (typeof document === "undefined") return;
    const previous = document.title;
    document.title = "Đóng góp câu hỏi phỏng vấn — MercyBlade";
    return () => {
      document.title = previous;
    };
  }, []);

  useEffect(() => {
    if (!user?.id) {
      setEligibility(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const result = await canSubmitInterviewPrompt(user.id);
      if (!cancelled) setEligibility(result);
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const enLengthOk = questionEn.length >= MIN_EN && questionEn.length <= MAX_EN;
  const viLengthOk = questionVi.length <= MAX_VI;
  const contextLengthOk = context.length <= MAX_CONTEXT;
  const formValid = enLengthOk && viLengthOk && contextLengthOk;

  const enCharsLeft = useMemo(() => MAX_EN - questionEn.length, [questionEn]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id) return;
    if (!formValid) return;

    setSubmit({ kind: "submitting" });

    const { error } = await supabase.from("user_interview_prompts").insert({
      submitter_user_id: user.id,
      question_text_en: questionEn.trim(),
      question_text_vi: questionVi.trim() ? questionVi.trim() : null,
      profession,
      context: context.trim() ? context.trim() : null,
      difficulty,
      question_type: questionType,
      submitter_anonymous: anonymous,
      status: "pending",
    });

    if (error) {
      setSubmit({ kind: "error", message: error.message });
      return;
    }

    trackPromptSubmitted({
      profession,
      difficulty,
      question_type: questionType,
    });
    setSubmit({ kind: "done" });
  }

  if (!user?.id) {
    return (
      <div className="px-4 py-10 max-w-2xl mx-auto text-sm text-black/60">
        <p>Vui lòng đăng nhập để đóng góp câu hỏi.</p>
      </div>
    );
  }

  if (eligibility === null) {
    return (
      <div className="px-4 py-10 max-w-2xl mx-auto text-sm text-black/55">
        Đang kiểm tra điều kiện đóng góp…
      </div>
    );
  }

  if (!eligibility.eligible) {
    return (
      <div className="px-4 py-10 max-w-2xl mx-auto">
        <h1 className="text-xl font-bold mb-2">
          Chưa thể đóng góp câu hỏi
        </h1>
        <p className="text-sm italic text-black/55 mb-4">Not yet eligible</p>
        <section
          className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-black/85"
          data-testid="submit-prompt-ineligible-panel"
        >
          {eligibility.reasonVi}
        </section>
        <Link
          to="/mock-interview"
          className="inline-block mt-5 px-4 py-2 rounded-lg border border-black/15 text-sm font-semibold"
        >
          Quay lại mock interview
        </Link>
      </div>
    );
  }

  if (submit.kind === "done") {
    return (
      <div className="px-4 py-10 max-w-2xl mx-auto">
        <h1 className="text-xl font-bold mb-2">Cảm ơn bạn!</h1>
        <p className="text-sm italic text-black/55 mb-4">Thanks for sharing</p>
        <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-black/85">
          Câu hỏi của bạn đã được gửi và sẽ được kiểm duyệt trước khi xuất hiện
          công khai.
        </section>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/mock-interview/community"
            className="px-4 py-2 rounded-lg border border-black/15 text-sm font-semibold"
          >
            Xem câu hỏi cộng đồng
          </Link>
          <Link
            to="/mock-interview"
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold"
          >
            Luyện thêm phỏng vấn
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="px-4 py-6 max-w-2xl mx-auto space-y-5"
      data-testid="submit-prompt-form"
    >
      <header>
        <h1 className="text-xl font-bold">Đóng góp câu hỏi phỏng vấn</h1>
        <p className="text-xs italic text-black/55">
          Submit a community interview prompt
        </p>
      </header>

      <div>
        <label
          htmlFor="question_en"
          className="block text-sm font-semibold text-black/85"
        >
          Câu hỏi (tiếng Anh) — bắt buộc
        </label>
        <p className="text-xs italic text-black/55 mb-1">
          The English-language question you were asked.
        </p>
        <textarea
          id="question_en"
          value={questionEn}
          onChange={(e) => setQuestionEn(e.target.value)}
          minLength={MIN_EN}
          maxLength={MAX_EN}
          required
          rows={3}
          className="w-full p-3 rounded-lg border border-black/15 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder='e.g. "Tell me about a time you had to handle an upset customer."'
        />
        <div className="text-xs text-black/55 mt-1">
          {questionEn.length} / {MAX_EN} ký tự (còn {enCharsLeft})
        </div>
      </div>

      <div>
        <label
          htmlFor="question_vi"
          className="block text-sm font-semibold text-black/85"
        >
          Bản dịch tiếng Việt (tuỳ chọn)
        </label>
        <p className="text-xs italic text-black/55 mb-1">
          Optional Vietnamese translation.
        </p>
        <textarea
          id="question_vi"
          value={questionVi}
          onChange={(e) => setQuestionVi(e.target.value)}
          maxLength={MAX_VI}
          rows={2}
          className="w-full p-3 rounded-lg border border-black/15 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="VD: Hãy kể một lần bạn xử lý khách hàng khó tính."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="profession"
            className="block text-sm font-semibold text-black/85"
          >
            Ngành nghề
          </label>
          <select
            id="profession"
            value={profession}
            onChange={(e) =>
              setProfession(e.target.value as InterviewPromptProfession)
            }
            className="w-full mt-1 p-2 rounded-lg border border-black/15 text-sm bg-white"
          >
            {INTERVIEW_PROMPT_PROFESSIONS.map((p) => (
              <option key={p} value={p}>
                {PROFESSION_LABELS_VI[p]} · {PROFESSION_LABELS_EN[p]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="question_type"
            className="block text-sm font-semibold text-black/85"
          >
            Dạng câu hỏi
          </label>
          <select
            id="question_type"
            value={questionType}
            onChange={(e) =>
              setQuestionType(e.target.value as InterviewPromptQuestionType)
            }
            className="w-full mt-1 p-2 rounded-lg border border-black/15 text-sm bg-white"
          >
            {INTERVIEW_PROMPT_QUESTION_TYPES.map((t) => (
              <option key={t} value={t}>
                {QUESTION_TYPE_LABELS_VI[t]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="context"
          className="block text-sm font-semibold text-black/85"
        >
          Bối cảnh (tuỳ chọn)
        </label>
        <p className="text-xs italic text-black/55 mb-1">
          Where / when this question came up. Optional.
        </p>
        <input
          id="context"
          type="text"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          maxLength={MAX_CONTEXT}
          className="w-full p-2 rounded-lg border border-black/15 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          placeholder="VD: Hỏi tại Wells Fargo, San Jose, 2024-11"
        />
        <div className="text-xs text-black/55 mt-1">
          {context.length} / {MAX_CONTEXT}
        </div>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold text-black/85">Độ khó</legend>
        <div className="flex flex-wrap gap-3 mt-2">
          {INTERVIEW_PROMPT_DIFFICULTIES.map((d) => (
            <label
              key={d}
              className={`px-3 py-1.5 rounded-full border text-sm cursor-pointer ${
                difficulty === d
                  ? "bg-emerald-50 border-emerald-400 text-emerald-900"
                  : "border-black/15 text-black/75"
              }`}
            >
              <input
                type="radio"
                name="difficulty"
                value={d}
                checked={difficulty === d}
                onChange={() => setDifficulty(d)}
                className="hidden"
              />
              {DIFFICULTY_LABELS_VI[d]}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex items-start gap-2 text-sm text-black/85">
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
          className="mt-1"
        />
        <span>
          Đăng ẩn danh (mặc định). Nếu bỏ chọn, tên hiển thị có thể được hiện
          với câu hỏi sau khi duyệt.
        </span>
      </label>

      {submit.kind === "error" && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
          Lỗi: {submit.message}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={!formValid || submit.kind === "submitting"}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold disabled:opacity-40"
          data-testid="submit-prompt-button"
        >
          {submit.kind === "submitting" ? "Đang gửi…" : "Gửi câu hỏi"}
        </button>
        <Link
          to="/mock-interview"
          className="px-4 py-2 rounded-lg border border-black/15 text-sm font-semibold"
        >
          Huỷ
        </Link>
      </div>

      <p className="text-xs text-black/50">
        Câu hỏi sẽ được kiểm duyệt trước khi xuất hiện công khai. Nội dung cá
        nhân, phân biệt đối xử, hoặc spam sẽ bị từ chối.
      </p>
    </form>
  );
}
