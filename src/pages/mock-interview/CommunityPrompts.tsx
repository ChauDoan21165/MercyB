// /mock-interview/community — public list of approved community
// interview prompts. Voting requires auth; signed-out users hit a
// redirect to /signin.
//
// Vietnamese-first. Card shows VI when present, EN as fallback. Sort:
// top-voted by default, "Mới nhất" toggle for newest.
//
// The "use this question" CTA links into /mock-interview with a
// `?community_prompt=<id>` query so the room can pull it in. (Phase
// 1 stops at deep-linking; Phase 2 wires it into the actual room
// flow with the slider.)

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";
import { upvotePrompt } from "@/lib/interviewPrompts/voting";
import { trackPromptVoted } from "@/lib/interviewPrompts/telemetry";
import {
  DIFFICULTY_LABELS_VI,
  INTERVIEW_PROMPT_DIFFICULTIES,
  INTERVIEW_PROMPT_PROFESSIONS,
  INTERVIEW_PROMPT_QUESTION_TYPES,
  PROFESSION_LABELS_VI,
  QUESTION_TYPE_LABELS_VI,
  type InterviewPromptDifficulty,
  type InterviewPromptProfession,
  type InterviewPromptQuestionType,
  type UserInterviewPromptRow,
} from "@/lib/interviewPrompts/types";

type SortMode = "top" | "newest";

