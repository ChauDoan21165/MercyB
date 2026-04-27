// src/pages/teacher-portal/ReviewItem.tsx
//
// /teacher/review/:itemId — single content review form.
//
// itemId format: "<content_type>:<content_id>" (see parseItemId).
// Layout: side-by-side on desktop, stacked on mobile (flex-col → flex-row).
// Original content is rendered as best-effort: for vstep/toeic/ielts/
// cultural/profession we render the content_id and a placeholder
// instruction (the live page exists at known routes; the teacher can
// open it in a new tab to review). For 'room' we fetch the JSON.
//
// Submit:
//   1. INSERT into teacher_feedback with reviewer_id = auth.uid().
//   2. UPDATE content_review_status: status flows from the decision,
//      last_reviewed_at = now(), reviewer_id = auth.uid().
//   3. Best-effort POST to teacher-notifications (action: 'feedback_submitted').
//      Failure of the notification step does NOT block the review save.

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { supabase } from "@/lib/supabaseClient";
import {
  CONTENT_TYPE_LABEL_VI,
  DECISION_LABEL_VI,
  ISSUE_CATEGORIES,
  ISSUE_LABEL_VI,
  type ContentType,
  type TeacherDecision,
  type TeacherFeedbackSeverity,
  type TeacherIssue,
  type TeacherIssueCategory,
  parseItemId,
} from "@/lib/teacher-portal/types";

const SEVERITY_OPTIONS: ReadonlyArray<{ value: TeacherFeedbackSeverity; label: string }> = [
  { value: "1", label: "1 — Nhỏ (nitpick)" },
  { value: "2", label: "2 — Nhẹ" },
  { value: "3", label: "3 — Trung bình" },
  { value: "4", label: "4 — Nghiêm trọng" },
  { value: "5", label: "5 — Chặn (blocking)" },
];

const DECISION_TO_REVIEW_STATE: Record<
  TeacherDecision,
  "approved" | "needs_revision" | "rejected"
> = {
  approve: "approved",
  needs_revision: "needs_revision",
  reject: "rejected",
};

interface IssueState {
  category: TeacherIssueCategory;
  checked: boolean;
  note: string;
}

function buildInitialIssueState(): IssueState[] {
  return ISSUE_CATEGORIES.map((category) => ({
    category,
    checked: false,
    note: "",
  }));
}

export default function ReviewItem(): React.ReactElement {
  const navigate = useNavigate();
  const { itemId = "" } = useParams<{ itemId: string }>();

  const parsed = useMemo(() => parseItemId(itemId), [itemId]);

  const [decision, setDecision] = useState<TeacherDecision | "">("");
  const [severity, setSeverity] = useState<TeacherFeedbackSeverity>("3");
  const [issueStates, setIssueStates] = useState<IssueState[]>(buildInitialIssueState);
  const [suggestedCorrection, setSuggestedCorrection] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // For 'room' content, fetch the JSON to show alongside the form.
  const [roomJson, setRoomJson] = useState<string | null>(null);

  useEffect(() => {
    if (!parsed) return;
    if (parsed.contentType !== "room") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/data/${parsed.contentId}.json`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json = await res.json();
        if (!cancelled) {
          setRoomJson(JSON.stringify(json, null, 2));
        }
      } catch (e) {
        if (!cancelled) {
          setRoomJson(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [parsed]);

  const toggleIssue = useCallback((category: TeacherIssueCategory) => {
    setIssueStates((prev) =>
      prev.map((s) =>
        s.category === category ? { ...s, checked: !s.checked } : s,
      ),
    );
  }, []);

  const updateIssueNote = useCallback(
    (category: TeacherIssueCategory, note: string) => {
      setIssueStates((prev) =>
        prev.map((s) => (s.category === category ? { ...s, note } : s)),
      );
    },
    [],
  );

  if (!parsed) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-6">
        <p className="text-sm text-red-700" role="alert">
          ID nội dung không hợp lệ. (Invalid item id format.)
        </p>
      </main>
    );
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!decision) {
      setError("Vui lòng chọn quyết định trước khi gửi. (Please select a decision before submitting.)");
      return;
    }

    setSubmitting(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        throw new Error("Bạn cần đăng nhập. (Sign-in required.)");
      }
      const reviewerId = userData.user.id;

      const issues: TeacherIssue[] = issueStates
        .filter((s) => s.checked)
        .map((s) => ({
          category: s.category,
          ...(s.note.trim() ? { note: s.note.trim() } : {}),
        }));

      const { error: insertError } = await supabase
        .from("teacher_feedback")
        .insert({
          content_id: parsed.contentId,
          content_type: parsed.contentType,
          reviewer_id: reviewerId,
          severity,
          issues,
          suggested_correction: suggestedCorrection.trim() || null,
          decision,
          status: "open",
        });

      if (insertError) {
        throw new Error(insertError.message);
      }

      const newReviewState = DECISION_TO_REVIEW_STATE[decision];
      const { error: updateError } = await supabase
        .from("content_review_status")
        .update({
          status: newReviewState,
          last_reviewed_at: new Date().toISOString(),
          reviewer_id: reviewerId,
        })
        .eq("content_id", parsed.contentId)
        .eq("content_type", parsed.contentType);

      if (updateError) {
        // Non-fatal: the feedback row is saved. Surface the error but
        // don't roll back.
        console.warn("[ReviewItem] update review_status failed:", updateError.message);
      }

      // Notify admins (best-effort).
      try {
        await supabase.functions.invoke("teacher-notifications", {
          body: {
            action: "feedback_submitted",
            content_id: parsed.contentId,
            content_type: parsed.contentType,
            severity,
            decision,
          },
        });
      } catch (notifyErr) {
        console.warn("[ReviewItem] notification failed:", notifyErr);
      }

      setSuccessMessage("Đã gửi đánh giá. (Review submitted.)");
      setTimeout(() => navigate("/teacher"), 1200);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Lỗi không xác định.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-xl font-bold sm:text-2xl">
          Duyệt nội dung
        </h1>
        <p className="mt-1 break-all font-mono text-sm text-slate-600">
          {CONTENT_TYPE_LABEL_VI[parsed.contentType]} · {parsed.contentId}
        </p>
      </header>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Original content panel */}
        <section
          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 p-4"
          aria-label="Nội dung gốc"
        >
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-600">
            Nội dung gốc
          </h2>
          {parsed.contentType === "room" && roomJson ? (
            <pre className="max-h-[60vh] overflow-auto rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-800">
              {roomJson}
            </pre>
          ) : (
            <p className="text-sm text-slate-700">
              Mở nội dung gốc trong tab mới để đối chiếu:{" "}
              <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs">
                {parsed.contentId}
              </code>
              <br />
              <span className="text-xs text-slate-500">
                Open the source content in a new tab to compare while reviewing.
              </span>
            </p>
          )}
        </section>

        {/* Review form */}
        <form
          className="flex-1 space-y-4 rounded-lg border border-slate-200 bg-white p-4"
          onSubmit={handleSubmit}
          aria-label="Mẫu đánh giá"
        >
          <fieldset>
            <legend className="text-sm font-bold uppercase tracking-wide text-slate-600">
              Quyết định
            </legend>
            <div className="mt-2 space-y-1.5">
              {(Object.keys(DECISION_LABEL_VI) as TeacherDecision[]).map((value) => (
                <label key={value} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="decision"
                    value={value}
                    checked={decision === value}
                    onChange={() => setDecision(value)}
                  />
                  <span>{DECISION_LABEL_VI[value]}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-bold uppercase tracking-wide text-slate-600">
              Vấn đề (chọn nhiều)
            </legend>
            <div className="mt-2 space-y-2">
              {issueStates.map((state) => (
                <div key={state.category} className="rounded-md border border-slate-200 p-2">
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <input
                      type="checkbox"
                      checked={state.checked}
                      onChange={() => toggleIssue(state.category)}
                    />
                    <span>{ISSUE_LABEL_VI[state.category]}</span>
                  </label>
                  {state.checked && (
                    <input
                      type="text"
                      value={state.note}
                      onChange={(e) => updateIssueNote(state.category, e.target.value)}
                      placeholder="Ghi chú (tuỳ chọn)"
                      className="mt-1.5 w-full rounded border border-slate-300 px-2 py-1 text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          </fieldset>

          <div>
            <label
              className="text-sm font-bold uppercase tracking-wide text-slate-600"
              htmlFor="severity"
            >
              Mức độ
            </label>
            <select
              id="severity"
              value={severity}
              onChange={(e) => setSeverity(e.target.value as TeacherFeedbackSeverity)}
              className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
            >
              {SEVERITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="text-sm font-bold uppercase tracking-wide text-slate-600"
              htmlFor="suggested-correction"
            >
              Đề xuất chỉnh sửa (markdown)
            </label>
            <textarea
              id="suggested-correction"
              value={suggestedCorrection}
              onChange={(e) => setSuggestedCorrection(e.target.value)}
              rows={5}
              placeholder="Ví dụ: thay 'sentence X' bằng 'sentence Y' vì..."
              className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 font-mono text-sm"
            />
          </div>

          {error && (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          {successMessage && (
            <p className="text-sm text-emerald-700" role="status">
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {submitting ? "Đang gửi…" : "Gửi đánh giá"}
          </button>
        </form>
      </div>
    </main>
  );
}