export default function CommunityPrompts(): React.ReactElement {
  const { user } = useAuth();

  const [rows, setRows] = useState<UserInterviewPromptRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [profession, setProfession] = useState<InterviewPromptProfession | "">(
    "",
  );
  const [difficulty, setDifficulty] = useState<InterviewPromptDifficulty | "">(
    "",
  );
  const [questionType, setQuestionType] = useState<
    InterviewPromptQuestionType | ""
  >("");
  const [sort, setSort] = useState<SortMode>("top");

  const [myUpvotes, setMyUpvotes] = useState<Set<string>>(new Set());
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let query = supabase
        .from("user_interview_prompts")
        .select("*")
        .eq("status", "published")
        .limit(200);

      if (profession) query = query.eq("profession", profession);
      if (difficulty) query = query.eq("difficulty", difficulty);
      if (questionType) query = query.eq("question_type", questionType);

      query =
        sort === "top"
          ? query.order("upvotes_count", { ascending: false })
          : query.order("submitted_at", { ascending: false });

      const { data, error: queryError } = await query;
      if (cancelled) return;
      if (queryError) {
        setError(queryError.message);
        setRows([]);
        return;
      }
      setRows((data ?? []) as UserInterviewPromptRow[]);
    })();
    return () => {
      cancelled = true;
    };
  }, [profession, difficulty, questionType, sort]);

  // Load this user's existing upvotes to dim the buttons they already
  // pressed. Anon visitors skip this entirely.
  useEffect(() => {
    if (!user?.id) {
      setMyUpvotes(new Set());
      return;
    }
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("user_interview_prompt_votes")
        .select("prompt_id")
        .eq("user_id", user.id)
        .eq("vote_type", "up");
      if (error) {
        // Surface the read failure instead of silently showing no upvotes.
        console.warn("[CommunityPrompts] upvotes read failed", error);
      }
      if (cancelled) return;
      setMyUpvotes(
        new Set((data ?? []).map((r: { prompt_id: string }) => r.prompt_id)),
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  async function handleUpvote(promptId: string) {
    if (!user?.id) {
      window.location.assign(
        `/signin?redirect=${encodeURIComponent("/mock-interview/community")}`,
      );
      return;
    }
    setBusyId(promptId);
    const result = await upvotePrompt(promptId, user.id);
    setBusyId(null);
    if (result.ok) {
      trackPromptVoted({ promptId, voteType: "up" });
      // Optimistic local bump.
      setRows((prev) =>
        prev
          ? prev.map((r) =>
              r.id === promptId
                ? { ...r, upvotes_count: r.upvotes_count + 1 }
                : r,
            )
          : prev,
      );
      setMyUpvotes((prev) => {
        const next = new Set(prev);
        next.add(promptId);
        return next;
      });
    } else if (result.reason === "already_voted") {
      setMyUpvotes((prev) => {
        const next = new Set(prev);
        next.add(promptId);
        return next;
      });
    }
  }

  const visibleRows = useMemo(() => rows ?? [], [rows]);

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <header className="mb-4">
        <h1 className="text-xl font-bold">Câu hỏi từ cộng đồng</h1>
        <p className="text-xs italic text-black/55">
          Community-curated mock interview questions
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-3">
        <select
          aria-label="Lọc theo ngành nghề"
          value={profession}
          onChange={(e) =>
            setProfession(e.target.value as InterviewPromptProfession | "")
          }
          className="text-sm border border-black/15 rounded-lg px-2 py-1 bg-white"
        >
          <option value="">Tất cả ngành</option>
          {INTERVIEW_PROMPT_PROFESSIONS.map((p) => (
            <option key={p} value={p}>
              {PROFESSION_LABELS_VI[p]}
            </option>
          ))}
        </select>
        <select
          aria-label="Lọc theo độ khó"
          value={difficulty}
          onChange={(e) =>
            setDifficulty(e.target.value as InterviewPromptDifficulty | "")
          }
          className="text-sm border border-black/15 rounded-lg px-2 py-1 bg-white"
        >
          <option value="">Mọi độ khó</option>
          {INTERVIEW_PROMPT_DIFFICULTIES.map((d) => (
            <option key={d} value={d}>
              {DIFFICULTY_LABELS_VI[d]}
            </option>
          ))}
        </select>
        <select
          aria-label="Lọc theo dạng câu hỏi"
          value={questionType}
          onChange={(e) =>
            setQuestionType(
              e.target.value as InterviewPromptQuestionType | "",
            )
          }
          className="text-sm border border-black/15 rounded-lg px-2 py-1 bg-white"
        >
          <option value="">Mọi dạng câu hỏi</option>
          {INTERVIEW_PROMPT_QUESTION_TYPES.map((t) => (
            <option key={t} value={t}>
              {QUESTION_TYPE_LABELS_VI[t]}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setSort(sort === "top" ? "newest" : "top")}
          className="text-sm px-3 py-1 rounded-lg border border-black/15 bg-white"
        >
          {sort === "top" ? "Đang xem: Bình chọn cao" : "Đang xem: Mới nhất"}
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          to="/mock-interview/submit-prompt"
          className="text-sm px-3 py-1 rounded-lg bg-emerald-600 text-white"
        >
          Đóng góp câu hỏi của bạn
        </Link>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 mb-3">
          Lỗi: {error}
        </div>
      )}

      {rows === null ? (
        <p className="text-sm text-black/55">Đang tải…</p>
      ) : visibleRows.length === 0 ? (
        <p className="text-sm text-black/60 italic">
          Chưa có câu hỏi nào khớp bộ lọc. Hãy là người đầu tiên đóng góp!
        </p>
      ) : (
        <ul className="space-y-3">
          {visibleRows.map((row) => {
            const isOwn = user?.id && row.submitter_user_id === user.id;
            const alreadyVoted = myUpvotes.has(row.id);
            return (
              <li
                key={row.id}
                className="rounded-xl border border-black/10 bg-white p-4"
                data-testid="community-prompt-card"
              >
                <div className="text-sm font-semibold text-black/90">
                  {row.question_text_vi || row.question_text_en}
                </div>
                {row.question_text_vi && (
                  <div className="text-xs italic text-black/55 mt-1">
                    {row.question_text_en}
                  </div>
                )}
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-black/65">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                    {PROFESSION_LABELS_VI[row.profession]}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200">
                    {DIFFICULTY_LABELS_VI[row.difficulty]}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200">
                    {QUESTION_TYPE_LABELS_VI[row.question_type]}
                  </span>
                </div>
                {row.context && (
                  <p className="text-xs text-black/60 mt-2 italic">
                    {row.context}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-3">
                  {isOwn ? (
                    <span
                      className="text-xs text-black/50 italic"
                      data-testid="own-prompt-no-vote"
                    >
                      Bạn không thể vote câu hỏi của chính mình · {row.upvotes_count} bình chọn
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleUpvote(row.id)}
                      disabled={busyId === row.id || alreadyVoted}
                      className={`text-xs px-3 py-1 rounded-lg border ${
                        alreadyVoted
                          ? "bg-black/5 border-black/10 text-black/40"
                          : "bg-white border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                      }`}
                      data-testid="upvote-btn"
                    >
                      {alreadyVoted ? "Đã vote" : "👍 Vote"} · {row.upvotes_count}
                    </button>
                  )}
                  <Link
                    to={`/mock-interview?community_prompt=${row.id}`}
                    className="text-xs px-3 py-1 rounded-lg border border-black/15"
                  >
                    Sử dụng câu hỏi này
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
